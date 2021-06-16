pragma solidity ^0.8.5;

import "hardhat/console.sol";

contract Betting {
    struct Bet {
        uint8 horse;
        uint256 amount;
    }

    uint8 correctHorse = 7;
    mapping(address => Bet) public bets;
    mapping(uint8 => address) public addresses;

    event FetchCorrectHorse(uint8 id, address adr);

    uint8 currentId = 0;

    function makeBet(uint8 horse) public payable {
        require(msg.value == 5 * (10**16));
        console.log("Balance: ", msg.sender.balance);
        console.log("Horse: ", horse);
        console.log("msg sender and value: ", msg.sender, msg.value);
        // console.log(block.timestamp + 500);
        Bet memory newBet = Bet(horse, msg.value);
        bets[msg.sender] = newBet;
        addresses[currentId] = msg.sender;

        // save address;

        // race - off-chain
        // server on race finish: sendCorrectHorseOracleFnc(); -> payEveryone(addresses);

        // 1. placeBet(betId) -> checkBet(betId) -> getCorrectHorse(betId) -> ... wait for 1 week (server saves betIds) -> oracleNotifiesCorrectHorse(betId) -> checkBet() continues to pay you.
        // 2.

        // emit FetchCorrectHorse(currentId, msg.sender);

        // still do payment ???

        // await... for oracle response?

        currentId++;
    }

    /*

        if you press directly you get "race not finished"
        wait 30 sec.

        press the button -> getPayment contract -> race is finished -> how do I get correct horse from node -> pay
        you get money.

    */

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

    function payMeBackWithAddress(uint256 amountToWithdraw, address addr)
        public
        returns (bool success)
    {
        payable(addr).transfer(amountToWithdraw);
        return true;
    }

    function finishRaceAndPay(uint8 horse, uint8 id) public returns (bool) {
        console.log("Pay back to the following bet:");
        console.log(horse);
        console.log(id);
        console.log(bets[addresses[id]].horse);

        correctHorse = horse;

        if (horse == bets[addresses[id]].horse) {
            // payable(addresses[id]).transfer(10 * (10**16));
            // payMeBackWithAddress(10 * (10**16), addresses[id]);
            return true;
        }
        return false;
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
