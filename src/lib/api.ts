import type { IVideoInfo, ITranscriptResponse, TranscriptFormat } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiError {
  message: string;
  status: number;
}

class ApiClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' })) as ApiError;
    throw new ApiClientError(
      errorData.message || `HTTP error ${response.status}`,
      response.status
    );
  }
  return response.json() as Promise<T>;
}

export function extractVideoId(input: string): string | null {
  const patterns = [
    // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // Short URL: https://youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // Embed URL: https://www.youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // Shorts URL: https://www.youtube.com/shorts/VIDEO_ID
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    // Direct video ID (11 characters)
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

export async function getVideoInfo(videoId: string): Promise<IVideoInfo> {
  const response = await fetch(`${API_BASE_URL}/api/video/${videoId}/info`);
  return handleResponse<IVideoInfo>(response);
}

export async function getTranscript(
  videoId: string,
  format: TranscriptFormat = 'json',
  languages: string = 'en'
): Promise<ITranscriptResponse | string> {
  const params = new URLSearchParams({
    format,
    languages,
  });

  const response = await fetch(
    `${API_BASE_URL}/api/video/${videoId}/transcript?${params.toString()}`
  );

  if (format === 'json') {
    return handleResponse<ITranscriptResponse>(response);
  }

  // For text, srt, vtt formats, return raw text
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' })) as ApiError;
    throw new ApiClientError(
      errorData.message || `HTTP error ${response.status}`,
      response.status
    );
  }

  return response.text();
}

export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return handleResponse<{ status: string }>(response);
}

export { ApiClientError };
