// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.9;

import { IFToken } from "../interfaces/IFToken.sol";
import { IDebtToken } from "../interfaces/IDebtToken.sol";
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {SafeMath} from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import "../WadRayMath.sol";
import { DataTypes } from './DataTypes.sol';

library ReserveLogic {
    using SafeMath for uint256;
    using WadRayMath for uint256;
    using SafeERC20 for IERC20;


    // event ReserveDataUpdated(
    //     address indexed asset,
    //     uint256 interestRate
    // );

    struct reserveDataLocalVars {  
        uint256 totalDebt;
        uint256 totalLiquidity;
        uint256 utilizationRate;
        uint256 liquidityRate;
        uint256 timeDelta;
    }

    using ReserveLogic for DataTypes.Reserve;

    function getUtilizationRateOld(
        DataTypes.Reserve storage reserve,
        uint256 totalFTokenSupply,
        uint256 totalDebtTokenSupply
    )
        internal
        view
        returns (uint256)
    {
        reserveDataLocalVars memory vars;
        vars.totalDebt = totalDebtTokenSupply;
        vars.totalLiquidity = totalFTokenSupply;
        
        vars.utilizationRate = 0;
        if (totalFTokenSupply > 0) {
            vars.utilizationRate = vars.totalDebt.wadToRay().rayDiv(vars.totalLiquidity.wadToRay());
        }
        return vars.utilizationRate;
    }

    function getUtilizationRate(
        DataTypes.Reserve storage reserve
    )
        internal
        view
        returns (uint256)
    {
        reserveDataLocalVars memory vars;
        vars.totalDebt = IFToken(reserve.debtTokenAddress).totalSupply(); // TODO: change to IDebtToken after this is implemented
        vars.totalLiquidity = IFToken(reserve.fTokenAddress).totalSupply();
        
        vars.utilizationRate = 0;
        if (vars.totalLiquidity > 0) {
            vars.utilizationRate = vars.totalDebt.wadToRay().rayDiv(vars.totalLiquidity.wadToRay());
        }
        return vars.utilizationRate;
    }

    function getLiquidityRate(
        DataTypes.Reserve storage reserve
    )
        internal 
        view
        returns (uint256)
    {
        reserveDataLocalVars memory vars;
        vars.utilizationRate = getUtilizationRate(reserve);
        return reserve.borrowRate.rayMul(vars.utilizationRate);
    }

    function getReserveNormalizedIncome(
        DataTypes.Reserve storage reserve,
        uint256 totalFTokenSupply,
        uint256 totalDebtTokenSupply
    )
        internal
        view
        returns (uint256)
    {
        reserveDataLocalVars memory vars;
        vars.liquidityRate = getLiquidityRate(reserve);

        if (reserve.latestUpdateTimestamp == 0) {
            vars.timeDelta = 0;
        } else {
            vars.timeDelta = block.timestamp.sub(reserve.latestUpdateTimestamp);
            // vars.timeDelta = 365 days;
        }

        return reserve.liquidityIndex.add(
            reserve.liquidityIndex.rayMul(vars.liquidityRate).mul(vars.timeDelta).div(365 days)
        );
    }

    function getUserFTokenBalance(
        DataTypes.Reserve storage reserve,
        address user
    )
        internal
        view
        returns (uint256)
    {
        return IFToken(reserve.fTokenAddress).balanceOf(user);
    }

    function getUserDebtTokenBalance(
        DataTypes.Reserve storage reserve,
        address user
    )
        internal
        view
        returns (uint256)
    {
        return IFToken(reserve.debtTokenAddress).balanceOf(user); // TODO: change to IDebtToken
    }

    function getFTokenTotalSupply(
        DataTypes.Reserve storage reserve
    )
        internal
        view
        returns (uint256)
    {
        return IFToken(reserve.fTokenAddress).totalSupply();
    }

    // function getDebtTokenTotalSupply(
    //     DataTypes.Reserve storage reserve
    // )
    //     internal
    //     view
    //     returns (uint256)
    // {
    //     return IDebtToken(reserve.debtTokenAddress).totalSupply();
    // }
}