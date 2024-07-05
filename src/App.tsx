// src/App.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { analyzeSentiment } from './apis/azureSentiment';
import getSongDetails from './apis/azureSongHandlerAPI';
import { getTokenFromUrl, getUserData, getUserTopArtists, getUserTopTracks } from './apis/spotifyApi';
import './App.css';
import Login from './components/Login';
import TopArtistsTable from './components/TopArtistsTable';
import TopTracksChart from './components/TopTracksChart';

const MainApp: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [moodAnalysis, setMoodAnalysis] = useState<any[]>([]);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('spotifyToken');
    const tokenExpiration = localStorage.getItem('spotifyTokenExpiration');
    const hash = getTokenFromUrl();
    window.location.hash = '';
    const _token = hash.access_token;

    if (_token) {
      const _expires_in = hash.expires_in;
      const expirationTime = new Date().getTime() + _expires_in * 1000;
      localStorage.setItem('spotifyToken', _token);
      localStorage.setItem('spotifyTokenExpiration', expirationTime.toString());
      setToken(_token);
    } else if (tokenFromStorage && tokenExpiration) {
      const expirationTime = parseInt(tokenExpiration);
      if (new Date().getTime() < expirationTime) {
        setToken(tokenFromStorage);
      } else {
        localStorage.removeItem('spotifyToken');
        localStorage.removeItem('spotifyTokenExpiration');
      }
    } else {
      console.log("No token found");
    }
  }, []);

  useEffect(() => {
    if (token) {
      getUserData(token).then(setUser);
      getUserTopTracks(token).then(data => setTopTracks(data.items));
      getUserTopArtists(token).then(data => setTopArtists(data.items));
    }
  }, [token]);

  useEffect(() => {
    if (topTracks.length > 0) {
      const analyzeTracks = async () => {
        const analysis = await Promise.all(
          topTracks.map(async track => {
            const cacheKey = `sentiment-${track.id}`;
            const cachedSentiment = localStorage.getItem(cacheKey);
            if (cachedSentiment) {
              return JSON.parse(cachedSentiment);
            } else {
              const songDetails = await getSongDetails(track.name, track.artists[0].name);
              if (!songDetails) {
                return { track: track.name, sentiment: 'unknown' };
              }

              const sentiment = await analyzeSentiment(songDetails.songDescription, songDetails.songLanguage);
              const sentimentAnalysis = {
                track: track.name,
                sentiment
              };
              localStorage.setItem(cacheKey, JSON.stringify(sentimentAnalysis));
              return sentimentAnalysis;
            }
          })
        );
        setMoodAnalysis(analysis);
      };

      analyzeTracks();
    }
  }, [topTracks]);

  return (
    <div className="App">
      {!token ? (
        <Login />
      ) : (
        <div className="container">
          <header>
            <h1>Welcome, {user?.display_name}</h1>
          </header>
          <section>
            <h2>Your Top Tracks</h2>
            <TopTracksChart tracks={topTracks} />
          </section>
          <section>
            <h2>Mood Analysis</h2>
            <ul className="mood-analysis">
              {moodAnalysis.map(({ track, sentiment }) => (
                <li key={track} className={sentiment.toLowerCase()}>
                  <span>{track}</span>
                  <span>{sentiment}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Your Top Artists</h2>
            <TopArtistsTable artists={topArtists} />
          </section>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <Router basename="/Mood-Analyzer">
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

export default App;
