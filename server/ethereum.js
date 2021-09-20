const Web3 = require("web3");
const HDWalletProvider = require("truffle-hdwallet-provider");


const artifact = require("../src/artifacts/contracts/BettingOracle.sol/BettingOracle.json");
const contractAddress = require("./bettingOracleAddress.json").address;
console.log({ contractAddress });
const bettingContractAddress = require("./bettingAddress.json").address;
console.log({ bettingContractAddress });
const networkAddress = "http://localhost:8545";
const web3 = new Web3(new HDWalletProvider("spell coast torch proof roof basket lift rural figure pigeon coffee slender",
 "http://localhost:8545"
));
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
        console.log("will use accounts[0]: ", accounts[0]);
        resolve(accounts[0]);
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
const sendCorrectHorse = (correctHorse, id, betPlayerAddress, msgSenderAddress) => {
  console.log("send corr horse: ", { correctHorse, id, betPlayerAddress });
  return new Promise((resolve, reject) => {
    account(betPlayerAddress)
      .then((account) => {
        console.log("Inside sendCorrectHorse : betPlayerAddress ", betPlayerAddress);
        console.log("Inside sendCorrectHorse : msgSenderAddress ", msgSenderAddress);
        console.log("Inside sendCorrectHorse : account ", account);
        console.log("THIS WILL CALL OUR CONTRACT/ORACLE callback");
        contract.sendCorrectHorse(
          correctHorse, betPlayerAddress,
          id,
          {
            from: account, // what should this be? should this be user who made the bet?     or is it "oracle owner account?"
            gas: 12450000, // max gas. // who pays this?
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
  // contract.forgetEvents
  contract.GetCorrectHorseEvent((error, result) => listener(error, result));
};

module.exports = {
  createRequest,
  sendCorrectHorse,
  subscribeToGetCorrectHorseEvent,
};
