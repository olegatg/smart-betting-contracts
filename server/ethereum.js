const Web3 = require("web3");

const artifact = require("../src/artifacts/contracts/BettingOracle.sol/BettingOracle.json");
const oracleContractAddress = require("./bettingOracleAddress.json").address;
const bettingContractAddress = require("./bettingAddress.json").address;
const networkAddress = "http://localhost:8545";

// https://intellipaat.com/community/12969/web3-eth-subscribe-not-implemented-for-web3-version-1-0-0-beta-27
// it seems that Http provider does not work with event listeners. Have to use WebsocketProvider.
const provider = new Web3.providers.WebsocketProvider(networkAddress);

// specify provider for Web3
const web3 = new Web3(provider);

// get the contract from network
const contract = new web3.eth.Contract(artifact.abi, oracleContractAddress);

console.log("CONTRACT: ", { contract });

const account = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err === null) {
        console.log("will use accounts[0]: ", accounts[0]);
        resolve(accounts[0]);
      } else {
        reject(err);
      }
    });
  });
};

/* oracle service/betting service uses this to send data to contract */
const sendCorrectHorse = (
  correctHorse,
  id,
  betPlayerAddress,
  msgSenderAddress
) => {
  console.log("send corr horse: ", { correctHorse, id, betPlayerAddress });
  return new Promise((resolve, reject) => {
    account(betPlayerAddress)
      .then(async (account) => {
        console.log(
          "Inside sendCorrectHorse : betPlayerAddress ",
          betPlayerAddress
        );
        console.log(
          "Inside sendCorrectHorse : msgSenderAddress ",
          msgSenderAddress
        );

        console.log("THIS WILL CALL OUR CONTRACT/ORACLE callback");

        const methodToSend = contract.methods.sendCorrectHorse(
          correctHorse,
          bettingContractAddress,
          id
        );

        console.log("methodToSend: ", { methodToSend });

        console.log("Will estimate gas");
        const estimatedGas = Math.round(
          (await methodToSend.estimateGas()) * 1.1
        );

        console.log("Inside sendCorrectHorse : account ", {
          account,
          estimatedGas,
        });

        methodToSend.send(
          {
            from: account, // what should this be? should this be user who made the bet?     or is it "oracle owner account?"
            gas: estimatedGas, // max gas. // who pays this?
          },
          (err, res) => {
            if (err === null) {
              console.log({ res });
              resolve(res);
            } else {
              console.log({ err });
              reject(err);
            }
          }
        );
      })
      .catch((error) => reject(error));
  });
};

/* listener for NewRequest event - oracle service uses it and does staff when receives it */
const subscribeToGetCorrectHorseEvent = (listener) => {
  console.log("Subscribe.");
  contract.events.GetCorrectHorseEvent(null, (error, event) =>
    listener(error, event)
  );
};

module.exports = {
  sendCorrectHorse,
  subscribeToGetCorrectHorseEvent,
};
