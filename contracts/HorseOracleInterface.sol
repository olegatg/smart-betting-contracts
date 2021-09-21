pragma solidity ^0.8.5;

abstract contract HorseOracleInterface {
    function notifyAtgOnBet(address playerAddress)
        public
        virtual
        returns (uint256);
}
