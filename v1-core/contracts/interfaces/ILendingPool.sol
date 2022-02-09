// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

interface ILendingPool {
    function initReserve(
        address asset, 
        address fTokenAddress, 
        address debtTokenAddress
    ) 
        external;

    function deposit(address asset, uint256 amount) external;

    function withdraw(address asset, uint256 amount) external;

    function borrow(
        address asset, 
        uint256 amount, 
        address collateral, 
        uint256 tokenId,
        uint256 numWeeks
    )
        external;

    function repay(
        address asset,
        uint256 repaymentAmount,
        uint256 borrowId
    ) 
        external;

    function liquidate(
        address asset,
        uint256 liquidationAmount, 
        uint256 borrowId
    ) 
        external;

    function getLiquidityIndex(
        address asset
    )
        external 
        returns (uint256);

    function getFTokenAsset(
        address fToken
    )
        external 
        returns (address);

    function pause() external;

    function unpause() external;

    function freezeReserve(address asset) external;

    function pauseReserve(address asset) external;

    function protectReserve(address asset) external;

    function activateReserve(address asset) external;

    function connectCollateralManager(address _collateralManagerAddress) external;

    function connectLendingPoolBorrow(address _lendingPoolBorrowAddress) external;

    function connectLendingPoolDeposit(address _lendingPoolDepositAddress) external;

    function connectLendingPoolLiquidate(address _lendingPoolLiquidateAddress) external;

    function connectLendingPoolRepay(address _lendingPoolRepayAddress) external;

    function connectLendingPoolWithdraw(address _lendingPoolWithdrawAddress) external;

    function connectTokenPriceOracle(address _oracleTokenPriceAddress) external;

    function getFloorPrice(address collateral, address asset) external returns (uint256);

    function getLiquidationThreshold(address collateral) external returns (bool, uint256);

    function getTokenPriceOracleAddress() external view returns (address);

    function getFloorPriceMock(address collateral) external view returns (uint256);

    function getCollateralManagerAddress() external view returns (address);



}