var Migrations = artifacts.require("./Migrations.sol");
//main contracts
var Token =artifacts.require("Mishka");
var voter = artifacts.require("Voter");
var pos = artifacts.require("Pos");
var registrar = artifacts.require("Registrar");

//data contracts
var datareg = artifacts.require("DataRegister");
var randomData = artifacts.require("RandomNumber");

//lottery
var raffle = artifacts.require("RaffleLottery");


module.exports = function(deployer,network,accounts) {
    //main part
    deployer.deploy([voter,pos,registrar]).then(() => {
        deployer.deploy(Token,pos.address,registrar.address,voter.address).then(() => {
            //data part
            var reg = registrar.at(registrar.address);
            reg.setToken(Token.address,{from: accounts[0]});
            
            var p = pos.at(pos.address);
            p.setToken(Token.address);
            var v = pos.at(voter.address);
            v.setToken(Token.address);

            deployer.deploy(datareg,registrar.address).then(() => {
                reg.registerDataRegister(datareg.address,{from: accounts[0]});
                deployer.deploy(randomData,datareg.address).then(() => {
                    var dr = datareg.at(datareg.address);
                    dr.registerDataSource("randWord",randomData.address).catch(error=>console.log(error));
                });
                //dr.registerDataSource("rndWord",rd);
            });
    
            //lottery 8
            var rl8 = deployer.deploy(raffle,Token.address,8,1000);
            var rl10 = deployer.deploy(raffle,Token.address,10,1000);
            var rl12 = deployer.deploy(raffle,Token.address,12,1000);
            //console.log("RL8 = " + rl8.address);
            //console.log("RL10 = " + rl10.address);
            //console.log("RL12 = " + rl12.address);
        });
    });
};


