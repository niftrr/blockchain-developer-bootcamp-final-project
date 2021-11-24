// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");
const envFile = "../interface/.env";
let fileData = "";
  
async function writeContractAddressesToInterfaceEnv(fileData) {
  fs.writeFile(envFile, fileData, (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // Get Signers 
  [acc0, acc1, acc2, emergencyAdmin, admin] = await hre.ethers.getSigners();

  // Get and deploy Configurator
  Configurator = await ethers.getContractFactory('Configurator');
  configurator = await Configurator.deploy(
      emergencyAdmin.address,
      admin.address 
  );
  await configurator.deployed();

  // Get and deploy LendingPool contract
  const LendingPool = await hre.ethers.getContractFactory('LendingPool');
  const lendingPool = await LendingPool.deploy(configurator.address);
  await lendingPool.deployed();
  console.log("LendingPool deployed to:", lendingPool.address);
  fileData += `REACT_APP_LENDING_POOL_CONTRACT_ADDRESS=${lendingPool.address}\n`;

  // Connect LendingPool in Configurator
  await configurator.connect(admin).connectLendingPool(
    lendingPool.address
  );

  // Get and deploy CollateralManager contract
  const CollateralManager = await hre.ethers.getContractFactory('CollateralManager');
  const collateralManager = await CollateralManager.deploy(
    configurator.address,
    lendingPool.address
  );
  await collateralManager.deployed();
  console.log("CollateralManager deployed to:", collateralManager.address);
  fileData += `REACT_APP_COLLATERAL_MANAGER_CONTRACT_ADDRESS=${collateralManager.address}\n`;

  // Connect CollateralManager in Configurator
  await configurator.connect(admin).connectCollateralManager(
      collateralManager.address
  );

  // Get and deploy OraceTokenPrice
  TokenPriceOracle = await ethers.getContractFactory('TokenPriceOracle');
  tokenPriceOracle = await TokenPriceOracle.deploy();

  // Get and deploy AssetToken contracts
  const assetTokenSupply = hre.ethers.utils.parseEther("5000000.0");
  const assetTokenInitialBalance = hre.ethers.utils.parseEther("150000.0");
  const assetTokenInitialBalanceWETH = hre.ethers.utils.parseEther("200.0");
  const AssetToken = await hre.ethers.getContractFactory('AssetToken');
  // DAI:
  assetTokenDAI = await AssetToken.connect(admin).deploy('DAI Token', 'DAI', assetTokenSupply);
  await assetTokenDAI.deployed();
  console.log("assetTokenDAI deployed to:", assetTokenDAI.address);
  fileData += `REACT_APP_ASSET_TOKEN_DAI_CONTRACT_ADDRESS=${assetTokenDAI.address}\n`;
  // ETH:
  assetTokenETH = await AssetToken.connect(admin).deploy('ETH Token', 'ETH', assetTokenSupply);
  await assetTokenETH.deployed();
  console.log("assetTokenETH deployed to:", assetTokenETH.address);
  fileData += `REACT_APP_ASSET_TOKEN_ETH_CONTRACT_ADDRESS=${assetTokenETH.address}\n`;
  // USDC:
  assetTokenUSDC = await AssetToken.connect(admin).deploy('USDC Token', 'USDC', assetTokenSupply);
  await assetTokenUSDC.deployed();
  console.log("assetTokenUSDC deployed to:", assetTokenUSDC.address);
  fileData += `REACT_APP_ASSET_TOKEN_USDC_CONTRACT_ADDRESS=${assetTokenUSDC.address}\n`;

  // Get and deploy nToken contracts
  NToken = await hre.ethers.getContractFactory('NToken');
  // DAI:
  nTokenDAI = await NToken.deploy(
    configurator.address,
    lendingPool.address,
    'DAI nToken', 
    'nDAI'
  );
  await nTokenDAI.deployed();
  console.log("nTokenDAI deployed to:", nTokenDAI.address);
  fileData += `REACT_APP_N_TOKEN_DAI_CONTRACT_ADDRESS=${nTokenDAI.address}\n`;
  // ETH:
  nTokenETH = await NToken.deploy(
    configurator.address,
    lendingPool.address,
    'ETH nToken', 
    'nETH'
  );
  await nTokenETH.deployed();
  console.log("nTokenETH deployed to:", nTokenETH.address);
  fileData += `REACT_APP_N_TOKEN_ETH_CONTRACT_ADDRESS=${nTokenETH.address}\n`;
  // USDC:
  nTokenUSDC = await NToken.deploy(
    configurator.address,
    lendingPool.address,
    'USDC nToken', 
    'nUSDC'
  );
  await nTokenUSDC.deployed();
  console.log("nTokenUSDC deployed to:", nTokenUSDC.address);
  fileData += `REACT_APP_N_TOKEN_USDC_CONTRACT_ADDRESS=${nTokenUSDC.address}\n`;

  // Get and deploy debtToken contracts
  DebtToken = await hre.ethers.getContractFactory('DebtToken');
  // DAI:
  debtTokenDAI = await DebtToken.deploy(
    configurator.address,
    lendingPool.address,
    'DAI debtToken', 
    'debtDAI'
  );
  await debtTokenDAI.deployed();  
  console.log("debtTokenDAI deployed to:", debtTokenDAI.address);
  fileData += `REACT_APP_DEBT_TOKEN_DAI_CONTRACT_ADDRESS=${debtTokenDAI.address}\n`;
  // ETH:
  debtTokenETH = await DebtToken.deploy(
    configurator.address,
    lendingPool.address,
    'ETH debtToken', 
    'debtETH'
  );
  await debtTokenETH.deployed();  
  console.log("debtTokenETH deployed to:", debtTokenETH.address);
  fileData += `REACT_APP_DEBT_TOKEN_ETH_CONTRACT_ADDRESS=${debtTokenETH.address}\n`;
  // USDC:
  debtTokenUSDC = await DebtToken.deploy(
    configurator.address,
    lendingPool.address,
    'USDC debtToken', 
    'debtUSDC'
  );
  await debtTokenUSDC.deployed();  
  console.log("debtTokenUSDC deployed to:", debtTokenUSDC.address);
  fileData += `REACT_APP_DEBT_TOKEN_USDC_CONTRACT_ADDRESS=${debtTokenUSDC.address}\n`;

  // Initialize Reserves
  // DAI:
  configurator.connect(admin).initLendingPoolReserve(assetTokenDAI.address, nTokenDAI.address, debtTokenDAI.address);
  // ETH:
  configurator.connect(admin).initLendingPoolReserve(assetTokenETH.address, nTokenETH.address, debtTokenETH.address);
  // USDC:
  configurator.connect(admin).initLendingPoolReserve(assetTokenUSDC.address, nTokenUSDC.address, debtTokenUSDC.address);
  console.log('Initialized Reserves');

  // Get and deploy NFT contracts
  NFT = await hre.ethers.getContractFactory('NFT');
  // PUNK:
  nftPUNK = await NFT.deploy('Cryptopunks', 'PUNK');
  await nftPUNK.deployed();
  console.log("NFT PUNK deployed to:", nftPUNK.address);
  fileData += `REACT_APP_NFT_PUNK_CONTRACT_ADDRESS=${nftPUNK.address}\n`;
  // BAYC:
  nftBAYC = await NFT.deploy('Bored Ape Yacht Club', 'BAYC');
  await nftBAYC.deployed();
  console.log("NFT BAYC deployed to:", nftBAYC.address);
  fileData += `REACT_APP_NFT_BAYC_CONTRACT_ADDRESS=${nftBAYC.address}`;

  // Set NFT liquidation thresholds
  configurator.connect(admin).setCollateralManagerLiquidationThreshold(nftPUNK.address, 150); // in percent
  configurator.connect(admin).setCollateralManagerLiquidationThreshold(nftBAYC.address, 150); // in percent

  // Whitelist NFT
  configurator.connect(admin).updateCollateralManagerWhitelist(nftPUNK.address, true);
  configurator.connect(admin).updateCollateralManagerWhitelist(nftBAYC.address, true);

  // Set NFT-specific APRs
  configurator.connect(admin).setCollateralManagerInterestRate(nftPUNK.address, 18);
  configurator.connect(admin).setCollateralManagerInterestRate(nftBAYC.address, 20);

  // Transfer funds to acc0, acc1 and acc2
  const accDict = {0: acc0, 1: acc1, 2: acc2}
  const tokenDict = {
    "DAI": assetTokenDAI.address,
    "USDC": assetTokenUSDC.address,
    "WETH": assetTokenETH.address
  }
  function swap(_dict){ 
    var ret = {};
    for(var key in _dict){
      ret[_dict[key]] = key;
    }
    return ret;
  }
  const inverseTokenDict = swap(tokenDict);

  async function transfer(accNum, token) {
    let transferAmount = assetTokenInitialBalance
    if (inverseTokenDict[token.address]=="WETH") {
      transferAmount = assetTokenInitialBalanceWETH;
    }
    await token.connect(admin).transfer(accDict[accNum].address, transferAmount);
    console.log(`Transferred acc${accNum} (${accDict[accNum].address}) ${transferAmount/10**18} ${inverseTokenDict[token.address]} (${token.address})`)
  }
  await transfer(0, assetTokenDAI);
  await transfer(0, assetTokenUSDC);
  await transfer(0, assetTokenETH);
  await transfer(1, assetTokenDAI);
  await transfer(1, assetTokenUSDC);
  await transfer(1, assetTokenETH);
  await transfer(2, assetTokenDAI);
  await transfer(2, assetTokenUSDC);
  await transfer(2, assetTokenETH);

  // Mint NFTs to acc1 and acc2
  const nftDict = {"PUNK": nftPUNK, "BAYC": nftBAYC}
  async function mint(nftName, accNum, tokenId) {
    const nft = nftDict[nftName];
    const acc = accDict[accNum];
    await nft.mint(acc.address, tokenId);
    console.log(`${nftName} #${tokenId} minted to acc${accNum} (address: ${acc.address})`)
  }
  // PUNK:
  await mint("PUNK", 0, 0);
  await mint("PUNK", 0, 1);
  await mint("PUNK", 1, 2);
  await mint("PUNK", 1, 3);
  await mint("PUNK", 2, 4);
  await mint("PUNK", 2, 5);
  // BAYC: 
  await mint("BAYC", 0, 0);
  await mint("BAYC", 0, 1);
  await mint("BAYC", 1, 2);
  await mint("BAYC", 1, 3);
  await mint("BAYC", 2, 4);
  await mint("BAYC", 2, 5); 

  // Writes fileData to interface ../interface/.env 
  await writeContractAddressesToInterfaceEnv(fileData);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
