// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import { IDebtToken } from './interfaces/IDebtToken.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

/// @title DebtToken Contract for the NFTlend protocol.
/// @author Niftrr
/// @notice Allows for the tracking of debt for the purposes of APY calculations.
/// @dev Debt tokens are non-transferable and so diverge from the ERC20 standard.
contract DebtToken is ERC20Pausable, IDebtToken, AccessControl {
    bytes32 public constant CONFIGURATOR_ROLE = keccak256("CONFIGURATOR_ROLE");
    bytes32 public constant LENDING_POOL_ROLE = keccak256("LENDING_POOL_ROLE");

    constructor(
        address configurator, 
        address lendingPool,
        string memory name, 
        string memory symbol
    ) 
        ERC20(name, symbol) 
    {
        // Grant the configurator and lendingPool roles
        _setupRole(CONFIGURATOR_ROLE, configurator);
        _setupRole(LENDING_POOL_ROLE, lendingPool);
    }

    modifier onlyConfigurator() {
        require(hasRole(CONFIGURATOR_ROLE, msg.sender), "Caller is not the Configurator");
        _;
    }

    modifier onlyLendingPool() {
        require(hasRole(LENDING_POOL_ROLE, msg.sender), "Caller is not the Lending Pool");
        _;
    }

    /// @notice Mints an amount of debt tokens to a given account.
    /// @param to The account.
    /// @param amount The amount of debt tokens.
    /// @dev Calls the underlying ERC20 `_mint` function.
    function mint(address to, uint256 amount) public virtual override onlyLendingPool {
        _mint(to, amount);
    }

    /// @notice Burns an amount of debt tokens from a given account.
    /// @param account The account.
    /// @param amount The amount of debt tokens.
    /// @dev Calls the underlying ERC20 `_burn` function.
    function burnFrom(address account, uint256 amount) public virtual override onlyLendingPool {
        _burn(account, amount);
    }

    /// @notice Burn unsupported.
    /// @dev Overrides the ERC20 `burn` function to make unsupported.
    function burn(uint256 amount) public virtual override onlyLendingPool {
        amount;
        revert('BURN_NOT_SUPPORTED');
    }

    /// @notice Approve unsupported.
    /// @dev Overrides the ERC20 `approve` function to make unsupported.
    function approve(
        address spender, 
        uint256 amount
    ) 
        public 
        virtual 
        override 
        onlyLendingPool 
        returns (bool) 
    {
        spender;
        amount;
        revert('APPROVE_NOT_SUPPORTED');
    }

    /// @notice Transfer unsupported.
    /// @dev Overrides the ERC20 `transfer` function to make unsupported.
    function transfer(
        address to, 
        address asset, 
        uint256 amount
    ) 
        public 
        virtual 
        override 
        onlyLendingPool 
    {
        to;
        asset;
        amount;
        revert('TRANSFER_NOT_SUPPORTED');
    }

    /// @notice TransferFrom unsupported.
    /// @dev Overrides the ERC20 `transferFrom` function to make unsupported.
    function transferFrom(
        address from, 
        address to, 
        uint256 amount
    ) 
        public 
        virtual 
        override 
        onlyLendingPool
        returns (bool) 
    {
        from;
        to;
        amount;
        revert('TRANSFER_NOT_SUPPORTED');
    }

    /// @notice Pauses the debt token contract.
    /// @dev Pauses `mint`/`burn` function calls.
    function pause() public virtual override onlyConfigurator {
        _pause();
    }

    /// @notice Unpauses the debt token contract.
    /// @dev Unpauses `mint`/`burn` function calls.
    function unpause() public virtual override onlyConfigurator {
        _unpause();
    }
}
