const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken contract",function(){
    it("Mint and burn", async function(){
        const [owner, signer] = await ethers.getSigners();
        const MyToken = await ethers.getContractFactory("MyToken");
        const myToken = await MyToken.deploy("My Token", "MTK");
        const quantityMintToken = 5;
        const quantityBurnToken = 3;
        const nftBalance = quantityMintToken - quantityBurnToken;

        await myToken.mint(owner.address, quantityMintToken);
        await myToken.connect(owner).burn(quantityBurnToken)
        
        expect(nftBalance).to.equal(2)
    });
})