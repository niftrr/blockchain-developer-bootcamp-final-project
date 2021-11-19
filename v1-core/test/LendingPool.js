const { expect } = require('chai');
const { ethers } = require('hardhat');

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
    hhAssetTokenSupply = ethers.utils.parseUnits('3', 18); //3*10**numDecimals;
    hhAssetTokenInitialBalance = ethers.utils.parseUnits('1', 18);
    alice_tokenId = 0;
    bob_tokenId = 1;

    // Get Signers
    [owner, alice, bob] = await ethers.getSigners();

    // Get and deploy LendingPool
    OracleTokenPrice = await ethers.getContractFactory('OracleTokenPrice');
    hhOracleTokenPrice = await OracleTokenPrice.deploy();
    hhOracleTokenPriceAddress = await hhOracleTokenPrice.resolvedAddress;

    // Get and deploy LendingPool
    LendingPool = await ethers.getContractFactory('LendingPool');
    hhLendingPool = await LendingPool.deploy();
    await hhLendingPool.deployed();
    hhLendingPoolAddress = await hhLendingPool.resolvedAddress;

    // Get and deploy CollateralManager
    CollateralManager = await ethers.getContractFactory('CollateralManager');
    hhCollateralManager = await CollateralManager.deploy(
        owner.address,
        hhLendingPoolAddress
        );
    await hhCollateralManager.deployed();
    hhCollateralManagerAddress = await hhCollateralManager.resolvedAddress;

    // Link CollateralManager to LendingPool
    await hhLendingPool.setCollateralManagerAddress(hhCollateralManagerAddress);

    // Get and deploy Asset Token
    AssetToken = await ethers.getContractFactory('AssetToken');
    hhAssetToken = await AssetToken.deploy('Dai Token', 'DAI', hhAssetTokenSupply.toString());
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

    // Whitelist NFT
    hhCollateralManager.updateWhitelist(hhNFT.address, true);

    // Set NFT liquidation threshold
    hhCollateralManager.setLiquidationThreshold(hhNFT.address, 150); // in percent

    // Transfer funds to alice and bob
    await hhAssetToken.transfer(alice.address, hhAssetTokenInitialBalance.toString());
    await hhAssetToken.transfer(bob.address, hhAssetTokenInitialBalance.toString());

    // Mint NFTs to alice and bob
    await hhNFT.mint(alice.address, alice_tokenId);
    await hhNFT.mint(bob.address, bob_tokenId);

    // Logging 
    // console.log('CollateralManager deployed:', hhCollateralManagerAddress);
    // console.log('LendingPoolAddress deployed:', hhLendingPoolAddress);
    // console.log('alice:', alice.address);
    // console.log('bob:', bob.address);
});

async function initReserve() {
    return hhLendingPool.initReserve(
        hhAssetToken.address, 
        hhNToken.address,
        hhDebtToken.address)
}

async function deposit(signer, assetToken, tokenAmount) {
    // Approve transferFrom lendingPool 
    await assetToken.connect(alice).approve(hhLendingPoolAddress, tokenAmount);
    // Deposit in hhNToken contract reserve
    return hhLendingPool.connect(signer).deposit(assetToken.address, tokenAmount)
}

async function withdraw(signer, assetToken, nToken, tokenAmount) {
    // Approve nToken burnFrom lendingPool 
    await nToken.connect(signer).approve(hhLendingPoolAddress, tokenAmount);
    // Withdraw assetTokens by depositing/buring nTokens
    return hhLendingPool.connect(signer).withdraw(assetToken.address, tokenAmount);
}

async function borrow(signer, nftToken, tokenId, assetToken, tokenAmount, interestRate, numWeeks) {
    // Approve NFT transfer
    await nftToken.connect(signer).approve(hhCollateralManagerAddress, tokenId);
    return hhLendingPool.connect(signer).borrow(
        assetToken.address,
        tokenAmount,
        nftToken.address,
        tokenId, 
        interestRate,
        numWeeks);
}

async function repay(signer, assetToken, nToken, repaymentAmount, borrowId) {
    // Approve nToken reserve to transfer repaymentAmount of asset token
    await assetToken.connect(signer).approve(nToken.address, repaymentAmount);
    return hhLendingPool.connect(signer).repay(
        assetToken.address,
        repaymentAmount,
        borrowId);
}

describe('OracleTokenPrice', function() {

    it('ETH/USD', async function () {
        let latestPrice = (await hhOracleTokenPrice.getLatestPriceMock("ETHUSD")).toString();
        expect(latestPrice).to.equal('400000000000,8');
    })
})

describe('AssetToken', function() {

    it('balance should be 1*10*numDecimals for owner', async function () {
        let balance = (await hhAssetToken.balanceOf(await owner.address)).toString();
        expect(balance).to.equal((hhAssetTokenSupply - 2 * hhAssetTokenInitialBalance).toString());
    })

    it('balance should be 1*10*numDecimals for alice & bob', async function () {
        let balanceAlice = (await hhAssetToken.balanceOf(await alice.address)).toString();
        expect(balanceAlice).to.equal(hhAssetTokenInitialBalance.toString());
        let balanceBob = (await hhAssetToken.balanceOf(await bob.address)).toString();
        expect(balanceBob).to.equal(hhAssetTokenInitialBalance.toString());
    })
})

describe('LendingPool >> Init', function() {

    it('should init reserve', async function () {

        // Initialize reserve
        async function _initReserve() {
            return initReserve();
        }

        // Expect: InitReserve Emit response
        await expect(
            _initReserve())
            .to.emit(hhLendingPool, 'InitReserve')
            .withArgs(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address);
    });
});
    
describe('LendingPool >> Deposit', function() {

    it('should deposit tokens to NToken reserve', async function () {
        const tokenAmount = ethers.utils.parseUnits('1', 18);//1*10**numDecimals;

        // Initialize reserve
        await initReserve();

        // Deposit Asset tokens
        async function _deposit(signer, assetToken, tokenAmount) {
            return deposit(signer, assetToken, tokenAmount);
        }

        // Expect: Deposit Emit response
        await expect(
            _deposit(alice, hhAssetToken, tokenAmount))
            .to.emit(hhLendingPool, 'Deposit')
            .withArgs(
                hhAssetToken.address,
                tokenAmount,
                alice.address);

        // Expect: assetTokens transferred from alice to hhNToken contract
        await expect(
            (await hhAssetToken.balanceOf(alice.address)))
            .to.equal((hhAssetTokenInitialBalance - tokenAmount));
        await expect(
            (await hhAssetToken.balanceOf(hhNToken.address)))
            .to.equal(tokenAmount);

        // Expect: nTokens minted to alice 
        await expect(
            (await hhNToken.balanceOf(hhNToken.address)))
            .to.equal(0);
        await expect(
            (await hhNToken.balanceOf(alice.address)))
            .to.equal(tokenAmount);
    });
});

describe('LendingPool >> Withdraw', function() {

    it('should withdraw tokens from NToken reserve', async function () {
        const tokenAmount = ethers.utils.parseUnits('1', 18); //1*10**numDecimals;

        // Initialize reserve
        await initReserve();

        // Deposit Asset tokens
        await deposit(alice, hhAssetToken, tokenAmount);

        // Withdraw Asset tokens
        async function _withdraw(signer, assetToken, nToken, tokenAmount) {
            return withdraw(signer, assetToken, nToken, tokenAmount);
        }

        // Expect: Withdraw Emit response
        await expect(
            _withdraw(alice, hhAssetToken, hhNToken, tokenAmount))
            .to.emit(hhLendingPool, 'Withdraw')
            .withArgs(
                hhAssetToken.address,
                tokenAmount,
                alice.address);

        // Expect: assetTokens transfered from hhNToken contract to alice
        await expect(
            (await hhAssetToken.balanceOf(alice.address)))
            .to.equal(hhAssetTokenInitialBalance);
        await expect(
            (await hhAssetToken.balanceOf(hhNToken.address)))
            .to.equal(0);

        // Expect: nTokens burnedFrom alice
        await expect(
            (await hhNToken.balanceOf(alice.address)))
            .to.equal(0);
    });
});

describe('LendingPool >> Borrow', function() {
    
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

    it('should create borrow with an NFT as collateral', async function() {
        const tokenAmount = ethers.utils.parseUnits('1', 18); //1*10**numDecimals;
        const interestRate = 20;
        const numWeeks = 1;
        const repaymentAmount = tokenAmount.add(tokenAmount.mul(interestRate).div(100).mul(numWeeks).div(52));
        // Initialize reserve
        await initReserve();

        // Deposit Asset tokens [required for liquidity]
        await deposit(alice, hhAssetToken, tokenAmount);

        // Borrow Asset tokens
        async function _borrow(signer, nftToken, tokenId, assetToken, tokenAmount, interestRate, numWeeks) {
            return borrow(signer, nftToken, tokenId, assetToken, tokenAmount, interestRate, numWeeks);
        }
        
        // Expect: Borrow Emit response
        await expect(
            _borrow(bob, hhNFT, bob_tokenId, hhAssetToken, tokenAmount, interestRate, numWeeks))
            .to.emit(hhLendingPool, 'Borrow')
            .withArgs(
                hhAssetToken.address,
                tokenAmount,
                repaymentAmount,
                hhNFT.address,
                bob_tokenId,
                bob.address);

        // Expect: NFT to be held in Escrow
        await expect(
            (await hhNFT.ownerOf(bob_tokenId)))
            .to.equal(hhCollateralManagerAddress);

        // Expect: assetTokens transferred to bob
        await expect(
            (await hhAssetToken.balanceOf(bob.address)))
            .to.equal(hhAssetTokenInitialBalance.add(tokenAmount));
    });
});

describe('LendingPool >> Repay', function() {

    it('should retreive an NFT by repaying a borrow', async function () {
        const tokenAmount = ethers.utils.parseUnits('1', 18); //1*10**numDecimals;
        const interestRate = 20;
        const numWeeks = 1;
        const repaymentAmount = tokenAmount.add(tokenAmount.mul(interestRate).div(100).mul(numWeeks).div(52));

        // Initialize reserve
        await initReserve();

        // Deposit Asset tokens [required for liquidity]
        await deposit(alice, hhAssetToken, tokenAmount);

        // Borrow Asset tokens
        await borrow(bob, hhNFT, bob_tokenId, hhAssetToken, tokenAmount, interestRate, numWeeks);
        
        // Retrieve borrowId 
        borrowIds = await hhCollateralManager.getUserBorrows(bob.address);
        borrowId = borrowIds[0];

        // Repay Asset tokens
        async function _repay(signer, assetToken, nToken, repaymentAmount, borrowId) {
            return repay(signer, assetToken, nToken, repaymentAmount, borrowId);
        }

        // Expect: Repay Emit response
        await expect(
            _repay(bob, hhAssetToken, hhNToken, repaymentAmount, borrowId))
            .to.emit(hhLendingPool, 'Repay')
            .withArgs(
                borrowId,
                hhAssetToken.address,
                repaymentAmount,
                bob.address);  

        // Expect: assetTokens transferred from user to nToken reserve
        await expect(
            (await hhAssetToken.balanceOf(bob.address)))
            .to.equal(hhAssetTokenInitialBalance.add(tokenAmount).sub(repaymentAmount));
        await expect(
            (await hhAssetToken.balanceOf(hhNToken.address)))
            .to.equal(repaymentAmount); // Alice's deposit - Bob's borrow + Bob's repayment  

        // Expect: corresponding debtTokens to have been burned
        await expect(
            (await hhDebtToken.balanceOf(bob.address)))
            .to.equal(0);

        // Expect: NFT transferred from Escrow back to user
        await expect(
            (await hhNFT.ownerOf(bob_tokenId)))
            .to.equal(bob.address);           
    });
});
