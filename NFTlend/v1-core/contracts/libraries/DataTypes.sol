//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

library DataTypes {
    struct ReserveData {
        address nTokenAddress;
        address debtTokenAddress;
        uint128 currentInterestRate;
    }
}