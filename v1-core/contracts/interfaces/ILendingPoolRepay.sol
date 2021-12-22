// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

interface ILendingPoolRepay {

    function repay(
        address asset, 
        uint256 repaymentAmount,
        uint256 borrowId
    ) external returns (bool);

}