# NFTlend V1 Core

This repository contains the core smart contracts for the NFTlend V1 Protocol. 

## Licensing

The primary license for NFTlend V1 Core is the Business Source License 1.1 (`BUSL-1.1`), see [`LICENSE`](./LICENSE).

## Dev Notes

### Creating Tokens

1. `token = await ERC20PresetMinterPauser.new("Faux DAI", "DAI")`
2. `await token.address`
3. `await token.mint('{addresses[0]}', '1000000000000000000000')` 
4. `(await token.balanceOf('{addresses[0]}')).toString()`

[Resource](https://forum.openzeppelin.com/t/create-an-erc20-using-truffle-without-writing-solidity/2713)
### Creating NFTs

1. `nft = await ERC721PresetMinterPauserAutoId.deployed()`
2. `await nft.mint({addresses[0]})`
3. `await nft.ownerOf(0)`
4. `await nft.tokenURI(0)`

[Resource](https://forum.openzeppelin.com/t/create-an-nft-and-deploy-to-a-public-testnet-using-truffle/2961)