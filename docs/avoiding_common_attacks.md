# Avoiding Common Attacks

## SWC-100 (Function Default Visibility)

Vulnerable state operations moved to `private` functions to be called by secured and permissioned `external` wrapper functions. Similar conscious decisions have been made to explicity set the visibility type of all other functions. 

## SWC-101 (Integer Overflow and Underflow)

`SafeMath` contract from OpenZeppelin used to revert a transaction when an operation overflows or underflows. 

## SWC-103 (Floating pragma)

Specific compiler pragma `0.8.9` used in contracts to avoid accidental bug inclusion through outdated compiler versions. 

## SWC-104 (Unchecked Call Return Value)

External calls and low-level `call` and `delegatecall` method responses are checked for success. Transaction are reverted on failure to avoid unexpected behaviour and potential exploits.

## SWC-107 (Reentrancy)

State changes are avoided after external calls using the Checks-Effects-Interactions patten. In addition, the contracts inherit the `ReentrancyGuard` from OpenZeppelin to make sure there are no nested (reentrant) calls to their functions. 

## SWC-108 (State Variable Default Visibility)

Consious decisions have been made to explicitly set the visibility type of all state variables.

## SWC-125 (Incorrect Inheritance Order)

Contracts are inheritted from more general to more specific to avoid unexpected behaviour. This was a special consideration in creating the `debtToken` contract that is a non-`ERC20`-compliant, `IERC20` inherited contract.

## Modifiers used only for validation

All modifiers are used for validation only, with a `require` statement.

## Pull over push

All functions prioritize recieving contract calls over making contract calls.
