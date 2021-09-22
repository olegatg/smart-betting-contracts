pragma solidity ^0.8.5;
// import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./CallerContractInterface.sol";
import "hardhat/console.sol";

// contract BettingOracle is Ownable {
contract BettingOracle {
    uint256 private randNonce = 0;
    uint256 private modulus = 1000;
    mapping(uint256 => bool) pendingRequests;
    event BetPlacedEvent(
        address playerAddress,
        uint256 id,
        address bettingContractAddress
    );
    event SetCorrectHorseEvent(uint256 ethPrice, address callerAddress);

    /*
     * this function is called after user makes a bet.
     * it notifies oracle service someone waits for a response by emiting an event
     */
    function notifyAtgOnBet(address playerAddress) public returns (uint256) {
        console.log( "ORACLE: getCorrectHorse msg.sender: ", msg.sender,playerAddress);

        // in original example (https://cryptozombies.io/en/lesson/15/chapter/1) they used msg.sender, but it seems not to work

        randNonce++;
        uint256 id = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, playerAddress, randNonce)
            )
        ) % modulus;
        pendingRequests[id] = true;
        // emit an event to notify external service
        emit BetPlacedEvent(playerAddress, id, msg.sender);
        return id;
    }

    // public onlyOwner {
    function sendCorrectHorse(
        uint8 correctHorse,
        address _bettingContractAddress,
        uint256 _id
    ) public payable {
        console.log("ORACLE: sendCorrectHorse: ", correctHorse);
        require(pendingRequests[_id],"This request is not in my pending list.");
        delete pendingRequests[_id];
        console.log("ORACLE: sendCorrectHorse: calling _bettingContractAddress",_bettingContractAddress);
        CallerContracInterface callerContractInstance;
        callerContractInstance = CallerContracInterface(
            _bettingContractAddress
        );
        callerContractInstance.oracleCallback(correctHorse, _id);
        //emit SetCorrectHorseEvent(_ethPrice, _callerAddress);
    }
}
