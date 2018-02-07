//main contracts
var Token =artifacts.require("Mishka");

var Pos = artifacts.require("Pos");


//stub
var Stub = artifacts.require("StubContract");

//addresses 
//TokenAddress = "0xfb88de099e13c3ed21f80a7a1e49f8caecf10df6";
//PosAddress = "0x9fbda871d559710256a2502a2517b794b482db40";
//StubAddress = "0xecfcab0a285d3380e488a39b4bb21e777f8a4eac";

contract("Pos1",(accounts)=> {
    it("initial balance", async ()=>{
        var tok = await Token.deployed();
        var pos = await Pos.deployed();
        var posTokens = await tok.balanceOf(pos.contract.address);
        assert.equal(posTokens.valueOf(),"1000000000000","INITIAL SUPPLY won't load to the contract account");
    })
    it("buy tokens",async () => {
        var tok = await Token.at(TokenAddress);
        var pos = await Pos.at(PosAddress);
        var posEthers = await web3.eth.getBalance(pos.contract.address);
        var posTokens = await tok.balanceOf(pos.contract.address);
        var ac1Tokens = await tok.balanceOf(accounts[1]);
        var buyPrice = 1000000;
        var tokens = 3;
        var amount = buyPrice*tokens;
        var tx = await pos.buy({from: accounts[1],value: amount});
        var ctEthers2 = await web3.eth.getBalance(pos.contract.address);
        var ctTokens2 = await tok.balanceOf(pos.contract.address);
        var ac1Tokens2 = await tok.balanceOf(accounts[1]);
        assert.equal(ctEthers2.valueOf(),ctEthers.plus(amount).valueOf(),'contract ethers failed');
        //assert.equal(ac1Ethers2.valueOf(),ac1Ethers.minus(amount).valueOf(),'account ethers failed')
        assert.equal(ctTokens2.toNumber(),ctTokens.toNumber()-tokens,'contract tokens failed');
        assert.equal(ac1Tokens2.toNumber(),ac1Tokens.toNumber()+tokens,'account tokens failed');
    })
});


// contract("StubContract1",(accounts) => {
//     it("buy tokens",async () => {

//     })
//     it("test transaction limit",async () => {
//         var sc = await Stub.at(StubAddress);
//         var tok = await Token.at(TokenAddress);
//         var pos = await Pos.at(PosAddress);
//     })
// });