const Web3 = require("web3");

const artifact = require("../src/artifacts/contracts/BettingOracle.sol/BettingOracle.json");
const oracleContractAddress = require("./bettingOracleAddress.json").address;
const networkAddress = "http://localhost:8545";

// https://intellipaat.com/community/12969/web3-eth-subscribe-not-implemented-for-web3-version-1-0-0-beta-27
// it seems that Http provider does not work with event listeners. Have to use WebsocketProvider.
const provider = new Web3.providers.WebsocketProvider(networkAddress);

// specify provider for Web3
const web3 = new Web3(provider);

// get the contract from network
const bettingOracleContract = new web3.eth.Contract(
  artifact.abi,
  oracleContractAddress
);

console.log("CONTRACT: ", { bettingOracleContract });

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
  playerAddress,
  bettingContractAddress
) => {
  console.log("send corr horse: ", {
    correctHorse,
    id,
    playerAddress,
    bettingContractAddress,
  });
  return new Promise((resolve, reject) => {
    account()
      .then(async (account) => {
        console.log("Call our ORACLE callback");

        const methodToSend = bettingOracleContract.methods.sendCorrectHorse(
          correctHorse,
          bettingContractAddress,
          id
        );

        const estimatedGas = Math.round(
          (await methodToSend.estimateGas()) * 1.1
        );

        console.log("Estimated gas: ", {
          estimatedGas,
        });

        methodToSend.send(
          {
            from: account, // what account does this need to be?
            gas: estimatedGas, // max gas. payed by the one initiated the bet?
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

/* listener for BetPlacedEvent event - oracle service uses it and does staff when receives it */
const subscribeToBetPlacedEvent = (listener) => {
  bettingOracleContract.events.BetPlacedEvent(listener);
};

/* listener for ResetBetsEvent event*/
const subscribeToResetBetsEvent = (listener) => {
  bettingOracleContract.events.ResetBetsEvent(listener);
};

module.exports = {
  sendCorrectHorse,
  subscribeToBetPlacedEvent,
  subscribeToResetBetsEvent,
};
