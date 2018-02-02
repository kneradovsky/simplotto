pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './Migrations.sol';
import './MishkaToken.sol';
import './DataSource.sol';

contract DataRegister is Migrations,Ownable {
    mapping(address => DataSource) public dataSourcesAddr;
    mapping(string => DataSource) public dataSources;
    Registrar reg;
    uint256 public commisionRate = 10;

    function DataRegister(Registrar _register) {
        reg = _register;
        _register.registerDataRegister(this);
    }

    function registerDataSource(string name, DataSource src) public onlyOwner {
        dataSourcesAddr[src] = src;
        if (dataSources[name] != address(0)) {
            require(dataSources[name].owner() == src.owner());
            dataSource[name] = src;
        } else {
            dataSources[name] = src;
        }
    }

    function getData(string name) public returns (bytes) {
        require(dataSources[name] != address(0)); //name registered
        return getData(dataSources[name]);
    }

    function getData(address src) public returns (bytes) {
        require(dataSourcesAddr[src] == src); //address registered
        MishkaToken token = reg.token();
        require(token.balance(msg.sender) >= src.requestCost());
        uint comission = src.requestCost().mul(commisionRate).div(100);
        uint dataCost = src.requestCost().sub(commision);
        require(token.transferOnBehalf(msg.sender,this,comission)); 
        require(token.transferOnBehalf(msg.sender,src,dataCost));
    }

}