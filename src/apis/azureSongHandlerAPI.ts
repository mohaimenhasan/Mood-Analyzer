import axios from 'axios';

interface SongDetails {
    songDescription: string;
    songLanguage: string;
}

const songDetailsAPI = process.env.REACT_APP_AZURE_SONG_HANDLER;

const getSongDetails = async (trackName: string, artistName: string): Promise<SongDetails | null> => {
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${songDetailsAPI}?trackName=${trackName}&artistName=${artistName}`,
        headers: {}
    };

    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default getSongDetails;