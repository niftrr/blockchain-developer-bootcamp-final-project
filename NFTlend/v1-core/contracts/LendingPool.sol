//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { INToken } from "./INToken.sol";
import { DataTypes } from './libraries/DataTypes.sol';
import { ReserveLogic } from './libraries/ReserveLogic.sol';
import { LendingPoolStorage } from './LendingPoolStorage.sol';

import "hardhat/console.sol";

contract LendingPool is LendingPoolStorage {
    address public owner;

    struct Reserve {
        address nTokenAddress;
        address debtTokenAddress;
        uint128 currentInterestRate;
    }

    mapping(address => Reserve) reserves;

    event InitReserve(address asset, address nTokenAddress, address debtTokenAddress);
    event Deposit(address asset);
    
    constructor() {
        console.log('LendingPool deployed by owner:', msg.sender);
        owner = msg.sender;
    }
    
    function initReserve(
        address asset,
        address nTokenAddress,
        address debtTokenAddress
    ) public {
        Reserve memory reserve;
        reserve.nTokenAddress = nTokenAddress;
        reserve.debtTokenAddress = debtTokenAddress;
        reserves[asset] = reserve;

        emit InitReserve(asset, reserves[asset].nTokenAddress, reserves[asset].debtTokenAddress);
    }

    function deposit(address asset, uint256 amount) public {
        console.log('deposit called asset:', asset);
        Reserve memory reserve = reserves[asset];       

        address nToken = reserve.nTokenAddress;
        
        IERC20(asset).transferFrom(msg.sender, nToken, amount);
        INToken(nToken).mint(msg.sender, amount);
        
        // Dev Logging -- start
        uint256 assetBalance = IERC20(asset).balanceOf(nToken);
        console.log('nToken assetBalance:', assetBalance);

        uint256 nTokenBalance = INToken(nToken).balanceOf(msg.sender);
        console.log('msg.sender nTokenBalance:', nTokenBalance);
        // Dev Logging -- end

        emit Deposit(asset);
    }
}