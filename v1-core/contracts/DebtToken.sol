// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import { IDebtToken } from "./interfaces/IDebtToken.sol";
import "@openzeppelin/contracts/utils/Context.sol";

/// @title DebtToken Contract for the NFTlend protocol.
/// @author Niftrr
/// @notice Allows for the tracking of debt for the purposes of APY calculations.
/// @dev Debt tokens are non-transferable and so diverge from the ERC20 standard.
contract DebtToken is Context, ERC20Pausable, IDebtToken, AccessControl, ReentrancyGuard {
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

    /// @notice Mints an amount of debt tokens to a given account.
    /// @param to The account.
    /// @param amount The amount of debt tokens.
    /// @dev Calls the underlying ERC20 `_mint` function.
    /// @return Boolean for execution success.
    function mint(
        address to, 
        uint256 amount
    ) 
        public 
        virtual 
        override 
        nonReentrant
        onlyLendingPool 
        whenNotPaused 
        returns (bool)
    {
        _mint(to, amount);
        return true;
    }

    /// @notice Burns an amount of debt tokens from a given account.
    /// @param account The account.
    /// @param amount The amount of debt tokens.
    /// @dev Calls the underlying ERC20 `_burn` function.
    /// @return Boolean for execution success.
    function burnFrom(
        address account,
        uint256 amount
    ) 
        public 
        virtual 
        override 
        nonReentrant
        onlyLendingPool
        whenNotPaused 
        returns (bool)
    {
        _burn(account, amount);
        return true;
    }

    /// @notice Burn unsupported.
    /// @dev Overrides the ERC20 `burn` function to make unsupported.
    function burn(
        uint256 amount
    ) 
        public 
        virtual 
        override   
    {
        amount;
        revert('BURN_NOT_SUPPORTED');
    }

    /// @notice Approve unsupported.
    /// @dev Overrides the ERC20 `approve` function to make unsupported.
    /// @return Boolean for execution success.
    function approve(
        address spender, 
        uint256 amount
    ) 
        public 
        virtual 
        override 
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
    {
        to;
        asset;
        amount;
        revert('TRANSFER_NOT_SUPPORTED');
    }

    /// @notice TransferFrom unsupported.
    /// @dev Overrides the ERC20 `transferFrom` function to make unsupported.
    /// @return Boolean for execution success.
    function transferFrom(
        address from, 
        address to, 
        uint256 amount
    ) 
        public 
        virtual 
        override 
        returns (bool) 
    {
        from;
        to;
        amount;
        revert('TRANSFER_NOT_SUPPORTED');
    }

    /// @notice Pauses all contract functions.
    /// @dev Functions paused via Pausable contract modifier.
    function pause() public virtual override onlyConfigurator {
        _pause();
    }

    /// @notice Unpauses all contract functions.
    /// @dev Functions unpaused via Pausable contract modifier.
    function unpause() public virtual override onlyConfigurator {
        _unpause();
    }

    function getTotalSupply() public override returns (uint256) {
        return totalSupply();
    }
}
