const parseToUnits = (value) => ethers.utils.parseUnits(value.toString());

const main = async () => {
  const Token = await ethers.getContractFactory("Token");

  const token1 = await Token.deploy("Tether", "USDT", parseToUnits(10000000));
  await token1.deployed();
  const token1Symbol = await token1.symbol();
  console.log(`${token1Symbol} deployed to:`, token1.address);

  const token2 = await Token.deploy(
    "Chainlink",
    "LINK",
    parseToUnits(10000000)
  );
  await token2.deployed();
  const token2Symbol = await token2.symbol();
  console.log(`${token2Symbol} deployed to:`, token2.address);

  const token3 = await Token.deploy("Compound", "COMP", parseToUnits(10000000));
  await token3.deployed();
  const token3Symbol = await token3.symbol();
  console.log(`${token3Symbol} deployed to:`, token3.address);

  const token4 = await Token.deploy("Balancer", "BAL", parseToUnits(10000000));
  await token4.deployed();
  const token4Symbol = await token4.symbol();
  console.log(`${token4Symbol} deployed to:`, token4.address);
};

(async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
