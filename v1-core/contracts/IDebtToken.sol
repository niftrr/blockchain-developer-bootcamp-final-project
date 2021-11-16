// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

// import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
interface IDebtToken {
    function mint(address account, uint256 amount) external;

    function burn(uint256 amount) external;

    function burnFrom(address account, uint256 amount) external;

    function pause() external;

    function unpause() external;

    function setAdmin(address to) external;

    function setMinter(address to) external;

    function setBurner(address to) external;

    function setPauser(address to) external;

    function transfer(address asset, address to, uint256 amount) external;

}