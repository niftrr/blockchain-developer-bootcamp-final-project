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

    mapping(address => DataTypes.Reserve) internal _reserves;
    mapping(address => string) internal _pricePairs;

    address internal _collateralManagerAddress;
    address internal _tokenPriceOracleAddress;

    bool internal _isCollateralManagerConnected = false;

    uint256 internal _interestFee;
    uint256 internal _liquidationFee;
}