pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './Migrations.sol';

contract TradedToken is MintableToken, Migrations {
    uint256 public sellPrice = 0.01 finney;
    uint256 public buyPrice = 0.011 finney; 
    event PricesChanged(uint256 sellPrice,uint256 buyPrice);

    function setPrices(uint256 _sellPrice,uint256 _buyPrice) public onlyOwner {
        sellPrice = _sellPrice;
        buyPrice = _buyPrice;
        PricesChanged(_sellPrice,_buyPrice);
    }

    function getPrices() public view returns (uint256 _sellPrice,uint256 _buyPrice) {
        _sellPrice = sellPrice;
        _buyPrice = buyPrice;
        return (_sellPrice,_buyPrice);
    }
    function buy() public payable returns (uint amount) {
        amount = msg.value.div(buyPrice);
        require(amount >= 1);
        require(balances[this] >= amount);
        balances[msg.sender] = balances[msg.sender] + amount;
        balances[this] = balances[this] - amount;
        Transfer(this,msg.sender,amount);
        return amount;
    }

    function sell(uint amount) public returns (uint revenue) {
        //require(balances[msg.sender] >= amount);
        transfer(this,amount);
        revenue = amount.mul(sellPrice);
        require(msg.sender.send(revenue));
        Transfer(msg.sender,this,amount);
        return revenue;
    }
/*
    function getTokens(uint amount) onlyOwner public {
        require(balances[this] >= amount);
        balances[this].sub(amount);
        balances[owner].add(amount);
        Transfer(this,owner,amount);
    }
*/
    function transferEther(uint amount) onlyOwner public {
        require(this.balance >= amount);
        require(owner.send(amount));
    }

}