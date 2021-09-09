# `NFTlend.xyz`

> ### The NFT Liquidity Protocol
>
> *Lend and borrow against NFTs*

## Overview

`NFTlend.xyz` is an open-source, non-custodial liquidity protocol for borrowing assets using NFTs as collateral and earning interest on deposits.

### Borrowers

Use their NFTs as collateral to access liquidity.
### Lenders

Provide liquidity in return for attractive yields.

### Loans

Loans are generated from Collateralized Debt Positions (CDPs). The value of collateral locked up in a CDP must always be greater than the asset loaned against it plus some margin. 

Borrowers can close a loan at any time and unlock their NFT simply by repaying the debt.

### Soft Call

A Soft Call is triggered if the value of collateral in a CDP versus the assets loaned against it drops below a given threshold. 150%, for example.

Triggering a Soft Call gives the Borrower a set amount of time to resolve this shortfall before a Hard Call is triggered. This can be done through a partial loan repayment or by depositing a similar NFT.

The time allowed to resolve a Soft Call may be 24 hours, for instance, subject to protocol Governance.

### Hard Call

A Hard Call is triggered if the value of collateral in a CDP vs. the assets loaned against it drops below a subsequent threshold (125%, for instance), or a Soft Call is triggered and is not resolved in time. 

Triggering a Hard Call fractionalizes the NFT ERC721 token into ERC20 index tokens via [NFTX](https://app.nftx.org/). A proportion of these are sold / swapped on [Sushi](https://app.sushi.com/swap); enough to fully reimburse the Lender(s) plus a small liquidation fee paid to the protocol. The remaining ERC20 tokens are returned to the Lender, closing the loan. 

## Site Functionality

Users access the `NFTlend.xyz` website and connect to the app using their MetaMask Wallet.

### Borrowers

* Choose their NFT's Reserve to deposit their NFT
  * E.g. The [BAYC](https://boredapeyachtclub.com/#/home) Reserve
* They select the amount and type of collateral they wish to receive
  * E.g. 20 ETH
* The APR and minimum threshold levels are predetermined and visible at the time of loan creation
  * E.g.20% and 150%, respectively at present
  * These values may be updated by Governance
* And approve the transaction in MetaMask
* If liquidity (full or partial) is available they will receive their funds immediately
* If liquidity is unavailable they will enter a queue, FIFO
* Repay outstanding debt to close the loan and unlock their NFT
* (Partially repay debt or collateralize similar NFT in the case of a Soft Call)
* (Transfer equivalent ERC20 tokens from user account to Ethereum account / wallet in the case of a Hard Call forced liquidation)

### Lenders

* Choose the NFT Reserve to which they wish to add liquidity
  * Statistics such as Current and Historics Interest Rates, Collateralization Levels and NFTX Prices will be visible to aid decision making
* They select the amount of liquidity they wish to provide  
* And approve the transaction in MetaMask
* Added liquidity will immediately impact the returns of all lenders as they receive yields in proportion to their share of the overall market size
* Periodically receive yield payments to their user account
* Authorise the transfer of funds from their user account to their Ethereum account / wallet

## Detail

### Loans

* Are priced using NFTX floor prices
* Should remain above the `softcall_threshold`
* A `softcall` is executed if collateral drops below this threshold. Where:
  * the Borrower has `softcall_time` to make up the collateral deficit otherwise a `hardcall` is executed
* A `hardcall` is executed if collateral drops below the `hardcall_threshold` or has dropped below `softcall_threshold` for a period greater than `softcall_time`. Here:
  * the NFT collateral is deposited within its NFTX Vault
  * an amount of NFTX ERC20 tokens are sold to cover the outstanding debt and gas costs plus a `liquidation_fee`
  * the Lender receives their capital investment back in full
  * the Borrower receives the remaining NFTX ERC20 tokens

### Interest

* `loan_apr` is paid by the Borrower(s) to Lender(s)
* Continually accrued

### Fees

* `loan_creation_fee` paid by Borrowers at loan inception
* `liquidation_fee` paid by Borrowers if and when a Hard Call is triggered

### Variables

Values subject to protocol governance.

| | |
|--|--|
| `loan_apr` | 20% |
| `loan_creation_fee` | 0.5% |
| `softcall_threshold` | 150% |
| `hardcall_threshold` | 125% |
| `softcall_time` | 24hrs |
| `liquidation_fee` | 10% |

## Smart Contract Functionality

### Pseudocode (Rough / WIP)

```
contract borrow is
    input:  nft,
            loan_amount,
            loan_asset
    output: (loan or (partial_loan and promise_loan)) and debt_obligation

    if liquidity in nft_reserve
        if full liquidity
            return loan and debt_obligation
        else if partial liquidity
            return partial_loan, promise and debt_obligation          
    else
        return promise and debt_obligation


contract lend is
    input:  nft_reseve
            liquidity_amount,
            liquidity_asset
    output: promise_yield and deposit_receipt

    if collateral not in nft_reserve
        throw error
    
    return promise and deposit_receipt


contract pricing_oracle is
    input:  None
    output: nft_prices

    let nft_prices := []

    for each time_period in given interval do
        for each nft_reserve in nft_reserves do
            nft_prices <- nft_prices + (nft_reserve, nft_price) 

    return nft_prices


contract collataral_validation is
    input: nft_prices
    output: None

    for each nft_reserve in nft_reserves do
        for each loan in nft_reserve do
            
            let loan_collateral := nft_price / loan.percentage_collateralization
            
            if loan.asset_value > 150% loan_collateral
                execute soft_call contract on loan
                let timer start

            if (loan.asset_value > 150% loan_collateral and 
                timer > 24 hours) or 
               (loan.asset_value > 125% loan_collateral)
                execute hard_call contract on loan

    return None


contract softcall is
    input: loan,
           debt_obligation
           nft_price
    output: debt_obligation

    let debt_obligation <- debt_obligation 
                         + an amount of loan.liquidity_asset to reach the required minimum of 150% 

    return debt_obligation  


contract hardcall is 
    input: loan,
           nft_price
    output: None

    deposit loan.nft into NFTX Vault
    
    sell NFTX ERC20 tokens on Sushi to cover loan.debt_obligation + loan.liquidation_fee

    refund loan.debt_obligation.asset_amount to loan.lender(s)

    send liquidation_fee to protocol

    send remaining ERC20 tokens to borrower

    close loan

    return None
```
