//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { SafeMath } from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import { INToken } from "./INToken.sol";
import { IDebtToken } from "./IDebtToken.sol";
import { ICollateralManager } from "./ICollateralManager.sol";
import { DataTypes } from './libraries/DataTypes.sol';
import { ReserveLogic } from './libraries/ReserveLogic.sol';
import { LendingPoolStorage } from './LendingPoolStorage.sol';


import "@openzeppelin/contracts/token/ERC721/IERC721.sol"; // remove


import "hardhat/console.sol";

contract LendingPool is LendingPoolStorage {
    using SafeMath for uint256;  

    address public owner;
    address public collateralManagerAddress;

    struct Reserve {
        address nTokenAddress;
        address debtTokenAddress;
        uint128 currentInterestRate;
    }

    mapping(address => Reserve) reserves;

    event InitReserve(address asset, address nTokenAddress, address debtTokenAddress);
    event Deposit(address asset, uint256 amount, address lender);
    event Withdraw(address asset, uint256 amount, address lender);
    event Borrow(address asset, uint256 amount, uint256 repaymentAmount, address collateral, uint256 tokenId, address borrower);
    event Repay(uint256 borrowId, address asset, uint256 repaymentAmount, address borrower);

    constructor() {
        console.log('LendingPool deployed by owner:', msg.sender);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'ONLY_OWNER');
        _;
    }
    
    function initReserve(
        address asset,
        address nTokenAddress,
        address debtTokenAddress
    ) public onlyOwner {
        Reserve memory reserve;
        reserve.nTokenAddress = nTokenAddress;
        reserve.debtTokenAddress = debtTokenAddress;
        reserves[asset] = reserve;

        emit InitReserve(asset, reserves[asset].nTokenAddress, reserves[asset].debtTokenAddress);
    }

    function deposit(address asset, uint256 amount) public {
        Reserve memory reserve = reserves[asset];       

        address nToken = reserve.nTokenAddress;
        
        IERC20(asset).transferFrom(msg.sender, nToken, amount);
        INToken(nToken).mint(msg.sender, amount);
        
        emit Deposit(asset, amount, msg.sender);
    }

    function withdraw(address asset, uint256 amount) public {
        Reserve memory reserve = reserves[asset];       

        address nToken = reserve.nTokenAddress;

        uint256 nTokenBalance = INToken(nToken).balanceOf(msg.sender);
        require(nTokenBalance >= amount, "Insufficient nToken balance");

        INToken(nToken).burnFrom(msg.sender, amount);
        INToken(nToken).reserveTransfer(msg.sender, asset, amount);
        
        emit Withdraw(asset, amount, msg.sender);
    }

    function _mockOracle() public pure returns (uint256) {
        return 60.0;
    }
    
    function getLiquidationThreshold(address collateral) public returns (bool, uint256) {
        (bool success, bytes memory data) = collateralManagerAddress.call(
            abi.encodeWithSignature("getLiquidationThreshold(address)", "call getLiquidationThreshold", collateral)
        );
        return (success, abi.decode(data, (uint256)));
    }

    function borrow(
        address asset, 
        uint256 amount, 
        address collateral, 
        uint256 tokenId,
        uint256 interestRate,
        uint256 numWeeks) public 
    {
        uint256 repaymentAmount = amount.add(amount.mul(interestRate).div(100).mul(numWeeks).div(52));
        uint256 collateralIndexPrice = _mockOracle();
        uint maturity = block.timestamp + numWeeks * 1 weeks;

        ICollateralManager(collateralManagerAddress).deposit(
            msg.sender, 
            asset, 
            collateral, 
            tokenId, 
            repaymentAmount, 
            collateralIndexPrice, 
            maturity);

        // require(success, 'DEPOSIT_UNSUCCESSFUL');

        Reserve memory reserve = reserves[asset]; 
        IDebtToken(reserve.debtTokenAddress).mint(msg.sender, repaymentAmount);
        INToken(reserve.nTokenAddress).reserveTransfer(msg.sender, asset, amount);

        emit Borrow(asset, amount, repaymentAmount, collateral, tokenId, msg.sender);
    }

    function repay(
        address asset,
        uint256 repaymentAmount,
        uint256 borrowId
    ) public 
    {
        Reserve memory reserve = reserves[asset]; 
        INToken(reserve.nTokenAddress).reserveTransferFrom(msg.sender, asset, repaymentAmount);  

        ICollateralManager(collateralManagerAddress).withdraw(
            borrowId, 
            asset, 
            repaymentAmount);

        IDebtToken(reserve.debtTokenAddress).burnFrom(msg.sender, repaymentAmount);

        emit Repay(borrowId, asset, repaymentAmount, msg.sender);
    }

    function _getUserBorrows(address user) public returns (uint256[] memory) {
        console.log(11);
        (bool success , bytes memory data) = collateralManagerAddress.delegatecall(
            abi.encodeWithSignature("getUserBorrows(address)", user)); 
        
        console.log(12, success);
        return abi.decode(data, (uint256[])); 
    }

    function setCollateralManagerAddress(address _collateralManagerAddress) public onlyOwner {
        collateralManagerAddress = _collateralManagerAddress;
    }

    function getCollateralManagerAddress() public view returns (address) {
        return collateralManagerAddress;
    }
}