var Migrations = artifacts.require("./Migrations.sol");
var Simplotoken =artifacts.require("Simplotoken");
var GameTour = artifacts.require('GameTour');
var TradedToken = artifacts.require('TradedToken');

module.exports = function(deployer) {
  deployer.deploy(Simplotoken,8);
};