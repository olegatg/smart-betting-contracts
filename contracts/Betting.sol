pragma solidity ^0.8.5;

import "hardhat/console.sol";

contract Betting {
    struct Bet {
        uint256 bettingValue;
        uint256 amount;
    }

    mapping(address => Bet) public bets;

    function makeBet(uint256 bettingValue) public payable returns (uint256) {
        console.log("Balance: ", msg.sender.balance);
        console.log("Betting value: ", bettingValue);
        console.log("msg sender and value: ", msg.sender, msg.value);
        Bet memory newBet = Bet(bettingValue, msg.value);
        bets[msg.sender] = newBet;

        return newBet.bettingValue;
    }

    function getBet() public view returns (uint256) {
        console.log(
            "Bet info: ",
            msg.sender,
            bets[msg.sender].bettingValue,
            bets[msg.sender].amount
        );

        return bets[msg.sender].bettingValue;
    }

    function getATGBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function deposit() public payable {
        require(msg.value == 40000000000000000);
        // nothing else to do!
    }
}
