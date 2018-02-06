pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './Migrations.sol';
import './Tokenizer.sol';
import './MishkaToken.sol';

contract Registrar is Tokenizer {

    function Registrar() public {
    }

    function registerContract(address ct,uint256 limit) public onlyOwner tokenized {
        require(ct != address(0));
        token.setGlobalLimit(ct,limit);
    }

    function unregisterContract(address ct) public onlyOwner tokenized {
        registerContract(ct,0);
    }

    function registerDataRegister(address dr) public onlyOwner tokenized {
        registerContract(dr,token.totalSupply());
    }
}