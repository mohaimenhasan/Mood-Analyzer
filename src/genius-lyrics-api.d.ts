// src/genius-lyrics-api.d.ts
declare module 'genius-lyrics-api' {
    interface LyricsOptions {
      apiKey: string;
      title: string;
      artist: string;
      optimizeQuery: boolean;
    }
  
    export function getLyrics(options: LyricsOptions): Promise<string>;
    export function getSong(options: LyricsOptions): Promise<{
      id: string;
      title: string;
      url: string;
      albumArt: string;
      lyrics: string;
    }>;
  }
  