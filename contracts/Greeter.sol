//SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "hardhat/console.sol";

contract Greeter {
    string greeting;
    mapping(address => uint256) balances;
    mapping(address => uint256) public balanceOf;

    constructor(string memory _greeting) {
        console.log(address(this).balance);
        console.log("Deploying a Greeter from Oleg with greeting:", _greeting);
        greeting = _greeting;
    }

    function greet() public view returns (uint256 test) {
        console.log("Oleg");
        console.log(balanceOf[msg.sender]);

        // return address(this).balance;
        return balanceOf[msg.sender];
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }
}
