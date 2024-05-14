import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';
import { Row } from 'react-bootstrap';

function App() {
  const [loading, setLoading] = useState(false);
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [playerData, setPlayerData] = useState({});
  const [puuid, setPuuid] = useState("");
  const [level, setLevel] = useState(null);
  const [error, setError] = useState(null);
  const [iconId, setIconId] = useState("");
  const [searched, setSearched] = useState(false);
  const [gameList, setGameList] = useState([]);
  const [summonerId, setSummonerId] = useState("");
  const [soloDuoTier, setSoloDuoTier] = useState("");
  const [soloDuoDiv, setSoloDuoDiv] = useState("");
  const [soloDuoLP, setSoloDuoLP] = useState("");
  const [soloDuoWins, setSoloDuoWins] = useState("");
  const [soloDuoLosses, setSoloDuoLosses] = useState("");
  const [flexTier, setFlexTier] = useState("");
  const [flexDiv, setFlexDiv] = useState("");
  const [flexLP, setFlexLP] = useState("");
  const [flexWins, setFlexWins] = useState("");
  const [flexLosses, setFlexLosses] = useState("");

 
  function searchForPlayer() {
    setSearched(true);
    axios.get(`/search?gameName=${gameName}&tagLine=${tagLine}`)
      .then(function (response) {
        setPlayerData(response.data);
        setPuuid(response.data.puuid);
        setError(null);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function getLevel() {
    axios.get(`/level?puuid=${puuid}`)
      .then(function (response) {
        setLevel(response.data.summonerLevel);
        setIconId(response.data.profileIconId);
        setSummonerId(response.data.id);
        setError(null);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function getRank() {
    axios.get(`/rank?summonerId=${summonerId}`)
      .then(function (response) {
        setSoloDuoTier(response.data[0].tier);
        setSoloDuoDiv(response.data[0].rank);
        setSoloDuoLP(response.data[0].leaguePoints);
        setSoloDuoWins(response.data[0].wins);
        setSoloDuoLosses(response.data[0].losses);
        setFlexTier(response.data[1].tier);
        setFlexDiv(response.data[1].rank);
        setFlexLP(response.data[1].leaguePoints);
        setFlexWins(response.data[1].wins);
        setFlexLosses(response.data[1].losses);
        setError(null);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function getTierImage(tier) {
    const tierImages = {
      "IRON": "Iron.png",
      "BRONZE": "Bronze.png",
      "SILVER": "Silver.png",
      "GOLD": "Gold.png",
      "PLATINUM": "Platinum.png",
      "EMERALD": "Emerald.png",
      "DIAMOND": "Diamond.png",
      "MASTER": "Master.png",
      "GRANDMASTER": "Grandmaster.png",
      "CHALLENGER": "Challenger.png",
      ""          : "Unranked.png"
    };
    return tierImages[tier.toUpperCase()] || "";

}


  function getPast20Games(event) {
    setLoading(true);
    axios.get(`/past20Games?puuid=${puuid}`)
      .then(function (response) {
        setGameList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    setLoading(false);
  }

  function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
  }

  function getQueueType(queueId) {
    switch (queueId) {
      case 420:
        return "Ranked Solo/Duo";
      case 440:
        return "Ranked Flex";
      case 450:
        return "Howling Abyss";
      case 490:
        return "Normal (Quickplay)";
      case 400:
        return "Normal (Draft Pick)";
      case 1710:
        return "Arena";
      case 1700:
        return "Arena";
      default:
        return "Unknown Queue Type";
    }
  }
  function getPrimaryRune(id) {
    const runeImages = {
      "9923" : "9923.png",
      "8456" : "8456.png",
      "8439" : "8439.png",
      "8369" : "8369.png",
      "8360" : "8360.png",
      "8351" : "8351.png",
      "8239" : "8239.png",
      "8230" : "8230.png",
      "8214" : "8214.png",
      "8128" : "8128.png",
      "8124" : "8124.png",
      "8112" : "8112.png",
      "8021" : "8021.png",
      "8010" : "8010.png",
      "8008" : "8008.png",
      "8005" : "8005.png",
      "8437" : "8437.png"

    };

    return runeImages[id];
  }

  useEffect(() => {
    if (puuid) {
      getLevel();
      getPast20Games();
    }
  }, [puuid]);

  useEffect(() => {
    if (summonerId) {
      getRank();
    }
  }, [summonerId]);

  return (
    <div className="App">
      <div id="topbar">
      </div>
      <br />
      <div id="banner">
        <input type='text' placeholder='Riot ID' onChange={e => setGameName(e.target.value)}></input>
        <input type='text' placeholder='Tag Line (ex: NA1)' onChange={e => setTagLine(e.target.value)}></input>
        <button type="button" onClick={searchForPlayer}>Search for player</button>
      </div>
      <br />
      {error && searched && <p>{error}</p>}
      {JSON.stringify(playerData) !== '{}' && searched &&
        <>
          <br />
          <div id='wrapper'>
            <div style={{ position: 'relative', width: '100px', height: '100px', marginLeft: '40px' }}>
              <img
                style={{ borderRadius: '20%', width: '100%', height: '100%', marginRight: '20px' }}
                src={"https://ddragon.leagueoflegends.com/cdn/14.9.1/img/profileicon/" + iconId + ".png"}
                alt="Profile Icon"
              />
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translate(-50%)',
                color: 'white',
                textAlign: 'center',
                padding: '5px',
                borderRadius: '50%',
                backgroundColor: '#424952',

              }}>
                {level}
              </span>
            </div>
            <br />
            <div style={{ marginTop: '-70px', marginLeft: '25px' }}><h1>{playerData.gameName} #{playerData.tagLine}</h1></div>
          </div>
          <div id='content-container'>
            <div id='left-container'>
              <div id='ranked-container'>
                <div className='rank'>Ranked Solo</div>
                <img
                  style={{ width: '50px', height: '50px', justifyContent: 'left' }}
                  src={`/${getTierImage(soloDuoTier)}`}
                  alt={soloDuoTier}
                />
                <div className='tier'>
                  {soloDuoTier} {soloDuoDiv}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className='wins'>{soloDuoWins}W {soloDuoLosses}L</span>
                </div>
                <div className='lp'>{soloDuoLP} LP</div>
                <div className='winrate'>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  Win Rate {Math.round((soloDuoWins / (soloDuoWins + soloDuoLosses)) * 100)}%
                </div>
              </div>
              <div id='ranked-container'>
                <div className='rank'>Ranked Flex</div>
                <img
                  style={{ width: '50px', height: '50px', justifyContent: 'left' }}
                  src={`/${getTierImage(flexTier)}`}
                  alt={flexTier}
                />
                <div className='tier'>
                  {flexTier} {flexDiv}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className='wins'>{flexWins}W {flexLosses}L</span>
                </div>
                <div className='lp'>{flexLP} LP</div>
                <div className='winrate'>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  Win Rate {Math.round((flexWins / (flexWins + flexLosses)) * 100)}%</div>
              </div>
            </div>
            <div id='match-history-container'>
              {gameList.length !== 0 ? (
                <>
                  {gameList.map((gameData, index) => (
                    
                    <div key={index} className='single-match-container'>
                      {getQueueType(gameData.info.queueId)}
                      <div>
                        <p>Duration: {formatDuration(gameData.info.gameDuration)}</p>
                        <div>
                          <h5>Team 1</h5>
                          {gameData.info.participants.slice(0, 5).map((data, participantIndex) => (
                            <div className={`player-container ${data.win ? 'win' : 'loss'}`} key={participantIndex}>
                              <p key={participantIndex}>
                                <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '5px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <img 
                                  style={{ position: 'relative', width: '20px', height: '20px'}}
                                  src={"https://lolcdn.darkintaqt.com/cdn/spells/" + data.summoner1Id}
                                  alt="Summoner Spell 1"
                                />
                                <img 
                                  style={{ position: 'relative', width: '20px', height: '20px'}}
                                  src={"https://lolcdn.darkintaqt.com/cdn/spells/" + data.summoner2Id}
                                  alt="Summoner Spell 2"
                                />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <img
                                  style={{ position: 'relative', width: '20px', height: '20px'}}
                                  src={`/${getPrimaryRune(data.perks.styles[0].selections[0].perk)}` }
                                  alt="primary rune"
                                />
                                <img
                                  style={{ position: 'relative', width: '20px', height: '20px'}}
                                  src={"https://static.bigbrain.gg/assets/lol/runes/" + data.perks.styles[1].style + ".png"}
                                  alt="secondary rune"
                                />
                                </div>
                                
                                <div style={{ position: 'relative', width: '60px', height: '60px', marginLeft: '3px' }}>
                                  <img
                                    style={{ width: '40px', height: '40px', justifyContent: 'left', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center' }}
                                    src={"https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/" + data.championId+ "/" + data.championId + "000.jpg"}
                                    alt="Champion Icon"
                                  />
                                   <span style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '50%',
                                    transform: 'translate(-120%)',
                                    color: 'white',
                                    padding: '5px',
                                    borderRadius: '50%',
                                    backgroundColor: '#31313c',
                                  }}>
                                    {data.champLevel}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                      <img
                                        style={{ width: '30px', height: '30px' }}
                                        src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + data.item0 + ".png.webp"}
                                        alt="Item 0"
                                      />
                                      <img
                                        style={{ width: '30px', height: '30px' }}
                                        src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + data.item1 + ".png.webp"}
                                        alt="Item 1"
                                      />
                                      <img
                                        style={{ width: '30px', height: '30px' }}
                                        src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + data.item2 + ".png.webp"}
                                        alt="Item 2"
                                      />
                                      <img
                                        style={{ width: '30px', height: '30px' }}
                                        src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + data.item3 + ".png.webp"}
                                        alt="Item 3"
                                      />
                                      <img
                                        style={{ width: '30px', height: '30px'  }}
                                        src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + data.item4 + ".png.webp"}
                                        alt="Item 4"
                                      />
                                      <img
                                        style={{ width: '30px', height: '30px' }}
                                        src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + data.item5 + ".png.webp"}
                                        alt="Item 5"
                                      />
                                      <img
                                        style={{ width: '30px', height: '30px' }}
                                        src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + data.item6 + ".png.webp"}
                                        alt="Item 6"
                                      />

                                      
                                  </div>
                                </div>
                                {data.riotIdGameName}#{data.riotIdTagline} <div className='player-stats'>{data.kills}/{data.deaths}/{data.assists}</div>  
                                {data.deaths === 0 ? "Perfect" : ((data.kills + data.assists) / data.deaths).toFixed(2)} KDA
                                Damage dealt: {data.totalDamageDealtToChampions.toLocaleString()} Gold: {data.goldEarned.toLocaleString()} CS {(data.neutralMinionsKilled + data.totalMinionsKilled)} ({((data.neutralMinionsKilled + data.totalMinionsKilled) / (gameData.info.gameDuration / 60)).toFixed(1)})

                                </p>
                            </div>
                          ))}
                        </div>
                        <div>
                          <h5>Team 2</h5>
                          {gameData.info.participants.slice(5, 10).map((data, participantIndex) => (
                            <div className={`player-container ${data.win ? 'win' : 'loss'}`} key={participantIndex}>
                              <p key={participantIndex}>
                              <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '5px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <img 
                                  style={{ position: 'relative', width: '20px', height: '20px'}}
                                  src={"https://lolcdn.darkintaqt.com/cdn/spells/" + data.summoner1Id}
                                  alt="Summoner Spell 1"
                                />
                                <img 
                                  style={{ position: 'relative', width: '20px', height: '20px'}}
                                  src={"https://lolcdn.darkintaqt.com/cdn/spells/" + data.summoner2Id}
                                  alt="Summoner Spell 2"
                                />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <img
                                  style={{ position: 'relative', width: '20px', height: '20px'}}
                                  src={`/${getPrimaryRune(data.perks.styles[0].selections[0].perk)}` }
                                  alt="primary rune"
                                />
                                <img
                                  style={{ position: 'relative', width: '20px', height: '20px'}}
                                  src={"https://static.bigbrain.gg/assets/lol/runes/" + data.perks.styles[1].style + ".png"}
                                  alt="secondary rune"
                                />
                                </div>
                                
                                <div style={{ position: 'relative', width: '60px', height: '60px', marginLeft: '3px' }}>
                                  <img
                                    style={{ width: '40px', height: '40px', justifyContent: 'left', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center' }}
                                    src={"https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/" + data.championId+ "/" + data.championId + "000.jpg"}
                                    alt="Champion Icon"
                                  />
                                   <span style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '50%',
                                    transform: 'translate(-120%)',
                                    color: 'white',
                                    padding: '5px',
                                    borderRadius: '50%',
                                    backgroundColor: '#31313c',
                                  }}>
                                    {data.champLevel}
                                  </span>
                                  
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                      <img
                                        style={{ width: '30px', height: '30px' }}
                                        src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + data.item0 + ".png.webp"}
                                        alt="Item 0"
                                      />
                                      <img
                                        style={{ width: '30px', height: '30px' }}
                                        src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + data.item1 + ".png.webp"}
                                        alt="Item 1"
                                      />
                                      <img
                                        style={{ width: '30px', height: '30px' }}
                                        src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + data.item2 + ".png.webp"}
                                        alt="Item 2"
                                      />
                                      <img
                                        style={{ width: '30px', height: '30px' }}
                                        src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + data.item3 + ".png.webp"}
                                        alt="Item 3"
                                      />
                                      <img
                                        style={{ width: '30px', height: '30px'  }}
                                        src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + data.item4 + ".png.webp"}
                                        alt="Item 4"
                                      />
                                      <img
                                        style={{ width: '30px', height: '30px' }}
                                        src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + data.item5 + ".png.webp"}
                                        alt="Item 5"
                                      />
                                      <img
                                        style={{ width: '30px', height: '30px' }}
                                        src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + data.item6 + ".png.webp"}
                                        alt="Item 6"
                                      />

                                      
                                  </div>
                                </div>
                                {data.riotIdGameName}#{data.riotIdTagline} <div className='player-stats'>{data.kills}/{data.deaths}/{data.assists}</div> {((data.kills + data.assists) / data.deaths).toFixed(2)} KDA Damage dealt: {data.totalDamageDealtToChampions.toLocaleString()} Gold: {data.goldEarned.toLocaleString()} CS {(data.neutralMinionsKilled + data.totalMinionsKilled)} ({((data.neutralMinionsKilled + data.totalMinionsKilled) / (gameData.info.gameDuration / 60)).toFixed(1)})
                                
                                </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                    </div>
                    
                  ))}
                </>
              ) : (
                <p>No games in match history found</p>
              )}
            </div>
          </div>
        </>
      }
    </div>
  );
}

export default App;
