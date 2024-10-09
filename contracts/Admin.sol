// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Admin {
    address public admin;

    constructor() {
        admin = msg.sender;   
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not Allowed");
        _;
    }
}
