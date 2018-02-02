pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './Migrations.sol';
import './MishkaToken.sol';

contract Registrar is Tokenized,Migrations {

    function Registrar() {
        token=address(0);
    }
    function registerContract(address ct,uint256 limit) public onlyOwner tokenized {
        require(ct != address(0));
        token.setLimit(ct,limit);
    }

    function unregisterContract(address ct) public onlyOwner tokenized {
        registerContract(ct,0);
    }
}