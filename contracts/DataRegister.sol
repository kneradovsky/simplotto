pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './Migrations.sol';
import './Registrar.sol';
import './MishkaToken.sol';
import './DataSource.sol';

contract DataRegister is Migrations,Ownable {
    using SafeMath for uint;
    mapping(address => DataSource) public dataSourcesAddr;
    mapping(uint256 => DataSource) public dataSources; // string packed to the uint256
    Registrar reg;
    uint256 public commisionRate = 10;

    function DataRegister(Registrar _register) public {
        reg = _register;
        _register.registerDataRegister(this);
    }

    function registerDataSource(string strname, DataSource src) public onlyOwner {
        uint256 name = packString(strname);
        dataSourcesAddr[src] = src;
        if (dataSources[name] != address(0)) {
            require(dataSources[name].owner() == src.owner());
            dataSources[name] = src;
        } else {
            dataSources[name] = src;
        }
    }

    function getData(string strname) public returns (bytes) {
        uint256 name = packString(strname);
        require(dataSources[name] != address(0)); //name registered
        return getData(dataSources[name]);
    }

    function getData(DataSource src) public returns (bytes) {
        require(dataSourcesAddr[src] == src); //address registered
        Mishka token = reg.token();
        require(token.balanceOf(msg.sender) >= src.requestCost());
        uint requestCost = src.requestCost();
        uint comission = requestCost.mul(commisionRate).div(100);
        uint dataCost = requestCost.sub(comission);
        require(token.transferOnBehalf(msg.sender,this,comission)); 
        require(token.transferOnBehalf(msg.sender,src,dataCost));
    }

    function packString(string str) private pure returns (uint256 res) {
        bytes memory sb = bytes(str);
        require(sb.length <= 32); //length is less than byte size of the uint256
        res = 0;
        for (uint8 i = uint8(sb.length-1);i<=0;i--) {
            uint b = uint256(sb[i]);
            res = res + (b << i);
        }
        return res;
    }

}