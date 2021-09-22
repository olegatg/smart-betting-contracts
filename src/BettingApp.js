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
  const [poolBalance, setPoolBalance] = useState();
  const [player1Balance, setPlayer1Balance] = useState();
  const [player2Balance, setPlayer2Balance] = useState();
  const [player3Balance, setPlayer3Balance] = useState();
  const [player4Balance, setPlayer4Balance] = useState();

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

  async function finishRace() {
    fetch("http://localhost:3001/finishRace?winner=1");
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
        value: ethers.utils.parseEther("1"),
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

  async function resetBets() {
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

      console.log("will reset bets ");
      const oracleInstanceTransaction = await contract.resetBets();
      await oracleInstanceTransaction.wait();

      console.log("transaction done");
    }
  }

  async function getStatus() {
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
      setAtgBalance(convertHex(data) / 1000000000000000000);

      const poolData = await contract.getPoolBalance();
      setPoolBalance(convertHex(poolData) / 1000000000000000000);

      const player1 = await contract.getPlayer1Balance();
      setPlayer1Balance(convertHex(player1) / 1000000000000000000);

      const player2 = await contract.getPlayer2Balance();
      setPlayer2Balance(convertHex(player2) / 1000000000000000000);

      const player3 = await contract.getPlayer3Balance();
      setPlayer3Balance(convertHex(player3) / 1000000000000000000);

      const player4 = await contract.getPlayer4Balance();
      setPlayer4Balance(convertHex(player4) / 1000000000000000000);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p />

        <div className="admin">
          <div>Admin</div>
          <div>
            <button onClick={setOracleAddress}>Set oracle address</button>
          </div>
          <div>
            <button onClick={getStatus}>Get Status</button>
            <div>Pool balance: {poolBalance}</div>
            <div>Atg balance: {atgBalance}</div>
            <div />
            <div>Player1 balance: {player1Balance}</div>
            <div>Player2 balance: {player2Balance}</div>
            <div>Player3 balance: {player3Balance}</div>
            <div>Player4 balance: {player4Balance}</div>
          </div>

          <div>
            <button onClick={resetBets}>Reset bets</button>
          </div>
        </div>
        <div className="bet">
          <div>
            {"(Here or on ATG site)"}
            <button onClick={makeBet}>Make Bet</button>
            <input
              onChange={(e) => setBettingValue(e.target.value)}
              placeholder="Choose Horse nr"
            />
          </div>
          <div>
            {"(Here or on NFT site)"}
            <button onClick={finishRace}>Finish race</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
