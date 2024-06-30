import React from 'react';
import { loginUrl } from '../apis/spotifyApi';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginBox = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

const LoginButton = styled.a`
  display: inline-block;
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 5px;
  background-color: #1db954;
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
  &:hover {
    background-color: #1ed760;
  }
`;

const Login: React.FC = () => {
  return (
    <LoginContainer>
      <LoginBox>
        <Title>Welcome to Spotify Visualizer</Title>
        <p>Discover your music habits and mood analysis</p>
        <LoginButton href={loginUrl}>Login to Spotify</LoginButton>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;