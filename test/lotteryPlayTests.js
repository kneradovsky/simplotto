var Simplotoken = artifacts.require("Simplotoken");



contract("Simplotoken",function(accounts) {
    var events;
    before(async ()=> {
        var ct = await Simplotoken.deployed();
        events = ct.allEvents();
        events.watch((error,event) => {
            if(event.event != "Transfer" && event.event != "TicketBought")
                console.log(JSON.stringify(event,null,2));
        })

    })
    after(()=> {
        events.stopWatching();
    })
    it("buy 30 tokens for each account", async () => {
        var ct = await Simplotoken.deployed();
        var contractBalance = await ct.balanceOf(ct.contract.address);
        assert.equal(contractBalance.valueOf(),1000000,"INITIAL SUPPLY won't load to the contract account");
        var ethBalance = web3.eth.getBalance(ct.contract.address);
        console.log(`Balance of contract is ${web3.fromWei(ethBalance,'ether')} ethers`);

        var buyPrice = 11;
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
        var gameNumber1 = await ct.currentGameNumber();
        for(var i=0;i<257;i++) { //play full tickets + 1
            var accInd = i%10;
            var account = accounts[accInd];
            var tx = await ct.buyTicket({from: account});
        }
        var gameNumber2 = await ct.currentGameNumber();
        console.log(`${gameNumber1} ${gameNumber2}`)
        var tour = await ct.prevTours(0);
        console.log(tour);
        //events.stopWatching();
    })
    it("show balances after", async () => {
        var ct = await Simplotoken.deployed();
        for(var i=0;i<accounts.length;i++) {
            var account = accounts[i];
            var tokBal = await ct.balanceOf(account);
            //var ethBal = await web3.eth.getBalance(account);
            console.log(`Balance of ${account} is ${tokBal.valueOf()} tokens`);
        }
        //ether balance of the contract
        var ethBalance = web3.eth.getBalance(ct.contract.address);
        console.log(`Balance of contract is ${web3.fromWei(ethBalance,'ether')} ethers`);
    })
    it("sell all coins after game",async () => {
        var ct = await Simplotoken.deployed();
        var ethBalance = web3.eth.getBalance(ct.contract.address);
        console.log(`Balance of contract is ${web3.fromWei(ethBalance,'ether')} ethers`);
        
        for(var i=0;i<accounts.length;i++) {
            var account = accounts[i];
            var tokBal = await ct.balanceOf(account);
            console.log(tokBal);
            var tx = await ct.sell(tokBal.valueOf(),{from: account});
        }
        //ether balance of the contract
        ethBalance = web3.eth.getBalance(ct.contract.address);
        console.log(`Balance of contract is ${web3.fromWei(ethBalance,'ether')} ethers`);
        
    })
});