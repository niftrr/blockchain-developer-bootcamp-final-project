const { expect } = require('chai');
const { ethers } = require('hardhat');

let LendingPool;
let hhLendingPool;
let hhLendingPoolAddress;
let CollateralManager;
let hhCollateralManager;
let hhCollateralManagerAddress;
let TokenPriceOracle;
let hhTokenPriceOracle;
let hhTokenPriceOracleAddress;
let AssetToken;
let hhAssetToken;
let hhAssetTokenSupply;
let NToken;
let hhNToken;
let DebtToken;
let hhDebtToken;
let admin;
let emergencyAdmin;
let alice;
let bob;
let alice_tokenId;
let bob_tokenId;
let liquidationThreshold = 150;
let interestRate = 20;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

beforeEach(async function() {
    numDecimals = 10; // set lower than 18 due to ether.js issue
    hhAssetTokenSupply = ethers.utils.parseUnits('10000000', 18); //3*10**numDecimals;
    hhAssetTokenInitialBalance = ethers.utils.parseUnits('1000000', 18);
    alice_tokenId = 0;
    bob_tokenId = 1;

    // Get Signers
    [admin, emergencyAdmin, alice, bob, treasury] = await ethers.getSigners();

    // Get and deploy Configurator
    Configurator = await ethers.getContractFactory('Configurator');
    hhConfigurator = await Configurator.deploy(
        emergencyAdmin.address,
        admin.address 
    );
    await hhConfigurator.deployed();
    hhConfiguratorAddress = await hhConfigurator.resolvedAddress;

    // Get and deploy OraceTokenPrice
    TokenPriceOracle = await ethers.getContractFactory('TokenPriceOracle');
    hhTokenPriceOracle = await TokenPriceOracle.deploy();
    hhTokenPriceOracleAddress = await hhTokenPriceOracle.resolvedAddress;

    // Get and deploy LendingPool
    LendingPool = await ethers.getContractFactory('LendingPool');
    hhLendingPool = await LendingPool.deploy(
        hhConfiguratorAddress,
        treasury.address
    );
    await hhLendingPool.deployed();
    hhLendingPoolAddress = await hhLendingPool.resolvedAddress;

    // Connect Configurator to LendingPool by setting the address
    await hhConfigurator.connectLendingPool(hhLendingPoolAddress);

    // Get, deploy and connect LendingPoolBorrow ti LendingPool
    LendingPoolBorrow = await ethers.getContractFactory('LendingPoolBorrow');
    hhLendingPoolBorrow = await LendingPoolBorrow.deploy(
        hhConfiguratorAddress,
        hhLendingPoolAddress,
    );
    await hhLendingPoolBorrow.deployed();
    hhLendingPoolBorrowAddress = await hhLendingPoolBorrow.resolvedAddress;
    await hhConfigurator.connectLendingPoolBorrow(hhLendingPoolBorrowAddress);
    await hhConfigurator.connectLendingPoolLendingPoolBorrow();

    // Get, deploy and connect LendingPoolDeposit to LendingPool
    LendingPoolDeposit = await ethers.getContractFactory('LendingPoolDeposit');
    hhLendingPoolDeposit = await LendingPoolDeposit.deploy(
        hhConfiguratorAddress,
        hhLendingPoolAddress,
    );
    await hhLendingPoolDeposit.deployed();
    hhLendingPoolDepositAddress = await hhLendingPoolDeposit.resolvedAddress;
    await hhConfigurator.connectLendingPoolDeposit(hhLendingPoolDepositAddress);
    await hhConfigurator.connectLendingPoolLendingPoolDeposit();

    // Get, deploy and connect LendingPoolLiquidate to LendingPool
    LendingPoolLiquidate = await ethers.getContractFactory('LendingPoolLiquidate');
    hhLendingPoolLiquidate = await LendingPoolLiquidate.deploy(
        hhConfiguratorAddress,
        hhLendingPoolAddress,
    );
    await hhLendingPoolLiquidate.deployed();
    hhLendingPoolLiquidateAddress = await hhLendingPoolLiquidate.resolvedAddress;
    await hhConfigurator.connectLendingPoolLiquidate(hhLendingPoolLiquidateAddress);
    await hhConfigurator.connectLendingPoolLendingPoolLiquidate();

    // Get, deploy and connect LendingPoolRepay to LendingPool
    LendingPoolRepay = await ethers.getContractFactory('LendingPoolRepay');
    hhLendingPoolRepay = await LendingPoolRepay.deploy(
        hhConfiguratorAddress,
        hhLendingPoolAddress,
    );
    await hhLendingPoolRepay.deployed();
    hhLendingPoolRepayAddress = await hhLendingPoolRepay.resolvedAddress;
    await hhConfigurator.connectLendingPoolRepay(hhLendingPoolRepayAddress);
    await hhConfigurator.connectLendingPoolLendingPoolRepay();

    // Get, deploy and connect LendingPoolWithdraw to LendingPool
    LendingPoolWithdraw = await ethers.getContractFactory('LendingPoolWithdraw');
    hhLendingPoolWithdraw = await LendingPoolWithdraw.deploy(
        hhConfiguratorAddress,
        hhLendingPoolAddress,
    );
    await hhLendingPoolWithdraw.deployed();
    hhLendingPoolWithdrawAddress = await hhLendingPoolWithdraw.resolvedAddress;
    await hhConfigurator.connectLendingPoolWithdraw(hhLendingPoolWithdrawAddress);
    await hhConfigurator.connectLendingPoolLendingPoolWithdraw();


    // Get and deploy CollateralManager
    CollateralManager = await ethers.getContractFactory('CollateralManager');
    hhCollateralManager = await CollateralManager.deploy(
        hhConfiguratorAddress,
        hhLendingPoolAddress
        );
    await hhCollateralManager.deployed();
    hhCollateralManagerAddress = await hhCollateralManager.resolvedAddress;

    // Connect Configurator to CollateralManager
    await hhConfigurator
    .connect(admin)
    .connectCollateralManager(
        hhCollateralManagerAddress
    )

    // Link CollateralManager to LendingPool
    await hhConfigurator
    .connect(admin)
    .connectLendingPoolCollateralManager();

    // Get and deploy Asset Token
    AssetToken = await ethers.getContractFactory('AssetToken');
    hhAssetToken = await AssetToken.deploy('Dai Token', 'DAI', hhAssetTokenSupply.toString());
    await hhAssetToken.deployed();
    
    // Get and deploy nToken
    NToken = await ethers.getContractFactory('NToken');
    hhNToken = await NToken.deploy(
        hhConfiguratorAddress,
        hhLendingPoolAddress,
        'Dai nToken', 
        'nDAI');
    await hhNToken.deployed();

    // Get and deploy debtToken
    DebtToken = await ethers.getContractFactory('DebtToken');
    hhDebtToken = await DebtToken.deploy(
        hhConfiguratorAddress,
        hhLendingPoolAddress,
        'Dai debtToken', 
        'debtDAI'
    );
    await hhDebtToken.deployed();   

    // -- Assign minter role to LendingPool
    // await hhDebtToken.setMinter(hhLendingPoolAddress);

    // -- Assign burner role to LendingPool
    // await hhDebtToken.setBurner(hhLendingPoolAddress);

    // Get and deploy NFT
    NFT = await ethers.getContractFactory('NFT');
    hhNFT = await NFT.deploy('Punk NFT', 'PUNK');
    await hhNFT.deployed();

    // Whitelist NFT
    hhConfigurator
    .connect(admin)
    .updateCollateralManagerWhitelist(hhNFT.address, true);

    // Set NFT liquidation threshold
    hhConfigurator
    .connect(admin)
    .setCollateralManagerLiquidationThreshold(hhNFT.address, liquidationThreshold); // in percent

    // Set NFT interestRate threshold
    hhConfigurator
    .connect(admin)
    .setCollateralManagerInterestRate(hhNFT.address, interestRate); // in percent


    // Transfer funds to alice and bob
    await hhAssetToken.transfer(alice.address, hhAssetTokenInitialBalance.toString());
    await hhAssetToken.transfer(bob.address, hhAssetTokenInitialBalance.toString());

    // Mint NFTs to alice and bob
    await hhNFT.mint(alice.address, alice_tokenId);
    await hhNFT.mint(bob.address, bob_tokenId);

    // Set Mocked Oracle NFT price
    const mockFloorPrice = ethers.utils.parseUnits('100', 18);
    hhLendingPool.setMockFloorPrice(hhNFT.address, mockFloorPrice);

    // Set Mock Oracle Asset Token prices
    const mockETHDAI = ethers.utils.parseUnits('4325', 18);
    // const mockETHUSDC = ethers.utils.parseUnits('4332.14.', 18);
    // const mockETHWETH = ethers.utils.parseUnits('1', 18);
    hhLendingPool.setMockEthTokenPrice(hhAssetToken.address, mockETHDAI);    

    // Logging 
    // console.log('CollateralManager deployed:', hhCollateralManagerAddress);
    // console.log('LendingPoolAddress deployed:', hhLendingPoolAddress);
    // console.log('alice:', alice.address);
    // console.log('bob:', bob.address);
});

async function initReserve() {
    return hhConfigurator
    .connect(admin)
    .initLendingPoolReserve(
        hhAssetToken.address, 
        hhNToken.address,
        hhDebtToken.address
    )
}

async function deposit(signer, assetToken, tokenAmount) {
    // Approve transferFrom lendingPool 
    await assetToken.connect(signer).approve(hhLendingPoolAddress, tokenAmount);
    // Deposit in hhNToken contract reserve
    return hhLendingPool.connect(signer).deposit(assetToken.address, tokenAmount)
}

async function withdraw(signer, assetToken, nToken, _tokenAmount) {
    // Approve nToken burnFrom lendingPool 
    await nToken.connect(signer).approve(hhLendingPoolAddress, _tokenAmount);
    // Withdraw assetTokens by depositing/buring nTokens
    return hhLendingPool.connect(signer).withdraw(assetToken.address, _tokenAmount);
}

async function borrow(signer, nftToken, tokenId, assetToken, tokenAmount, numWeeks) {
    // Approve NFT transfer
    await nftToken.connect(signer).approve(hhCollateralManagerAddress, tokenId);
    return hhLendingPool.connect(signer).borrow(
        assetToken.address,
        tokenAmount,
        nftToken.address,
        tokenId, 
        numWeeks);
}

async function repay(signer, assetToken, nToken, repaymentAmount, borrowId) {
    // Approve transfer of repaymentAmount asset tokens to nToken address (asset reserve)
    await assetToken.connect(signer).approve(nToken.address, repaymentAmount);
    return hhLendingPool.connect(signer).repay(
        assetToken.address,
        repaymentAmount,
        borrowId);
}

async function liquidate(signer, assetToken, liquidationAmount, borrowId) {
    // Approve transfer of liquidationAmount asset tokens to lendingPool address)
    await assetToken.connect(signer).approve(hhLendingPoolAddress, liquidationAmount);
    return hhLendingPool.connect(signer).liquidate(
        assetToken.address,
        liquidationAmount,
        borrowId);
}

describe('TokenPriceOracle', function() {

    it('ETH/USD', async function () {
        let latestPrice = (await hhTokenPriceOracle.getLatestPriceMock("ETHUSD")).toString();
        expect(latestPrice).to.equal('true,400000000000,8');
    })
})

describe('AssetToken', function() {

    // it('balance should be 1*10*numDecimals for owner', async function () {
    //     let balance = (await hhAssetToken.balanceOf(await admin.address)).toString();
    //     expect(balance).to.equal((hhAssetTokenSupply - 2 * hhAssetTokenInitialBalance).toString());
    // })

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
            .to.equal((hhAssetTokenInitialBalance.sub(tokenAmount)));
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

    it('should update liquidity index', async function () {
        const tokenAmount = ethers.utils.parseUnits('1', 18);//1*10**numDecimals;
        
        const liquidityRate = 0;
        const timeDelta = 2;
        const borrowRate = 0;
        const utilizationRate = 0;
        const previousLiquidityIndex = ethers.utils.parseUnits('1',27);
        const updatedLiquidityIndex = previousLiquidityIndex.mul((liquidityRate * timeDelta)/(365 * 24 * 60 * 60) + 1);

        // Initialize reserve
        await initReserve();

        // Deposit >> Expect previousLiquidityIndex
        await expect(
            deposit(alice, hhAssetToken, tokenAmount))
            .to.emit(hhLendingPool, 'UpdateReserve')
            .withArgs(
                hhAssetToken.address,
                borrowRate,
                utilizationRate,
                previousLiquidityIndex);

        // Deposit (w/ system timeDelta == 2) >> Expect updatedLiquidityIndex
        await expect(
            deposit(alice, hhAssetToken, tokenAmount))
            .to.emit(hhLendingPool, 'UpdateReserve')
            .withArgs(
                hhAssetToken.address,
                borrowRate,
                utilizationRate,
                updatedLiquidityIndex);
    });
});

describe('LendingPool >> Withdraw', function() {

    it('should withdraw tokens from NToken reserve', async function () {
        const tokenAmount = ethers.utils.parseUnits('3', 18); //1*10**numDecimals;
        const withdrawAmount = ethers.utils.parseUnits('1', 18);

        // Initialize reserve
        await initReserve();

        // Deposit Asset tokens
        await deposit(alice, hhAssetToken, tokenAmount);

        // Withdraw Asset tokens
        async function _withdraw(signer, assetToken, nToken, _tokenAmount) {
            return withdraw(signer, assetToken, nToken, _tokenAmount);
        }

        // Expect: Withdraw Emit response
        await expect(
            _withdraw(alice, hhAssetToken, hhNToken, withdrawAmount))
            .to.emit(hhLendingPool, 'Withdraw')
            .withArgs(
                hhAssetToken.address,
                withdrawAmount,
                alice.address);

        // Expect: assetTokens transfered from hhNToken contract to alice
        await expect(
            (await hhAssetToken.balanceOf(alice.address)))
            .to.equal(hhAssetTokenInitialBalance.sub(tokenAmount.sub(withdrawAmount)));

        await expect(
            (await hhAssetToken.balanceOf(hhNToken.address)))
            .to.equal(tokenAmount.sub(withdrawAmount));

        // Expect: nTokens burnedFrom alice
        await expect(
            (await hhNToken.balanceOf(alice.address)))
            .to.equal(tokenAmount.sub(withdrawAmount));
    });

    it('should update liquidity index', async function () {
        const tokenAmount = ethers.utils.parseUnits('2', 18);//1*10**numDecimals;
        const withdrawAmount = ethers.utils.parseUnits('1', 18);

        
        const timeDelta = 2;
        const previousLiquidityIndex = ethers.utils.parseUnits('1',27);
        const borrowRate = ethers.utils.parseUnits('0', 18);
        const utilizationRate = withdrawAmount.div(tokenAmount)
        const liquidityRate = borrowRate.mul(utilizationRate);
        const updatedLiquidityIndex = previousLiquidityIndex.mul((liquidityRate * timeDelta)/(365 * 24 * 60 * 60) + 1);

        // Initialize reserve
        await initReserve();

        // Deposit >> Expect previousLiquidityIndex
        await expect(
            deposit(alice, hhAssetToken, tokenAmount))
            .to.emit(hhLendingPool, 'UpdateReserve')
            .withArgs(
                hhAssetToken.address,
                borrowRate,
                utilizationRate,
                previousLiquidityIndex);

        // Withdraw (w/ system timeDelta == 2) >> Expect updatedLiquidityIndex
        await expect(
            withdraw(alice, hhAssetToken, hhNToken, withdrawAmount))
            .to.emit(hhLendingPool, 'UpdateReserve')
            .withArgs(
                hhAssetToken.address,
                borrowRate,
                utilizationRate,
                updatedLiquidityIndex);
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
        const numWeeks = 1;
        const repaymentAmount = tokenAmount.add(tokenAmount.mul(interestRate).div(100).mul(numWeeks).div(52));
        // Initialize reserve
        await initReserve();

        // Deposit Asset tokens [required for liquidity]
        await deposit(alice, hhAssetToken, tokenAmount);

        // Borrow Asset tokens
        async function _borrow(signer, nftToken, bob_tokenId, assetToken, tokenAmount, numWeeks) {
            return borrow(signer, nftToken, bob_tokenId, assetToken, tokenAmount, numWeeks);
        }
        
        // Expect: Borrow Emit response
        await expect(
            _borrow(bob, hhNFT, bob_tokenId, hhAssetToken, tokenAmount, numWeeks))
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

    it('should retrieve an NFT by repaying a borrow', async function () {
        const tokenAmount = ethers.utils.parseUnits('1', 18); //1*10**numDecimals;
        const interestRate = 20;
        const numWeeks = 1;
        const repaymentAmount = tokenAmount.add(tokenAmount.mul(interestRate).div(100).mul(numWeeks).div(52));

        // Initialize reserve
        await initReserve();

        // Deposit Asset tokens [required for liquidity]
        await deposit(admin, hhAssetToken, tokenAmount);

        // Borrow Asset tokens
        await borrow(bob, hhNFT, bob_tokenId, hhAssetToken, tokenAmount, numWeeks);
        
        // Retrieve borrowId 
        borrowIds = await hhCollateralManager.getUserBorrowIds(bob.address);
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

describe('LendingPool >> Liquidate', function() {

    it('should retrieve an NFT by liquidating a borrow', async function() {
        const tokenAmount = ethers.utils.parseUnits('100000', 18); //1*10**numDecimals;
        const numWeeks = 0;
        const repaymentAmount = tokenAmount.add(tokenAmount.mul(interestRate).div(100).mul(numWeeks).div(52));
        // Initialize reserve
        await initReserve();

        // Admin: Deposits Asset tokens [required for liquidity]
        await deposit(admin, hhAssetToken, tokenAmount);

        // Borrow Asset tokens
        async function _borrow(signer, nftToken, bob_tokenId, assetToken, tokenAmount, numWeeks) {
            return borrow(signer, nftToken, bob_tokenId, assetToken, tokenAmount, numWeeks);
        }
        
        // Bob: Creates a Borrow
        await _borrow(bob, hhNFT, bob_tokenId, hhAssetToken, tokenAmount, numWeeks);
            
        // Retrieve borrowId 
        borrowIds = await hhCollateralManager.getUserBorrowIds(bob.address);
        borrowId = borrowIds[0];
        
        // Retrieve borrowItem
        const borrowItem = await hhCollateralManager.getBorrow(borrowId);

        // Calc liquidation amount
        let mockFloorPrice = await hhLendingPool.getMockFloorPrice(hhNFT.address, hhAssetToken.address);
        let liquidationAmount = mockFloorPrice.mul(80).div(100);

        // CHECK BALANCE and liquidationAmount
        expect (await hhAssetToken.balanceOf(await alice.address)).to.equal(ethers.utils.parseUnits('1000000', 18));
        expect (await liquidationAmount).to.equal(ethers.utils.parseUnits('346000', 18));

        // Alice: Liquidates borrow (in default as numWeeks=0)
        expect(
            await liquidate(alice, hhAssetToken, liquidationAmount, borrowId)
        )
        .to.emit(hhLendingPool, 'Liquidate')
        .withArgs(
            borrowId,
            hhAssetToken.address,
            liquidationAmount,
            alice.address);

        // Expect: liquidator (alice) to have paid liquidationAmount
        await expect(
            (await hhAssetToken.balanceOf(alice.address)))
            .to.equal(hhAssetTokenInitialBalance.sub(liquidationAmount));

        // Expect: borrow.repaymentAmount assetTokens transferred from liquidator (alice) to nToken reserve
        await expect(
            (await hhAssetToken.balanceOf(hhNToken.address)))
            .to.equal(borrowItem.repaymentAmount); 

        // Expect: 5% of the remaining to be paid to LP as a liquidation fee
        await expect(
            (await hhAssetToken.balanceOf(treasury.address)))
            .to.equal(((liquidationAmount).sub(borrowItem.repaymentAmount)).mul(5).div(100)); 

        // Expect: 95% of the remaining be reimbursed to the borrower
        await expect(
            (await hhAssetToken.balanceOf(bob.address)))
            .to.equal(liquidationAmount.sub(borrowItem.repaymentAmount).sub(((liquidationAmount).sub(borrowItem.repaymentAmount)).mul(5).div(100)).add(hhAssetTokenInitialBalance).add(tokenAmount)); 

        // Expect: corresponding debtTokens to have been burned
        await expect(
            (await hhDebtToken.balanceOf(bob.address)))
            .to.equal(0);

        // Expect: NFT transferred from Escrow to the liquidator (alice)
        await expect(
            (await hhNFT.ownerOf(bob_tokenId)))
            .to.equal(alice.address);   
    });

    it('should revert if called with incorrect asset', async function () {
        const tokenAmount = ethers.utils.parseUnits('2', 18); //1*10**numDecimals;
        const interestRate = 20;
        const numWeeks = 1;
        // const repaymentAmount = tokenAmount.add(tokenAmount.mul(interestRate).div(100).mul(numWeeks).div(52));
        const liquidationAmount = tokenAmount.mul(160).div(100);

        // Get and deploy incorrect Asset Token
        IncorrectAssetToken = await ethers.getContractFactory('AssetToken');
        hhIncorrectAssetToken = await AssetToken.deploy('Dai Token', 'DAI', hhAssetTokenSupply.toString());
        await hhIncorrectAssetToken.deployed();

        // Initialize reserve
        await initReserve();

        // Deposit Asset tokens [required for liquidity]
        await deposit(admin, hhAssetToken, tokenAmount);

        // Borrow Asset tokens
        await borrow(bob, hhNFT, bob_tokenId, hhAssetToken, tokenAmount, numWeeks);
        
        // Retrieve borrowId 
        borrowIds = await hhCollateralManager.getUserBorrowIds(bob.address);
        borrowId = borrowIds[0];


        // Liquidate Borrow
        async function _liquidate(signer, assetToken, liquidationAmount, borrowId) {
            return liquidate(signer, assetToken, liquidationAmount, borrowId);
        }

        // Expect: Repay Emit response
        await expect(
            _liquidate(alice, hhIncorrectAssetToken, liquidationAmount, borrowId))
            .to.be.revertedWith("INCORRECT_ASSET");
       
    });

    it('should revert if floor price is above liquidiation threshold', async function () {
        const tokenAmount = ethers.utils.parseUnits('2', 18); //1*10**numDecimals;
        const numWeeks = 1;

        // Initialize reserve
        await initReserve();

        // Deposit Asset tokens [required for liquidity]
        await deposit(admin, hhAssetToken, tokenAmount);

        // Borrow Asset tokens
        await borrow(bob, hhNFT, bob_tokenId, hhAssetToken, tokenAmount, numWeeks);
        
        // Retrieve borrowId 
        borrowIds = await hhCollateralManager.getUserBorrowIds(bob.address);
        borrowId = borrowIds[0];

        // Calc liquidation amount
        let mockFloorPrice = await hhLendingPool.getMockFloorPrice(hhNFT.address, hhAssetToken.address);
        let liquidationAmount = mockFloorPrice.mul(80).div(100);

        // Liquidate Borrow
        async function _liquidate(signer, assetToken, liquidationAmount, borrowId) {
            return liquidate(signer, assetToken, liquidationAmount, borrowId);
        }

        // Expect: Repay Emit response
        await expect(
            _liquidate(alice, hhAssetToken, liquidationAmount, borrowId))
            .to.be.revertedWith("BORROW_NOT_IN_DEFAULT");
       
    });
});
