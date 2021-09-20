const { checkResultErrors } = require("ethers/lib/utils");
const {
  sendCorrectHorse,
  subscribeToGetCorrectHorseEvent,
} = require("./ethereum.js");

const bets = [];

const start = async () => {
  console.log("started. will subscribe to GetCorrectHorseEvent");
  /*
   * subscribe and listen to the users requesting results
   */
  subscribeToGetCorrectHorseEvent(
    // function executed at the request:
    (error, event) => {
      console.log("LISTENER got GetCorrectHorseEvent! event: ", {
        event,
        error,
      });

      if (!event) {
        return;
      }

      // implement your log - add request to your log.

      console.log("LISTENER! will push caller to our array");
      // save the incoming bets
      bets.push({
        id: event.returnValues.id,
        callerAddress: event.returnValues.callerAddress,
        msgSenderAddress: event.returnValues.msgSenderAddress,
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
      try {
        sendCorrectHorse(
          correctHorse,
          bets[bets.length - 1].id,
          bets[bets.length - 1].callerAddress,
          bets[bets.length - 1].msgSenderAddress
        );
      } catch (error) {
        console.log("ERROR sending: ", error);
      }
    }
  };
};

module.exports = start;
