pragma solidity ^0.4.17;

contract GameTour {
    uint8  public bits;
    address[10] public winners;
    uint32 public nextIndex;
    uint32 public freeTickets;
    address[256] public tickets;
    uint32 public gameNumber;
    
  

    function GameTour(uint32 _gameNumber,uint8 _bits) public {
        bits = _bits;
        freeTickets = uint32(2) ** bits;
        //tickets = new address[](freeTickets);
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
        return curTick;
    }
    function processWinners(uint32[] winningIndexes) public returns (address[10]) {
        for (uint i = 0;i < winningIndexes.length;i++) {
            winners[i] = tickets[winningIndexes[i]];
        }
        return winners;
    }
    
    function getWinners() view public returns (address[10]) {
        return winners;
    }
}