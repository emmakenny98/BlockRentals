var CreateListing = artifacts.require("CreateListing.sol");

module.exports = function(deployer) {
  deployer.deploy(CreateListing);
};
