import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Betting from "./artifacts/contracts/Betting.sol/Betting.json";
import betting from "./betting.json";

function convertHex(hex) {
  return parseInt(hex._hex, 16);
}

// Update with the contract address logged out to the CLI when it was deployed
const greeterAddress = betting.address;

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
      const contract = new ethers.Contract(greeterAddress, Betting.abi, signer);

      console.log("provider in fetch: ", { provider });
      try {
        const data = await contract.checkBet();
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
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("provider in set: ", { provider });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Betting.abi, signer);
      const transaction = await contract.makeBet(bettingValue, {
        value: ethers.utils.parseEther("0.05"),
      });
      await transaction.wait();
      console.log("transaction done");
    }
  }

  async function getAtgBalance() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // could suffice to use provider, but then one gets a diferent adress in setBetting
      // so we can use signer in both places or come up with a different id mechanism (probably bet id or so)
      const contract = new ethers.Contract(greeterAddress, Betting.abi, signer);

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
      const contract = new ethers.Contract(greeterAddress, Betting.abi, signer);

      const data = await contract.makeContractRich({
        value: ethers.utils.parseEther("100"),
      });
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {" "}
          <button onClick={makeBet}>Make Bet</button>
          <input
            onChange={(e) => setBettingValue(e.target.value)}
            placeholder="Choose Horse nr"
          />
        </div>
        <div>
          <button onClick={checkBet}>Check my bet</button>
        </div>
        <div>
          <div>ATG Balance: {atgBalance}</div>
          <button onClick={getAtgBalance}>Get Atg Balance</button>
        </div>
        <div>
          <button onClick={makeContractRich}>Make contract rich 100eth </button>
        </div>
      </header>
    </div>
  );
}

export default App;
