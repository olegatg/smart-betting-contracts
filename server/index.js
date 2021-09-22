const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());

const bettingOracleService = require("./bettingOracleService");

bettingOracleService.start();

app.get("/finishRace", (req, res) => {
  console.log("Received finishRace request ", req.query.winner);
  const correctHorse = req.query.winner;
  bettingOracleService.finishRace(correctHorse);
  res.status(200).send("race finished. correct horse: ");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
