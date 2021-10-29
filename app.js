const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// API 1 GET method

app.get("/players/", async (request, response) => {
  const allPlayers = `SELECT * FROM cricketTeam;`;
  const allPlayerTeam = await db.all(allPlayers);
  response.send(allPlayerTeam);
});

// API 2  POST method

app.get("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayersToTable = `INSERT INTO cricketTeam(playerName,jerseyNumber,role)
VALUES (
        '${playerName}',
         ${jerseyNumber},
         ${role},
);`;
  const dbResponse = await db.run(addPlayersToTable);
  const playerId = dbResponse.lastID;
  response.send({ playerId: playerId });
});

// API player Id

app.get("/players/:playersId", async (response, request) => {
  const { playerId } = request.params;
  const playerIdQuery = `SELECT * FROM cricketTeam WHERE playerId = ${playerId};`;
  const playerIdDetails = await db.get(playerIdQuery);
  response.send(playerIdDetails);
});

// API 4 PUT
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayer = `
    UPDATE cricketTeam
    SET
    ${playerName},
    ${jerseyNumber},
    ${role}
    WHERE playerId = ${playerId};`;
  await db.run(updatePlayer);
  response.send("Player Details Updated");
});

//API 5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteplayer = `
    DELETE FROM
      cricketTeam
    WHERE
      playerId = ${player_id};`;
  await db.run(deletePlayer);
  response.send("Player Removed");
});

module.exports = app;
