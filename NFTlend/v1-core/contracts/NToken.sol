//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import { INToken } from './INToken.sol';

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/**
 * @dev {ERC20} token, including:
 *
 *  - ability for holders to burn (destroy) their tokens
 *  - a minter role that allows for token minting (creation)
 *  - a pauser role that allows to stop all token transfers
 *
 * This contract uses {AccessControl} to lock permissioned functions using the
 * different roles - head to its documentation for details.
 *
 * The account that deploys the contract will be granted the minter and pauser
 * roles, as well as the default admin role, which will let it grant both minter
 * and pauser roles to other accounts.
 */
contract NToken is Context, AccessControlEnumerable, ERC20Pausable, INToken {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    event TransferSent(address from, address to, uint256 amount);

    /**
     * @dev Grants `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE` and `PAUSER_ROLE` to the
     * account that deploys the contract.
     *
     * See {ERC20-constructor}.
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(BURNER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
    }

    function setAdmin(address to) public virtual override {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "NToken: must have admin role to change admin role");
        _setupRole(DEFAULT_ADMIN_ROLE, to);
    }

    function setMinter(address to) public virtual override {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "NToken: must have admin role to change minter role");
        _setupRole(MINTER_ROLE, to);
    }

    function setBurner(address to) public virtual override {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "NToken: must have admin role to change burner role");
        _setupRole(BURNER_ROLE, to);
    }

    function setPauser(address to) public virtual override {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "NToken: must have admin role to change pauser role");
        _setupRole(PAUSER_ROLE, to);
    }

    /**
     * @dev Creates `amount` new tokens for `to`.
     *
     * See {ERC20-_mint}.
     *
     * Requirements:
     *
     * - the caller must have the `MINTER_ROLE`.
     */
    function mint(address to, uint256 amount) public virtual override {
        require(hasRole(MINTER_ROLE, _msgSender()), "NToken: must have minter role to mint");
        _mint(to, amount);
    }

    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) public virtual override {
        require(hasRole(BURNER_ROLE, _msgSender()), "NToken: must have burner role to burn");
        _burn(_msgSender(), amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's
     * allowance.
     *
     * See {ERC20-_burn} and {ERC20-allowance}.
     *
     * Requirements:
     *
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `amount`.
     */
    function burnFrom(address account, uint256 amount) public virtual override {
        uint256 currentAllowance = allowance(account, _msgSender());
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        unchecked {
            _approve(account, _msgSender(), currentAllowance - amount);
        }
        _burn(account, amount);
    }

    /**
     * @dev Pauses all token transfers.
     *
     * See {ERC20Pausable} and {Pausable-_pause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function pause() public virtual override {
        require(hasRole(PAUSER_ROLE, _msgSender()), "ERC20PresetMinterPauser: must have pauser role to pause");
        _pause();
    }

    /**
     * @dev Unpauses all token transfers.
     *
     * See {ERC20Pausable} and {Pausable-_unpause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function unpause() public virtual override {
        require(hasRole(PAUSER_ROLE, _msgSender()), "ERC20PresetMinterPauser: must have pauser role to unpause");
        _unpause();
    }

    function reserveTransfer(address to, address asset, uint256 amount) public virtual override {
        require(hasRole(BURNER_ROLE, _msgSender()), "NToken: must have burner role to transfer tokens");
        require(IERC20(asset).balanceOf(address(this)) >= amount, "Insuffiecient supply of asset token in reserve.");

        IERC20(asset).approve(to, amount);
        IERC20(asset).transfer(to, amount);

        emit TransferSent(address(this), to, amount);
    }

    function reserveTransferFrom(address from, address asset, uint256 amount) public virtual override {
        require(hasRole(BURNER_ROLE, _msgSender()), "NToken: must have burner role to transfer tokens");
        require(IERC20(asset).balanceOf(from) >= amount, "Insufficient user asset token balance.");

        IERC20(asset).transferFrom(from, address(this), amount);

        emit TransferSent(from, address(this), amount);
    }
}
