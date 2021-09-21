import "./App.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Betting from "./artifacts/contracts/Betting.sol/Betting.json";
import bettingAddress from "./bettingAddress.json";
import bettingOracleAddress from "./bettingOracleAddress.json";

function convertHex(hex) {
  return parseInt(hex._hex, 16);
}

// Update with the contract address logged out to the CLI when it was deployed
const bettingContractAddress = bettingAddress.address;
const oracleAddress = bettingOracleAddress.address;

function App() {
  // store betting in local state
  const [bettingValue, setBettingValue] = useState();
  const [atgBalance, setAtgBalance] = useState();

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call the smart contract, read the current betting value
  async function checkBet() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // could suffice to use provider, but then one gets a diferent adress in setBetting
      // so we can use signer in both places or come up with a different id mechanism (probably bet id or so)
      const contract = new ethers.Contract(
        bettingContractAddress,
        Betting.abi,
        signer
      );

      console.log("provider in fetch: ", { provider });
      try {
        const data = await contract.checkBet();
        // const data = await contract.payMeBack(10 ** 17);
        console.log("data: ", { data });
        console.log("data: ", convertHex(data));
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  // call the smart contract, send an update
  async function makeBet() {
    if (!bettingValue) return;
    if (typeof window.ethereum !== "undefined") {
      console.log("will request account");
      const account = await requestAccount();
      console.log("got account ", { account });
      console.log("will create provider");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("provider in set: ", { provider });
      const signer = provider.getSigner();
      console.log("got signer: ", { provider });
      const contract = new ethers.Contract(
        bettingContractAddress,
        Betting.abi,
        signer
      );
      console.log("got contract: ", { contract });

      const transaction = await contract.makeBet(bettingValue, {
        value: ethers.utils.parseEther("0.05"),
      });
      console.log("await for transaction ", { transaction });
      await transaction.wait();
      console.log("transaction done");
    }
  }

  // tmp: this needs to be done from the oracle owner account - figure out.
  async function setOracleAddress() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("provider in set: ", { provider });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        bettingContractAddress,
        Betting.abi,
        signer
      );

      console.log("will set oracle address to ", oracleAddress);
      const oracleInstanceTransaction = await contract.setOracleInstanceAddress(
        oracleAddress
      );
      await oracleInstanceTransaction.wait();

      console.log("transaction done");
    }
  }

  async function getAtgBalance() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // could suffice to use provider, but then one gets a diferent adress in setBetting
      // so we can use signer in both places or come up with a different id mechanism (probably bet id or so)
      const contract = new ethers.Contract(
        bettingContractAddress,
        Betting.abi,
        signer
      );

      const data = await contract.getATGBalance();
      console.log("atg balance: ", { data });
      console.log("atg balance converted: ", convertHex(data));
      setAtgBalance(convertHex(data));
    }
  }

  async function makeContractRich() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // could suffice to use provider, but then one gets a diferent adress in setBetting
      // so we can use signer in both places or come up with a different id mechanism (probably bet id or so)
      const contract = new ethers.Contract(
        bettingContractAddress,
        Betting.abi,
        signer
      );

      const data = await contract.makeContractRich({
        value: ethers.utils.parseEther("100"),
      });
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p />
        <div className="main">
          {" "}
          <button onClick={makeBet}>Make Bet</button>
          <input
            onChange={(e) => setBettingValue(e.target.value)}
            placeholder="Choose Horse nr"
          />
        </div>
        <div className="admin">
          <div>Admin</div>
          <div>
            <div>ATG Balance: {atgBalance}</div>
            <button onClick={getAtgBalance}>Get Atg Balance</button>
          </div>
          <div>
            <button onClick={setOracleAddress}>Set oracle address</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
