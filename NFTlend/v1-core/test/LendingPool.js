const { expect } = require('chai');
const { ethers } = require('hardhat');

// const ERC20 = artifacts.require('ERC20');
let LendingPool;
let hhLendingPool;
let hhLendingPoolAddress;
let CollateralManager;
let hhCollateralManager;
let hhCollateralManagerAddress;
let AssetToken;
let hhAssetToken;
let hhAssetTokenSupply;
let NToken;
let hhNToken;
let DebtToken;
let hhDebtToken;
let owner;
let alice;
let bob;
let alice_tokenId;
let bob_tokenId;

beforeEach(async function() {
    numDecimals = 10; // set lower than 18 due to ether.js issue
    hhAssetTokenSupply = 3*10**numDecimals;
    hhAssetTokenInitialBalance = 1*10**numDecimals;
    alice_tokenId = 0;
    bob_tokenId = 1;

    // Get and deploy LendingPool
    LendingPool = await ethers.getContractFactory('LendingPool');
    hhLendingPool = await LendingPool.deploy();
    await hhLendingPool.deployed();
    hhLendingPoolAddress = await hhLendingPool.resolvedAddress;
    console.log('LendingPoolAddress deployed:', hhLendingPoolAddress);

    // Get and deploy CollateralManager
    CollateralManager = await ethers.getContractFactory('CollateralManager');
    hhCollateralManager = await CollateralManager.deploy();
    await hhCollateralManager.deployed();
    hhCollateralManagerAddress = await hhCollateralManager.resolvedAddress;
    console.log('CollateralManager deployed:', hhCollateralManagerAddress);

    // Link CollateralManager to LendingPool
    await hhLendingPool.setCollateralManagerAddress(hhCollateralManagerAddress);

    // Get and deploy Asset Token
    AssetToken = await ethers.getContractFactory('AssetToken');
    hhAssetToken = await AssetToken.deploy('Dai Token', 'DAI', hhAssetTokenSupply);
    await hhAssetToken.deployed();

    // Get and deploy nToken
    NToken = await ethers.getContractFactory('NToken');
    hhNToken = await NToken.deploy('Dai nToken', 'nDAI');
    await hhNToken.deployed();

    // -- Assign minter role to LendingPool
    await hhNToken.setMinter(hhLendingPoolAddress);

    // -- Assign burner role to LendingPool
    await hhNToken.setBurner(hhLendingPoolAddress);

    // Get and deploy debtToken
    DebtToken = await ethers.getContractFactory('DebtToken');
    hhDebtToken = await DebtToken.deploy('Dai debtToken', 'debtDAI');
    await hhDebtToken.deployed();   

    // -- Assign minter role to LendingPool
    await hhDebtToken.setMinter(hhLendingPoolAddress);

    // -- Assign burner role to LendingPool
    await hhDebtToken.setBurner(hhLendingPoolAddress);

    // Get and deploy NFT
    NFT = await ethers.getContractFactory('NFT');
    hhNFT = await NFT.deploy('Punk NFT', 'PUNK');
    await hhNFT.deployed();

    // Set NFT liquidation threshold
    hhCollateralManager.setLiquidationThreshold(hhNFT.address, 150); // in percent

    // Get Signers
    [owner, alice, bob] = await ethers.getSigners();
    console.log('alice:', alice.address);
    console.log('bob:', bob.address);
    // Transfer funds to alice and bob
    await hhAssetToken.transfer(alice.address, hhAssetTokenInitialBalance);
    await hhAssetToken.transfer(bob.address, hhAssetTokenInitialBalance);

    // Mint NFTs to alice and bob
    await hhNFT.mint(alice.address, alice_tokenId);
    await hhNFT.mint(bob.address, bob_tokenId);
});

describe('AssetToken', function() {

    it('balance should be 1*10*numDecimals for owner', async function () {
        let balance = (await hhAssetToken.balanceOf(await owner.address)).toString();
        expect(balance).to.equal((hhAssetTokenSupply - 2 * hhAssetTokenInitialBalance).toString());
    })

    it('balance should be zero for non-owner', async function () {
        let balance = (await hhAssetToken.balanceOf(await alice.address)).toString();
        expect(balance).to.equal(hhAssetTokenInitialBalance.toString());
    })
})

describe('LendingPool >> Init', function() {

    // TODO: 
    // - should revert if reserve doesn't exist
    // - should revert if non-owner tries to init reserve
    // - ... 

    it('should init reserve', async function () {

        // Initialize reserve
        await expect(
            hhLendingPool.initReserve(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address))
            .to.emit(hhLendingPool, 'InitReserve')
            .withArgs(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address);
    });
});
    
describe('LendingPool >> Deposit', function() {

    it('should deposit tokens into NToken contract', async function () {
        const tokenAmount = 1*10**numDecimals;

        // Initialize reserve
        hhLendingPool.initReserve(
            hhAssetToken.address, 
            hhNToken.address,
            hhNToken.address)

        // Approve assetToken transferFrom lendingPool 
        await hhAssetToken.connect(alice).approve(hhLendingPoolAddress, tokenAmount);

        // Deposit tokenAmount of assetTokens in hhNToken contract
        await expect(
            hhLendingPool.connect(alice).deposit(hhAssetToken.address, tokenAmount))
            .to.emit(hhLendingPool, 'Deposit')
            .withArgs(
                hhAssetToken.address,
                tokenAmount,
                alice.address);

        // Expect assetTokens to have transfered from alice hhNToken contract
        await expect(
            (await hhAssetToken.balanceOf(alice.address)))
            .to.equal((hhAssetTokenInitialBalance - tokenAmount));
        await expect(
            (await hhAssetToken.balanceOf(hhNToken.address)))
            .to.equal(tokenAmount);

        // Expect nTokens to have been minted directly to alice 
        await expect(
            (await hhNToken.balanceOf(hhNToken.address)))
            .to.equal(0);
        await expect(
            (await hhNToken.balanceOf(alice.address)))
            .to.equal(tokenAmount);

    });

});

describe('LendingPool >> Withdraw', function() {

    it('should withdraw after deposit (burning nTokens to retreive assetTokens)', async function () {
        const tokenAmount = 1*10**numDecimals;

        // Initialize reserve
        hhLendingPool.initReserve(
            hhAssetToken.address, 
            hhNToken.address,
            hhDebtToken.address)

        // Approve assetToken transferFrom signer to lendingPool 
        await hhAssetToken.connect(alice).approve(hhLendingPoolAddress, tokenAmount);

        // Deposit tokenAmount of assetTokens in hhNToken contract
        await expect(
            hhLendingPool.connect(alice).deposit(hhAssetToken.address, tokenAmount))
            .to.emit(hhLendingPool, 'Deposit')
            .withArgs(
                hhAssetToken.address,
                tokenAmount,
                alice.address);

        // Expect assetTokens to have transfered from alice hhNToken contract
        await expect(
            (await hhAssetToken.balanceOf(alice.address)))
            .to.equal((hhAssetTokenInitialBalance - tokenAmount));
        await expect(
            (await hhAssetToken.balanceOf(hhNToken.address)))
            .to.equal(tokenAmount);

        // Expect nTokens to have been minted directly to alice 
        await expect(
            (await hhNToken.balanceOf(hhNToken.address)))
            .to.equal(0);
        await expect(
            (await hhNToken.balanceOf(alice.address)))
            .to.equal(tokenAmount);

        // Approve nToken burnFrom lendingPool 
        await hhNToken.connect(alice).approve(hhLendingPoolAddress, tokenAmount);

        // Withdraw assetTokens (by depositing / buring nTokens)
        await expect(
            hhLendingPool.connect(alice).withdraw(hhAssetToken.address, tokenAmount))
            .to.emit(hhLendingPool, 'Withdraw')
            .withArgs(
                hhAssetToken.address,
                tokenAmount,
                alice.address);

        // Expect assetTokens to have transfered from hhNToken contract to alice
        await expect(
            (await hhAssetToken.balanceOf(alice.address)))
            .to.equal(hhAssetTokenInitialBalance);
        await expect(
            (await hhAssetToken.balanceOf(hhNToken.address)))
            .to.equal(0);

        // Expect nTokens to have left alice and been burned
        await expect(
            (await hhNToken.balanceOf(hhNToken.address)))
            .to.equal(0);
        await expect(
            (await hhNToken.balanceOf(alice.address)))
            .to.equal(0);
    });
});

describe('LendingPool >> Borrow', function() {
    // TODO: 
    // - should create borrow by depositing NFT, generating (non-transferable) debtTokens
    // - ... 
    it('should init reserve', async function () {

        // Initialize reserve
        await expect(
            hhLendingPool.initReserve(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address))
            .to.emit(hhLendingPool, 'InitReserve')
            .withArgs(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address);
    });
    
    it('should check NFT balances', async function () {
        await expect(
            (await hhNFT.balanceOf(alice.address)))
            .to.equal(1);
        await expect(
            (await hhNFT.balanceOf(bob.address)))
            .to.equal(1);
    });

    it('should check NFT tokenId ownership', async function () {
        await expect(
            (await hhNFT.ownerOf(alice_tokenId)))
            .to.equal(alice.address);
        await expect(
            (await hhNFT.ownerOf(bob_tokenId)))
            .to.equal(bob.address);    
    });

    it('should create borrow by depositing an NFT and generating debtTokens', async function() {
        const tokenAmount = 1*10**numDecimals;
        const tokenId = bob_tokenId; // tokenId of NFT owned by bob
        const interestRate = 20;
        const numWeeks = 1;
        
        //derived variables to check
        const repaymentAmount = Math.round(tokenAmount*(1 + 1*interestRate/100*numWeeks/52));

        // Initialize reserve
        hhLendingPool.initReserve(
            hhAssetToken.address, 
            hhNToken.address,
            hhDebtToken.address)

        // Alice: Approve assetToken transferFrom lendingPool 
        await hhAssetToken.connect(alice).approve(hhLendingPoolAddress, tokenAmount);

        // Alice: Deposit tokenAmount of assetTokens in hhNToken contract
        await expect(
            hhLendingPool.connect(alice).deposit(hhAssetToken.address, tokenAmount))
            .to.emit(hhLendingPool, 'Deposit')
            .withArgs(
                hhAssetToken.address,
                tokenAmount,
                alice.address);

        // Bob: Approve NFT transfer
        await hhNFT.connect(bob).approve(hhCollateralManagerAddress, bob_tokenId);

        // Bob: Borrow nTokens using NFT as collateral
        await expect(
            hhLendingPool.connect(bob).borrow(
                hhAssetToken.address,
                tokenAmount,
                hhNFT.address,
                bob_tokenId, 
                interestRate,
                numWeeks))
            .to.emit(hhLendingPool, 'Borrow')
            .withArgs(
                hhAssetToken.address,
                tokenAmount,
                repaymentAmount,
                hhNFT.address,
                tokenId,
                bob.address);

        await expect(
            (await hhNFT.ownerOf(bob_tokenId)))
            .to.equal(hhCollateralManagerAddress);
    });
});

describe('LendingPool >> Repay', function() {

    it('should create and repay a borrow (depositing and returning an NFT)', async function () {
        const tokenAmount = 1*10**numDecimals;
        const tokenId = bob_tokenId; // tokenId of NFT owned by bob
        const interestRate = 20;
        const numWeeks = 1;

        //derived variables to check
        const repaymentAmount = Math.round(tokenAmount*(1 + 1*interestRate/100*numWeeks/52));

        // BORROW -- START --------------------------------------------
        // Initialize reserve
        hhLendingPool.initReserve(
            hhAssetToken.address, 
            hhNToken.address,
            hhDebtToken.address)

        // Alice: Approve assetToken transferFrom lendingPool 
        await hhAssetToken.connect(alice).approve(hhLendingPoolAddress, tokenAmount);

        // Alice: Deposit tokenAmount of assetTokens in hhNToken contract
        await expect(
            hhLendingPool.connect(alice).deposit(hhAssetToken.address, tokenAmount))
            .to.emit(hhLendingPool, 'Deposit')
            .withArgs(
                hhAssetToken.address,
                tokenAmount,
                alice.address);

        // Bob: Approve NFT transfer
        await hhNFT.connect(bob).approve(hhCollateralManagerAddress, bob_tokenId);

        // Bob: Borrow nTokens using NFT as collateral
        await expect(
            hhLendingPool.connect(bob).borrow(
                hhAssetToken.address,
                tokenAmount,
                hhNFT.address,
                bob_tokenId, 
                interestRate,
                numWeeks))
            .to.emit(hhLendingPool, 'Borrow')
            .withArgs(
                hhAssetToken.address,
                tokenAmount,
                repaymentAmount,
                hhNFT.address,
                tokenId,
                bob.address);

        await expect(
            (await hhNFT.ownerOf(bob_tokenId)))
            .to.equal(hhCollateralManagerAddress);
        // BORROW -- END --------------------------------------------
        
        // Get bob's borrows
        borrowIds = await hhCollateralManager.getUserBorrows(bob.address);
        borrowId = borrowIds[0];

        // Bob: approve repaymentAmount of asset token to nToken reserve
        await hhAssetToken.connect(bob).approve(hhNToken.address, repaymentAmount);

        // Bob: Repay borrow to retreive NFT
        await expect(
            hhLendingPool.connect(bob).repay(
                hhAssetToken.address,
                repaymentAmount,
                borrowId))
            .to.emit(hhLendingPool, 'Repay')
            .withArgs(
                borrowId,
                hhAssetToken.address,
                repaymentAmount,
                bob.address);  

        // Bob: expect relating debtTokens to have been burned
        await expect(
            (await hhDebtToken.balanceOf(bob.address)))
            .to.equal(0);
    });

});