var Simplotoken = artifacts.require("Simplotoken");

contract("Simplotoken",function(accounts) {
   it("should put funds on the self account",async ()=> {
        var instance = await Simplotoken.deployed();
        var ownerBalance = await instance.balanceOf(accounts[0]);
        assert.equal(ownerBalance.valueOf(),1000000,"INITIAL SUPPLY won't load to the owners account");
        var tx = await instance.transfer(instance.contract.address,500000,{from : accounts[0]});
        var contractBalance = await instance.balanceOf(instance.contract.address);
        assert.equal(contractBalance.valueOf(),500000,"INITIAL SUPPLY won't load to the contract account");
    })
    it("check owner",() => {
    return Simplotoken.deployed().then((instance)=> {
        return instance.owner();
    }).then(owner => {
        assert.equal(accounts[0],owner);
    })
   })
   it("send tokens", async () => {
       var trCoins = 3;
       var ct = await Simplotoken.deployed();
       var coinsBalance1 = await ct.balanceOf(accounts[2]);
       var tx = await ct.transfer(accounts[2],trCoins,{from: accounts[0]});
       var coinsBalance2  = await ct.balanceOf(accounts[2]);
       assert.equal(coinsBalance2.toNumber(),coinsBalance1.toNumber()+trCoins,"balance won't increased");
   })
   it("buy tickets", async () => {
    var ct = await Simplotoken.deployed();
    var tx = await ct.transfer(accounts[1],1,{from: accounts[0]});
    var coinsBalance1 = await ct.balanceOf(accounts[1]);
    var freeTickets1 = await ct.getFreeTickets();
    var tx = await ct.buyTicket({from: accounts[1]});
    var freeTickets2 = await ct.getFreeTickets();
    var coinsBalance2  = await ct.balanceOf(accounts[1]);
    assert.equal(coinsBalance2.valueOf(),coinsBalance1.valueOf()-1,"balance won't decreased");
    assert.equal(freeTickets2.toNumber(), freeTickets1.toNumber()-1, "free tickets won't decreased");
   })
   it("buy tokens", async () => {
    var ct = await Simplotoken.deployed();
    var ctEthers = await web3.eth.getBalance(ct.contract.address);
    var ctTokens = await ct.balanceOf(ct.contract.address);
    var ac1Tokens = await ct.balanceOf(accounts[1]);
    var buyPrice = 0.011;
    var tokens = 3;
    var amount = web3.toWei(buyPrice*tokens,'finney')
    var tx = await ct.buy({from: accounts[1],value: amount});
    var ctEthers2 = await web3.eth.getBalance(ct.contract.address);
    var ctTokens2 = await ct.balanceOf(ct.contract.address);
    var ac1Tokens2 = await ct.balanceOf(accounts[1]);
    assert.equal(ctEthers2.valueOf(),ctEthers.plus(amount).valueOf(),'contract ethers failed');
    //assert.equal(ac1Ethers2.valueOf(),ac1Ethers.minus(amount).valueOf(),'account ethers failed')
    assert.equal(ctTokens2.toNumber(),ctTokens.toNumber()-tokens,'contract tokens failed');
    assert.equal(ac1Tokens2.toNumber(),ac1Tokens.toNumber()+tokens,'account tokens failed');
   })
   it("sell tokens", async () => {
    var ct = await Simplotoken.deployed();
    var ctEthers = await web3.eth.getBalance(ct.contract.address);
    var ctTokens = await ct.balanceOf(ct.contract.address);
    var ac1Tokens = await ct.balanceOf(accounts[1]);
    var sellPrice = 0.01;
    var tokens = 3;
    var amount = web3.toWei(sellPrice*tokens,'finney')
    var tx = await ct.sell(tokens,{from: accounts[1]});
    var ctEthers2 = await web3.eth.getBalance(ct.contract.address);
    var ctTokens2 = await ct.balanceOf(ct.contract.address);
    var ac1Tokens2 = await ct.balanceOf(accounts[1]);
    assert.equal(ctEthers2.valueOf(),ctEthers.minus(amount).valueOf(),'contract ethers failed');
    assert.equal(ctTokens2.toNumber(),ctTokens.toNumber()+tokens,'contract tokens failed');
    assert.equal(ac1Tokens2.toNumber(),ac1Tokens.toNumber()-tokens,'account tokens failed');
   })   
})