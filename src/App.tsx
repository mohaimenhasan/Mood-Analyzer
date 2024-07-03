// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
    const hash = getTokenFromUrl();
    window.location.hash = '';
    const _token = hash.access_token || tokenFromStorage;

    if (_token) {
      setToken(_token);
      getUserData(_token).then(setUser);
      getUserTopTracks(_token).then(data => setTopTracks(data.items));
      getUserTopArtists(_token).then(data => setTopArtists(data.items));
    }
  }, []);

  useEffect(() => {
    if (topTracks.length > 0) {
      const analyzeTracks = async () => {
        const analysis = await Promise.all(
          topTracks.map(async track => {
            const lyrics = await getLyrics(track.name, track.artists[0].name);
            if (!lyrics) return { track: track.name, sentiment: 'unknown' };

            const sentiment = await analyzeSentiment(lyrics);
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
    </Routes>
  </Router>
);

export default App;
