const NFTlendV1LendingPool = artifacts.require("./NFTlendV1LendingPool.sol");

module.exports = function (deployer) {
  deployer.deploy(NFTlendV1LendingPool);
};
