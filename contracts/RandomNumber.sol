pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './DataSource.sol';

contract RandomNumber is DataSource {
    uint256 private entropy = 0;
    function RandomNumber(DataRegister _reg) DataSource(_reg) public {
        requestCost = 100; //100 natural units - 10E-4 tokens
    }

    function getData() public onlyDataRegister returns(bytes) {
        bytes32 rnd = generatePseudoRand(bytes32(block.timestamp));
        bytes memory res = new bytes(32);
        for (uint8 i = 0;i<rnd.length;i++) {
            res[i] = rnd[i];
        }
        return res;
    }

    function generatePseudoRand(bytes32 seed) private returns(bytes32) {
        uint8 pseudoRandomOffset = uint8(uint256(sha256(
        seed,
        block.difficulty,
        block.coinbase,
        block.timestamp,
        entropy
        )) & 0xff);
        // WARNING: This assumes block.number > 256... If block.number < 256, the below block.blockhash could return 0
        // This is probably only an issue in testing, but shouldn't be a problem there.
        uint256 pseudoRandomBlock = block.number - pseudoRandomOffset - 1;
        bytes32 pseudoRand = keccak256(
        block.number,
        block.blockhash(pseudoRandomBlock),
        block.difficulty,
        block.timestamp,
        entropy
        );
        entropy = uint256(keccak256(entropy, pseudoRand));
        return pseudoRand;
    }        

}
