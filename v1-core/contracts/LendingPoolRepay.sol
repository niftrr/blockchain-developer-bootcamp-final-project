// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import { DataTypes } from "./libraries/DataTypes.sol";
import { LendingPoolStorage } from './LendingPoolStorage.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { ICollateralManager } from "./interfaces/ICollateralManager.sol";
import { IFToken } from "./interfaces/IFToken.sol";
import { IDebtToken } from "./interfaces/IDebtToken.sol";

import "@openzeppelin/contracts/utils/Context.sol";
import { ILendingPoolRepay } from "./interfaces/ILendingPoolRepay.sol";
import { SafeMath } from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import "./WadRayMath.sol";

import "hardhat/console.sol";

contract LendingPoolRepay is Context, LendingPoolStorage, ILendingPoolRepay, Pausable, AccessControl {
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

    /// @notice Private function to repay a borrow position.
    /// @param asset The ERC20 token to be borrowed.
    /// @param repaymentAmount The amount of ERC20 tokens to be repaid.
    /// @param borrowId The unique identifier of the borrow.
    /// @dev Transfers assets back to the reserve before burning debtTokens and returning collateral. 
    function repay(
        address asset,
        uint256 repaymentAmount,
        uint256 borrowId
    ) 
        external
        returns (bool) 
    {
        bool success;
        uint256 borrowAmount;
        uint256 interestRate;
        DataTypes.Reserve storage reserve = _reserves[asset]; 
        
        success = IFToken(reserve.fTokenAddress).reserveTransferFrom(_msgSender(), asset, repaymentAmount);  
        require(success, "UNSUCCESSFUL_TRANSFER");

        (success, borrowAmount, interestRate) = ICollateralManager(_collateralManagerAddress).withdraw(
            borrowId, 
            asset, 
            repaymentAmount
        );

        require(success, "UNSUCCESSFUL_WITHDRAW");

        success = IDebtToken(reserve.debtTokenAddress).burnFrom(_msgSender(), repaymentAmount);
        require(success, "UNSUCCESSFUL_BURN");

        // Update reserve borrow numbers - for use in APR calculation
        if (reserve.borrowAmount.sub(borrowAmount) > 0) {
            reserve.borrowRate = WadRayMath.rayDiv(
                WadRayMath.rayMul(
                    WadRayMath.wadToRay(reserve.borrowAmount), reserve.borrowRate
                ).sub(
                    WadRayMath.rayMul(
                        WadRayMath.wadToRay(borrowAmount), interestRate 
                    )    
                ), (WadRayMath.wadToRay(reserve.borrowAmount).sub(WadRayMath.wadToRay(borrowAmount)))
            );
        } else {
            reserve.borrowRate  = 0;
        }

        reserve.borrowAmount = reserve.borrowAmount.sub(borrowAmount);

        return success;
    }
}