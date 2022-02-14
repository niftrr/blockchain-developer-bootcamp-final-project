// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.9;

import { DataTypes } from './libraries/DataTypes.sol';
import { ReserveLogic } from './libraries/ReserveLogic.sol';

/// @title Lending Pool Storage contract.
/// @author Niftrr
/// @notice Separates storage from the Lending Pool contract.
/// @dev To maintain storage and help limit size of Lending Pool contract.
contract LendingPoolStorage {
    using ReserveLogic for DataTypes.Reserve;

    address internal _treasuryAddress;
    address internal _lendingPoolBorrowAddress;
    address internal _lendingPoolDepositAddress;
    address internal _lendingPoolLiquidateAddress;
    address internal _lendingPoolRepayAddress;
    address internal _lendingPoolWithdrawAddress;

    mapping(address => DataTypes.Reserve) internal _reserves;
    mapping(address => address) internal _underlyingAssets;
    mapping(address => string) internal _pricePairs;
    mapping(address => mapping(address => uint256)) userScaledBalances;
    mapping(address => mapping(address => uint256)) userFTokenBalances;

    address internal _collateralManagerAddress;
    address internal _tokenPriceOracleAddress;

    bool internal _isCollateralManagerConnected = false;

    uint256 internal _interestFee;
    uint256 internal _liquidationFee;
}