var Simplotoken = artifacts.require("Simplotoken");

contract("Simplotoken",function(accounts) {
   it("should put 1M on the first account",()=> {
       return Simplotoken.deployed().then((instance)=>{
           return instance.balanceOf(accounts[0]);
       }).then((balance)=>{

           assert.equal(balance.valueOf(),1000000,"INITIAL SUPPLY won't load to the contract account");
       })
   })
   it("check owner",() => {
    return Simplotoken.deployed().then((instance)=> {
        return instance.owner();
    }).then(owner => {
        assert.equal(accounts[0],owner);
    })
   })
})