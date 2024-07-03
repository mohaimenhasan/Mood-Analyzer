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

    if (_token) {
      localStorage.setItem('spotifyToken', _token);
      navigate('/');
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
