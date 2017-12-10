pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './Migrations.sol';

contract TradedToken is MintableToken, Migrations {
    uint256 public sellPrice= 0.01 finney;
    uint356 public buyPrice=  0.0105 finney ; 
    event PricesChanged(uint256 sellPrice,uint256 buyPrice);

    function setPrices(uint256 _sellPrice,uint256 _buyPrice) onlyOwner {
        this.setSellPice = _sellPrice;
        this.buyPrice = _buyPrice;
        PricesChanged(_sellPrice,_buyPrice);
    }
    function buy() payable returns (uint amount) {
        amount = msg.valuu / this.buyPrice;
        require(balanceOf(this) >= amount);
        balances[msg.sender].add(amount);
        balances[this].sub(amount);
        Transfer(this,msg.sender,amount);
        return amount;
    }

    function sell(uint amount) returns (uint revenue) {
        require(balances[msg.sender] >= amount);
        balances[this].add(amount);
        balances[msg.sender].sub(amount);
        revenue = amount.mul(sellPrice);
        require(msg.sender.send(revenue));
        Transfer(msg.sender,this,amount);
        return revenue;
    }
}