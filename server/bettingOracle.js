const { sendCorrectHorse, onFetchCorrectHorse } = require("./ethereum.js");

const bets = [];

const start = () => {
  onFetchCorrectHorse((error, result) => {
    console.log("result", result);
    console.log("start", result.args.address);

    // save the incoming bets
    bets.push(result.args.id);

    setTimeout(() => {
      const correctHorse = 7;
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
      sendCorrectHorse(correctHorse, bets[bets.length - 1]);
    }
  };
};

module.exports = start;
