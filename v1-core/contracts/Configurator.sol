// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import { ILendingPool } from "./interfaces/ILendingPool.sol";

import "hardhat/console.sol";

/// @title Configuration contract for the NFTlend protocol.
/// @author Niftrr
/// @notice Allows for configuration of the protocol.
/// @dev Emergency admin role is for non-BAU, security-critical updates.
contract Configurator is Context, AccessControl {
    bytes32 public constant EMERGENCY_ADMIN_ROLE = keccak256("EMERGENCY_ADMIN_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    address public lendingPoolAddress;

    constructor(address emergencyAdmin, address admin) {
        _setupRole(EMERGENCY_ADMIN_ROLE, emergencyAdmin);
        _setupRole(ADMIN_ROLE, admin);
    }

    modifier onlyEmergencyAdmin {
        require(hasRole(EMERGENCY_ADMIN_ROLE, _msgSender()), "Caller is not emergency admin.");
        _;
    }

    modifier onlyAdmin {
        require(hasRole(ADMIN_ROLE, _msgSender()), "Caller is not admin.");
        _;
    }

    /// @notice Connects the Lending Pool contract by setting the address.
    /// @param _lendingPoolAddress The lending pool address.
    /// @dev Sets the lendingPoolAddress variable.
    function connectLendingPool(address _lendingPoolAddress) public onlyAdmin {
        lendingPoolAddress = _lendingPoolAddress;
    }

    /// @notice Gets the Lending Pool contract address.
    /// @dev Returns the value of the lendingPoolAddress variable.
    function getLendingPoolAddress() public view returns (address) {
        return lendingPoolAddress;
    }

    /// @notice Pauses all Lending Pool contract functions.
    /// @dev Functions paused via Pausable contract modifier.
    function pauseLendingPool() public onlyEmergencyAdmin {
        ILendingPool(lendingPoolAddress).pause();
    }

    /// @notice Unpauses all Lending Pool contract functions.
    /// @dev Functions unpaused via Pausable contract modifier.
    function unpauseLendingPool() public onlyEmergencyAdmin {
        ILendingPool(lendingPoolAddress).unpause();
    }

    /// @notice Initializes a Lending Pool reserve.
    /// @param asset The ERC20, reserve asset token.
    /// @param nTokenAddress The derivative nToken address.
    /// @param debtTokenAddress The derivative debtToken address.
    /// @dev External `initReserve` function calls `_initReserve` if modifiers are succeeded.    
    function initLendingPoolReserve(
        address asset, 
        address nTokenAddress,
        address debtTokenAddress
    )
        public onlyAdmin 
    {
        ILendingPool(lendingPoolAddress).initReserve(
            asset, 
            nTokenAddress, 
            debtTokenAddress
        );
    }

    /// @notice Freezes the specified Lending Pool asset reserve
    /// @param asset The ERC20, reserve asset token.
    /// @dev To freeze Lending Pool deposit and borrow functions for a single reserve.
    function freezeLendingPoolReserve(address asset) public onlyEmergencyAdmin {
        ILendingPool(lendingPoolAddress).freezeReserve(asset);
    }

    /// @notice Pauses the specified Lending Pool asset reserve
    /// @param asset The ERC20, reserve asset token.
    /// @dev To pause Lending Pool functions for a single reserve instead of the whole contract.
    function pauseLendingPoolReserve(address asset) public onlyEmergencyAdmin {
        ILendingPool(lendingPoolAddress).pauseReserve(asset);
    }

    /// @notice Protects the specified Lending Pool asset reserve
    /// @param asset The ERC20, reserve asset token.
    /// @dev Deactivates Lending Pool functions `liquidate`, `deposit` and `borrow`.
    function protectLendingPoolReserve(address asset) public onlyEmergencyAdmin {
        ILendingPool(lendingPoolAddress).protectReserve(asset);
    }

    /// @notice Activate the specified Lending Pool asset reserve
    /// @param asset The ERC20, reserve asset token.
    /// @dev To activate all functions for a single Lending Pool reserve.
    function activateLendingPoolReserve(address asset) public onlyEmergencyAdmin {
        ILendingPool(lendingPoolAddress).activateReserve(asset);
    }

    /// @notice Connects the Lending Pool to the Collateral Manager by setting the address.
    /// @param _collateralManagerAddress The Collateral Manager contract address.
    /// @dev This can be set only once and is protected by a modifier.
    function connectLendingPoolCollateralManager(
        address _collateralManagerAddress
    ) 
        public
        onlyEmergencyAdmin
    {
        ILendingPool(lendingPoolAddress).connectCollateralManager(
            _collateralManagerAddress
        );
    }

    /// @notice Connects the Lending Pool to the Token Price Oracle by setting the address.
    /// @param tokenPriceOracleAddress The Token Price Oracle contract address.
    /// @dev This can be reset but shouldn't need to be.
    function connectLendingPoolTokenPriceOracle(
        address tokenPriceOracleAddress
    ) 
        public
        onlyEmergencyAdmin
    {
        ILendingPool(lendingPoolAddress).connectTokenPriceOracle(
            tokenPriceOracleAddress
        );
    }

}