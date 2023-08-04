const { expect } = require("chai");
const { ethers } = require("hardhat");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

describe("MyToken contract",function(){
    it("Mint and burn", async function(){
        const [owner, signer] = await ethers.getSigners();
        const MyToken = await ethers.getContractFactory("MyToken");
        const myToken = await MyToken.deploy("My Token", "MTK");
        const quantityMintToken = 5;
        const quantityBurnToken = 3;
        const nftBalance = quantityMintToken - quantityBurnToken;

        await myToken.mint(owner.address, quantityMintToken);
        //console.log("quantity before mint token:", await myToken.balanceOf(owner.address));
        await myToken.connect(owner).burn(quantityBurnToken)
        //console.log("quantity after mint token:", await myToken.balanceOf(owner.address));
        expect(nftBalance).to.equal(2)
    });
})


describe("Staking contract",function(){
    let owner;
    let signer;
    let myToken;
    let staking;

    it("Deploy", async function(){
        [owner, signer] = await ethers.getSigners();
        const MyToken = await ethers.getContractFactory("MyToken");
        myToken = await MyToken.deploy("My Token", "MTK");   
        const addr = await myToken.getAddress();
        const Staking = await ethers.getContractFactory("Staking");
        staking = await Staking.deploy(addr);
    });

    it("Staking", async function(){
        // mint 
        await myToken.mint(owner, ethers.parseEther("100"));
        
        //approve cho hợp đồng staking 
        const initialStakeAmount = ethers.parseEther("10");
        const totalAmountTransfer = ethers.parseEther("50");

        const addr = await staking.getAddress();
        await myToken.connect(owner).approve(addr, initialStakeAmount);
        await myToken.connect(owner).mint(addr, totalAmountTransfer);
        
        //Stake
        await staking.connect(owner).stake(initialStakeAmount);

        const duration = 3600;
        await ethers.provider.send("evm_increaseTime", [duration]);

        //unStake
        await staking.connect(owner).unstake();
        const calculateStackProfit =  (initialStakeAmount * BigInt(1) * BigInt(duration) / BigInt(1000000));
        const rewardAmount = await staking.rewardAmount1(owner);
        expect (calculateStackProfit).to.equal(rewardAmount);
    })

    it("WithdRraw", async function(){
        await myToken.connect(owner).approve(staking.address, ethers.parseEther("100"));
        await staking.connect(staking.address).stake(ethers.parseEther("100"));

        await time.increase(60 * 60 * 24 * 7); // Increase time by 1 week

        await staking.connect(signer).withdraw();

        const aliceBalance = await myToken.balanceOf(signer.address);
        expect(aliceBalance).to.equal(ethers.parseEther("110"));
    });

    it("", async function(){

    })  
})