// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.9;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {SafeMath} from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import {DataTypes} from './DataTypes.sol';

library ReserveLogic {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    event ReserveDataUpdated(
        address indexed asset,
        uint256 interestRate
    );

    // using ReserveLogic for DataTypes.ReserveData;

    function init(
        DataTypes.Reserve storage reserve,
        address nTokenAddress,
        address debtTokenAddress
    ) external {
        reserve.nTokenAddress = nTokenAddress;
        reserve.debtTokenAddress = debtTokenAddress;
    }

    function updateState(DataTypes.Reserve storage reserve) internal {
        // TODO
    }
}