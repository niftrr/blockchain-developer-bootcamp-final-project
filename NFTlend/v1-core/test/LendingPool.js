const { expect } = require('chai');
const { ethers } = require('hardhat');

// const ERC20 = artifacts.require('ERC20');
let LendingPool;
let hhLendingPool;
let hhLendingPoolAddress;
let AssetToken;
let hhAssetToken;
let hhAssetTokenSupply;
let NToken;
let hhNToken;
let owner;
let alice;
let bob;

beforeEach(async function() {
    hhAssetTokenSupply = 1000;

    // Get and deploy LendingPool
    LendingPool = await ethers.getContractFactory('LendingPool');
    hhLendingPool = await LendingPool.deploy();
    await hhLendingPool.deployed();
    hhLendingPoolAddress = await hhLendingPool.resolvedAddress;
    
    // Get and deploy Asset Token
    AssetToken = await ethers.getContractFactory('AssetToken');
    hhAssetToken = await AssetToken.deploy('Dai Token', 'DAI', hhAssetTokenSupply);
    await hhAssetToken.deployed();

    // Get and deploy nToken
    NToken = await ethers.getContractFactory('NToken');
    hhNToken = await NToken.deploy('Dai nToken', 'nDAI');
    await hhNToken.deployed();

    // Give minter role to LendingPool
    await hhNToken.setMinter(hhLendingPoolAddress);

    // Get Signers
    [owner, alice, bob] = await ethers.getSigners();
});

describe('AssetToken', function() {

    it('balance should be 1000 for owner', async function () {
        let balance = (await hhAssetToken.balanceOf(await owner.address)).toString();
        expect(balance).to.equal('1000');
    })

    it('balance should be zero for non-owner', async function () {
        let balance = (await hhAssetToken.balanceOf(await alice.address)).toString();
        expect(balance).to.equal('0');
    })
})

describe('LendingPool', function() {

    it('should init reserve', async function () {

        // Initialize reserve
        await expect(
            hhLendingPool.initReserve(
                hhAssetToken.address, 
                hhNToken.address,
                hhNToken.address))
            .to.emit(hhLendingPool, 'InitReserve')
            .withArgs(
                hhAssetToken.address, 
                hhNToken.address,
                hhNToken.address);
    });

    console.log('should deposit tokens into !!!!NToken contract!!!')
    it('should deposit tokens into NToken contract', async function () {
        const tokenAmount = 10;

        // Initialize reserve
        hhLendingPool.initReserve(
            hhAssetToken.address, 
            hhNToken.address,
            hhNToken.address)

        // Approve assetToken transferFrom lendingPool 
        await hhAssetToken.approve(hhLendingPoolAddress, tokenAmount);

        // Deposit tokenAmount of assetTokens in hhNToken contract
        await expect(
            hhLendingPool.deposit(hhAssetToken.address, tokenAmount))
            .to.emit(hhLendingPool, 'Deposit')
            .withArgs(hhAssetToken.address);

        // Successful transfer of assetTokens to hhNToken contract
        await expect(
            (await hhAssetToken.balanceOf(hhNToken.address)))
            .to.equal(tokenAmount);

    });
});

