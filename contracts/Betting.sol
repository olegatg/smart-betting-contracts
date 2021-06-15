pragma solidity ^0.8.5;

import "hardhat/console.sol";

contract Betting {
    struct Bet {
        uint256 horse;
        uint256 amount;
    }
    uint256 correctHorse = 7;
    mapping(address => Bet) public bets;

    function makeBet(uint256 horse) public payable {
        require(msg.value == 50000000000000000);
        console.log("Balance: ", msg.sender.balance);
        console.log("Horse: ", horse);
        console.log("msg sender and value: ", msg.sender, msg.value);
        // console.log(block.timestamp + 500);
        Bet memory newBet = Bet(horse, msg.value);
        bets[msg.sender] = newBet;
    }

    function checkBet() public view returns (string memory) {
        if (bets[msg.sender].horse == correctHorse) {
            console.log(bets[msg.sender].horse);
            console.log("COrrect horse!");
            return "Money! Correct horse!";
        }
        console.log("No money today");
        return "No money today";
    }

    function getBet() public view returns (uint256) {
        console.log(
            "Bet info: ",
            msg.sender,
            bets[msg.sender].horse,
            bets[msg.sender].amount
        );

        return bets[msg.sender].horse;
    }

    function makeContractRich() public payable {}

    function getATGBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // function payUser () {
    //     call(userAddress) 100
    // }
}
