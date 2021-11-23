// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { INToken } from "./interfaces/INToken.sol";
import { IDebtToken } from "./interfaces/IDebtToken.sol";
import { ICollateralManager } from "./interfaces/ICollateralManager.sol";
import { DataTypes } from './libraries/DataTypes.sol';
import { LendingPoolStorage } from './LendingPoolStorage.sol';
import { TokenPriceOracle } from './TokenPriceOracle.sol';

import { DataTypes } from "./libraries/DataTypes.sol";

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

    /// @notice Emitted when a borrow is liquidated.
    /// @param borrowId The unique identifier of the borrow.
    /// @param asset The ERC20 address of the borrowed asset.
    /// @param liquidationAmount The amount of ERC20 tokens to be spent for liquidation.
    /// @param liquidator The liquidator account.
    event Liquidate(
        uint256 borrowId, 
        address asset, 
        uint256 liquidationAmount, 
        address liquidator
    );

    /// @notice Emitted when the asset reserve is frozen.
    /// @param asset The reserve asset.
    event ReserveFrozen(
        address asset
    );

    /// @notice Emitted when the asset reserve is paused.
    /// @param asset The reserve asset.
    event ReservePaused(
        address asset
    );

    /// @notice Emitted when the asset reserve is protected.
    /// @param asset The reserve asset.
    event ReserveProtected(
        address asset
    );

    /// @notice Emitted when the asset reserve is activated.
    /// @param asset The reserve asset.
    event ReserveActivated(
        address asset
    );

    /// @notice Emitted when the collateral manager is connected.
    /// @param collateralManagerAddress The collateral manager address.
    event CollateralManagerConnected(
        address collateralManagerAddress
    );

    /// @notice Emitted when the token price oracle is connected.
    /// @param tokenPriceOracleAddress The token price oracle address.
    event TokenPriceOracleConnected(
        address tokenPriceOracleAddress
    );

    constructor(address configurator) {
        // Grant the configurator role
        _setupRole(CONFIGURATOR_ROLE, configurator);
        interestFee = 5; // 5%
        liquidationFee = 5; //5%
    }

    modifier onlyConfigurator() {
        require(hasRole(CONFIGURATOR_ROLE, _msgSender()), "Caller is not the Configurator");
        _;
    }

    modifier whenReserveActive(address asset) {
        DataTypes.Reserve memory reserve = reserves[asset];  
        require(reserve.status == DataTypes.ReserveStatus.Active, "Reserve is not active.");  
        _;
    }

    modifier whenReserveNotPaused(address asset) {
        DataTypes.Reserve memory reserve = reserves[asset];  
        require(reserve.status != DataTypes.ReserveStatus.Paused, "Reserve is paused.");  
        _;
    }

    modifier whenReserveNotProtected(address asset) {
        DataTypes.Reserve memory reserve = reserves[asset];  
        require(reserve.status != DataTypes.ReserveStatus.Protected, "Reserve is protected.");  
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

    /// @notice To liquidate a borrow position.
    /// @param asset The ERC20 token to be borrowed.
    /// @param liquidationAmount The amount of ERC20 tokens to be paid.
    /// @param borrowId The unique identifier of the borrow.
    /// @dev Calls internal `_liquidate` function if modifiers are succeeded.   
    function liquidate(
        address asset,
        uint256 liquidationAmount,
        uint256 borrowId
    )
        external 
        whenNotPaused
        whenReserveNotPaused(asset)
        whenReserveNotProtected(asset)
    {
        _liquidate(asset, liquidationAmount, borrowId);
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
        DataTypes.Reserve storage reserve = reserves[asset]; 
        reserve.status = DataTypes.ReserveStatus.Frozen;

        emit ReserveFrozen(asset);
    }

    /// @notice Pauses the specified asset reserve
    /// @param asset The ERC20, reserve asset token.
    /// @dev To pause functions for a single reserve instead of the whole contract.
    function pauseReserve(address asset) external onlyConfigurator {
        DataTypes.Reserve storage reserve = reserves[asset]; 
        reserve.status = DataTypes.ReserveStatus.Paused;

        emit ReservePaused(asset);
    }

    /// @notice Protects the specified asset reserve
    /// @param asset The ERC20, reserve asset token.
    /// @dev Desactivates functions `liquidate`, `deposit` and `borrow`.
    function protectReserve(address asset) external onlyConfigurator {
        DataTypes.Reserve storage reserve = reserves[asset]; 
        reserve.status = DataTypes.ReserveStatus.Protected;

        emit ReserveProtected(asset);
    }

    /// @notice Activate the specified asset reserve
    /// @param asset The ERC20, reserve asset token.
    /// @dev To activate all functions for a single reserve.
    function activateReserve(address asset) external onlyConfigurator {
        DataTypes.Reserve storage reserve = reserves[asset]; 
        reserve.status = DataTypes.ReserveStatus.Active;  

        emit ReserveActivated(asset);
    }

    /// @notice Get user borrows.
    /// @param user The user account.
    /// @dev Delegate call to the CM contract to retreive data.
    /// @return Returns an array of the user borrow ids.
    function getUserBorrows(address user) public returns (uint256[] memory) {
        (,bytes memory data) = collateralManagerAddress.delegatecall(
            abi.encodeWithSignature("getUserBorrows(address)", user)); 
        return abi.decode(data, (uint256[])); 
    }

    /// @notice Initialize the Collateral Manager contract address.
    /// @param _collateralManagerAddress The Collateral Manager contract address.
    /// @dev Uses a state varaible.
    function connectCollateralManager(
        address _collateralManagerAddress
    ) 
        public 
        onlyConfigurator 
    {
        require(!isCollateralManagerConnected, "Collateral Manager already connected");
        isCollateralManagerConnected = true;
        collateralManagerAddress = _collateralManagerAddress;

        emit CollateralManagerConnected(collateralManagerAddress);
    }

    /// @notice Connect the Token Price Oracle contract by setting the address.
    /// @param _tokenPriceOracleAddress The Token Price Oracle address.
    /// @dev Uses a state variable.
    function connectTokenPriceOracle(
        address _tokenPriceOracleAddress
    ) 
        public 
        onlyConfigurator 
    {
        tokenPriceOracleAddress = _tokenPriceOracleAddress;

        emit TokenPriceOracleConnected(tokenPriceOracleAddress);
    }

    /// @notice Gets the NFT floor price in terms of the asset provided (WIP3)
    /// @param collateral The ERC721 token.
    /// @param asset The ERC20 token price the NFT in.
    /// @dev This is also a WIP as calls getLatestPriceMock and getFloorPriceMock.
    /// @return Returns the floorPrice of the NFT project in terms of the asset provided. 
    function getFloorPrice(address collateral, address asset) public view returns (uint256) {
        uint256 floorPrice = 60; //getFloorPriceMock(collateral); TODO: connect Oracle
        string memory pricePair = pricePairs[asset];
        if (keccak256(abi.encodePacked(pricePair))!=keccak256(abi.encodePacked(""))) {
            (int price, uint8 decimal) = TokenPriceOracle(tokenPriceOracleAddress).getLatestPriceMock(pricePair);
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

    /// @notice Get the Token Price Oracle contract address.
    /// @dev Uses a state variable.
    /// @return Returns the Token price oracle contract address.
    function getTokenPriceOracleAddress() public view returns (address) {
        return tokenPriceOracleAddress;
    }

    /// @notice Get the Collateral Manager contract address.
    /// @dev Uses a state variable.
    /// @return Returns the Collateral Manager contract address.
    function getCollateralManagerAddress() public view returns (address) {
        return collateralManagerAddress;
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
        DataTypes.Reserve memory reserve;
        reserve.status = DataTypes.ReserveStatus.Active;
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
        DataTypes.Reserve memory reserve = reserves[asset];  
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
        DataTypes.Reserve memory reserve = reserves[asset];        
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
        DataTypes.Reserve memory reserve = reserves[asset];  
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
        DataTypes.Reserve memory reserve = reserves[asset]; 
        INToken(reserve.nTokenAddress).reserveTransferFrom(_msgSender(), asset, repaymentAmount);  

        ICollateralManager(collateralManagerAddress).withdraw(
            borrowId, 
            asset, 
            repaymentAmount
        );

        IDebtToken(reserve.debtTokenAddress).burnFrom(_msgSender(), repaymentAmount);

        emit Repay(borrowId, asset, repaymentAmount, _msgSender());
    }

    /// @notice Private function to liquidate a borrow position.
    /// @param asset The ERC20 token to be borrowed.
    /// @param liquidationAmount The amount of ERC20 tokens to be paid.
    /// @param borrowId The unique identifier of the borrow.
    /// @dev Transfers assets back to the reserve before burning debtTokens and retreiving collateral for the liquidator. 
    function _liquidate(
        address asset,
        uint256 liquidationAmount,
        uint256 borrowId
    ) 
        private
    {
        DataTypes.Reserve memory reserve = reserves[asset];  
        DataTypes.Borrow memory borrowItem = ICollateralManager(
            collateralManagerAddress
        ).getBorrow(borrowId);

        address borrower = borrowItem.borrower;
        uint256 repaymentAmount = borrowItem.repaymentAmount;

        IERC20(asset).transferFrom(_msgSender(), reserve.nTokenAddress, repaymentAmount);

        uint256 remainder = liquidationAmount.sub(repaymentAmount);
        uint256 feeAmount = remainder.mul(liquidationFee).div(100);
        uint256 reimbursementAmount = remainder.sub(feeAmount);

        IERC20(asset).transferFrom(_msgSender(), address(this), feeAmount);
        IERC20(asset).transferFrom(_msgSender(), borrower, reimbursementAmount);
        IDebtToken(reserve.debtTokenAddress).burnFrom(borrower, repaymentAmount);
        
        ICollateralManager(collateralManagerAddress).retrieve(
            borrowId, 
            asset, 
            repaymentAmount,
            _msgSender()
        );

        emit Liquidate(borrowId, asset, liquidationAmount, _msgSender());
    }
}