// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import { DataTypes } from "./libraries/DataTypes.sol";
import { LendingPoolStorage } from './LendingPoolStorage.sol';
import { LendingPoolLogic } from './LendingPoolLogic.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { ICollateralManager } from "./interfaces/ICollateralManager.sol";
import { INToken } from "./interfaces/INToken.sol";
import { IDebtToken } from "./interfaces/IDebtToken.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import { ILendingPoolLiquidate } from "./interfaces/ILendingPoolLiquidate.sol";
import { SafeMath } from '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract LendingPoolLiquidate is Context, LendingPoolStorage, LendingPoolLogic, ILendingPoolLiquidate, Pausable, AccessControl {
    using SafeMath for uint256; 


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

    /// @notice Private function to liquidate a borrow position.
    /// @param asset The ERC20 token to be borrowed.
    /// @param liquidationAmount The amount of ERC20 tokens to be paid.
    /// @param borrowId The unique identifier of the borrow.
    /// @dev Transfers assets back to the reserve before burning debtTokens and retreiving collateral for the liquidator. 
    function liquidate(
        address asset,
        uint256 liquidationAmount,
        uint256 borrowId
    ) 
        external
        returns (bool)
    {
        bool success;
        DataTypes.Reserve memory reserve = _reserves[asset];  
        DataTypes.Borrow memory borrowItem = ICollateralManager(
            _collateralManagerAddress
        ).getBorrow(borrowId);
        require(asset == borrowItem.erc20Token, "INCORRECT_ASSET");

        uint256 floorPrice = getMockFloorPrice(borrowItem.collateral.erc721Token, asset);
        // TODO: To have 80% liquidation price able to be set/updated 
        require(liquidationAmount == floorPrice.mul(80).div(100), "INCORRECT_AMOUNT");
        require(floorPrice < borrowItem.liquidationPrice || block.timestamp > borrowItem.maturity, "BORROW_NOT_IN_DEFAULT");

        address borrower = borrowItem.borrower;
        uint256 repaymentAmount = borrowItem.repaymentAmount;

        success = IERC20(asset).transferFrom(_msgSender(), reserve.nTokenAddress, repaymentAmount);
        require(success, "UNSUCCESSFUL_TRANSFER");

        uint256 remainder = liquidationAmount.sub(repaymentAmount);
        uint256 feeAmount = remainder.mul(_liquidationFee).div(100);
        uint256 reimbursementAmount = remainder.sub(feeAmount);

        success = IERC20(asset).transferFrom(_msgSender(), _treasuryAddress, feeAmount);
        require(success, "UNSUCCESSFUL_TRANSFER");
        
        success = IERC20(asset).transferFrom(_msgSender(), borrower, reimbursementAmount);
        require(success, "UNSUCCESSFUL_TRANSFER");
        
        success = IDebtToken(reserve.debtTokenAddress).burnFrom(borrower, repaymentAmount);
        require(success, "UNSUCCESSFUL_BURN");
        
        success = ICollateralManager(_collateralManagerAddress).retrieve(
            borrowId, 
            asset, 
            repaymentAmount,
            _msgSender()
        );
        require(success, "UNSUCCESSFUL_RETRIEVE");

        // Update borrowRate - for use in APR calculation
        reserve.borrowRate = reserve.borrowRate.sub(
            borrowItem.borrowAmount.mul(borrowItem.interestRate)
        );
        return success;
    }

}