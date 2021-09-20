const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const artifact = require("../src/artifacts/contracts/BettingOracle.sol/BettingOracle.json");
const contractAddress = require("./bettingOracleAddress.json").address;
console.log({ contractAddress });
const bettingContractAddress = require("./bettingAddress.json").address;
console.log({ bettingContractAddress });
const networkAddress = "http://localhost:8545";
const privateKeyNo0x =
  "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // private key of "266" or [0] account

// https://intellipaat.com/community/12969/web3-eth-subscribe-not-implemented-for-web3-version-1-0-0-beta-27
// need to add "on" method to make it work...
const wsProvider = new Web3.providers.WebsocketProvider(networkAddress);
HDWalletProvider.prototype.on = wsProvider.on.bind(wsProvider);

const provider = new HDWalletProvider({
  privateKeys: [privateKeyNo0x], // this should fetch the "266", or [0] account
  providerOrUrl: wsProvider,
});
const web3 = new Web3(provider);

const contract = new web3.eth.Contract(artifact.abi, contractAddress);

console.log("CONTRACT: ", { contract });

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
          betPlayerAddress,
          id
        );

        console.log("methodToSend: ", { methodToSend });

        console.log("Will estimate gas");
        // fails already here!
        const estimatedGas = await methodToSend.estimateGas();

        console.log("Inside sendCorrectHorse : account ", {
          account,
          estimatedGas,
        });

        // https://medium.com/finnovate-io/how-do-i-sign-transactions-with-web3-f90a853904a2
        // not working anyway...
        // console.log("Will encode and sign");

        // var encodedABI = methodToSend.encodeABI();
        // const tx = {
        //   from: account,
        //   to: msgSenderAddress,
        //   gas: estimatedGas * 1.1,
        //   data: encodedABI,
        // };

        // console.log("Will send signed");

        // web3.eth.accounts
        //   .signTransaction(tx, privateKeyNo0x)
        //   .then((signedTx) => {
        //     // raw transaction string may be available in .raw or
        //     // .rawTransaction depending on which signTransaction
        //     // function was called
        //     const sentTx = web3.eth.sendSignedTransaction(
        //       signedTx.raw || signedTx.rawTransaction
        //     );
        //     sentTx.on("receipt", (receipt) => {
        //       console.log("receipt: ", { receipt });
        //       // do something when receipt comes back
        //     });
        //     sentTx.on("error", (err) => {
        //       console.log("ERROR: ", { err });
        //       // do something on transaction error
        //     });
        //   })
        //   .catch((err) => {
        //     console.log("ERRO: ", err);
        //     // do something when promise fails
        //   });

        methodToSend
          .send(
            {
              from: account, // what should this be? should this be user who made the bet?     or is it "oracle owner account?"
              gas: estimatedGas * 1.1, // max gas. // who pays this?
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
          )
          .on("transactionHash", function (hash) {
            console.log("transactionHash: ", hash);
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            console.log("confirmation: ", { confirmationNumber, receipt });
          })
          .on("receipt", function (receipt) {
            console.log("receipt: ", receipt);
          })
          .on("error", function (error, receipt) {
            console.log("errro: ", { error, receipt });
          });
      })
      .catch((error) => reject(error));
  });
};

/* listener for NewRequest event - oracle service uses it and does staff when receives it */
const subscribeToGetCorrectHorseEvent = (listener) => {
  contract.events
    .GetCorrectHorseEvent(null, (error, event) => listener(error, event))
    .on("connected", function (subscriptionId) {
      console.log("connected: ", subscriptionId);
    })
    .on("data", function (event) {
      console.log("data: ", event); // same results as the optional callback above
    })
    .on("changed", function (event) {
      console.log("changed: ", event);
    })
    .on("error", function (error, receipt) {
      // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
      console.log("error: ", error);
    });
};

module.exports = {
  createRequest,
  sendCorrectHorse,
  subscribeToGetCorrectHorseEvent,
};
