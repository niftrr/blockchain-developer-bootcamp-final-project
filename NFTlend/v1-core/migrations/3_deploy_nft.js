const ERC721PresetMinterPauserAutoId = artifacts.require("./ERC721PresetMinterPauserAutoId.sol");

module.exports = function(deployer) {
  deployer.deploy(ERC721PresetMinterPauserAutoId, "My NFT","NFT", "https://my-json-server.typicode.com/abcoathup/samplenft/tokens/");
};
