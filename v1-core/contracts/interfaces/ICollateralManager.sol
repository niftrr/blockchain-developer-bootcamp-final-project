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
        uint256 maturity
    ) 
        external 
        returns (bool success);

    function withdraw(
        uint256 _id, 
        address asset, 
        uint256 repaymentAmount
    ) 
        external
        returns (bool success);

    function retrieve(
        uint256 _id, 
        address asset, 
        uint256 repaymentAmount, 
        address liquidator
    ) 
        external
        returns (bool success);
    
    function setInterestRate(address _erc721Token, uint256 interestRate) external;

    function getInterestRate(address _erc721Token) external returns (uint256);
    
    function setLiquidationThreshold(address _erc721Token, uint256 _threshold) external;

    function updateWhitelist(address _erc721Token, bool isWhitelisted) external;

    function getLiquidationThreshold(address _erc721Token) external view;

    function getUserBorrowIds(address user) external view;

    function getBorrow(uint256 borrowId) external returns (DataTypes.Borrow memory);
}