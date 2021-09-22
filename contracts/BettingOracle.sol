pragma solidity ^0.8.5;
// import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./CallerContractInterface.sol";
import "hardhat/console.sol";

// contract BettingOracle is Ownable {
contract BettingOracle {
    uint256 private idCounter = 1;
    mapping(uint256 => bool) pendingRequests;
    event BetPlacedEvent(
        address playerAddress,
        uint256 id,
        address bettingContractAddress
    );
    event SetCorrectHorseEvent(uint256 ethPrice, address callerAddress);
    event ResetBetsEvent();

    /*
     * this function is called after user makes a bet.
     * it notifies oracle service someone waits for a response by emiting an event
     */
    function notifyAtgOnBet(address playerAddress) public returns (uint256) {
        console.log(
            "ORACLE: getCorrectHorse msg.sender: ",
            msg.sender,
            playerAddress
        );

        idCounter++;
        uint256 id = idCounter;

        pendingRequests[id] = true;
        // emit an event to notify external service
        emit BetPlacedEvent(playerAddress, id, msg.sender);
        return id;
    }

    function resetBets() public {
        emit ResetBetsEvent();
    }

    // public onlyOwner {
    function sendCorrectHorse(
        uint8 correctHorse,
        address _bettingContractAddress,
        uint256 _id
    ) public payable {
        console.log("ORACLE: sendCorrectHorse: ", correctHorse);
        require(
            pendingRequests[_id],
            "This request is not in my pending list."
        );
        delete pendingRequests[_id];
        console.log(
            "ORACLE: sendCorrectHorse: calling _bettingContractAddress",
            _bettingContractAddress
        );
        CallerContracInterface callerContractInstance;
        callerContractInstance = CallerContracInterface(
            _bettingContractAddress
        );
        callerContractInstance.oracleCallback(correctHorse, _id);
        //emit SetCorrectHorseEvent(_ethPrice, _callerAddress);
    }
}
