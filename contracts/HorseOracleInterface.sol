pragma solidity ^0.8.5;

abstract contract HorseOracleInterface {
    function getCorrectHorse(address callerAddress)
        public
        virtual
        returns (uint256);
}
