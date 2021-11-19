// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AssetToken is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialBalance) ERC20(name, symbol) {
        _mint(msg.sender, initialBalance);
    }
}