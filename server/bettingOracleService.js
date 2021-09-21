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
        playerAddress: event.returnValues.playerAddress,
        bettingContractAddress: event.returnValues.bettingContractAddress,
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

  const onFinishedRace = async (correctHorse) => {
    // in real life we would map as in alternative above
    if (bets.length > 0) {
      console.log(
        "returning for player: ",
        bets[bets.length - 1].playerAddress
      );
      try {
        await sendCorrectHorse(
          correctHorse,
          bets[bets.length - 1].id,
          bets[bets.length - 1].playerAddress,
          bets[bets.length - 1].bettingContractAddress
        );
      } catch (error) {
        console.log("ERROR sending: ", error);
      }
    }
  };
};

module.exports = start;
