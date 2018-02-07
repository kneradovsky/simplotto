pragma solidity ^0.4.17; 

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './Migrations.sol';
import './MishkaToken.sol';

contract StubContract is Ownable,Migrations {
    Mishka token;
    function StubContract(Mishka _token) public {
        token = _token;
    }

    function testTransfer(address from, address to, uint256 amount) {
        token.transferOnBehalf(from,to,amount);
    }
}
