// src/Callback.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenFromUrl } from './apis/spotifyApi';

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = '';
    const _token = hash.access_token;
    const _expires_in = hash.expires_in;

    if (_token) {
      console.log('we found an access token from the URL in the callback file');
      const expirationTime = new Date().getTime() + _expires_in * 1000; // _expires_in is in seconds
      localStorage.setItem('spotifyToken', _token);
      localStorage.setItem('spotifyTokenExpiration', expirationTime.toString());
      navigate('/');
    } else {
      console.log('no token found in the callback file');
      navigate('/'); // Redirect to home if no token is found
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
