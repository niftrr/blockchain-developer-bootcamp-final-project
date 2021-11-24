// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface INToken is IERC20 {
    function mint(address account, uint256 amount) external returns (bool);

    function burn(uint256 amount) external returns (bool);

    function burnFrom(address account, uint256 amount) external returns (bool);

    function reserveTransfer(address asset, address to, uint256 amount) external returns (bool);

    function reserveTransferFrom(address asset, address from, uint256 amount) external returns (bool);

    function pause() external;

    function unpause() external;
}