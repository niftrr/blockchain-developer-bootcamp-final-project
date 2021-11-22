// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

library DataTypes {

    enum ReserveStatus {
        Active, // Able to perform all reserve operations.
        Frozen, // Only able to `withdraw`, `repay` and `liquidate`. Not `borrow` or `deposit`
        Paused, // Not able to perform any reserve operation.
        Protected // Only able to `withdraw` and `repay`. Not `borrow`, `deposit` or `liquidate`.
    }

    enum BorrowStatus { 
        Active, // Open
        Repaid, // Closed, paid by borrower
        Liquidated // Closed, paid by liquidator
    }
    
    struct Reserve {
        ReserveStatus status;
        address nTokenAddress;
        address debtTokenAddress;
        uint128 currentInterestRate;
    }

    struct Collateral {
        address erc721Token;
        uint256 tokenId;
    }

    struct Borrow {
        BorrowStatus status;
        Collateral collateral;
        address borrower;
        address erc20Token;
        uint256 borrowAmount;
        uint256 repaymentAmount;
        uint256 interestRate;
        uint256 liquidationPrice;
        uint256 maturity;
    }
}