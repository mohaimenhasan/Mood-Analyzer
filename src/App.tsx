// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getTokenFromUrl, getUserData, getUserTopTracks, getUserTopArtists } from './apis/spotifyApi';
import { analyzeSentiment } from './apis/azureSentiment';
import { getLyrics } from './apis/lyricsApi';
import TopTracksChart from './components/TopTracksChart';
import Login from './components/Login';
import Callback from './Callback';
import './App.css';

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
      // If we have a new token, set it and store the expiration time
      const _expires_in = hash.expires_in;
      const expirationTime = new Date().getTime() + _expires_in * 1000;
      localStorage.setItem('spotifyToken', _token);
      localStorage.setItem('spotifyTokenExpiration', expirationTime.toString());
      setToken(_token);
    } else if (tokenFromStorage && tokenExpiration) {
      // Check if the stored token has expired
      const expirationTime = parseInt(tokenExpiration);
      if (new Date().getTime() < expirationTime) {
        setToken(tokenFromStorage);
      } else {
        // Token has expired
        localStorage.removeItem('spotifyToken');
        localStorage.removeItem('spotifyTokenExpiration');
      }
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
            const lyricsResponse = await getLyrics(track.name, track.artists[0].name);
            if (!lyricsResponse) return { track: track.name, sentiment: 'unknown' };

            const sentiment = await analyzeSentiment(lyricsResponse.lyrics, lyricsResponse.songLanguage);
            return { track: track.name, sentiment };
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
        <div>
          <h1>Welcome, {user?.display_name}</h1>
          <h2>Your Top Tracks</h2>
          <TopTracksChart tracks={topTracks} />
          <h2>Your Top Artists</h2>
          <ul>
            {topArtists.map(artist => (
              <li key={artist.id}>{artist.name}</li>
            ))}
          </ul>
          <h2>Mood Analysis</h2>
          <ul>
            {moodAnalysis.map(({ track, sentiment }) => (
              <li key={track}>{track}: {sentiment}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <Router basename="/Mood-Analyzer">
    <Routes>
      <Route path="/callback" element={<Callback />} />
      <Route path="/" element={<MainApp />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

export default App;