// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import { DataTypes } from "../libraries/DataTypes.sol";

interface ICollateralManager {

    function pause() external;

    function unpause() external;
   
    function deposit(
        address borrower,
        address erc20Token,
        address erc721Token, 
        uint256 tokenId, 
        uint256 borrowAmount,
        uint256 repaymentAmount,
        uint256 interestRate,
        uint256 liquidationPrice,
        uint256 maturity) external;

    function withdraw (uint256 _id, address asset, uint256 repaymentAmount) external;

    function liquidate(uint256 _id, address asset, uint256 repaymentAmount, address liquidator) external;
    
    function setInterestRate(address _erc721Token, uint256 interestRate) external;
    
    function setLiquidationThreshold(address _erc721Token, uint256 _threshold) external;

    function updateWhitelist(address _erc721Token, bool isWhitelisted) external;

    function getLiquidationThreshold(address _erc721Token) external view;

    function getUserBorrows(address user) external view;

    function getBorrow(uint256 borrowId) external returns (DataTypes.Borrow memory);

    function getBorrowPieces(uint256 borrowId) external returns (   
        uint state,
        address erc721Token, 
        uint256 tokenId,
        address borrower, 
        address erc20Token,
        uint256 borrowAmount,
        uint256 repaymentAmount,
        uint256 interestRate,
        uint256 liquidationPrice,
        uint256 maturity
    ) ;
}