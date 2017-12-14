var Simplotoken = artifacts.require("Simplotoken");

contract("Simplotoken",function(accounts) {
   it("should put 1M on the first account",()=> {
       return Simplotoken.deployed().then((instance)=>{
           return instance.getBalance.call(accounts[0]);
       }).then((balance)=>{
           console.log(balance);
           assert.equal(balance.valueOf(),1000000,"INITIAL SUPPLY won't load to the contract account");
       })
   })
})