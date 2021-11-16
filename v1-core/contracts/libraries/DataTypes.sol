// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

library DataTypes {
    struct ReserveData {
        address nTokenAddress;
        address debtTokenAddress;
        uint128 currentInterestRate;
    }
}