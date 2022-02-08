// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.9;

import { LendingPoolStorage } from './LendingPoolStorage.sol';
import { INToken } from "./interfaces/INToken.sol";
import { IDebtToken } from "./interfaces/IDebtToken.sol";
import { ICollateralManager } from "./interfaces/ICollateralManager.sol";
import { MockOracle } from "./mocks/Oracle.sol";
import { SafeMath } from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import "./WadRayMath.sol";

import { DataTypes } from "./libraries/DataTypes.sol";

import "hardhat/console.sol";

/// @title Lending Pool Logic contract.
/// @author Niftrr
/// @notice Contains unprotected public view and internal Lending Pool functions.
/// @dev To help organize and limit size of Lending Pool contract.
contract LendingPoolLogic is LendingPoolStorage, MockOracle {
    using SafeMath for uint256;  
    using WadRayMath for uint256;

    /// @notice Get the Token Price Oracle contract address.
    /// @dev Uses a state variable.
    /// @return Returns the Token price oracle contract address.
    function getTokenPriceOracleAddress() public view returns (address) {
        return _tokenPriceOracleAddress;
    }

    /// @notice Get the Collateral Manager contract address.
    /// @dev Uses a state variable.
    /// @return Returns the Collateral Manager contract address.
    function getCollateralManagerAddress() public view returns (address) {
        return _collateralManagerAddress;
    }

    /// @notice Private function to calculate borrow variables.
    /// @param asset The ERC20 token to be borrowed.
    /// @param amount The amount of ERC20 tokens to be borrowed.
    /// @param collateral The ERC721 token to be used as collateral.
    /// @param numWeeks The number of weeks until the borrow maturity.
    /// @dev Returns items in a fixed array and split from _borrow to save on space.
    /// @return Array of the repaymentAmount, collateralFloorPrice and maturity.
    function getBorrowVariables(
        address asset,
        uint256 amount, 
        address collateral,
        uint256 numWeeks
    )
        internal
        returns (uint256[4] memory)
    {
        uint256[4] memory variables;
        uint256 interestRate = ICollateralManager(
            _collateralManagerAddress
        ).getInterestRate(
            collateral
        );
        //repaymentAmount
        variables[0] = amount.add(
            WadRayMath.rayToWad(
                WadRayMath.rayMul(WadRayMath.wadToRay(amount), interestRate).mul(numWeeks).div(52)
            )
        );

        //interestRate
        variables[1] = interestRate;
        //collateralFloorPrice
        variables[2] = getMockFloorPrice(collateral, asset); 
        //maturity
        variables[3] = block.timestamp.add(numWeeks.mul(1 weeks)); 
        return variables;
    }

}