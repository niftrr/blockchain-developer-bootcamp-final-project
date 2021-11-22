// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import { DataTypes } from './libraries/DataTypes.sol';
import { ReserveLogic } from './libraries/ReserveLogic.sol';

/// @title Lending Pool Storage contract.
/// @author Niftrr
/// @notice Separates storage from the Lending Pool contract.
/// @dev To maintain storage and help limit size of Lending Pool contract.
contract LendingPoolStorage {
    using ReserveLogic for DataTypes.Reserve;

    mapping(address => DataTypes.Reserve) internal reserves;
    mapping(address => string) internal pricePairs;

    address internal collateralManagerAddress;
    address internal tokenPriceOracleAddress;

    bool internal isCollateralManagerConnected = false;

    uint256 internal interestFee;
    uint256 internal liquidationFee;
}