pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './Migrations.sol';

contract Mishka is MintableToken, Migrations {

    enum PluginType { Registrar, Voter, POS }


    string public constant name = "Mishka";
    string public constant symbol = "MST";
    uint8 public constant decimals = 6;
    uint256 public constant INITIAL_SUPPLY = 1000000 * (10 ** uint256(decimals));
    
    event globalLimitSet(address ct,uint256 limit);
    event pluginReplaced(PluginType ptype, address prev, address current);
    
    mapping (address => uint256) public contractLimit;
    mapping (address => mapping (address => uint256) ) internal contractOwnLimit;
    address public registrar;
    address public voter;
    address public pos;

    function Mishka(address _pos, address _registrar, address _voter) {
        require(_pos != address(0));
        require(_registrar != address(0));
        require(_voter != address(0));
        totalSupply = INITIAL_SUPPLY;
        balances[_pos] = totalSupply;
        setPluginAddress(PluginType.POS, _pos);
        setPluginAddress(PluginType.Registrar, _registrar);
        setPluginAddress(PluginType.Voter, _voter);
    }

    function setPluginAddress(PluginType ptype, address dest) public onlyOwner returns (bool) {
        address prev = address(0);
        if (ptype == PluginType.Registrar ) {
            prev = registrar;
            registrar = dest;
        } else if (ptype == PluginType.Voter ) {
            prev = voter;
            voter = dest;
        } else if (ptype == PluginType.POS) {
            prev = pos;
            pos = dest;
        } else {
            return false;
        }
        pluginReplaced(ptype,prev,dest);
    }

    modifier onlyRegistrar() {
        require(msg.sender == registrar || msg.sender == owner);
        _;
    }

    function setGlobalLimit(address ct, uint256 limit) public onlyRegistrar returns (bool) {
        contractLimit[contractAddr] = limit;
        globalLimitSet(ct,limit);
        return true;
    }

    function setOwnLimit(address ct, uint256 limit) public returns(bool) {
        contractOwnLimit[msg.sender][ct] = limit;
        return true;
    }

    function transferOnBehalf(address from, address to, uint256 amount) public returns (bool) {
        require(contractLimit[msg.sender] > 0); //means contract registered
        if (contractOwnLimit[from][msg.sender] > 0) {
            require(contractOwnLimit[from][msg.sender] > amount); //if client sender set own limit then use it
        }
        return transferInternal(from,to,amount);
    }

    function transferInternal(address from, address to, uint256 amount) private returns (bool) {
        require(to != address(0));
        require(amount <= balances[from]);
        balances[from] = balances[from].sub(amount);
        balances[to] = balances[to].add(amount);
        Transfer(from, to, amount);
        return true;
    }

}