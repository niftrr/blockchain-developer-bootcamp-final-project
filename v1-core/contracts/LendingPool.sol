// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { IFToken } from "./interfaces/IFToken.sol";
import { IDebtToken } from "./interfaces/IDebtToken.sol";
import { ICollateralManager } from "./interfaces/ICollateralManager.sol";
import { ILendingPoolDeposit } from "./interfaces/ILendingPoolDeposit.sol";
import { ILendingPoolWithdraw } from "./interfaces/ILendingPoolWithdraw.sol";
import { ILendingPoolBorrow } from "./interfaces/ILendingPoolBorrow.sol";
import { ILendingPoolRepay } from "./interfaces/ILendingPoolRepay.sol";
import { ILendingPoolLiquidate } from "./interfaces/ILendingPoolLiquidate.sol";
import { DataTypes } from './libraries/DataTypes.sol';
import { LendingPoolCore } from './LendingPoolCore.sol';
import { LendingPoolLogic } from './LendingPoolLogic.sol';
import { LendingPoolEvents } from './LendingPoolEvents.sol';
import { TokenPriceOracle } from './TokenPriceOracle.sol';
import { DataTypes } from "./libraries/DataTypes.sol";

import "@openzeppelin/contracts/utils/Context.sol";
import { SafeMath } from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import "./WadRayMath.sol";
import "hardhat/console.sol";

/// @title Lending Pool contract for instant, permissionless NFT-backed loans
/// @author Niftrr
/// @notice Allows for the borrow/repay of loans and deposit/withdraw of assets.
/// @dev This is our protocol's point of access.
contract LendingPool is Context, LendingPoolLogic, LendingPoolEvents, LendingPoolCore, AccessControl, Pausable, ReentrancyGuard {
    using SafeMath for uint256;  
    using WadRayMath for uint256;

    bytes32 internal constant CONFIGURATOR_ROLE = keccak256("CONFIGURATOR_ROLE");

    constructor(
        address configurator, 
        address treasuryAddress
        ) 
    {
        _setupRole(CONFIGURATOR_ROLE, configurator);
        _treasuryAddress = treasuryAddress;
        _interestFee = WadRayMath.ray().rayMul(5).rayDiv(100); // 5%
        _liquidationFee = WadRayMath.ray().rayMul(5).rayDiv(100); //5%
    }

    modifier onlyConfigurator() {
        require(hasRole(CONFIGURATOR_ROLE, _msgSender()), "Caller is not the Configurator");
        _;
    }

    modifier whenReserveActive(address asset) {
        DataTypes.Reserve memory reserve = _reserves[asset];  
        require(reserve.status == DataTypes.ReserveStatus.Active, "Reserve is not active.");  
        _;
    }

    modifier whenReserveNotPaused(address asset) {
        DataTypes.Reserve memory reserve = _reserves[asset];  
        require(reserve.status != DataTypes.ReserveStatus.Paused, "Reserve is paused.");  
        _;
    }

    modifier whenReserveNotProtected(address asset) {
        DataTypes.Reserve memory reserve = _reserves[asset];  
        require(reserve.status != DataTypes.ReserveStatus.Protected, "Reserve is protected.");  
        _;
    }

    /// @notice Initialize the Collateral Manager contract address.
    /// @param collateralManagerAddress The Collateral Manager contract address.
    /// @dev Uses a state varaible.
    function connectCollateralManager(
        address collateralManagerAddress
    ) 
        public 
        onlyConfigurator 
    {
        require(!_isCollateralManagerConnected, "Collateral Manager already connected");
        _isCollateralManagerConnected = true;
        _collateralManagerAddress = collateralManagerAddress;

        emit CollateralManagerConnected(_collateralManagerAddress);
    }

    /// @notice Connect the LendingPoolBorrow contract address.
    /// @param lendingPoolBorrowAddress The LendingPoolBorrow contract address.
    /// @dev Uses a state varaible.
    function connectLendingPoolBorrow(
        address lendingPoolBorrowAddress
    ) 
        public 
        onlyConfigurator 
    {
        _lendingPoolBorrowAddress = lendingPoolBorrowAddress;

        emit LendingPoolBorrowConnected(_lendingPoolBorrowAddress);
    }

    /// @notice Connect the LendingPoolDeposit contract address.
    /// @param lendingPoolDepositAddress The LendingPoolDeposit contract address.
    /// @dev Uses a state varaible.
    function connectLendingPoolDeposit(
        address lendingPoolDepositAddress
    ) 
        public 
        onlyConfigurator 
    {
        _lendingPoolDepositAddress = lendingPoolDepositAddress;

        emit LendingPoolDepositConnected(_lendingPoolDepositAddress);
    }

    /// @notice Connect the LendingPoolLiquidate contract address.
    /// @param lendingPoolLiquidateAddress The LendingPoolLiquidate contract address.
    /// @dev Uses a state varaible.
    function connectLendingPoolLiquidate(
        address lendingPoolLiquidateAddress
    ) 
        public 
        onlyConfigurator 
    {
        _lendingPoolLiquidateAddress = lendingPoolLiquidateAddress;

        emit LendingPoolLiquidateConnected(_lendingPoolLiquidateAddress);
    }

    /// @notice Connect the LendingPoolRepay contract address.
    /// @param lendingPoolRepayAddress The LendingPoolRepay contract address.
    /// @dev Uses a state varaible.
    function connectLendingPoolRepay(
        address lendingPoolRepayAddress
    ) 
        public 
        onlyConfigurator 
    {
        _lendingPoolRepayAddress = lendingPoolRepayAddress;

        emit LendingPoolRepayConnected(_lendingPoolRepayAddress);
    }        

    /// @notice Connect the LendingPoolWithdraw contract address.
    /// @param lendingPoolWithdrawAddress The LendingPoolWithdraw contract address.
    /// @dev Uses a state varaible.
    function connectLendingPoolWithdraw(
        address lendingPoolWithdrawAddress
    ) 
        public 
        onlyConfigurator 
    {
        _lendingPoolWithdrawAddress = lendingPoolWithdrawAddress;

        emit LendingPoolWithdrawConnected(_lendingPoolWithdrawAddress);
    }        

    /// @notice Connect the Token Price Oracle contract by setting the address.
    /// @param tokenPriceOracleAddress The Token Price Oracle address.
    /// @dev Uses a state variable.
    function connectTokenPriceOracle(
        address tokenPriceOracleAddress
    ) 
        public 
        onlyConfigurator 
    {
        _tokenPriceOracleAddress = tokenPriceOracleAddress;

        emit TokenPriceOracleConnected(_tokenPriceOracleAddress);
    }

    /// @notice Initializes a reserve.
    /// @param asset The ERC20, reserve asset token.
    /// @param fTokenAddress The derivative fToken address.
    /// @param debtTokenAddress The derivative debtToken address.
    /// @dev Calls internal `_initReserve` function if modifiers are succeeded.    
    function initReserve(
        address asset,
        address fTokenAddress,
        address debtTokenAddress
    ) 
        external 
        onlyConfigurator 
    {
        _initReserve(asset, fTokenAddress, debtTokenAddress);
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
        nonReentrant
        whenNotPaused 
        whenReserveActive(asset)
    {
        (bool success, bytes memory data) = _lendingPoolDepositAddress.delegatecall(
            abi.encodeWithSignature("deposit(address,uint256)", asset,amount)
        );
        require(success, string(data));
        
        uint256 liquidityIndex = _updateLiquidityIndex(asset);
        uint256 userScaledBalance = _updateUserScaledBalance(_msgSender(), asset, amount, true);

        emit Deposit(asset, amount, _msgSender(), userScaledBalance);
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
        nonReentrant
        whenNotPaused 
        whenReserveNotPaused(asset)
    {
        (bool success, bytes memory data) = _lendingPoolWithdrawAddress.delegatecall(
            abi.encodeWithSignature("withdraw(address,uint256)", asset,amount)
        );
        require(success, string(data));

        uint256 liquidityIndex =  _updateLiquidityIndex(asset);
        uint256 userScaledBalance = _updateUserScaledBalance(_msgSender(), asset, amount, false);

        emit Withdraw(asset, amount, _msgSender());
    }

    /// @notice External function to create a borrow position.
    /// @param asset The ERC20 token to be borrowed.
    /// @param amount The amount of ERC20 tokens to be borrowed.
    /// @param collateral The ERC721 token to be used as collateral.
    /// @param tokenId The tokenId of the ERC721 token to be deposited. 
    /// @param numWeeks The number of weeks until the borrow maturity.
    /// @dev Calls internal `_borrow` function if modifiers are succeeded. 
    function borrow(
        address asset, 
        uint256 amount, 
        address collateral, 
        uint256 tokenId,
        uint256 numWeeks
    ) 
        external 
        nonReentrant
        whenNotPaused
        whenReserveActive(asset)
    {
        uint256 repaymentAmount;
        (bool success, bytes memory data) = _lendingPoolBorrowAddress.delegatecall(
            abi.encodeWithSignature("borrow(address,uint256,address,uint256,uint256)", asset,amount,collateral,tokenId,numWeeks)
        );
        require(success, string(data));
        
        (success, repaymentAmount) = abi.decode(data, (bool,uint256));
        require(success, "BORROW_UNSUCCESSFUL");
        uint256 liquidityIndex = _updateLiquidityIndex(asset);
        emit Borrow(asset, amount, repaymentAmount, collateral, tokenId, _msgSender(), liquidityIndex);
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
        nonReentrant
        whenNotPaused
        whenReserveNotPaused(asset)
    {
        (bool success, bytes memory data ) = _lendingPoolRepayAddress.delegatecall(
            abi.encodeWithSignature("repay(address,uint256,uint256)", asset,repaymentAmount,borrowId)
        );
        require(success, string(data));

        uint256 liquidityIndex = _updateLiquidityIndex(asset);

        emit Repay(borrowId, asset, repaymentAmount, _msgSender());
    }

    // /// @notice To liquidate a borrow position.
    // /// @param asset The ERC20 token to be borrowed.
    // /// @param liquidationAmount The amount of ERC20 tokens to be paid.
    // /// @param borrowId The unique identifier of the borrow.
    // /// @dev Calls internal `_liquidate` function if modifiers are succeeded.   
    // function liquidate(
    //     address asset,
    //     uint256 liquidationAmount,
    //     uint256 borrowId
    // )
    //     external 
    //     nonReentrant
    //     whenNotPaused
    //     whenReserveNotPaused(asset)
    //     whenReserveNotProtected(asset)
    // {
    //     (bool success, bytes memory data) = _lendingPoolLiquidateAddress.delegatecall(
    //         abi.encodeWithSignature("liquidate(address,uint256,uint256)", asset,liquidationAmount,borrowId)
    //     );
    //     require(success, string(data));

    //     uint256 liquidityIndex = _updateLiquidityIndex(asset);

    //     emit Liquidate(borrowId, asset, liquidationAmount, _msgSender());
    // }

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
        DataTypes.Reserve storage reserve = _reserves[asset]; 
        reserve.status = DataTypes.ReserveStatus.Frozen;

        emit ReserveFrozen(asset);
    }

    /// @notice Pauses the specified asset reserve
    /// @param asset The ERC20, reserve asset token.
    /// @dev To pause functions for a single reserve instead of the whole contract.
    function pauseReserve(address asset) external onlyConfigurator {
        DataTypes.Reserve storage reserve = _reserves[asset]; 
        reserve.status = DataTypes.ReserveStatus.Paused;

        emit ReservePaused(asset);
    }

    /// @notice Protects the specified asset reserve
    /// @param asset The ERC20, reserve asset token.
    /// @dev Desactivates functions `liquidate`, `deposit` and `borrow`.
    function protectReserve(address asset) external onlyConfigurator {
        DataTypes.Reserve storage reserve = _reserves[asset]; 
        reserve.status = DataTypes.ReserveStatus.Protected;

        emit ReserveProtected(asset);
    }

    /// @notice Activate the specified asset reserve
    /// @param asset The ERC20, reserve asset token.
    /// @dev To activate all functions for a single reserve.
    function activateReserve(address asset) external onlyConfigurator {
        DataTypes.Reserve storage reserve = _reserves[asset]; 
        reserve.status = DataTypes.ReserveStatus.Active;  

        emit ReserveActivated(asset);
    }

    /// @notice Private function to initialize a reserve.
    /// @param asset The ERC20, reserve asset token.
    /// @param fTokenAddress The derivative fToken address.
    /// @param debtTokenAddress The derivative debtToken address.
    /// @dev ERC20 asset address used as reserve key.    
    function _initReserve(
        address asset,
        address fTokenAddress,
        address debtTokenAddress
    ) 
        private
    {
        DataTypes.Reserve memory reserve;
        reserve.status = DataTypes.ReserveStatus.Active;
        reserve.fTokenAddress = fTokenAddress;
        reserve.debtTokenAddress = debtTokenAddress;
        reserve.liquidityIndex = 10**27;
        _reserves[asset] = reserve;
        _fTokenAssetMapping[fTokenAddress] = asset;

        emit InitReserve(asset, _reserves[asset].fTokenAddress, _reserves[asset].debtTokenAddress);
    }
}