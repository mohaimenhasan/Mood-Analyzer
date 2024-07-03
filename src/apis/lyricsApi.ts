import axios from 'axios';
import cheerio from 'cheerio';

const geniusToken = process.env.REACT_APP_GENIUS_API_TOKEN;
const corsByPass = 'https://thingproxy.freeboard.io';
const geniusAPI = 'https://api.genius.com';
const geniusWebPage = 'https://genius.com';

interface LyricsResponse {
  lyrics: string;
  songLanguage: string;
}

interface GeniusResponse {
  songPath: string;
  apiPath: string;
}

const getSongFromSearch = async (trackName: string, artistName: string): Promise<GeniusResponse> => {
  const response = await axios.get(`${corsByPass}/fetch/${geniusAPI}/search`, {
    headers: {
      Authorization: `Bearer ${geniusToken}`,
    },
    params: {
      q: `${trackName} ${artistName}`,
    },
  });
  
  const songPath = response.data.response.hits[0]?.result?.path;
  const apiPath = response.data.response.hits[0]?.result?.api_path;
  if (!songPath) {
    console.warn('No song path found for', trackName, artistName);
    return { songPath: '', apiPath: ''};
  }

  return { songPath, apiPath: apiPath};
};

const getSongLanuage = async (api_path: string) => {
  try{
    const response = await axios.get(`${corsByPass}/fetch/${geniusAPI}${api_path}`, {
      headers: {
        Authorization: `Bearer ${geniusToken}`,
      }
    });
    
    return response.data.response.song.language || 'en';
  }
  catch (error) {
    console.warn('Error fetching song language:', error);
    return 'en';
  }
};

const getLyrics = async (trackName: string, artistName: string) : Promise<LyricsResponse | null> => {
  const geniusResponse = await getSongFromSearch(trackName, artistName);
  if (!geniusResponse.songPath) {
    return null;
  }
  const songLanguage = geniusResponse.apiPath ? await getSongLanuage(geniusResponse.apiPath) : 'en';
  
  try {
    const lyricsPage = await axios.get(`${corsByPass}/fetch/${geniusWebPage}${geniusResponse.songPath}`);
    const $ = cheerio.load(lyricsPage.data);
    const lyrics = $('div.lyrics').text().trim() || $('div[class^="Lyrics__Container"]').text().trim();
    
    return {lyrics, songLanguage};
  }
  catch (error) {
    console.warn('Error fetching lyrics:', error);
    return null;
  }
};

export { getLyrics };
