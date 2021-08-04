const CompanyRegistry = artifacts.require("CompanyRegistry");
//account 1 on ganache cli - update as needed
const RegistryOwner = "0xeBE31C3899353795C43f006fA50F3A07Dc37964e";

module.exports = function (deployer) {
  deployer.deploy(CompanyRegistry, RegistryOwner);
};

//ganache-cli --fork https://mainnet.infura.io/v3/09026dadca7744ea9d976f85b2a9723e --unlock 0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503