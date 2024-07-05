// src/App.tsx

import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader'; // Import the spinner
import { analyzeSentiment } from './apis/azureSentiment';
import getSongDetails from './apis/azureSongHandlerAPI';
import { getTokenFromUrl, getUserData, getUserTopArtists, getUserTopTracks } from './apis/spotifyApi';
import './App.css';
import Login from './components/Login';
import SentimentChart from './components/SentimentChart';
import TopArtistsTable from './components/TopArtistsTable';
import TopTracksChart from './components/TopTracksChart';

const MainApp: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [moodAnalysis, setMoodAnalysis] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('top-songs');
  const [timeRange, setTimeRange] = useState<string>('medium_term'); // Add state for time range
  const [sentimentData, setSentimentData] = useState<any>({ short_term: [], medium_term: [], long_term: [] }); // Add state for sentiment data
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  const getSongSentiment = async (track: any) => {
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
  };

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
      setLoading(true);
      getUserData(token).then(data => {
        setUser(data);
        setLoading(false);
      });
      getUserTopTracks(token, timeRange).then(data => {
        setTopTracks(data.items);
        setLoading(false);
      }); // Pass timeRange
      getUserTopArtists(token, timeRange).then(data => {
        setTopArtists(data.items);
        setLoading(false);
      }); // Pass timeRange
    }
  }, [token, timeRange]); // Add timeRange as a dependency

  useEffect(() => {
    if (topTracks.length > 0) {
      setLoading(true);
      const analyzeTracks = async () => {
        const analysis = await Promise.all(
          topTracks.map(async track => {
            return await getSongSentiment(track);
          })
        );
        setMoodAnalysis(analysis);
        setLoading(false);
      };

      analyzeTracks();
    }
  }, [topTracks]);

  // Fetch sentiment data for all time ranges only when the active tab is 'sentiment-chart'
  useEffect(() => {
    if (token && activeTab === 'sentiment-chart') {
      const fetchSentimentData = async (range: string) => {
        setLoading(true);
        const tracks = await getUserTopTracks(token, range);
        const analysis = await Promise.all(
          tracks.items.map(async (track: any) => {
            return await getSongSentiment(track);
          })
        );
        setLoading(false);
        return analysis;
      };

      const fetchAllSentiments = async () => {
        const shortTerm = await fetchSentimentData('short_term');
        const mediumTerm = await fetchSentimentData('medium_term');
        const longTerm = await fetchSentimentData('long_term');
        setSentimentData({ short_term: shortTerm, medium_term: mediumTerm, long_term: longTerm });
      };

      fetchAllSentiments();
    }
  }, [token, activeTab]); // Add activeTab as a dependency

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return '#7DDA58';
      case 'negative':
        return '#DE4D4F';
      case 'neutral':
      default:
        return '#e9ecef';
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return <ClipLoader size={150} color={"#123abc"} loading={loading} />;
    }

    switch (activeTab) {
      case 'top-songs':
        return (
          <section>
            <h2>Your Top Tracks</h2>
            <TopTracksChart tracks={topTracks} />
          </section>
        );
      case 'top-artists':
        return (
          <section>
            <h2>Your Top Artists</h2>
            <TopArtistsTable artists={topArtists} />
          </section>
        );
      case 'mood-analysis':
        return (
          <section>
            <h2>Mood Analysis</h2>
            <ul className="mood-analysis">
              {moodAnalysis.map(({ track, sentiment }) => (
                <li key={track} style={{ backgroundColor: getSentimentColor(sentiment) }}>
                  <span>{track}</span>
                  <span>{sentiment}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      case 'sentiment-chart':
        return (
          <section>
            <h2>Sentiment Over Time</h2>
            <SentimentChart sentimentData={sentimentData} />
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`App ${token ? 'logged-in' : ''}`}>
      {!token ? (
        <Login />
      ) : (
        <div className="container">
          <header>
            <h1>Welcome, {user?.display_name}</h1>
          </header>
          <div className="time-range-selector">
            <label htmlFor="time-range">Select Time Range: </label>
            <select
              id="time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="short_term">Last 4 Weeks</option>
              <option value="medium_term">Last 6 Months</option>
              <option value="long_term">Last Year</option>
            </select>
          </div>
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === 'top-songs' ? 'active' : ''}`}
              onClick={() => setActiveTab('top-songs')}
            >
              Top Songs
            </button>
            <button
              className={`tab-button ${activeTab === 'top-artists' ? 'active' : ''}`}
              onClick={() => setActiveTab('top-artists')}
            >
              Top Artists
            </button>
            <button
              className={`tab-button ${activeTab === 'mood-analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('mood-analysis')}
            >
              Mood Analysis
            </button>
            <button
              className={`tab-button ${activeTab === 'sentiment-chart' ? 'active' : ''}`}
              onClick={() => setActiveTab('sentiment-chart')}
            >
              Sentiment Chart
            </button>
          </div>
          <div >
            {renderTabContent()}
          </div>
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
