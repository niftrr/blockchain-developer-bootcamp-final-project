// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import { DataTypes } from "./libraries/DataTypes.sol";
import { LendingPoolStorage } from './LendingPoolStorage.sol';

import { LendingPoolLogic } from './LendingPoolLogic.sol';
import { ICollateralManager } from "./interfaces/ICollateralManager.sol";
import { ILendingPoolBorrow } from "./interfaces/ILendingPoolBorrow.sol";
import { IFToken } from "./interfaces/IFToken.sol";
import { IDebtToken } from "./interfaces/IDebtToken.sol";
import { SafeMath } from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import "./WadRayMath.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "hardhat/console.sol";

contract LendingPoolBorrow is Context, LendingPoolStorage, LendingPoolLogic, ILendingPoolBorrow, Pausable, AccessControl {
    using SafeMath for uint256; 
    using WadRayMath for uint256;

    bytes32 public constant CONFIGURATOR_ROLE = keccak256("CONFIGURATOR_ROLE");
    bytes32 public constant LENDING_POOL_ROLE = keccak256("LENDING_POOL_ROLE");
    
    constructor(address configurator, address lendingPool) {
        _setupRole(CONFIGURATOR_ROLE, configurator);
        _setupRole(LENDING_POOL_ROLE, lendingPool);
    }

    modifier onlyConfigurator() {
        require(hasRole(CONFIGURATOR_ROLE, _msgSender()), "Caller is not the Configurator");
        _;
    }

    modifier onlyLendingPool() {
        require(hasRole(LENDING_POOL_ROLE, _msgSender()), "Caller is not the Lending Pool");
        _;
    }

    /// @notice Pauses the contract deposit and withdraw functions.
    /// @dev Functions paused via modifiers using Pausable contract.
    function pause() external onlyConfigurator {
        _pause();
    }

    /// @notice Unpauses the contract deposit and withdraw functions.
    /// @dev Functions unpaused via modifiers using Pausable contract.
    function unpause() external onlyConfigurator {
        _unpause();
    }

    /// @notice Private function to create a borrow position.
    /// @param asset The ERC20 token to be borrowed.
    /// @param amount The amount of ERC20 tokens to be borrowed.
    /// @param collateral The ERC721 token to be used as collateral.
    /// @param tokenId The tokenId of the ERC721 token to be deposited. 
    /// @param numWeeks The number of weeks until the borrow maturity.
    /// @dev Deposits collateral in CM before minting debtTokens and finally loaning assets. 
    function borrow(
        address asset, 
        uint256 amount, 
        address collateral, 
        uint256 tokenId,
        uint256 numWeeks
    ) 
        external
        returns (bool, uint256)
    {
        bool success;
        DataTypes.Reserve storage reserve = _reserves[asset]; 
        uint256[4] memory variables = getBorrowVariables(
            asset,
            amount, 
            collateral,
            numWeeks
        );

        // TODO: remove, used for calculating user scaled balance
        variables[0] = amount; // setting repayment amount equal to borrow amount

        success = ICollateralManager(_collateralManagerAddress).deposit(
            _msgSender(), 
            asset, 
            collateral, 
            tokenId, 
            amount,
            variables[0], //repaymentAmount
            variables[1], //interestRate
            variables[2], //collateralFloorPrice
            variables[3]); //maturity
        require(success, "UNSUCCESSFUL_DEPOSIT");

        success = IDebtToken(reserve.debtTokenAddress).mint(_msgSender(), variables[0]);
        require(success, "UNSUCCESSFUL_MINT");

        success = IFToken(reserve.fTokenAddress).reserveTransfer(_msgSender(), asset, amount);
        require(success, "UNSUCCESSFUL_TRANSFER");

        // Update reserve borrow numbers - for use in APR calculation
        reserve.borrowRate = WadRayMath.rayDiv(
            WadRayMath.rayMul(
                WadRayMath.wadToRay(reserve.borrowAmount), reserve.borrowRate
            ).add(
                WadRayMath.rayMul(
                    WadRayMath.wadToRay(amount), variables[1] // interestRate
                )    
            ), (WadRayMath.wadToRay(reserve.borrowAmount).add(WadRayMath.wadToRay(amount)))
        );

        reserve.borrowAmount = reserve.borrowAmount.add(amount);

        return (success, variables[0]);
    }
}