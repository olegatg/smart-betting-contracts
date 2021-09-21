pragma solidity ^0.8.5;

import "hardhat/console.sol";

import "./HorseOracleInterface.sol";

// import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Betting {
    enum BetStatus{NEW,REGISTERED,PAID}
    struct Bet {
        uint8 horse;
        uint256 amount;
        address playerAddress;
        BetStatus status;
    }
    HorseOracleInterface public oracleInstance;

    uint8 public correctHorse;
    address public oracleAddress;

    mapping(uint256 => Bet) public registeredBets;
    mapping(uint8 => uint256) public horseDistribution;

     /*
     * need to set this first from the oracle account
     */
    function setOracleInstanceAddress(address _oracleInstanceAddress)
        public
    //   onlyOwner
    {
        oracleAddress = _oracleInstanceAddress;
        oracleInstance = HorseOracleInterface(oracleAddress);
    }

    function makeBet(uint8 horse) public payable {
        require(msg.value == 0.05 ether);
        console.log("Balance: ", msg.sender.balance);
        console.log("Horse: ", horse);
        console.log("msg sender and value: ", msg.sender, msg.value);

        Bet memory newBet = Bet(horse, msg.value, msg.sender, BetStatus.NEW);

        // bet is made. now request correct horse. oracle will call callback.
        uint256 id = oracleInstance.notifyAtgOnBet(msg.sender); // notify "oracle" that someone waits for it.
        registeredBets[id] = newBet;
        horseDistribution[horse]++;
    }

    /*
     * Called by an oracle service, potentially after a long time?
     */
    function oracleCallback(uint8 _horseNumber, uint256 _id) public onlyOracle {
        console.log("Oracle callback executed");
        require(registeredBets[_id].horse > 0, "This request is not in my pending list ");
        require(registeredBets[_id].status !=  BetStatus.PAID, "This request is already paid out");
        correctHorse = _horseNumber;
        delete registeredBets[_id];

        if (registeredBets[_id].horse == correctHorse) {
            console.log(registeredBets[_id].playerAddress);
            console.log("Correct horse!", registeredBets[_id].horse);
            // calculate
            payMeBack(address(this).balance/horseDistribution[correctHorse], registeredBets[_id].playerAddress);
            return;
        }
        console.log("No money today");
    }

    function payMeBack(uint256 amountToWithdraw, address addr) public returns (bool success)
    {
        payable(addr).transfer(amountToWithdraw);
        return true;
    }

    function getATGBalance() public view returns (uint256) {
        return address(this).balance;
    }

    modifier onlyOracle() {
        require(
            msg.sender == oracleAddress,
            "You are not authorized to call this function."
        );
        _;
    }
}
