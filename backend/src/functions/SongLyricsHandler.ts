import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from 'axios';

const geniusToken = process.env.GENIUS_API_TOKEN;

const geniusAPI = 'https://api.genius.com';

interface SongDetailsResponse {
    songDescription: string;
    songLanguage: string;
}

interface GeniusResponse {
    songPath: string;
    apiPath: string;
}

const getSongFromSearch = async (trackName: string, artistName: string, context: InvocationContext): Promise<GeniusResponse> => {
    try {
        const response = await axios.get(`${geniusAPI}/search`, {
            headers: {
                Authorization: `Bearer ${geniusToken}`
            },
            params: {
                q: `${trackName} ${artistName}`,
            },
        });

        const songPath = response.data.response.hits[0]?.result?.path;
        const apiPath = response.data.response.hits[0]?.result?.api_path;

        if (!songPath) {
            context.log('No song path found for', trackName, artistName);
            return { songPath: '', apiPath: '' };
        }

        context.log(`Got the song path: ${songPath}`);
        context.log(`Got the api path: ${apiPath}`);

        return { songPath, apiPath: apiPath };
    }
    catch (error) {
        context.warn('Error fetching song:', error);
        return { songPath: '', apiPath: '' };
    }
};

const getDetailedSong = async (api_path: string, context: InvocationContext) => {
    try {
        const response = await axios.get(`${geniusAPI}${api_path}?text_format=plain`, {
            headers: {
                Authorization: `Bearer ${geniusToken}`
            }
        });

        return response.data.response.song;
    } catch (error) {
        context.warn('Error fetching song:', error);
        return '';
    }
};

const getLyrics = async (trackName: string, artistName: string, context: InvocationContext): Promise<SongDetailsResponse | null> => {
    try {
        context.log("Getting song from search");
        const geniusResponse = await getSongFromSearch(trackName, artistName, context);
        context.log(JSON.stringify(geniusResponse));
        if (!geniusResponse.songPath) {
            return null;
        }

        context.log("Getting song language");
        const detailedSong = geniusResponse.apiPath ? await getDetailedSong(geniusResponse.apiPath, context) : '';
        if (!detailedSong) {
            return null;
        }
        var songLanguage = detailedSong.language;
        var songDescription = detailedSong.description ? detailedSong.description.plain : '';

        context.log(`Got the song languge: ${songLanguage}`);
        context.log(`Got the song description: ${songDescription}`);

        return { songDescription, songLanguage };
    } catch (error) {
        context.warn('Error fetching song:', error);
        return null;
    }
};

export async function SongLyricsHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function started processing request for url "${request.url}".`);

    const trackName = request.query.get('trackName');
    const artistName = request.query.get('artistName');

    context.log(`Received trackName: ${trackName}, artistName: ${artistName}.`);

    if (!trackName || !artistName) {
        context.log('Missing trackName or artistName in query parameters.');
        return {
            status: 400,
            body: "Please provide both 'trackName' and 'artistName' as query parameters."
        };
    }

    const songDetailedResponse = await getLyrics(trackName, artistName, context);

    if (!songDetailedResponse || !songDetailedResponse.songDescription) {
        return {
            status: 404,
            body: "Song not found."
        };
    }

    return {
        status: 200,
        body: JSON.stringify({
            songDescription: songDetailedResponse.songDescription,
            songLanguage: songDetailedResponse.songLanguage
        })
    };
}

app.http('SongLyricsHandler', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: SongLyricsHandler
});