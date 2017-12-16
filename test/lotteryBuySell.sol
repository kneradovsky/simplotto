pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/LotteryToken.sol";


contract LotteryBuySell {
    uint public initialBalance = 10 ether;
    function testBuy2Coins() public {
        Simplotoken tok = Simplotoken(DeployedAddresses.Simplotoken());
        var amount = tok.buy.value(0.033 finney);
        Assert.equal(amount, 3,"failed");
    }
}