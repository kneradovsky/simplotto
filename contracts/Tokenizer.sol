pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './Migrations.sol';
import './MishkaToken.sol';

contract Tokenizer is Ownable,Migrations {
    bool private tokenSet = false;
    Mishka public token;

    function setToken(Mishka _token) public onlyOwner {
        require(!tokenSet);
        token = _token;
        tokenSet = true;
    }

    modifier tokenized() {
        require(tokenSet);
        _;
    }

}