//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { SafeMath } from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import { INToken } from "./INToken.sol";
import { DataTypes } from './libraries/DataTypes.sol';
import { ReserveLogic } from './libraries/ReserveLogic.sol';
import { LendingPoolStorage } from './LendingPoolStorage.sol';

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
    event Borrow(address asset, uint256 amount, address collateral, uint256 tokenId, address borrower);
    
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
        INToken(nToken).transfer(msg.sender, asset, amount);
        
        emit Withdraw(asset, amount, msg.sender);
    }

    function mockOracle() public pure returns (uint256) {
        return 60.0;
    }
    
    function getLiquidationThreshold(address collateral) internal returns (bool, uint256) {
        (bool success, bytes memory data) = collateralManagerAddress.call(
            abi.encodeWithSignature("getLiquidationThreshold(address)", collateral)
        );
        return (success, abi.decode(data, (uint256)));
    }

    function depositCollateral(
        address borrower, 
        address asset, 
        address collateral, 
        uint256 tokenId, 
        uint256 repaymentAmount, 
        uint256 liquidationPrice, 
        uint256 maturity) internal returns (bool) 
    {
        (bool success, bytes memory data) = collateralManagerAddress.delegatecall(
            abi.encodeWithSignature("deposit(address,address,address,uint256,uint256,uint256,uint256)", 
            borrower, asset, collateral, tokenId, repaymentAmount, liquidationPrice, maturity)
        ); 
        return (success); 
    }

    function borrow(
        address asset, 
        uint256 amount, 
        address collateral, 
        uint256 tokenId,
        uint256 interestRate,
        uint256 maturity) public 
    {
        uint256 repaymentAmount = amount.mul(interestRate.add(1));
        uint256 collateralIndexPrice = mockOracle();

        bool success = depositCollateral(
            msg.sender, 
            asset, 
            collateral, 
            tokenId, 
            repaymentAmount, 
            collateralIndexPrice, 
            maturity);

        require(success, 'DEPOSIT_UNSUCCESSFUL');

        Reserve memory reserve = reserves[asset]; 
        address nToken = reserve.nTokenAddress;
        INToken(nToken).transfer(msg.sender, asset, amount);

        emit Borrow(asset, amount, collateral, tokenId, msg.sender);
    }
}