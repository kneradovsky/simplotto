var Migrations = artifacts.require("./Migrations.sol");
var Simplotoken =artifacts.require("Simplotoken");

module.exports = function(deployer) {
  deployer.deploy(Simplotoken,8);
};