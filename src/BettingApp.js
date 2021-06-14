import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Betting from "./artifacts/contracts/Betting.sol/Betting.json";

function logHex(hex) {
  return parseInt(hex._hex, 16);
}

// Update with the contract address logged out to the CLI when it was deployed
const greeterAddress = "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F";

function App() {
  // store betting in local state
  const [bettingValue, setBettingValue] = useState();

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call the smart contract, read the current betting value
  async function fetchBetting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Betting.abi,
        provider
      );
      try {
        const data = await contract.getBet();
        console.log("data: ", logHex(data));
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  // call the smart contract, send an update
  async function setBetting() {
    if (!bettingValue) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Betting.abi, signer);
      const transaction = await contract.makeBet(bettingValue);
      await transaction.wait();
      fetchBetting();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchBetting}>Fetch betting</button>
        <button onClick={setBetting}>Set betting</button>
        <input
          onChange={(e) => setBettingValue(e.target.value)}
          placeholder="Set betting"
        />
      </header>
    </div>
  );
}

export default App;
