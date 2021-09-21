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
      console.log("LISTENER! args: ", result.args);
      console.log("LISTENER! args Id: ", result.args.id.toNumber());

      if (!result) {
        return;
      }

      // implement your log - add request to your log.

      console.log("LISTENER! will push caller to our array");
      // save the incoming bets
      bets.push({
          id: result.args.id,
          playerAddress: result.args.playerAddress,
          bettingContractAddress: result.args.bettingContractAddress,
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
    // in real life we would map as in alternative above
    if (bets.length > 0) {
      console.log("returning for player: ", bets[bets.length - 1].playerAddress);
      sendCorrectHorse(
        correctHorse,
        bets[bets.length - 1].id,
        bets[bets.length - 1].playerAddress,
        bets[bets.length - 1].bettingContractAddress
      );
    }
  };
};

module.exports = start;
