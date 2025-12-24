import type { IVideoResponse, TranscriptFormat } from '@/types';

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

export async function getVideoData(videoId: string): Promise<IVideoResponse> {
  const response = await fetch(`${API_BASE_URL}/api/video/${videoId}`);
  return handleResponse<IVideoResponse>(response);
}

export async function getTranscriptRaw(
  videoId: string,
  format: TranscriptFormat,
  languages: string = 'en'
): Promise<string> {
  const params = new URLSearchParams({
    format,
    languages,
  });

  const response = await fetch(
    `${API_BASE_URL}/api/video/${videoId}/transcript?${params.toString()}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' })) as ApiError;
    throw new ApiClientError(
      errorData.message || `HTTP error ${response.status}`,
      response.status
    );
  }

  return response.text();
}

export { ApiClientError };
