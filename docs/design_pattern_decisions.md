# Design Pattern Decisions

## Inter-Contract Execution

### System Diagram

![System Diagram](../assets/nftlend-system-diagram.png?raw=true "System diagram")

The `Configurator` and `LendingPool` contracts use interfaces to call and update state within the `CollateralManager`, `NToken` and `DebtToken` contracts. Oracle contracts are called directly.

### `LendingPool`
* `deposit()`: 
  * Uses the `IERC20` interface to transfer tokens from sender to the `NToken` contract
  * Uses the `INToken` interface to mint the sender nTokens from the `NToken` contract.
* `withdraw()`: 
  * Uses the `INToken` interface to burn tokens from sender account within the `NToken` contract
  * Uses the `INToken` interface transfer tokens from the `NToken` contract to the sender.
* `borrow()`: 
  * Uses the `ICollateralManager` interface to deposit collateral and create a borrow within the `CollateralManager` contract.
  * Uses the `IDebtToken` interface mint debtTokens from the `DebtToken` contract to the sender.
  * Uses the `INToken` interface to transfer tokens from the `Ntoken` contract to the sender. 
* `repay()`:
  * Uses the `INToken` interface to transfer tokens from the sender to the `Ntoken` contract. 
  * Uses the `ICollateralManager` interface to withdraw collateral and repay a borrow within the `CollateralManager` contract.
  * Uses the `IDebtToken` interface burn debtTokens held by sender.
* `liquidate()`:
  * Uses the `IERC20` interface to transfer tokens from the sender to the `Ntoken` contract, `LendingPool` contract and borrower account.
  * Uses the `IDebtToken` interface burn debtTokens held by the borrower.
  * Uses the `ICollateralManager` interface to retrieve the collateral and liquidate a borrow within the `CollateralManager` contract.

### `CollateralManager`
* `deposit()`, `withdraw()` and `retrieve()`:
  * Uses the `IERC721` interface to transfer ERC721 token tokenIds to and from the contract.

### `Configurator`
* Uses the `ILendingPool` interface to:
  * set state variables.
  * `pause()` / `unpause()` the `LendingPool` contract.
  * `initLendingPoolReserve()`, `freezeLendingPoolReserve()`, `pauseLendingPoolReserve()`, `protectLendingPoolReserve()` and `activateLendingPoolReserve()` to create and manage reserve issues without having to pause the whole contract.
* Uses the `ICollateralManager`, `INToken` and `IDebtToken` interfaces to:
  * set state variables.
  * `pause()` / `unpause()` their respective contracts.


## Inheritance,  Interfaces and Libraries

`Context`, `AccessControl` and `Pausable` contracts inherited from OpenZeppelin. 
* `Context` used to enable meta-transactions sent by a trusted forwarder.
* `AccessControl` used to set role-based access control.
* `Pausable` used to enable the pause / unpause of contracts.
* `ERC20Pausable` used to enable to pause / unpause of inherited ERC20 contracts. 

`LendingPoolStorage` contract created and inherited to maintain storage and help limit the size of the `LendingPool` contract. 

`IERC20` and `IERC721` OpenZeppelin interfaces used to interact with the respective ERC compliant contracts. 

`IERC721Receiver` OpenZeppelin interface inherited to receive the safe transfer of ERC721 tokens. 

`ILendingPool`, `ICollateralManager`, `INToken` and `IDebtToken` interfaces created and used to interact with their respective protocol contracts.

`DataTypes` library created and used to share data types between protocol contracts. 

### `LendingPool`

* Inherits: `Context`, `LendingPoolStorage`, `AcessControl` and `Pausable`.
* Uses interfaces: `IERC20`, `INToken`, `IDebtToken`, `ICollateralManager`
* Uses library: `DataTypes` 

### `CollateralManager`

* Inherits: `Context`, `IERC721Receiver`, `AcessControl` and `Pausable`.
* Uses interfaces: `IERC721`, `IERC721Receiver`
* Uses library: `DataTypes` 

### `NToken`

* Inherits: `Context`, `INToken`, `AcessControl` and `ERC20Pausable`.
* Uses interfaces: `IERC20`

### `DebtToken`

* Inherits: `Context`, `ERC20Pausable` `IDebtToken` and `AcessControl`.
* Uses interfaces: `IERC20`

### `Configurator`

* Inherits: `Context` and `AcessControl`.
* Uses interfaces: `ILendingPool`, `ICollateralManager`, `INToken` and `IDebtToken`.

<!-- ## Oracles

TODO -->

## Access Control Design Patterns

### `Role-Based Access Control`

*Role-Based Access Control (RBAC)* design pattern used, inherriting from the OpenZeppelin `AccessControl` contract. The RBAC design is used to restrict access to function calls. Roles for each of the protocol contract "callers" have been created (e.g. `LendingPool` &rarr; `LENDING_POOL_ROLE`) to permission inter-contract execution, and help protect the sytem from bad actors. Access roles enable only the:

* `LENDING_POOL_ROLE` to:
  * `deposit()`, `withdraw()` and `retrieve()` collateral within the `CollateralManager` contract.
  * `mint()`, `burn()`, `burnFrom()`, `approve()`, `reserveTransfer()`, `reserveTransferFrom()` within the `NToken` contract.
  * `mint()`, `burn()`, `burnFrom()`, `approve()`, within the `DebtToken` contract.
* `CONFIGURATOR_ROLE` to:
  * `pause()` or `unpause()` all other contracts and set state variables. 
  * `initReserve()`, `freezeReserve()`, `pauseReserve()`, `protectReserve()`, `activateReserve()`, `connectCollateralManager()` and connect oracles within the `LendingPool` contract. 
* `ADMIN_ROLE` to:
  * `connectLendingPool()`, `connectCollateralManager()`, `connectLendingPoolCollateralManager()`, `initLendingPoolReserve()`, `setCollateralManagerInterestRate()`, `setCollateralManagerLiquidationThreshold()`, `updateCollatearlManagerWhitelist()` and connect oracles within the `Configurator` contract.
* `EMERGENCY_ADMIN_ROLE` to:
  * `pauseLendingPool()`, `unpauseLendingPool()`, `freezeLendingPoolReserve()`, `pauseLendingPoolReserve()`, `protectLendingPoolReserve()`, `activateLendingPoolReserve()`, `pauseCollateralManager()`, `unpauseCollateralManager()`, `pauseNToken()`, `unpauseNToken()` and `pauseDebtToken()`, `unpauseDebtToken()` within the `Configurator` contract.

Assess roles per contract:

* `LendingPool`:
  * `CONFIGURATOR_ROLE`
* `CollateralManager`:
  * `CONFIGURATOR_ROLE`
  * `LENDING_POOL_ROLE`
* `NToken`:
  * `CONFIGURATOR_ROLE`
  * `LENDING_POOL_ROLE`
* `DebtToken`:
  * `CONFIGURATOR_ROLE`
  * `LENDING_POOL_ROLE`
* `Configurator`:
  * `EMERGENCY_ADMIN_ROLE`
  * `ADMIN_ROLE`

<!-- ## Upgradable Contracts

TODO -->

<!-- ## Optimizing Gas

TODO -->