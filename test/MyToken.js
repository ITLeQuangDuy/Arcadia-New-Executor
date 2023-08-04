// // File: MyToken.test.js
// const { ethers, upgrades } = require("hardhat");
// const { assert } = require("chai");

// describe("TestTime", () => {
//   let MyToken;
//   let myTokenInstance;
//   let owner;
//   let user;

//   beforeEach(async () => {
//     // Triển khai contract trước mỗi test case
//     [owner, user] = await ethers.getSigners();
//     MyToken = await ethers.getContractFactory("MyToken1");
//     myTokenInstance = await upgrades.deployProxy(MyToken, []);
//   });

//   it("should unlock tokens after waiting for the specified duration", async () => {
//     const amount = 100;
//     const duration = 3600; // 1 hour in seconds

//     // Lock tokens for the user
//     await myTokenInstance.lockTokens(amount, duration);

//     // Increase time by 1.5 hours using evm.increaseTime
//     await ethers.provider.send("evm_increaseTime", [duration * 1.5]);

//     // Mine a new block to update the blockchain state
//     await ethers.provider.send("evm_mine");

//     // Unlock tokens for the user
//     await myTokenInstance.unlockTokens();

//     // Check the user's balance
//     const userBalance = await myTokenInstance.balances(user.address);
//     assert.equal(userBalance, amount, "Tokens were not unlocked correctly");
//   });
// });
