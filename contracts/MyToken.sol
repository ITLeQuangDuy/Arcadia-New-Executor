// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyToken1 {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public lockTime;

    function lockTokens(uint256 amount, uint256 duration) public {
        require(amount <= balances[msg.sender], "Insufficient balance");
        require(duration > 0, "Duration must be greater than 0");

        balances[msg.sender] -= amount;
        balances[address(this)] += amount;
        lockTime[msg.sender] = block.timestamp + duration;
    }

    function unlockTokens() public {
        require(block.timestamp >= lockTime[msg.sender], "Tokens are still locked");
        uint256 amount = balances[address(this)];
        balances[address(this)] = 0;
        balances[msg.sender] += amount;
    }
}
