const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@openzeppelin/test-helpers");

describe("Staking", function () {
  let Staking;
  let staking;
  let MyToken;
  let myToken;
  let owner;
  let alice;

  it("setup",async function () {
    [owner, alice] = await ethers.getSigners();

    MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.connect(owner).deploy("My Token", "MT");

    Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.connect(owner).deploy(await myToken.getAddress());

    await myToken.mint(owner, ethers.parseEther("1000"));
    await myToken.mint(alice, ethers.parseEther("1000"));
  });

  it("should stake and unstake correctly", async function () {
    await myToken.connect(owner).approve(await staking.getAddress(), ethers.parseEther("100"));
    await staking.stake(ethers.parseEther("100"));

    await time.increase(60 * 60 * 24); // Increase time by 1 day

    await staking.connect(alice).unstake();

    const aliceBalance = await myToken.balanceOf(alice);
    expect(aliceBalance).to.equal(ethers.parseEther("1000")); // Initial balance

    const stakingBalance = await myToken.balanceOf(staking.address);
    expect(stakingBalance).to.equal(0); // No tokens should be left in the staking contract
  });

  it("should calculate rewards correctly", async function () {
    await myToken.connect(alice).approve(staking.address, ethers.parseEther("100"));
    await staking.connect(alice).stake(ethers.parseEther("100"));

    await time.increase(60 * 60 * 24 * 7); // Increase time by 1 week

    await staking.connect(alice).withdraw();

    const aliceBalance = await myToken.balanceOf(alice.address);
    expect(aliceBalance).to.equal(ethers.parseEther("110")); // Initial balance + 10% reward
  });

  it("should withdraw rewards correctly", async function () {
    await myToken.connect(alice).approve(staking.address, ethers.parseEther("100"));
    await staking.connect(alice).stake(ethers.parseEther("100"));
  
    await time.increase(60 * 60 * 24); // Increase time by 1 day
  
    await staking.connect(alice).withdraw();
  
    const aliceBalance = await myToken.balanceOf(alice.address);
    expect(aliceBalance).to.equal(ethers.parseEther("101")); // Initial balance + 1% reward
  
    const stakingBalance = await myToken.balanceOf(staking.address);
    expect(stakingBalance).to.equal(0); // No tokens should be left in the staking contract
  });
  
  it("should calculate rewards correctly", async function () {
    await myToken.connect(alice).approve(staking.address, ethers.parseEther("100"));
    await staking.connect(alice).stake(ethers.parseEther("100"));
  
    await time.increase(60 * 60 * 24 * 7); // Increase time by 1 week
  
    await staking.connect(alice).withdraw();
  
    const aliceBalance = await myToken.balanceOf(alice.address);
    expect(aliceBalance).to.equal(ethers.parseEther("110")); // Initial balance + 10% reward
  });
  
  it("should calculate rewards when staking is 0", async function () {
    await time.increase(60 * 60 * 24 * 7); // Increase time by 1 week
  
    await staking.connect(alice).withdraw();
  
    const aliceBalance = await myToken.balanceOf(alice.address);
    expect(aliceBalance).to.equal(ethers.parseEther("1000")); // Initial balance remains the same
  });
  
});
