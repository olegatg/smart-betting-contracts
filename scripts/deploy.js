// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const os = require("os");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run("compile");

  // We get the contract to deploy

  const Betting = await hre.ethers.getContractFactory("Betting");
  const betting = await Betting.deploy();

  await betting.deployed();

  console.log(
    "Betting deployed to:",
    JSON.stringify({ address: betting.address })
  );

  fs.writeFileSync(
    "./src/bettingAddress.json",
    JSON.stringify({ address: betting.address }),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );

  const BettingOracleFactory = await hre.ethers.getContractFactory(
    "BettingOracle"
  );
  const bettingOracle = await BettingOracleFactory.deploy();

  await bettingOracle.deployed();

  console.log(
    "Betting oracle deployed to:",
    JSON.stringify({ address: bettingOracle.address })
  );

  fs.writeFileSync(
    "./server/bettingOracleAddress.json",
    JSON.stringify({ address: bettingOracle.address }),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );

  fs.writeFileSync(
    "./server/bettingAddress.json",
    JSON.stringify({ address: betting.address }),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );

  fs.writeFileSync(
    "./src/bettingOracleAddress.json",
    JSON.stringify({ address: bettingOracle.address }),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );

  try {
    // for atg.se

    // copy address
    const atgAddressJson =
      os.homedir() + "/code/atgse/crypto/bettingAddress.json";
    fs.writeFileSync(
      atgAddressJson,
      JSON.stringify({ address: betting.address }),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );

    const atgArtifactJson = os.homedir() + "/code/atgse/crypto/Betting.json";
    // copy artifact
    fs.copyFile(
      "./src/artifacts/contracts/Betting.sol/Betting.json",
      atgArtifactJson,
      (err) => {
        if (err) throw err;
        console.log("source.txt was copied to destination.txt");
      }
    );
  } catch (e) {
    console.log(
      "could not deploy files to atg.se repo checkout. check your paths in deploy.js script."
    );
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
