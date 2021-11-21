const { expect } = require('chai');
const { ethers } = require('hardhat');

let Configurator;
let hhConfigurator;
let hhConfiguratorAddress;
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

beforeEach(async function() {
    numDecimals = 10; // set lower than 18 due to ether.js issue
    hhAssetTokenSupply = ethers.utils.parseUnits('3', 18); //3*10**numDecimals;
    hhAssetTokenInitialBalance = ethers.utils.parseUnits('1', 18);

    // Get Signers
    [admin, emergencyAdmin, alice, bob] = await ethers.getSigners();

    // Get and deploy Configurator
    Configurator = await ethers.getContractFactory('Configurator');
    hhConfigurator = await Configurator.deploy(
        emergencyAdmin.address,
        admin.address 
    );
    await hhConfigurator.deployed();
    hhConfiguratorAddress = await hhConfigurator.resolvedAddress;

    // Get and deploy LendingPool
    LendingPool = await ethers.getContractFactory('LendingPool');
    hhLendingPool = await LendingPool.deploy(
        hhConfiguratorAddress
    );
    await hhLendingPool.deployed();
    hhLendingPoolAddress = await hhLendingPool.resolvedAddress;

    // Connect Configurator to LendingPool by setting the address
    await hhConfigurator.connectLendingPool(hhLendingPoolAddress);

    // Get and deploy CollateralManager
    CollateralManager = await ethers.getContractFactory('CollateralManager');
    hhCollateralManager = await CollateralManager.deploy(
        hhConfiguratorAddress,
        hhLendingPoolAddress
        );
    await hhCollateralManager.deployed();
    hhCollateralManagerAddress = await hhCollateralManager.resolvedAddress;

    // Get and deploy OraceTokenPrice
    TokenPriceOracle = await ethers.getContractFactory('TokenPriceOracle');
    hhTokenPriceOracle = await TokenPriceOracle.deploy();
    hhTokenPriceOracleAddress = await hhTokenPriceOracle.resolvedAddress;

    // Get and deploy Asset Token
    AssetToken = await ethers.getContractFactory('AssetToken');
    hhAssetToken = await AssetToken.deploy('Dai Token', 'DAI', hhAssetTokenSupply.toString());
    await hhAssetToken.deployed();

    // Get and deploy nToken
    NToken = await ethers.getContractFactory('NToken');
    hhNToken = await NToken.deploy(
        admin.address, // NOTE: Using the owner as standin for the Configurator
        hhLendingPoolAddress,
        'Dai nToken', 
        'nDAI');
    await hhNToken.deployed();

    // Get and deploy debtToken
    DebtToken = await ethers.getContractFactory('DebtToken');
    hhDebtToken = await DebtToken.deploy(
        admin.address, // NOTE: Using the owner as standin for the Configurator
        hhLendingPoolAddress,
        'Dai debtToken', 
        'debtDAI'
    );
    await hhDebtToken.deployed();  
});

async function initReserve() {
    return hhLendingPool.initReserve(
        hhAssetToken.address, 
        hhNToken.address,
        hhDebtToken.address)
}

// async function deposit(signer, assetToken, tokenAmount) {
//     // Approve transferFrom lendingPool 
//     await assetToken.connect(signer).approve(hhLendingPoolAddress, tokenAmount);
//     // Deposit in hhNToken contract reserve
//     return hhLendingPool.connect(signer).deposit(assetToken.address, tokenAmount)
// }

describe('Configurator >> LendingPool >> pause()', function() {

    it('should pause when caller is emergency admin', async function () {
        await expect(
            hhConfigurator.connect(emergencyAdmin).pauseLendingPool()
        ).to.emit(hhLendingPool, "Paused")
    });

    it('should revert when caller is not emergency admin', async function () {
        await expect(
            hhConfigurator.connect(admin).pauseLendingPool()
        ).to.be.revertedWith("Caller is not emergency admin.");
    });
})

describe('Configurator >> LendingPool >> unpause()', function() {

    it('should unpause when caller is emergency admin', async function () {
        hhConfigurator.connect(emergencyAdmin).pauseLendingPool()
        await expect(
            hhConfigurator.connect(emergencyAdmin).unpauseLendingPool()
        ).to.emit(hhLendingPool, "Unpaused")
    });

    it('should revert when caller is not emergency admin', async function () {
        await expect(
            hhConfigurator.connect(admin).unpauseLendingPool()
        ).to.be.revertedWith("Caller is not emergency admin.");
    });
})

describe('Configurator >> LendingPool >> initReserve()', function() {
    

    it('should initialize the reserve when caller is admin', async function () {
        
        await expect(
            hhConfigurator
            .connect(admin)
            .initLendingPoolReserve(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address))
            .to.emit(hhLendingPool, "InitReserve")
            .withArgs(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address
            )
    });

    it('should revert when caller is not admin', async function () {
        await expect(
            hhConfigurator
            .connect(alice)
            .initLendingPoolReserve(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address))
            .to.be.revertedWith("Caller is not admin.");
    });
})

describe('Configurator >> LendingPool >> freezeReserve()', function() {

    it('should freeze reserve when caller is emergency admin', async function () {
        // Init Reserve
        await hhConfigurator
            .connect(admin)
            .initLendingPoolReserve(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address
            )
        
        await expect(
            hhConfigurator
            .connect(emergencyAdmin)
            .freezeLendingPoolReserve(hhAssetToken.address))
            .to.emit(hhLendingPool, "ReserveFrozen")
    });

    it('should revert when caller is not emergency admin', async function () {
        // Init Reserve
        await hhConfigurator
            .connect(admin)
            .initLendingPoolReserve(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address
            )
        await expect(
            hhConfigurator.connect(admin).freezeLendingPoolReserve(
                hhAssetToken.address
            ))
            .to.be.revertedWith("Caller is not emergency admin.");
    });
})

describe('Configurator >> LendingPool >> pauseReserve()', function() {

    it('should pause reserve when caller is emergency admin', async function () {
        // Init Reserve
        await hhConfigurator
            .connect(admin)
            .initLendingPoolReserve(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address
            )
        
        await expect(
            hhConfigurator
            .connect(emergencyAdmin)
            .pauseLendingPoolReserve(hhAssetToken.address))
            .to.emit(hhLendingPool, "ReservePaused")
    });

    it('should revert when caller is not emergency admin', async function () {
        // Init Reserve
        await hhConfigurator
            .connect(admin)
            .initLendingPoolReserve(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address
            )
        await expect(
            hhConfigurator.connect(admin).pauseLendingPoolReserve(
                hhAssetToken.address
            ))
            .to.be.revertedWith("Caller is not emergency admin.");
    });
})

describe('Configurator >> LendingPool >> protectReserve()', function() {

    it('should protect reserve when caller is emergency admin', async function () {
        // Init Reserve
        await hhConfigurator
            .connect(admin)
            .initLendingPoolReserve(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address
            )
        
        await expect(
            hhConfigurator
            .connect(emergencyAdmin)
            .protectLendingPoolReserve(hhAssetToken.address))
            .to.emit(hhLendingPool, "ReserveProtected")
    });

    it('should revert when caller is not emergency admin', async function () {
        // Init Reserve
        await hhConfigurator
            .connect(admin)
            .initLendingPoolReserve(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address
            )
        await expect(
            hhConfigurator.connect(admin).protectLendingPoolReserve(
                hhAssetToken.address
            ))
            .to.be.revertedWith("Caller is not emergency admin.");
    });
})

describe('Configurator >> LendingPool >> activateReserve()', function() {

    it('should activate reserve when caller is emergency admin', async function () {
        // Init Reserve
        await hhConfigurator
            .connect(admin)
            .initLendingPoolReserve(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address
            )
        
        await expect(
            hhConfigurator
            .connect(emergencyAdmin)
            .activateLendingPoolReserve(hhAssetToken.address))
            .to.emit(hhLendingPool, "ReserveActivated")
    });

    it('should revert when caller is not emergency admin', async function () {
        // Init Reserve
        await hhConfigurator
            .connect(admin)
            .initLendingPoolReserve(
                hhAssetToken.address, 
                hhNToken.address,
                hhDebtToken.address
            )
        await expect(
            hhConfigurator.connect(admin).activateLendingPoolReserve(
                hhAssetToken.address
            ))
            .to.be.revertedWith("Caller is not emergency admin.");
    });
})

describe('Configurator >> LendingPool >> connectCollateralManager()', function() {

    it('should set the Collateral Manager address when caller is emergency admin', async function () {
        await expect(
            hhConfigurator
            .connect(emergencyAdmin)
            .connectLendingPoolCollateralManager(
                hhCollateralManager.address
            ))
            .to.emit(hhLendingPool, "CollateralManagerConnected")
    });

    it('should revert when called for a second time', async function () {
        hhConfigurator
            .connect(emergencyAdmin)
            .connectLendingPoolCollateralManager(
                hhCollateralManager.address
            )
        
        await expect(
            hhConfigurator
            .connect(emergencyAdmin)
            .connectLendingPoolCollateralManager(
                hhCollateralManager.address
            ))
            .to.be.revertedWith("Collateral Manager already connected");
    });

    it('should revert when caller is not emergency admin', async function () {
        await expect(
            hhConfigurator.connect(admin)
            .connectLendingPoolCollateralManager(
                hhCollateralManager.address
            ))
            .to.be.revertedWith("Caller is not emergency admin.");
    });
})

describe('Configurator >> LendingPool >> connectTokenPriceOracle()', function() {

    it('should set the Token Price Oracle address when caller is emergencyAdmin', async function () {
        await expect(
            hhConfigurator
            .connect(emergencyAdmin)
            .connectLendingPoolTokenPriceOracle(
                hhCollateralManager.address
            ))
            .to.emit(hhLendingPool, "TokenPriceOracleConnected")
    });

    it('should revert when caller is not emergencyAdmin', async function () {
        await expect(
            hhConfigurator
            .connect(admin)
            .connectLendingPoolTokenPriceOracle(
                hhCollateralManager.address
            ))
            .to.be.revertedWith("Caller is not emergency admin.");
    });
})