import React, { useEffect, useState } from 'react';
import { getTokenFromUrl, getUserData, getUserTopTracks, getUserTopArtists } from './apis/spotifyApi';
import TopTracksChart from './components/TopTracksChart';
import Login from './components/Login';
import './App.css';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = '';
    const _token = hash.access_token;

    if (_token) {
      setToken(_token);
      getUserData(_token).then(setUser);
      getUserTopTracks(_token).then(data => setTopTracks(data.items));
      getUserTopArtists(_token).then(data => setTopArtists(data.items));
    }
  }, []);

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
        </div>
      )}
    </div>
  );
};

export default App;
