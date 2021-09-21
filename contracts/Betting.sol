pragma solidity ^0.8.5;

import "hardhat/console.sol";

import "./HorseOracleInterface.sol";

// import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Betting {
    struct Bet {
        uint8 horse;
        uint256 amount;
    }

    uint8 private correctHorse;
    HorseOracleInterface private oracleInstance;
    address private oracleAddress;
    mapping(uint256 => bool) myRequests;
    event NewOracleAddressEvent(address oracleAddress);
    event ReceivedNewRequestIdEvent(uint256 id);
    event ReceivedCorrectHorseEvent(uint256 horseNumber, uint256 id);

    mapping(uint256 => Bet) public bets;
    mapping(uint256 => address) public addresses;

    event FetchCorrectHorse(uint8 id, address adr);

    /*
     * need to set this first from the oracle account
     */
    function setOracleInstanceAddress(address _oracleInstanceAddress)
        public
    //   onlyOwner
    {
        oracleAddress = _oracleInstanceAddress;
        oracleInstance = HorseOracleInterface(oracleAddress);
        emit NewOracleAddressEvent(oracleAddress);
    }

    /*
     * Called by an oracle service, potentially after a long time?
     */
    function oracleCallback(uint8 _horseNumber, uint256 _id) public onlyOracle {
        console.log("Oracle callback executed");
        require(myRequests[_id], "This request is not in my pending list.");
        correctHorse = _horseNumber;
        delete myRequests[_id];
        emit ReceivedCorrectHorseEvent(_horseNumber, _id);

        if (bets[_id].horse == correctHorse) {
            console.log(bets[_id].horse);
            console.log("Correct horse!");
            payMeBack(10 * (10**16), addresses[_id]);
            return;
        }
        console.log("No money today");
    }

    modifier onlyOracle() {
        require(
            msg.sender == oracleAddress,
            "You are not authorized to call this function."
        );
        _;
    }

    function makeBet(uint8 horse) public payable {
        require(msg.value == 5 * (10**16));
        console.log("Balance: ", msg.sender.balance);
        console.log("Horse: ", horse);
        console.log("msg sender and value: ", msg.sender, msg.value);

        // console.log(block.timestamp + 500);

        Bet memory newBet = Bet(horse, msg.value);

        // bet is made. now request correct horse. oracle will call callback.
        uint256 id = oracleInstance.getCorrectHorse(msg.sender); // notify "oracle" that someone waits for it.
        myRequests[id] = true;

        bets[id] = newBet;
        addresses[id] = msg.sender;
    }

    /*
     * User [1] makes a bet
     * Notify Oracle that user [1] is in a bet.

     * time goes on...
     * users [2], [3] join.
     *
     * race starts
     * race finishes
     * "oracle service" will for each user trigger a callback
    */

    function payMeBack(uint256 amountToWithdraw, address addr)
        public
        returns (bool success)
    {
        payable(addr).transfer(amountToWithdraw);
        return true;
    }

    function getATGBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // function checkBet() public returns (string memory) {
    //     if (bets[msg.sender].horse == correctHorse) {
    //         console.log(bets[msg.sender].horse);
    //         console.log("Correct horse!");
    //         payMeBack(10 * (10**16));
    //         return "Money! Correct horse!";
    //     }
    //     console.log("No money today");
    //     return "No money today";
    // }
}
