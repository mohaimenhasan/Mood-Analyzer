
# Spotify Mood Analyzer

## Overview

The Spotify Mood Analyzer is a React application that connects to the Spotify API to fetch a user's top tracks and artists. It performs sentiment analysis on the lyrics of the top tracks using the Azure Sentiment API and displays the results in a user-friendly interface.

## Features

- User Authentication with Spotify
- Fetch and display user's top tracks and artists
- Perform sentiment analysis on top tracks' lyrics using Azure Sentiment API
- Display sentiment analysis results

## Prerequisites

- Node.js and npm installed
- Spotify Developer account with client credentials
- Azure account for sentiment analysis
- Lyrics API access

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mohaimenhasan/Mood-Analyzer.git
cd Mood-Analyzer
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Spotify, Azure, and Lyrics API credentials:

```bash
REACT_APP_GENIUS_API_TOKEN=your_lyrics_api_key
REACT_APP_AZURE_SENTIMENT_ENDPOINT=your_azure_endpoint
REACT_APP_AZURE_SENTIMENT_ENDPOINT_KEY=your_azure_key
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
REACT_APP_SPOTIFY_REDIRECT_URI=your_spotify_redirect_uri
GENERATE_SOURCEMAP=false
REACT_APP_AZURE_SONG_HANDLER=your_song_handler_to_handle_song
```

## Usage

1. Start the development server:

```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`.

3. Log in with your Spotify account.

4. View your top tracks, top artists, and mood analysis results.

## Project Structure

```
src/
│
├── apis/
│   ├── azureSentiment.ts
│   ├── lyricsApi.ts
│   └── spotifyApi.ts
│
├── components/
│   ├── Login.tsx
│   └── TopTracksChart.tsx
│
├── App.css
├── App.tsx
├── index.css
├── index.tsx
│
├── ...
```

## API Endpoints

- **Spotify API**: Fetches user data, top tracks, and top artists.
- **Azure Sentiment API**: Analyzes sentiment of lyrics.
- **Lyrics API**: Retrieves lyrics for tracks.

## Important Files

- `App.tsx`: Main component that handles authentication, data fetching, and rendering.
- `spotifyApi.ts`: Contains functions to interact with Spotify API.
- `azureSentiment.ts`: Contains function to interact with Azure Sentiment API.
- `lyricsApi.ts`: Contains function to interact with Lyrics API.
- `TopTracksChart.tsx`: Component to display top tracks in a chart.
- `Login.tsx`: Component for user authentication with Spotify.

## License

This project is licensed under the MIT License.
