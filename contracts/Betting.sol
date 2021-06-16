pragma solidity ^0.8.5;

import "hardhat/console.sol";

contract Betting {
    struct Bet {
        uint256 horse;
        uint256 amount;
    }
    uint256 correctHorse = 7;
    mapping(address => Bet) public bets;

    event FetchCorrectHorse(address id);

    function makeBet(uint256 horse) public payable {
        require(msg.value == 5 * (10**16));
        console.log("Balance: ", msg.sender.balance);
        console.log("Horse: ", horse);
        console.log("msg sender and value: ", msg.sender, msg.value);
        // console.log(block.timestamp + 500);
        Bet memory newBet = Bet(horse, msg.value);
        bets[msg.sender] = newBet;
        // save address;

        // race - off-chain
        // server on race finish: sendCorrectHorseOracleFnc(); -> payEveryone(addresses);

        // 1. placeBet(betId) -> checkBet(betId) -> getCorrectHorse(betId) -> ... wait for 1 week (server saves betIds) -> oracleNotifiesCorrectHorse(betId) -> checkBet() continues to pay you.
        // 2.

        emit FetchCorrectHorse(msg.sender);
    }

    function checkBet() public returns (string memory) {
        if (bets[msg.sender].horse == correctHorse) {
            console.log(bets[msg.sender].horse);
            console.log("Correct horse!");
            payMeBack(10 * (10**16));
            return "Money! Correct horse!";
        }
        console.log("No money today");
        return "No money today";
    }

    function payMeBack(uint256 amountToWithdraw) public returns (bool success) {
        console.log("AAAA ", msg.sender);
        payable(msg.sender).transfer(amountToWithdraw);
        return true;
    }

    function finishRaceAndPay(uint256 correctHorse, address adr)
        public
        returns (bool)
    {
        console.log(correctHorse);
        console.log(bets[adr].horse);
        console.log(adr);
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
