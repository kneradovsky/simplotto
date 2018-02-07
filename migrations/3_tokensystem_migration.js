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

//stub
var stub = artifacts.require("StubContract");

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
            var ticketPrice = 1000;
            //lottery 8
            deployer.then(() => {
                return raffle.new(Token.address,8,ticketPrice);
            }).then((inst) => {
                console.log("R8 address="+inst.address);
                reg.registerContract(inst.address,ticketPrice);
            })
            //lottery 10
            deployer.then(() => {
                return raffle.new(Token.address,10,ticketPrice);
            }).then((inst) => {
                console.log("R10 address="+inst.address);
                reg.registerContract(inst.address,ticketPrice);
            })
            //lottery 12
            deployer.then(() => {
                return raffle.new(Token.address,12,ticketPrice);
            }).then((inst) => {
                console.log("R12 address="+inst.address);
                reg.registerContract(inst.address,ticketPrice);
            })

            //stub
            deployer.deploy(stub,Token.address);
        });
    });
};


