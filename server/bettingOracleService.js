const {
  sendCorrectHorse,
  subscribeToBetPlacedEvent,
  subscribeToResetBetsEvent,
} = require("./ethereum.js");

let bets = [];

const start = async () => {
  console.log("started. will subscribe to BetPlacedEvent and ResetBetsEvent");
  /*
   * subscribe and listen to the users requesting results
   */
  subscribeToBetPlacedEvent(
    // function executed at the request:
    (error, event) => {
      console.log("LISTENER got BetPlacedEvent event: ", {
        event,
        error,
      });

      if (!event) {
        return;
      }

      console.log("LISTENER will push caller to our array");
      // save the incoming bets
      bets.push({
        id: event.returnValues.id,
        playerAddress: event.returnValues.playerAddress,
        bettingContractAddress: event.returnValues.bettingContractAddress,
      });
    }
  );

  /*
   * subscribe and listen to the reset bets event
   */
  subscribeToResetBetsEvent(
    // function executed at the request:
    (error, event) => {
      console.log("LISTENER got ResetBetsEvent event: ", {
        event,
        error,
      });

      if (!event) {
        return;
      }

      console.log("LISTENER will reset bets array");
      // save the incoming bets
      bets = [];
    }
  );
};

const finishRace = (correctHorse) => {
  // in real life we would map as in alternative above
  if (bets?.length > 0) {
    bets.forEach(async (bet) => {
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
    });
  } else {
    console.log("no bets...");
  }
};

module.exports = {
  start,
  finishRace,
};
