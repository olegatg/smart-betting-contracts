const { checkResultErrors } = require("ethers/lib/utils");
const {
  sendCorrectHorse,
  subscribeToGetCorrectHorseEvent,
} = require("./ethereum.js");

const bets = [];

const start = () => {
  console.log("started. will subscribe to GetCorrectHorseEvent");
  /*
   * subscribe and listen to the users requesting results
   */
  subscribeToGetCorrectHorseEvent(
    // function executed at the request:
    (error, result) => {
      console.log("LISTENER got GetCorrectHorseEvent! result: ", result);
      console.log("LISTENER! args: ", result?.args);

      if (!result) {
        return;
      }

      // implement your log - add request to your log.

      console.log("LISTENER! will push caller to our array");

      // save the incoming bets
      bets.push({
        id: result.args.id,
        callerAddress: result.args.callerAddress,
      });

      setTimeout(() => {
        // let's pretend
        const correctHorse = 9;
        console.log(
          "Now race has finished and correct horse is: ",
          correctHorse
        );
        onFinishedRace(correctHorse);
      }, 5000);
    }
  );

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
