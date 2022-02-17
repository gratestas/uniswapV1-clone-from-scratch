const fs = require("fs");

const main = async () => {
  // We get the contract to deploy
  const Factory = await ethers.getContractFactory("Factory");
  const factory = await Factory.deploy();

  await factory.deployed();

  console.log("Factory.sol deployed to:", factory.address);

  const data = {
    address: factory.address,
    abi: JSON.parse(factory.interface.format("json")),
  };
  fs.writeFileSync(
    "client/smart_contract/data/Factory.json",
    JSON.stringify(data)
  );
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
(async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
