import axios from 'axios';

const endpoint = process.env.REACT_APP_AZURE_SENTIMENT_ENDPOINT;
const apiKey = process.env.REACT_APP_AZURE_SENTIMENT_API_KEY;

export const analyzeSentiment = async (text: string) => {
  try{
    const response = await axios.post(
      `${endpoint}/text/analytics/v3.0/sentiment`,
      {
        documents: [{ id: '1', language: 'en', text }],
      },
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data.documents[0]?.sentiment;
  }
  catch (err){
    console.warn('Error analyzing sentiment:', err);
    return 'unknown';
  }
};
  