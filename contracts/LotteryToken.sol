pragma solidity ^0.4.17;

import './TradedToken.sol';

contract GameTour {
    uint32 gameNumber;
    uint8  bits;
    address[10] private winners;
    uint32 private nextIndex;
    uint32 private freeTickets;
    address[] private tickets;
    
    event TourFinished();

    function GameTour(uint32 _gameNumber,uint8 _bits) public {
        bits = _bits;
        uint32 b = _bits;
        freeTickets = 2 ** b;
        tickets = new address[](freeTickets);
        nextIndex = 0;
        gameNumber = _gameNumber;
    }

    function addTicketSeq(address _player) public returns (uint32 curTick) {
        if (freeTickets == 0) { 
            curTick = nextIndex;
        } else {
            freeTickets--;
            tickets[nextIndex] = _player;
            curTick = nextIndex++;
        }
        return result;
    }
    function getTickets() public returns (address[]) {
        return tickets;
    }
    function getWinners() public returns (address[10]) {
        return winners;
    }
    function processWinners(uint32[10] winningIndexes) public returns (address[10]) {
        for (uint i = 0;i < 10;i++) {
            winners[i] = tickets[winningIndexes[i]];
        }
        return winners;
    }
    function getFreeTickets() returns (uint32) {
        return freeTickets;
    }
}

contract Simplotoken is TradedToken {

    string public constant name = "Simplotoken";
    string public constant symbol = "SLT";
    uint8 public constant decimals = 1;
    uint256 public constant INITIAL_SUPPLY = 1000000 * (10 ** uint256(decimals));

    uint currentGameNumber = 0;
    GameTour tour;
    mapping (uint => GameTour) prevTours;
    uint[10] payouts = (uint(30),20,15,10,8,6,5,3,2,1);
    uint8 bits = 8;

    event TicketBought(uint tickNumber);
    event TourStarted(uint tourNumber);
    event TourClosed(address[10] winners);

    function Simplotoken() {
        totalSupply = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        tour = new GameTour(currentGameNumber,bits);
    }

    function buyTicket() returns (uint) {
        require(balances[msg.sender]>=1);
        if (tour.getFreeTickets() > 0) {
            //decrease balance by 1 coin
            balances[msg.sender].sub(1);
        } else {
            //sell 1 coin to pay transaction commission
            sell(1);
            //close current game
            closeGame();
            //start another game
            startGame();
            
        }
        uint tickNumber = tour.addTicketSeq(msg.sender);
        TicketBought(tickNumber);
        return tickNumber;
    }
    
    function closeGame() private {
        

    }
    function startGame() private {
        prevTours[currentGameNumber] = tour;
        currentGameNumber++;
        tour = new GameTour(currentGameNumber,bits);
        TourStarted(currentGameNumber);
    }
 
}
