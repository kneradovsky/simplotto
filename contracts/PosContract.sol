pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './Migrations.sol';
import './MishkaToken.sol';
import './Tokenizer.sol';

contract Pos is Migrations,Tokenizer {
    using SafeMath for uint256;
    MishkaToken token;
    bool tokenSet;

    uint256 public sellPrice;
    uint256 public buyPrice; 
    event PricesChanged(uint256 sellPrice,uint256 buyPrice);
    
    
    function Pos() public {
        token = address(0);
        tokenSet = false;
        sellPrice = 1000000;
        buyPrice = 1000000;
    }

    function buy() public tokenized payable returns (uint amount) {
        require(token!=address(0));
        amount = msg.value.div(buyPrice);
        require(token.balances(this) >= amount);
        token.transfer(msg.sender,amount);
        return amount;
    }

    function sell(uint256 amount) public tokenized returns (uint256 revenue) {
        require(token!=address(0));
        uint256 decimalsDiv = 10**token.decimals();
        revenue = amount.mul(sellPrice).div(decimalsDiv);
        require(token.transferOnBehalf(msg.sender,this,amount));
        require(msg.sender.send(revenue));
        return revenue;
    }

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
    
}