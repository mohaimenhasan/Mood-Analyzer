import axios from 'axios';

const endpoint = process.env.REACT_APP_AZURE_SENTIMENT_ENDPOINT;
const apiKey = process.env.REACT_APP_AZURE_SENTIMENT_ENDPOINT_KEY;

export interface SentimentAnalysisResult {
  id: string;
  sentiment: string;
  confidenceScores: {
    positive: number;
    neutral: number;
    negative: number;
  };
  sentences: Sentence[];
  warnings: any[];
}

export interface Sentence {
  sentiment: string;
  confidenceScores: {
    positive: number;
    neutral: number;
    negative: number;
  };
  offset: number;
  length: number;
  text: string;
}

export const analyzeSentiment = async (text: string, language: string) : Promise<SentimentAnalysisResult | null> => {
  try{
    const response = await axios.post(
      `${endpoint}/text/analytics/v3.0/sentiment`,
      {
        documents: [
          {
            id: '1', 
            language, 
            text 
          }],
      },
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const sentimentData: SentimentAnalysisResult = response.data.documents[0];

    return sentimentData;
  }
  catch (err){
    console.warn('Error analyzing sentiment:', err);
    return null;
  }
};
  