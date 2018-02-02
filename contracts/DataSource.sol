import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './Migrations.sol';
import './DataRegister.sol';


contract DataSource is Ownable {
    DataRegister register;
    uint256 requestCost = 0;
    function DataSource(DataRegister _reg) {
        register = reg;
    }
    
    modifier onlyDataRegister() {
        requre(msg.sender==register || msg.sender==owner);
        _;
    }

    function getData() public onlyDataRegister returns(bytes);
}