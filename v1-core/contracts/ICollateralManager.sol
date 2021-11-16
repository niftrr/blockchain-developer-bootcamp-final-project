// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

interface ICollateralManager {

    event DepositCollateral(
        address borrower,
        address erc721Token, 
        uint256 tokenId, 
        uint256 id
    );

    event WithdrawCollateral(
        address borrower,
        address erc721Token, 
        uint256 tokenId, 
        uint256 id
    );
   
    function deposit(
        address borrower,
        address erc20Token,
        address erc721Token, 
        uint256 tokenId, 
        uint256 borrowAmount,
        uint256 repaymentAmount,
        uint256 interestRate,
        uint256 liquidationPrice,
        uint256 maturity) external payable;

    function withdraw (uint256 _id, address asset, uint256 repaymentAmount) external;

    function setLiquidationThreshold(address _erc721Token, uint256 _threshold) external;

    function getLiquidationThreshold(address _erc721Token) external view;

    function getUserBorrows(address user) external view;
}