const Company = artifacts.require("Company");
//account 1 on ganache cli - update as needed
const RegistryOwner = "0xeBE31C3899353795C43f006fA50F3A07Dc37964e";

module.exports = function (deployer) {
  deployer.deploy(Company, RegistryOwner, 0, "Genesis Company");
};