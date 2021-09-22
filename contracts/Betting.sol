pragma solidity ^0.8.5;

import "hardhat/console.sol";

import "./HorseOracleInterface.sol";

// import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Betting {
    enum BetStatus {
        NEW,
        REGISTERED,
        PAID
    }
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

    address atgAccount = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

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
        require(msg.value == 1 ether);
        console.log("Balance: ", msg.sender.balance);
        console.log("Horse: ", horse);
        console.log("msg sender and value: ", msg.sender, msg.value);

        // take a share for atg.
        payable(atgAccount).transfer(0.3 ether);

        Bet memory newBet = Bet(horse, msg.value, msg.sender, BetStatus.NEW);

        // bet is made. now request correct horse. oracle will call callback.
        uint256 id = oracleInstance.notifyAtgOnBet(msg.sender); // notify "oracle" that someone waits for it.
        registeredBets[id] = newBet;
        horseDistribution[horse]++;
    }

    function resetBets() public {
        console.log("will reset the bets.");

        // reset bets in atg server
        oracleInstance.resetBets();

        horseDistribution[1] = 0;
        horseDistribution[2] = 0;
        horseDistribution[3] = 0;
        horseDistribution[4] = 0;
        horseDistribution[5] = 0;
        horseDistribution[6] = 0;
        horseDistribution[7] = 0;
        horseDistribution[8] = 0;
        horseDistribution[9] = 0;
        horseDistribution[10] = 0;
        horseDistribution[11] = 0;
        horseDistribution[12] = 0;
        horseDistribution[13] = 0;
        horseDistribution[14] = 0;
        horseDistribution[15] = 0;
        horseDistribution[16] = 0;
    }

    /*
     * Called by an oracle service, potentially after a long time?
     */
    function oracleCallback(uint8 _correctHorseNumber, uint256 _id)
        public
        onlyOracle
    {
        console.log("Oracle callback executed");
        require(
            registeredBets[_id].horse > 0,
            "This request is not in my pending list "
        );
        require(
            registeredBets[_id].status != BetStatus.PAID,
            "This request is already paid out"
        );
        correctHorse = _correctHorseNumber;

        registeredBets[_id].status = BetStatus.PAID; // just to not pay again.
        if (registeredBets[_id].horse == _correctHorseNumber) {
            console.log("Correct horse!", registeredBets[_id].horse);
            // calculate
            payMeBack(
                address(this).balance / horseDistribution[_correctHorseNumber],
                registeredBets[_id].playerAddress
            );
        } else {
            console.log("No money today");
        }
    }

    function payMeBack(uint256 amountToWithdraw, address addr)
        public
        returns (bool success)
    {
        console.log("Pay back to ", addr);
        console.log("Will pay ", amountToWithdraw);
        payable(addr).transfer(amountToWithdraw);
        return true;
    }

    function getATGBalance() public view returns (uint256) {
        return address(atgAccount).balance;
    }

    function getPoolBalance() public view returns (uint256) {
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
