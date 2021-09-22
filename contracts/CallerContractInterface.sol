pragma solidity ^0.8.5;

/*
 * oracle callback
 */
abstract contract CallerContracInterface {
    function oracleCallback(uint8 correctHorse, uint256 id) public virtual;
}
