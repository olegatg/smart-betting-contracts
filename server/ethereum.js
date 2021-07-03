const Web3 = require("web3");

const artifact = require("../src/artifacts/contracts/BettingOracle.sol/BettingOracle.json");
const contractAddress = require("./bettingOracleAddress.json").address;
console.log({ contractAddress });
const networkAddress = "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(networkAddress));
console.log(web3.eth.contract);
const contract = web3.eth.contract(artifact.abi).at(contractAddress);

const account = (address) => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      // if we had a private key of "atg" account, we could pay

      console.log("accounts: ", accounts);
      console.log("contractAddress", contractAddress);
      console.log("adr", address);
      if (err === null) {
        // resolve(accounts[process.env.ACCOUNT_NUMBER]);
        resolve(address);
      } else {
        reject(err);
      }
    });
  });
};

/* client uses this to create request */
const createRequest = ({ urlToQuery, attributeToFetch }) => {
  return new Promise((resolve, reject) => {
    account()
      .then((account) => {
        contract.createRequest(
          urlToQuery,
          attributeToFetch,
          {
            from: account,
            gas: 60000000,
          },
          (err, res) => {
            if (err === null) {
              resolve(res);
            } else {
              reject(err);
            }
          }
        );
      })
      .catch((error) => reject(error));
  });
};

/* oracle service/betting service uses this to send data to contract */
const sendCorrectHorse = (correctHorse, id, address) => {
  console.log("send corr horse: ", { correctHorse, id, address });
  return new Promise((resolve, reject) => {
    account(address)
      .then((account) => {
        contract.sendCorrectHorse(
          correctHorse,
          address,
          id,
          {
            from: account,
            gas: 12450000, // max gas.
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
const subscribeToGetCorrectHorseEvent = (callback) => {
  contract.GetCorrectHorseEvent((error, result) => callback(error, result));
};

module.exports = {
  createRequest,
  sendCorrectHorse,
  subscribeToGetCorrectHorseEvent,
};
