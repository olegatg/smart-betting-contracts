const { checkResultErrors } = require("ethers/lib/utils");
const {
  sendCorrectHorse,
  subscribeToGetCorrectHorseEvent,
} = require("./ethereum.js");

const bets = [];

const start = () => {
  subscribeToGetCorrectHorseEvent((error, result) => {
    console.log("result", result);
    console.log("start", result?.args);

    if (!result) {
      return;
    }

    // save the incoming bets
    bets.push({ id: result.args.id, callerAddress: result.args.callerAddress });

    setTimeout(() => {
      const correctHorse = 9;
      console.log("Now race has finished and correct horse is: ", correctHorse);
      onFinishedRace(correctHorse);
    }, 5000);
  });

  const onFinishedRace = (correctHorse) => {
    // 1. send back correct horse and all bets
    // sendCorrectHorse(correctHorse, bets);

    /*
      // alternative
      forEach(bets, bet => sendCorrectHorse(correctHorse, bet));
    */

    // in real life we would map as in alternative above
    if (bets.length > 0) {
      console.log("callerAddress: ", bets[bets.length - 1].callerAddress);
      sendCorrectHorse(
        correctHorse,
        bets[bets.length - 1].id,
        bets[bets.length - 1].callerAddress
      );
    }
  };
};

module.exports = start;
