pragma solidity ^0.4.17; 

import './TradedToken.sol';
import './GameTour.sol';



contract Simplotoken is TradedToken {

    string public constant name = "Simplotoken";
    string public constant symbol = "SLT";
    uint8 public constant decimals = 0;
    uint256 public constant INITIAL_SUPPLY = 1000000 * (10 ** uint256(decimals));

    uint32 public currentGameNumber = 0;
    GameTour public tour;
    mapping (uint => GameTour) public prevTours;
    
    //change simultaneously
    uint32 public constant PAYOUT_SIZE = 10;
    uint8[10] public payouts = [uint8(30),20,15,10,8,6,5,3,2,1];
    
    uint8 public bits = 8;
    bytes32 private accumulatedEntropy;

    event TicketBought(uint tourNumber, uint tickNumber,uint freeTickets);
    event TourStarted(uint tourNumber,uint freeTickets);
    event TourClosed(uint tourNumber, address[10] winners);

    function Simplotoken(uint8 _bits) public {
        totalSupply = INITIAL_SUPPLY;
        balances[msg.sender] = totalSupply;
        bits = _bits;
        tour = new GameTour(currentGameNumber,bits);
        accumulatedEntropy = block.blockhash(block.number-1);
        TourStarted(currentGameNumber,tour.freeTickets());
    }

    
    function generatePseudoRand(bytes32 seed) private returns(bytes32) {
        uint8 pseudoRandomOffset = uint8(uint256(sha256(
        seed,
        block.difficulty,
        block.coinbase,
        block.timestamp,
        accumulatedEntropy
        )) & 0xff);
        // WARNING: This assumes block.number > 256... If block.number < 256, the below block.blockhash could return 0
        // This is probably only an issue in testing, but shouldn't be a problem there.
        uint256 pseudoRandomBlock = block.number - pseudoRandomOffset - 1;
        bytes32 pseudoRand = keccak256(
        block.number,
        block.blockhash(pseudoRandomBlock),
        block.difficulty,
        block.timestamp,
        accumulatedEntropy
        );
        accumulatedEntropy = keccak256(accumulatedEntropy, pseudoRand);
        return pseudoRand;
    }

    function buyTicket() public returns (uint) {
        require(balances[msg.sender]>=1);
        if (tour.freeTickets() > 0) {
            //decrease balance by 1 coin
            transfer(this,1);
        } else {
            //sell 1 coin to pay transaction commission
            sell(1);
            //close current game
            closeGame();
            //start another game
            startGame();
            
        }
        uint tickNumber = tour.addTicketSeq(msg.sender);
        TicketBought(currentGameNumber, tickNumber, tour.freeTickets());
        return tickNumber;
    }
    
    function getFreeTickets() public view returns (uint) {
        return tour.freeTickets();
    }
 
    function closeGame() private {
        //we need coins to payout 
        uint32 lastTickIndex = uint32(2)**bits - 1;
        require(this.balance >= lastTickIndex+1);
        uint32 pseudoRand = uint32(generatePseudoRand(bytes32(block.timestamp)));
        uint32[] memory indexes = new uint32[](payouts.length);
        for (uint i = 0;i < payouts.length;i++) {
            //too much right shifts is not a problem because we don't plan to have more than 65525 tickets
            indexes[i] = (pseudoRand & (lastTickIndex << (i+1))) >> (i+1);  
        }
        //normalize indexes. If index already exists - increment it.
        address[] memory visitedIndexes = new address[](lastTickIndex+1);
        for (i = 0;i<indexes.length;i++) {
            if (visitedIndexes[indexes[i]] != 0) {
                bool found = false;
                uint32 newIndex = indexes[i];
                for (uint j = 0;!found && j < indexes.length;j++) {
                    newIndex++;
                    if (newIndex>lastTickIndex) 
                        newIndex = 0;
                    if (visitedIndexes[newIndex]==0) 
                        found = true;
                }
                if (found) 
                    indexes[i] = newIndex;
            } 
            visitedIndexes[indexes[i]]==1;
        }
        delete visitedIndexes;
        tour.processWinners(indexes);
        payoutWinners();
        TourClosed(currentGameNumber, tour.getWinners());
    }

    function payoutWinners() private {
        uint32 tickCount = uint32(2)**bits;
        require(this.balance >= tickCount);
        var winners = tour.getWinners();
        for (uint i = 0;i < winners.length ; i++) {
            uint payout = uint256(tickCount).mul(payouts[i]).div(100); //get ticket payout
            //send from this balance to winner balance;
            _transferInternal(this,winners[i],payout);
        }
    }

    function startGame() private {
        prevTours[currentGameNumber] = tour;
        currentGameNumber++;
        tour = new GameTour(currentGameNumber,bits);
        TourStarted(currentGameNumber,tour.freeTickets());
    }

    function _transferInternal(address from, address to, uint amount) private {
        require(balances[from] >= amount);
        balances[to] = balances[to] + amount;
        balances[from] = balances[from] - amount;
    }

 
}
