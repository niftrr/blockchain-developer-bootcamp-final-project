const NFTlendV1LendingPool = artifacts.require("./lendingpool/NFTlendV1LendingPool.sol");

module.exports = function (deployer) {
  deployer.deploy(NFTlendV1LendingPool);
};
