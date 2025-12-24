export interface IVideoInfo {
  video_id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  channel: string;
  uploader: string;
  upload_date: string;
  view_count: number;
  like_count: number;
}

export interface ITranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

export interface ITranscript {
  video_id: string;
  language: string;
  language_code: string;
  is_generated: boolean;
  snippets: ITranscriptEntry[];
}

export interface IAvailableSubtitles {
  video_id: string;
  manual_subtitles: string[];
  automatic_captions: string[];
}

export interface IVideoResponse {
  info: IVideoInfo;
  transcript: ITranscript | null;
  available_subtitles: IAvailableSubtitles;
}

export type TranscriptFormat = 'json' | 'text' | 'srt' | 'vtt';
