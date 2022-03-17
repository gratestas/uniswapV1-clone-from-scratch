require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (value) => ethers.utils.parseEther(value.toString());

const fromWei = (value) =>
  ethers.utils.formatEther(
    typeof value === "string" ? value : value.toString()
  );

const getBalance = ethers.provider.getBalance;

const createExchange = async (factory, tokenAddress, sender) => {
  const exchangeAddress = await factory
    .connect(sender)
    .callStatic.createExchange(tokenAddress);

  await factory.connect(sender).createExchange(tokenAddress);

  const Exchange = await ethers.getContractFactory("Exchange");

  return Exchange.attach(exchangeAddress);
};

describe("Exchange", () => {
  let owner, user, exchange;
  let actualDifference, expectedDifference;
  const tolerance = 0.0001;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Token", "TKN", toWei(1000000));
    await token.deployed();

    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy(token.address);
    await exchange.deployed();
  });

  it("is deployed", async () => {
    expect(await exchange.deployed()).to.equal(exchange);
  });

  describe("addLiquidity", async () => {
    describe("when pool is empty", async () => {
      it("sets the initial exchange rate by depositing 200 tokens and 100 ethers on exchange", async () => {
        await token.approve(exchange.address, toWei(200));
        await exchange.addLiquidity(toWei(200), { value: toWei(100) });

        expect(await getBalance(exchange.address)).to.equal(toWei(100));
        expect(await exchange.getReserve()).to.equal(toWei(200));
      });

      it("mints LP-tokens", async () => {
        await token.approve(exchange.address, toWei(500));
        await exchange.addLiquidity(toWei(500), { value: toWei(10) });

        expect(await exchange.balanceOf(owner.address)).to.eq(toWei(10));
        expect(await exchange.totalSupply()).to.eq(toWei(10));
      });
    });
    describe("when pool already exists", async () => {
      beforeEach(async () => {
        await token.approve(exchange.address, toWei(700));
        await exchange.addLiquidity(toWei(500), { value: toWei(10) });
      });
      it("adds additional liquidity at the current exchange rate", async () => {
        await exchange.addLiquidity(toWei(200), { value: toWei(2) });

        const exchangeEthBalance = await getBalance(exchange.address);
        expect(exchangeEthBalance).to.equal(toWei(12));

        const exchangeTokenBalance = await exchange.getReserve();
        expect(fromWei(exchangeTokenBalance)).to.equal("600.0");
      });

      it("mints LP-tokens", async () => {
        await exchange.addLiquidity(toWei(500), { value: toWei(3) });

        expect(await exchange.balanceOf(owner.address)).to.eq(toWei(13));
        expect(await exchange.totalSupply()).to.eq(toWei(13));
      });

      it("fails when not enough tokens", async () => {
        await expect(
          exchange.addLiquidity(toWei(50), { value: toWei(10) })
        ).to.be.revertedWith("insufficient token amount");
      });
    });
  });

  describe("removeLiquidity", async () => {
    beforeEach(async () => {
      await token.approve(exchange.address, toWei(300));
      await exchange.addLiquidity(toWei(200), { value: toWei(100) });
    });
    it("removes some liquidity", async () => {
      const userEthBalanceBefore = await getBalance(owner.address);
      const userTokenBalanceBefore = await token.balanceOf(owner.address);
      await exchange.removeLiquidity(toWei(25));

      expect(await exchange.getReserve()).to.equal(toWei(150));
      expect(await getBalance(exchange.address)).to.equal(toWei(75));

      const userEthBalanceAfter = await getBalance(owner.address);
      const userTokenBalanceAfter = await token.balanceOf(owner.address);

      expectedDifference = 24.999934722436531782; // 25 - gas fees
      actualDifference = fromWei(userEthBalanceAfter.sub(userEthBalanceBefore));

      expect(actualDifference - expectedDifference).to.be.most(tolerance);
      expect(
        fromWei(userTokenBalanceAfter.sub(userTokenBalanceBefore))
      ).to.equal("50.0");
    });
  });

  describe("LP reward", async () => {
    it("adds liquidity,swaps token and removes liquidity", async () => {
      //liquidity provider deposits 100 ethers and 200 tokens
      await token.approve(exchange.address, toWei(300));
      await exchange.addLiquidity(toWei(200), { value: toWei(100) });

      const userEthBalanceBefore = await getBalance(user.address);

      // owner swaps 10 ethers and expects to get at least 18 tokens in exchange
      const tokensOut = fromWei(await exchange.tokenAmountPurchased(toWei(10)));

      const slippage = 0.99;
      const tokensOut_min = tokensOut * slippage;

      await exchange
        .connect(user)
        .ethToTokenSwap(toWei(tokensOut_min), { value: toWei(10) });

      const userEthBalanceAfter = await getBalance(user.address);

      expectedDifference = 10;
      actualDifference = fromWei(userEthBalanceBefore.sub(userEthBalanceAfter));
      expect(actualDifference - expectedDifference).to.be.most(tolerance);

      const userTokenBalance = await token.balanceOf(user.address);
      expect(fromWei(userTokenBalance)).to.eq("18.01637852593266606");

      const ownerEtherBalanceBefore = await getBalance(owner.address);
      const ownerTokenBalanceBefore = await token.balanceOf(owner.address);

      // Liquidity provider then removes the liquidity
      await exchange.removeLiquidity(toWei(100));

      expect(await exchange.getReserve()).to.equal(toWei(0));
      expect(await getBalance(exchange.address)).to.equal(toWei(0));

      const ownerEtherBalanceAfter = await getBalance(owner.address);
      const ownerTokenBalanceAfter = await token.balanceOf(owner.address);

      expectedDifference = 109.999948428332725665; // 25 - gas fees
      actualDifference = fromWei(
        ownerEtherBalanceAfter.sub(ownerEtherBalanceBefore)
      );
      expect(actualDifference - expectedDifference).to.be.most(tolerance);

      expect(
        fromWei(ownerTokenBalanceAfter.sub(ownerTokenBalanceBefore))
      ).to.equal("181.98362147406733394");
    });
  });

  describe("getPrice", async () => {
    it("returns correct prices", async () => {
      await token.approve(exchange.address, toWei(2000));
      await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });

      const tokenReserve = await exchange.getReserve();
      const etherReserve = await getBalance(exchange.address);

      // ETH per token
      expect(
        (await exchange.getPrice(etherReserve, tokenReserve)).toString()
      ).to.eq("500");

      // Token per ETH
      expect(await exchange.getPrice(tokenReserve, etherReserve)).to.eq(2000);
    });
  });

  describe("constant product formula", () => {
    it("should return correct amount of purchased ether", async () => {
      await token.approve(exchange.address, toWei(2000));
      await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });

      const etherPurchased = await exchange.ethAmountPurchased(toWei(2));
      expect(fromWei(etherPurchased)).to.eq("0.989020869339354039");
    });

    it("should return correct amount of purchased token", async () => {
      await token.approve(exchange.address, toWei(500));
      await exchange.addLiquidity(toWei(500), { value: toWei(10) });

      const tokenPurchased = await exchange.tokenAmountPurchased(toWei(1));
      expect(fromWei(tokenPurchased)).to.eq("45.04094631483166515");
    });

    it("prevents the pool from being drained", async () => {
      await token.approve(exchange.address, toWei(500));
      await exchange.addLiquidity(toWei(500), { value: toWei(10) });

      const tokenReserve = await exchange.getReserve();

      const tokenPurchased = await exchange.tokenAmountPurchased(toWei(10));
      expect(fromWei(tokenPurchased.toString())).to.not.eq(
        tokenReserve.toString()
      );
    });
  });

  describe("ethToTokenSwap", async () => {
    beforeEach(async () => {
      await token.approve(exchange.address, toWei(500));
      await exchange.addLiquidity(toWei(500), { value: toWei(10) });
    });

    it("transfers at least min amount of tokens ", async () => {
      const userBalanceBefore = await getBalance(user.address);
      await exchange
        .connect(user)
        .ethToTokenSwap(toWei(1.99), { value: toWei(1) });

      const userBalanceAfter = await getBalance(user.address);

      expectedDifference = 1.0000637154788639;
      actualDifference = fromWei(userBalanceBefore - userBalanceAfter);
      expect(actualDifference - expectedDifference).to.be.most(tolerance);
    });

    it("transfers at least min amount of tokens ", async () => {
      //user's balance of ether before swap transaction
      const userBalanceBefore = await getBalance(user.address);
      await exchange
        .connect(user)
        .ethToTokenSwap(toWei(45), { value: toWei(1) });

      //user's balance of ether after swap transaction
      const userBalanceAfter = await getBalance(user.address);

      expectedDifference = 1.0000637030133924;
      actualDifference = fromWei(userBalanceBefore - userBalanceAfter);

      expect(actualDifference - expectedDifference).to.be.most(tolerance);

      const userTokenBalance = await token.balanceOf(user.address);
      expect(fromWei(userTokenBalance)).to.eq("45.04094631483166515");

      const exchangeEthBalance = await getBalance(exchange.address);
      expect(fromWei(exchangeEthBalance)).to.eq("11.0");

      const exchangeTokenBalance = await token.balanceOf(exchange.address);
      expect(fromWei(exchangeTokenBalance)).to.eq("454.95905368516833485");
    });

    it("fails when output amount is less than expected min amount", async () => {
      await expect(
        exchange.connect(user).ethToTokenSwap(toWei(46), { value: toWei(1) })
      ).to.be.revertedWith("insufficient output amount of token");
    });
  });

  describe("tokenToEthSwap", async () => {
    beforeEach(async () => {
      await token.transfer(user.address, toWei(10));
      await token.connect(user).approve(exchange.address, toWei(10));

      await token.approve(exchange.address, toWei(500));
      await exchange.addLiquidity(toWei(500), {
        value: toWei(10),
      });
    });
    it("transfers at least min amount of ether", async () => {
      const userBalanceBefore = await getBalance(user.address);

      await exchange.connect(user).tokenToEthSwap(toWei(10), toWei(0.19));
      const userBalanceAfter = await getBalance(user.address);

      expectedDifference = 0.1941037668200612;
      actualDifference = fromWei(userBalanceAfter - userBalanceBefore);
      expect(actualDifference - expectedDifference).to.be.most(tolerance);

      const userTokenBalance = await token.balanceOf(user.address);
      expect(fromWei(userTokenBalance)).to.equal("0.0");

      const exchangeTokenBalance = await token.balanceOf(exchange.address);
      expect(fromWei(exchangeTokenBalance)).to.equal("510.0");

      const exchangeEthBalance = await getBalance(exchange.address);
      expect(fromWei(exchangeEthBalance)).to.equal("9.805844283192782899");
    });

    it("fails when output amount of ether is less than expected min amount", async () => {
      await expect(
        exchange.connect(user).tokenToEthSwap(toWei(10), toWei(0.2))
      ).to.be.revertedWith("insufficient output amount of ether");
    });
  });

  describe("ethToTokenTransfer", async () => {
    beforeEach(async () => {
      await token.approve(exchange.address, toWei(2000));
      await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });
    });

    it("transfers at least min amount of tokens to recipient", async () => {
      const userBalanceBefore = await getBalance(user.address);

      await exchange
        .connect(user)
        .ethToTokenTransfer(toWei(1.97), user.address, { value: toWei(1) });

      const userBalanceAfter = await getBalance(user.address);

      expectedDifference = 1.000064190344631172;
      actualDifference = fromWei(userBalanceBefore.sub(userBalanceAfter));
      expect(actualDifference - expectedDifference).to.be.most(tolerance);

      const userTokenBalance = await token.balanceOf(user.address);
      expect(fromWei(userTokenBalance)).to.equal("1.978041738678708079");

      const exchangeEthBalance = await getBalance(exchange.address);
      expect(fromWei(exchangeEthBalance)).to.equal("1001.0");

      const exchangeTokenBalance = await token.balanceOf(exchange.address);
      expect(fromWei(exchangeTokenBalance)).to.equal("1998.021958261321291921");
    });
  });

  describe("tokenToTokenSwap", async () => {
    it("swaps token for token2", async () => {
      const Factory = await ethers.getContractFactory("Factory");
      const factory = await Factory.deploy();
      await factory.deployed();

      const Token = await ethers.getContractFactory("Token");

      const token1 = await Token.deploy("Token1", "TKN1", toWei(1000000));
      await token1.deployed();

      const token2 = await Token.connect(user).deploy(
        "Token2",
        "TKN2",
        toWei(1000000)
      );
      await token2.deployed();

      // creating instances of exchange contract
      const exchange1 = await createExchange(factory, token1.address, owner);
      const exchange2 = await createExchange(factory, token2.address, user);

      // approving exchange 1 to add 2000 of token1 to the liquidity on behalf of owner
      await token1.approve(exchange1.address, toWei(2000));
      await exchange1.addLiquidity(toWei(2000), { value: toWei(1000) });

      // approving exchange 2 to add 1000 of token2 to the liquidity on behalf of user
      await token2.connect(user).approve(exchange2.address, toWei(1000));
      await exchange2
        .connect(user)
        .addLiquidity(toWei(1000), { value: toWei(1000) });

      expect(await token2.balanceOf(owner.address)).to.eq(0);

      await token1.approve(exchange1.address, toWei(10));

      // ether amount out of exchange1 that will be passed to exchange2
      const ethInExchange2 = fromWei(
        await exchange1.ethAmountPurchased(toWei(10))
      );

      // recalculated ether amount out of exchange1 that will be passed to exchange2
      // due to slippage
      const slippage = 0.99;
      const ethInExchange2_min = ethInExchange2 * slippage;

      // token amount purchased from exchange 2 in exchange of eth amount coming out from exchange 1
      const tokensOutExchange2 = fromWei(
        await exchange2.tokenAmountPurchased(toWei(ethInExchange2_min))
      );

      // recalculated ether amount out of exchange1 that will be passed to exchange2
      // due to slippage
      const tokensOutExchange2_min = tokensOutExchange2 * slippage;

      // user calls swap function with
      // amount of token to sold, min expected amount of token to receive
      // and address of token to receive passed in
      await exchange1.tokenToTokenSwap(
        toWei(10),
        toWei(tokensOutExchange2_min),
        token2.address
      );

      const ownerBalance = await token2.balanceOf(owner.address);
      expect(fromWei(ownerBalance)).to.eq("4.852698493489877956");

      expect(await token.balanceOf(user.address)).to.equal(0);

      await token2.connect(user).approve(exchange2.address, toWei(10));
      await exchange2
        .connect(user)
        .tokenToTokenSwap(toWei(10), toWei(19.6), token1.address);

      expect(fromWei(await token1.balanceOf(user.address))).to.equal(
        "19.602080509528011079"
      );
    });
  });
});
