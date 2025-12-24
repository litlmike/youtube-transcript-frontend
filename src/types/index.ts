export interface IVideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  channel: string;
}

export interface ITranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

export interface ITranscriptResponse {
  video_id: string;
  language: string;
  transcript: ITranscriptEntry[];
}

export type TranscriptFormat = 'json' | 'text' | 'srt' | 'vtt';
