require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    //rinkeby: {
    //  url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    //  accounts: [`${process.env.PRIVATE_KEY}`],
    //},
  },
};
