// SPDX-License-Identifier: busl-1.1
pragma solidity 0.8.9;

contract NFTlendV1LendingPool {

    event DepositToken(address user, address asset, uint256 amount);
    event WithdrawToken(address user, address asset, uint256 amount);
    event DepositNFT(address user, address collateral, uint32 tokenId);
    event WithdrawNFT(address user, address collateral, uint32 tokenId);
    event Borrow(address user, address asset, uint256 amount, address collateral, uint32 tokenId);
    event Repay(address user, address asset, uint256 amount, address collateral, uint32 tokenId);
    event Liquidate(address user, address collateral, uint32 tokenId);

    function depositToken(
        address asset,
        uint256 amount
    ) external {
        emit DepositToken(msg.sender, asset, amount);
    }

    function withdrawToken(
        address asset,
        uint256 amount
    ) external {
        emit WithdrawToken(msg.sender, asset, amount);
    }

    function depositNFT(
        address collateral,
        uint32 tokenId
    ) external {
        emit DepositNFT(msg.sender, collateral, tokenId);
    }

    function withdrawNFT(
        address collateral,
        uint32 tokenId
    ) external {
        emit WithdrawNFT(msg.sender, collateral, tokenId);
    }

    function borrow(
        address asset,
        address collateral,
        uint256 amount,
        uint32 tokenId
    ) external {
        emit Borrow(msg.sender, asset, amount, collateral, tokenId);
    }

    function repay(
        address asset,
        address collateral, 
        uint256 amount,
        uint32 tokenId
    ) external {
        emit Repay(msg.sender, asset, amount, collateral, tokenId);
    }

    function liquidate(
        address collateral,
        uint32 tokenId
    ) external {
        emit Liquidate(msg.sender, collateral, tokenId);
    }
}