// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // const Greeter = await hre.ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");

  // await greeter.deployed();

  // console.log("Greeter deployed to:", greeter.address);

  // Get and deploy LendingPool contract
  const LendingPool = await hre.ethers.getContractFactory('LendingPool');
  const lendingPool = await LendingPool.deploy();
  await lendingPool.deployed();
  console.log("LendingPool deployed to:", lendingPool.address);

  // Get and deploy CollateralManager contract
  const CollateralManager = await hre.ethers.getContractFactory('CollateralManager');
  const collateralManager = await CollateralManager.deploy();
  await collateralManager.deployed();
  console.log("CollateralManager deployed to:", collateralManager.address);

  // Link CollateralManager to LendingPool
  await lendingPool.setCollateralManagerAddress(collateralManager.address);

  // Get and deploy AssetToken contract
  const assetTokenNumDecimals = 10;
  const assetTokenSupply = 3*10**assetTokenNumDecimals;
  const assetTokenInitialBalance = 1*10**assetTokenNumDecimals;
  const AssetToken = await hre.ethers.getContractFactory('AssetToken');
  assetToken = await AssetToken.deploy('Dai Token', 'DAI', assetTokenSupply);
  await assetToken.deployed();
  console.log("AssetToken deployed to:", assetToken.address);

  // Get and deploy nToken contracts
  NToken = await hre.ethers.getContractFactory('NToken');
  // DAI:
  nTokenDAI = await NToken.deploy('DAI nToken', 'nDAI');
  await nTokenDAI.deployed();
  console.log("nTokenDAI deployed to:", nTokenDAI.address);
  // ETH:
  nTokenETH = await NToken.deploy('ETH nToken', 'nETH');
  await nTokenETH.deployed();
  console.log("nTokenETH deployed to:", nTokenETH.address);
  // USDC:
  nTokenUSDC = await NToken.deploy('USDC nToken', 'nUSDC');
  await nTokenUSDC.deployed();
  console.log("nTokenUSDC deployed to:", nTokenUSDC.address);

  // Asign nToken minter/burner roles to LendingPool
  // DAI:
  await nTokenDAI.setMinter(lendingPool.address);
  await nTokenDAI.setBurner(lendingPool.address);
  // ETH:
  await nTokenETH.setMinter(lendingPool.address);
  await nTokenETH.setBurner(lendingPool.address);
  // USDC:
  await nTokenUSDC.setMinter(lendingPool.address);
  await nTokenUSDC.setBurner(lendingPool.address);

  // Get and deploy debtToken contracts
  DebtToken = await hre.ethers.getContractFactory('DebtToken');
  // DAI:
  debtTokenDAI = await DebtToken.deploy('DAI debtToken', 'debtDAI');
  await debtTokenDAI.deployed();  
  console.log("debtTokenDAI deployed to:", debtTokenDAI.address);
  // ETH:
  debtTokenETH = await DebtToken.deploy('ETH debtToken', 'debtETH');
  await debtTokenETH.deployed();  
  console.log("debtTokenETH deployed to:", debtTokenETH.address);
  // USDC:
  debtTokenUSDC = await DebtToken.deploy('USDC debtToken', 'debtUSDC');
  await debtTokenUSDC.deployed();  
  console.log("debtTokenUSDC deployed to:", debtTokenUSDC.address);

  // Asign debtToken minter/burning roles to LendingPool
  // DAI:
  await debtTokenDAI.setMinter(lendingPool.address);
  await debtTokenDAI.setBurner(lendingPool.address);
  // ETH:
  await debtTokenETH.setMinter(lendingPool.address);
  await debtTokenETH.setBurner(lendingPool.address);
  // USDC:
  await debtTokenUSDC.setMinter(lendingPool.address);
  await debtTokenUSDC.setBurner(lendingPool.address);

  // Get and deploy NFT contract
  NFT = await hre.ethers.getContractFactory('NFT');
  nFT = await NFT.deploy('Punk NFT', 'PUNK');
  await nFT.deployed();
  console.log("NFT deployed to:", nFT.address);

  // Set NFT liquidation threshold
  collateralManager.setLiquidationThreshold(nFT.address, 150); // in percent

  // Get Signers
  [acc0, acc1, acc2] = await hre.ethers.getSigners();

  // Transfer funds to acc1 and acc2
  await assetToken.transfer(acc1.address, assetTokenInitialBalance);
  await assetToken.transfer(acc2.address, assetTokenInitialBalance);

  // Mint NFTs to acc1 and acc2
  const acc1TokenId = 0;
  const acc2TokenId = 1;
  await nFT.mint(acc1.address, acc1TokenId);
  await nFT.mint(acc2.address, acc2TokenId);  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
