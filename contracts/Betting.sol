pragma solidity ^0.8.5;

import "hardhat/console.sol";

contract Betting {
    struct Bet {
        uint256 betted;
        uint256 amount;
    }

    mapping(address => Bet) public bets;

    function makeBet(uint256 _outcome) public payable returns (uint256) {
        Bet memory newBet = Bet(_outcome, msg.value);
        bets[msg.sender] = newBet;
        console.log("Bets: ", msg.value, _outcome);
        return 987;
        // console.log(bets[msg.sender].outcome);
        // return bets[msg.sender].outcome;
        // return bets[msg.sender] = newBet;
    }

    function getBet() public view returns (uint256) {
        // return bets[msg.sender].outcome;
        return 1235;
    }
}
