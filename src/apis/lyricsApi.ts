import axios from 'axios';
import cheerio from 'cheerio';

const geniusToken = process.env.REACT_APP_GENIUS_API_TOKEN;
const corsByPass = 'https://thingproxy.freeboard.io';
const geniusAPI = 'https://api.genius.com';
const geniusWebPage = 'https://genius.com';

const getSongName = async (trackName: string, artistName: string) => {
  const response = await axios.get(`${corsByPass}/fetch/${geniusAPI}/search`, {
    headers: {
      Authorization: `Bearer ${geniusToken}`,
    },
    params: {
      q: `${trackName} ${artistName}`,
    },
  });

  // console.log('Genius API response:', response.data);

  const songPath = response.data.response.hits[0]?.result?.path;
  if (!songPath) {
    console.warn('No song path found for', trackName, artistName);
    return null;
  }

  return songPath;
};

const getLyrics = async (trackName: string, artistName: string) => {
  const songPath = await getSongName(trackName, artistName);
  if (!songPath) {
    return null;
  }

  try {
    const lyricsPage = await axios.get(`${corsByPass}/fetch/${geniusWebPage}${songPath}`);
    const $ = cheerio.load(lyricsPage.data);
    const lyrics = $('div.lyrics').text().trim() || $('div[class^="Lyrics__Container"]').text().trim();
    
    // console.log('Lyrics:', lyrics);
    return lyrics;
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return null;
  }
};

export { getLyrics };
