const {
  sendCorrectHorse,
  subscribeToBetPlacedEvent,
} = require("./ethereum.js");

const bets = [];

const start = async () => {
  console.log("started. will subscribe to BetPlacedEvent");
  /*
   * subscribe and listen to the users requesting results
   */
  subscribeToBetPlacedEvent(
    // function executed at the request:
    (error, event) => {
      console.log("LISTENER got BetPlacedEvent! event: ", {
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

      // setTimeout(() => {
      //   // let's pretend
      //   const correctHorse = 9;
      //   console.log(
      //     "Now race has finished and correct horse is: ",
      //     correctHorse
      //   );
      //   onFinishedRace(correctHorse);
      // }, 5000);
    }
  );

  const onFinishedRace = async (correctHorse) => {
    // in real life we would map as in alternative above
    if (bets.length > 0) {
      for (const bet in bets) {
        console.log("send response to player: ", bet.playerAddress);
        try {
          await sendCorrectHorse(
            correctHorse,
            bet.id,
            bet.playerAddress,
            bet.bettingContractAddress
          );
        } catch (error) {
          console.log("ERROR sending: ", error);
        }
      }
    }
  };
};

module.exports = start;
