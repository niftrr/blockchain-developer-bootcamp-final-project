// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.9;

/// @title Lending Pool Events contract.
/// @author Niftrr
/// @notice Contains Lending Pool events
/// @dev To help organize and limit size of Lending Pool contract.
contract LendingPoolEvents {    
    /// @notice Emitted when a new reserve is initialized.
    /// @param asset The ERC20, reserve asset address.
    /// @param fTokenAddress The derivative fToken address.
    /// @param debtTokenAddress The derivative debtToken address.
    event InitReserve(address asset, address fTokenAddress, address debtTokenAddress);
    
    /// @notice Emitted when an asset deposit is made.
    /// @param asset The ERC20, reserve asset address.
    /// @param amount The amount of ERC20 tokens.
    /// @param lender The lender account.
    /// @param liquidityIndex The reserve liquidity index.
    event Deposit(
        address asset, 
        uint256 amount, 
        address lender, 
        uint256 liquidityIndex
    );

    /// @notice Emitted when an asset withdraw is made.
    /// @param asset The ERC20, reserve asset address.
    /// @param amount The amount of ERC20 tokens.
    /// @param lender The lender account.
    /// @param liquidityIndex The reserve liquidity index.
    event Withdraw(
        address asset, 
        uint256 amount, 
        address lender, 
        uint256 liquidityIndex
        );

    /// @notice Emitted when a borrow is activated.
    /// @param asset The ERC20 address of the borrowed asset.
    /// @param amount The amount of ERC20 tokens borrowed.
    /// @param collateral The ERC721 token used as collateral.
    /// @param tokenId The tokenId of the ERC721 token to be deposited in escrow.
    /// @param borrower The borrower account.
    /// @param liquidityIndex The updated liquidity index.
    event Borrow(
        address asset, 
        uint256 amount, 
        address collateral, 
        uint256 tokenId, 
        address borrower,
        uint256 liquidityIndex
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

    event UpdateReserve(
        address asset,
        uint256 borrowRate,
        uint256 utilizationRate,
        uint256 liquidityIndex
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

    /// @notice Emitted when the lendingPoolBorrow contract is connected.
    /// @param lendingPoolBorrowAddress The lendingPoolBorrow contract address.
    event LendingPoolBorrowConnected(
        address lendingPoolBorrowAddress
    );

    /// @notice Emitted when the lendingPoolDeposit contract is connected.
    /// @param lendingPoolDepositAddress The lendingPoolDeposit contract address.
    event LendingPoolDepositConnected(
        address lendingPoolDepositAddress
    );

    /// @notice Emitted when the lendingPoolLiquidate contract is connected.
    /// @param lendingPoolLiquidateAddress The lendingPoolLiquidate contract address.
    event LendingPoolLiquidateConnected(
        address lendingPoolLiquidateAddress
    );
    
    /// @notice Emitted when the lendingPoolRepay contract is connected.
    /// @param lendingPoolRepayAddress The lendingPoolLiquidate contract address.
    event LendingPoolRepayConnected(
        address lendingPoolRepayAddress
    );
    
    /// @notice Emitted when the lendingPoolWithdraw contract is connected.
    /// @param lendingPoolWithdrawAddress The lendingPoolWithdraw contract address.
    event LendingPoolWithdrawConnected(
        address lendingPoolWithdrawAddress
    );
    
    /// @notice Emitted when the token price oracle is connected.
    /// @param tokenPriceOracleAddress The token price oracle address.
    event TokenPriceOracleConnected(
        address tokenPriceOracleAddress
    );
}