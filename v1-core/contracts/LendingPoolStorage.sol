// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import { DataTypes } from './libraries/DataTypes.sol';
import { ReserveLogic } from './libraries/ReserveLogic.sol';

/// @title Lending Pool Storage contract for maintaining storage (WIP).
/// @author Niftrr
/// @notice Separates storage from the Lending Pool contract.
/// @dev This is not yet implmented.
contract LendingPoolStorage {
    using ReserveLogic for DataTypes.ReserveData;
    // using UserConfiguration for DataTypes.UserConfigurationMap;

    mapping(address => DataTypes.ReserveData) internal _reserves;
    mapping(uint256 => address) internal _reservesList;
}