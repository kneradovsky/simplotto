var Simplotoken = artifacts.require("Simplotoken");



contract("Simplotoken",function(accounts) {
    it("buy 30 tokens for each account", async () => {
        var ct = await Simplotoken.deployed();
        var tx = await ct.transfer(ct.contract.address,500000,{from : accounts[0]});
        var contractBalance = await ct.balanceOf(ct.contract.address);
        assert.equal(contractBalance.valueOf(),500000,"INITIAL SUPPLY won't load to the contract account");
        var buyPrice = 0.011;
        var tokens = 30;
        var amount = Math.ceil(web3.toWei(buyPrice*tokens,'finney'));
        for(var i=0;i<10;i++) {
            var account = accounts[i];
            var oldBal = await ct.balanceOf(account);
            var tx = await ct.buy({from: account,value: amount});
            var newBal = await ct.balanceOf(account);
            assert.equal(newBal.toNumber(),oldBal.toNumber()+tokens,"balance of "+account+" wasn't increased");
        }
    })      
    it("test game play 1", async () => {
        var ct = await Simplotoken.deployed();
        var events = ct.allEvents();
        events.watch((error,event) => {
            if(event.event != "Transfer" && event.event != "TicketBought")
                console.log(JSON.stringify(event,null,2));
        })
        var gameNumber1 = await ct.currentGameNumber();
        for(var i=0;i<257;i++) { //play full tickets + 1
            var accInd = i%10;
            var account = accounts[accInd];
            var tx = await ct.buyTicket({from: account});
        }
        var gameNumber2 = await ct.currentGameNumber();
        console.log(`${gameNumber1} ${gameNumber2}`)
    })
    /*
    it("show balances after", async () => {
        var ct = await Simplotoken.deployed();
        for(var i=0;i<accounts.length;i++) {
            var account = accounts[i];
            var tokBal = await ct.balanceOf(account);
            //var ethBal = await web3.eth.getBalance(account);
            console.log(`Balance of ${account} is ${tokBal.valueOf()} tokens`);
        }
    })
   */
});