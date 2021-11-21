// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { INToken } from "./interfaces/INToken.sol";
import { IDebtToken } from "./interfaces/IDebtToken.sol";
import { ICollateralManager } from "./interfaces/ICollateralManager.sol";
import { DataTypes } from './libraries/DataTypes.sol';
import { ReserveLogic } from './libraries/ReserveLogic.sol';
import { LendingPoolStorage } from './LendingPoolStorage.sol';
import { OracleTokenPrice } from './OracleTokenPrice.sol';

import "@openzeppelin/contracts/utils/Context.sol";
import { SafeMath } from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import "hardhat/console.sol";

/// @title Lending Pool contract for instant, permissionless NFT-backed loans
/// @author Niftrr
/// @notice Allows for the borrow/repay of loans and deposit/withdraw of assets.
/// @dev This is our protocol's point of access.
contract LendingPool is Context, LendingPoolStorage, AccessControl, Pausable {
    using SafeMath for uint256;  

    bytes32 public constant CONFIGURATOR_ROLE = keccak256("CONFIGURATOR_ROLE");

    address public collateralManagerAddress;
    address public oracleTokenPriceAddress;

    enum Status {
        Active, // Able to perform all reserve operations.
        Frozen, // Only able to `withdraw`, `repay` and `liquidate`. Not `borrow` or `deposit`
        Paused, // Not able to perform any reserve operation.
        Protected // Only able to `withdraw` and `repay`. Not `borrow`, `deposit` or `liquidate`.
    }
    struct Reserve {
        Status status;
        address nTokenAddress;
        address debtTokenAddress;
        uint128 currentInterestRate;
    }

    mapping(address => Reserve) public reserves;
    mapping(address => uint256) public interestRates;
    mapping(address => string) public openseaCollection;
    mapping(address => string) public pricePairs;

    /// @notice Emitted when a new reserve is initialized.
    /// @param asset The ERC20, reserve asset address.
    /// @param nTokenAddress The derivative nToken address.
    /// @param debtTokenAddress The derivative debtToken address.
    event InitReserve(address asset, address nTokenAddress, address debtTokenAddress);
    
    /// @notice Emitted when an asset deposit is made.
    /// @param asset The ERC20, reserve asset address.
    /// @param amount The amount of ERC20 tokens.
    /// @param lender The lender account.
    event Deposit(address asset, uint256 amount, address lender);

    /// @notice Emitted when an asset withdraw is made.
    /// @param asset The ERC20, reserve asset address.
    /// @param amount The amount of ERC20 tokens.
    /// @param lender The lender account.
    event Withdraw(address asset, uint256 amount, address lender);

    /// @notice Emitted when a borrow is activated.
    /// @param asset The ERC20 address of the borrowed asset.
    /// @param amount The amount of ERC20 tokens borrowed.
    /// @param repaymentAmount The amount of ERC20 tokens to be repaid.
    /// @param collateral The ERC721 token used as collateral.
    /// @param tokenId The tokenId of the ERC721 token to be deposited in escrow.
    /// @param borrower The borrower account.
    event Borrow(
        address asset, 
        uint256 amount, 
        uint256 repaymentAmount, 
        address collateral, 
        uint256 tokenId, 
        address borrower
    );

    /// @notice Emitted when a borrow is repaid.
    /// @param borrowId The unique identifier of the borrow.
    /// @param asset The ERC20 address of the borrowed asset.
    /// @param repaymentAmount The amount of ERC20 tokens to be repaid.
    /// @param borrower The borrower account.
    event Repay(
        uint256 borrowId, 
        address asset, 
        uint256 repaymentAmount, 
        address borrower
    );

    constructor(address configurator) {
        // Grant the configurator role
        _setupRole(CONFIGURATOR_ROLE, configurator);
    }

    modifier onlyConfigurator() {
        require(hasRole(CONFIGURATOR_ROLE, _msgSender()), "Caller is not the Configurator");
        _;
    }

    modifier whenReserveActive(address asset) {
        Reserve memory reserve = reserves[asset];  
        require(reserve.status == Status.Active, "Reserve is not active.");  
        _;
    }

    modifier whenReserveNotPaused(address asset) {
        Reserve memory reserve = reserves[asset];  
        require(reserve.status != Status.Paused, "Reserve is paused.");  
        _;
    }

    modifier whenReserveNotProtected(address asset) {
        Reserve memory reserve = reserves[asset];  
        require(reserve.status != Status.Protected, "Reserve is protected.");  
        _;
    }

    /// @notice Initializes a reserve.
    /// @param asset The ERC20, reserve asset token.
    /// @param nTokenAddress The derivative nToken address.
    /// @param debtTokenAddress The derivative debtToken address.
    /// @dev Calls internal `_initReserve` function if modifiers are succeeded.    
    function initReserve(
        address asset,
        address nTokenAddress,
        address debtTokenAddress
    ) 
        external 
        onlyConfigurator 
    {
        _initReserve(asset, nTokenAddress, debtTokenAddress);
    }

    /// @notice Deposit assets into the lending pool.
    /// @param asset The ERC20 address of the asset.
    /// @param amount The amount of ERC20 tokens.
    /// @dev Calls internal `_deposit` function if modifiers are succeeded.  
    function deposit(
        address asset, 
        uint256 amount
    ) 
        external 
        whenNotPaused 
        whenReserveActive(asset)
    {
        _deposit(asset, amount);
    }

    /// @notice Withdraw assets from the lending pool.
    /// @param asset The ERC20 address of the asset.
    /// @param amount The amount of ERC20 tokens.
    /// @dev Calls internal `_withdraw` function if modifiers are succeeded. 
    function withdraw(
        address asset, 
        uint256 amount
    ) 
        external 
        whenNotPaused 
        whenReserveNotPaused(asset)
    {
        _withdraw(asset, amount);
    }

    /// @notice External function to create a borrow position.
    /// @param asset The ERC20 token to be borrowed.
    /// @param amount The amount of ERC20 tokens to be borrowed.
    /// @param collateral The ERC721 token to be used as collateral.
    /// @param tokenId The tokenId of the ERC721 token to be deposited. 
    /// @param interestRate The interest rate APR on the borrowed amount to 18 decimals.
    /// @param numWeeks The number of weeks until the borrow maturity.
    /// @dev Calls internal `_borrow` function if modifiers are succeeded. 
    function borrow(
        address asset, 
        uint256 amount, 
        address collateral, 
        uint256 tokenId,
        uint256 interestRate,
        uint256 numWeeks
    ) 
        external 
        whenNotPaused
        whenReserveActive(asset)
    {
        _borrow(
            asset, 
            amount, 
            collateral, 
            tokenId,
            interestRate,
            numWeeks
        );
    }

    /// @notice To repay a borrow position.
    /// @param asset The ERC20 token to be borrowed.
    /// @param repaymentAmount The amount of ERC20 tokens to be repaid.
    /// @param borrowId The unique identifier of the borrow.
    /// @dev Calls internal `_repay` function if modifiers are succeeded.  
    function repay(
        address asset,
        uint256 repaymentAmount,
        uint256 borrowId
    ) 
        external 
        whenNotPaused
        whenReserveNotPaused(asset)
    {
        _repay(asset, repaymentAmount, borrowId);
    }

    /// @notice Pauses the contract `deposit`, `withdraw`, `borrow` and `repay` functions.
    /// @dev Functions paused via modifiers using Pausable contract.
    function pause() external onlyConfigurator {
        _pause();
    }

    /// @notice Unauses the contract `deposit`, `withdraw`, `borrow` and `repay` functions.
    /// @dev Functions unpaused via modifiers using Pausable contract.
    function unpause() external onlyConfigurator {
        _unpause();
    }

    /// @notice Freezes the specified asset reserve
    /// @param asset The ERC20, reserve asset token.
    /// @dev To freeze deposit and borrow functions for a single reserve.
    function freezeReserve(address asset) external onlyConfigurator {
        Reserve storage reserve = reserves[asset]; 
        reserve.status = Status.Frozen;
    }

    /// @notice Pauses the specified asset reserve
    /// @param asset The ERC20, reserve asset token.
    /// @dev To pause functions for a single reserve instead of the whole contract.
    function pauseReserve(address asset) external onlyConfigurator {
        Reserve storage reserve = reserves[asset]; 
        reserve.status = Status.Paused;
    }

    /// @notice Protects the specified asset reserve
    /// @param asset The ERC20, reserve asset token.
    /// @dev Functions `withdraw` and `repay` are active, not `liquidate`, `deposit` or `borrow`.
    function protectReserve(address asset) external onlyConfigurator {
        Reserve storage reserve = reserves[asset]; 
        reserve.status = Status.Protected;
    }

    /// @notice Activate the specified asset reserve
    /// @param asset The ERC20, reserve asset token.
    /// @dev To activate all functions for a single reserve.
    function activateReserve(address asset) external onlyConfigurator {
        Reserve storage reserve = reserves[asset]; 
        reserve.status = Status.Active;  
    }

    /// @notice Get user borrows.
    /// @param user The user account.
    /// @dev Delegate call to the CM contract to retreive data.
    /// @return Returns an array of the user borrow ids.
    function _getUserBorrows(address user) public returns (uint256[] memory) {
        (bool success , bytes memory data) = collateralManagerAddress.delegatecall(
            abi.encodeWithSignature("getUserBorrows(address)", user)); 
        return abi.decode(data, (uint256[])); 
    }

    /// @notice Set the Collateral Manager contract address.
    /// @param _collateralManagerAddress The Collateral Manager contract address.
    /// @dev Uses a state varaible.
    function setCollateralManagerAddress(
        address _collateralManagerAddress
    ) 
        public 
        onlyConfigurator 
    {
        collateralManagerAddress = _collateralManagerAddress;
    }

    /// @notice Set the Token Price oracle contract address.
    /// @param _oracleTokenPriceAddress The Token Price oracle address.
    /// @dev Uses a state variable.
    function setOracleTokenPriceAddress(
        address _oracleTokenPriceAddress
    ) 
        public 
        onlyConfigurator 
    {
        oracleTokenPriceAddress = _oracleTokenPriceAddress;
    }

    /// @notice Gets the NFT floor price in terms of the asset provided (WIP3)
    /// @param collateral The ERC721 token.
    /// @param asset The ERC20 token price the NFT in.
    /// @dev This is also a WIP as calls getLatestPriceMock and getFloorPriceMock.
    /// @return Returns the floorPrice of the NFT project in terms of the asset provided. 
    function getFloorPrice(address collateral, address asset) public returns (uint256) {
        uint256 floorPrice = getFloorPriceMock(collateral);
        string memory pricePair = pricePairs[asset];
        if (keccak256(abi.encodePacked(pricePair))!=keccak256(abi.encodePacked(""))) {
            (int price, uint8 decimal) = OracleTokenPrice(oracleTokenPriceAddress).getLatestPriceMock(pricePair);
            uint256 price_ = uint256(price);
            floorPrice = floorPrice.mul(price_).div(decimal);
        }
        return floorPrice;
    }
    
    /// @notice Gets the liquidation threshold of the collateral provided.
    /// @param collateral An ERC721 token.
    /// @dev Makes a call to the Collateral Manager.
    /// @return Returns the liquidation threshold as a 18 decimal percentage. 
    function getLiquidationThreshold(address collateral) public returns (bool, uint256) {
        (bool success, bytes memory data) = collateralManagerAddress.call(
            abi.encodeWithSignature("getLiquidationThreshold(address)", "call getLiquidationThreshold", collateral)
        );
        return (success, abi.decode(data, (uint256)));
    }

    /// @notice Get the Token Price oracle contract address.
    /// @dev Uses a state variable.
    /// @return Returns the Token price oracle contract address.
    function getOracleTokenPriceAddress() public view returns (address) {
        return oracleTokenPriceAddress;
    }

    /// @notice Mock Oracle for NFT fLoor prices (WIP2).
    /// @param collateral ERC721 token address.
    /// @dev To be removed once chainlink nodes are hosting our external adapter.
    /// @return Always returns 60. 
    function getFloorPriceMock(address collateral) public view returns (uint256) {
        string memory collection = openseaCollection[collateral];
        uint256 floorPrice = _mockFloorOracle();
        return floorPrice;
    }

    /// @notice Get the Collateral Manager contract address.
    /// @dev Uses a state variable.
    /// @return Returns the Collateral Manager contract address.
    function getCollateralManagerAddress() public view returns (address) {
        return collateralManagerAddress;
    }

    /// @notice Mock Oracle for NFT fLoor prices (WIP1).
    /// @dev To be removed once chainlink nodes are hosting our external adapter.
    /// @return Always returns 60. 
    function _mockFloorOracle() public pure returns (uint256) {
        return 60.0;
    }

    /// @notice Private function to initialize a reserve.
    /// @param asset The ERC20, reserve asset token.
    /// @param nTokenAddress The derivative nToken address.
    /// @param debtTokenAddress The derivative debtToken address.
    /// @dev Protocol to be updated to support native ETH as well as ERC20.    
    function _initReserve(
        address asset,
        address nTokenAddress,
        address debtTokenAddress
    ) 
        private
    {
        Reserve memory reserve;
        reserve.status = Status.Active;
        reserve.nTokenAddress = nTokenAddress;
        reserve.debtTokenAddress = debtTokenAddress;
        reserves[asset] = reserve;

        emit InitReserve(asset, reserves[asset].nTokenAddress, reserves[asset].debtTokenAddress);
    }

    /// @notice Private function to deposit assets into the lending pool.
    /// @param asset The ERC20 address of the asset.
    /// @param amount The amount of ERC20 tokens.
    /// @dev Deposits assets into the LP in exchange for nTokens at a 1:1 ratio.  
    function _deposit(
        address asset, 
        uint256 amount
    ) 
        private 
    {
        Reserve memory reserve = reserves[asset];  
        address nToken = reserve.nTokenAddress; 
        IERC20(asset).transferFrom(_msgSender(), nToken, amount);
        INToken(nToken).mint(_msgSender(), amount);

        emit Deposit(asset, amount, _msgSender());
    }

    /// @notice Private function to withdraw assets from the lending pool.
    /// @param asset The ERC20 address of the asset.
    /// @param amount The amount of ERC20 tokens.
    /// @dev Withdraws assets from the LP by exchanging nTokens at a 1:1 ratio. 
    function _withdraw(
        address asset, 
        uint256 amount
    ) 
        private 
    {
        Reserve memory reserve = reserves[asset];        
        address nToken = reserve.nTokenAddress;
        uint256 nTokenBalance = INToken(nToken).balanceOf(_msgSender());
        require(nTokenBalance >= amount, "Insufficient nToken balance");
        INToken(nToken).burnFrom(_msgSender(), amount);
        INToken(nToken).reserveTransfer(_msgSender(), asset, amount);
        
        emit Withdraw(asset, amount, _msgSender());
    }

    /// @notice Private function to create a borrow position.
    /// @param asset The ERC20 token to be borrowed.
    /// @param amount The amount of ERC20 tokens to be borrowed.
    /// @param collateral The ERC721 token to be used as collateral.
    /// @param tokenId The tokenId of the ERC721 token to be deposited. 
    /// @param interestRate The interest rate APR on the borrowed amount to 18 decimals.
    /// @param numWeeks The number of weeks until the borrow maturity.
    /// @dev Deposits collateral in CM before minting debtTokens and finally loaning assets. 
    function _borrow(
        address asset, 
        uint256 amount, 
        address collateral, 
        uint256 tokenId,
        uint256 interestRate,
        uint256 numWeeks
    ) 
        private
    {
        Reserve memory reserve = reserves[asset];  
        uint256 repaymentAmount = amount.add(amount.mul(interestRate).div(100).mul(numWeeks).div(52));
        // uint256 collateralFloorPrice = _mockOracle();
        uint256 collateralFloorPrice = getFloorPrice(collateral, asset);
        uint maturity = block.timestamp + numWeeks * 1 weeks;

        ICollateralManager(collateralManagerAddress).deposit(
            _msgSender(), 
            asset, 
            collateral, 
            tokenId, 
            amount,
            repaymentAmount, 
            interestRate,
            collateralFloorPrice, 
            maturity);

        // require(success, 'DEPOSIT_UNSUCCESSFUL');
        IDebtToken(reserve.debtTokenAddress).mint(_msgSender(), repaymentAmount);
        INToken(reserve.nTokenAddress).reserveTransfer(_msgSender(), asset, amount);

        emit Borrow(asset, amount, repaymentAmount, collateral, tokenId, _msgSender());
    }

    /// @notice Private function to repay a borrow position.
    /// @param asset The ERC20 token to be borrowed.
    /// @param repaymentAmount The amount of ERC20 tokens to be repaid.
    /// @param borrowId The unique identifier of the borrow.
    /// @dev Transfers assets back to the reserve before burning debtTokens and returning collateral. 
    function _repay(
        address asset,
        uint256 repaymentAmount,
        uint256 borrowId
    ) 
        private 
    {
        Reserve memory reserve = reserves[asset]; 
        INToken(reserve.nTokenAddress).reserveTransferFrom(_msgSender(), asset, repaymentAmount);  

        ICollateralManager(collateralManagerAddress).withdraw(
            borrowId, 
            asset, 
            repaymentAmount);

        IDebtToken(reserve.debtTokenAddress).burnFrom(_msgSender(), repaymentAmount);

        emit Repay(borrowId, asset, repaymentAmount, _msgSender());
    }
}