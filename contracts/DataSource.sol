pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './Migrations.sol';
import './DataRegister.sol';



contract DataSource is Ownable {
    DataRegister register;
    uint256 public requestCost = 0;
    function DataSource(DataRegister _reg) public {
        register = _reg;
    }
    
    modifier onlyDataRegister() {
        require(msg.sender==address(register) || msg.sender==owner);
        _;
    }

    function getData() public onlyDataRegister returns(bytes);

}