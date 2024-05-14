const express = require('express');
const cors = require('cors');
const axios = require('axios');
//example PUUID: CPIhIggE60FV3f99FcpquQmp_M5FL3B0Oe5MrRX1ADk9b4gL1HQ8cQ8dBWB-qmG5pkbUN9ZRLh3E5w
const app = express();
const port = 3001; // Change this to a different port than your React app

app.use(cors()); // Enable CORS for all routes

const API_KEY = "";

app.get('/search', async (req, res) => {
  const { gameName, tagLine } = req.query;
  const API_CALL = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`;

  try {
    const response = await axios.get(API_CALL);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching player data');
  }
});

app.get('/level', async (req, res) => {
  const { puuid } = req.query;
  const API_CALL = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}/?api_key=${API_KEY}`;

  try {
    const response = await axios.get(API_CALL);
    console.log('ID API Response:', response.data.id); // Log the response
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching player data');
  }
});

app.get('/rank', async (req, res) => {
  const { summonerId } = req.query;
  //ex: https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/{summonerId}?api_key={API_KEY}
  const API_CALL = `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}/?api_key=${API_KEY}`;

  try {
    const response = await axios.get(API_CALL);
    //console.log('Rank API Response:', response.data.tier, response.data.rank, 'LP: ', response.data.leaguePoints); // Log the response
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching player data');
  }
});

app.get('/past20Games', async (req, res) => {
  try {
  
    const { puuid } = req.query;
    //ex: https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=20&api_key={API_KEY}
    const API_CALL = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${API_KEY}`;
    const gameIDs = await axios.get(API_CALL).then(response => response.data);
    
    const matchDataArray = [];
    for (let i = 0; i < (gameIDs.length-17); i++) {
      const matchID = gameIDs[i];
      //ex: https://americas.api.riotgames.com/lol/match/v5/matches/NA1_4993937723/?api_key=RGAPI-30a1a6c7-1f67-4ad0-9344-a8ed6602e706
      const matchData = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchID}/?api_key=${API_KEY}`).then(response => response.data);
      matchDataArray.push(matchData);
    }

    console.log('Match Data API Response:', matchDataArray);
    res.json(matchDataArray);
  } catch (error) {
    console.error('Error fetching match data:', error);
    res.status(500).json({ error: 'Failed to fetch match data' });
  }
});






app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
