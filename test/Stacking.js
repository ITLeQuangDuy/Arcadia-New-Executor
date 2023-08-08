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
        await myToken.connect(owner).burn(quantityBurnToken);

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

    //Staking
    it("Staking: Cannot stake 0", async function(){
        await expect(staking.connect(owner).stake(0)).to.be.revertedWith("Cannot stake 0");
    });

    it("UnStake: No staked amount", async function(){
        await expect(staking.connect(owner).unstake()).to.be.revertedWith("No staked amount");
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
        await expect(staking.connect(owner).withdraw()).to.be.revertedWith("No reward to claim");
    });
})