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
import "./WadRayMath.sol";
import "hardhat/console.sol";

contract LendingPoolLiquidate is Context, LendingPoolStorage, LendingPoolLogic, ILendingPoolLiquidate, Pausable, AccessControl {
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
        DataTypes.Reserve storage reserve = _reserves[asset];  
        DataTypes.Borrow memory borrowItem = ICollateralManager(
            _collateralManagerAddress
        ).getBorrow(borrowId);
        require(asset == borrowItem.erc20Token, "INCORRECT_ASSET");

        uint256 floorPrice = getMockFloorPrice(borrowItem.collateral.erc721Token, asset);
        console.log('floorPrice', floorPrice);
        // TODO: To have 80% liquidation price able to be set/updated 
        require(liquidationAmount == floorPrice.mul(80).div(100), "INCORRECT_AMOUNT");
        console.log('liquidationAmount', liquidationAmount);
        require(floorPrice < borrowItem.liquidationPrice || block.timestamp > borrowItem.maturity, "BORROW_NOT_IN_DEFAULT");
        address borrower = borrowItem.borrower;
        uint256 repaymentAmount = borrowItem.repaymentAmount;

        console.log('borrowItem.borrowAmount', borrowItem.borrowAmount);
        console.log('borrowItem.repaymentAmount', borrowItem.repaymentAmount);


        success = IERC20(asset).transferFrom(_msgSender(), reserve.nTokenAddress, repaymentAmount);
        require(success, "UNSUCCESSFUL_TRANSFER");
        console.log('here5');
        uint256 remainder = liquidationAmount.sub(repaymentAmount);
        console.log('here5a');
        uint256 feeAmount = WadRayMath.rayToWad(WadRayMath.rayMul(WadRayMath.wadToRay(remainder), _liquidationFee));
        console.log('here5b');
        console.log('remainder', remainder);
        console.log('feeAmount', feeAmount);
        console.log(' WadRayMath.wadToRay(remainder)',  WadRayMath.wadToRay(remainder));
        uint256 reimbursementAmount = remainder.sub(feeAmount);
        console.log('here5c');

        console.log('liquidationAmount', liquidationAmount);
        console.log('repaymentAmount', repaymentAmount);
        console.log('reimbursementAmount', reimbursementAmount);
        console.log('feeAmount', feeAmount);

        success = IERC20(asset).transferFrom(_msgSender(), _treasuryAddress, feeAmount);
        require(success, "UNSUCCESSFUL_TRANSFER");
        console.log('here6');
        success = IERC20(asset).transferFrom(_msgSender(), borrower, reimbursementAmount);
        require(success, "UNSUCCESSFUL_TRANSFER");
        console.log('here7');
        success = IDebtToken(reserve.debtTokenAddress).burnFrom(borrower, repaymentAmount);
        require(success, "UNSUCCESSFUL_BURN");
        console.log('here8');
        success = ICollateralManager(_collateralManagerAddress).retrieve(
            borrowId, 
            asset, 
            repaymentAmount,
            _msgSender()
        );
        require(success, "UNSUCCESSFUL_RETRIEVE");
        console.log('here9');
        // Update reserve borrow numbers - for use in APR calculation
        console.log('reserve.borrowAmount', reserve.borrowAmount);
        console.log('borrowItem.borrowAmount', borrowItem.borrowAmount);


        // if (reserve.borrowAmount.sub(borrowItem.borrowAmount) > 0) {
        //     reserve.borrowRate = (
        //         (reserve.borrowAmount.mul(reserve.borrowRate)).sub(borrowItem.borrowAmount.mul(borrowItem.interestRate))
        //     ).div(reserve.borrowAmount.sub(borrowItem.borrowAmount));
        // } else {
        //     reserve.borrowRate  = 0;
        // }

        // reserve.borrowAmount = reserve.borrowAmount.sub(borrowItem.borrowAmount);

        if (reserve.borrowAmount.sub(borrowItem.borrowAmount) > 0) {
            reserve.borrowRate = WadRayMath.rayDiv(
                WadRayMath.rayMul(
                    WadRayMath.wadToRay(reserve.borrowAmount), reserve.borrowRate
                ).sub(
                    WadRayMath.rayMul(
                        WadRayMath.wadToRay(borrowItem.borrowAmount), borrowItem.interestRate 
                    )    
                ), (WadRayMath.wadToRay(reserve.borrowAmount).sub(WadRayMath.wadToRay(borrowItem.borrowAmount)))
            );
        } else {
            reserve.borrowRate  = 0;
        }

        reserve.borrowAmount = reserve.borrowAmount.sub(borrowItem.borrowAmount);

        return success;
    }

}