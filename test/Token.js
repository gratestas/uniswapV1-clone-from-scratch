const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (value) => ethers.utils.parseEther(value.toString());

describe("Token contract", async () => {
  it("Deployment should assign the name, symbol and total supply of token", async () => {
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy("MuuToken", "MUU", toWei(100000));
    await token.deployed();

    const tokenName = await token.name();
    expect(tokenName).to.equal("MuuToken");

    const tokenSymbok = await token.symbol();
    expect(tokenSymbok).to.equal("MUU");

    const totalSupply = await token.totalSupply();
    //expect(initialSupply).to.equal()
  });
});
