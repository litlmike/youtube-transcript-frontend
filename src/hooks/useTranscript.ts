import { useState, useEffect, useCallback } from 'react';
import { getVideoInfo, getTranscript, ApiClientError } from '@/lib/api';
import type { IVideoInfo, ITranscriptResponse, TranscriptFormat } from '@/types';

interface UseTranscriptState {
  videoInfo: IVideoInfo | null;
  transcript: ITranscriptResponse | null;
  rawTranscript: string | null;
  isLoading: boolean;
  error: string | null;
  format: TranscriptFormat;
}

interface UseTranscriptReturn extends UseTranscriptState {
  fetchTranscript: (videoId: string) => Promise<void>;
  changeFormat: (format: TranscriptFormat) => void;
  reset: () => void;
}

const initialState: UseTranscriptState = {
  videoInfo: null,
  transcript: null,
  rawTranscript: null,
  isLoading: false,
  error: null,
  format: 'json',
};

export function useTranscript(): UseTranscriptReturn {
  const [state, setState] = useState<UseTranscriptState>(initialState);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const fetchTranscript = useCallback(async (videoId: string): Promise<void> => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      videoInfo: null,
      transcript: null,
      rawTranscript: null,
    }));
    setCurrentVideoId(videoId);

    try {
      // Fetch video info and transcript in parallel
      const [videoInfo, transcriptData] = await Promise.all([
        getVideoInfo(videoId),
        getTranscript(videoId, 'json'),
      ]);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        videoInfo,
        transcript: transcriptData as ITranscriptResponse,
        rawTranscript: null,
        format: 'json',
      }));
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to fetch transcript';

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
    }
  }, []);

  const changeFormat = useCallback((newFormat: TranscriptFormat): void => {
    setState((prev) => ({ ...prev, format: newFormat }));
  }, []);

  // Refetch transcript when format changes
  useEffect(() => {
    if (!currentVideoId || state.format === 'json') {
      return;
    }

    const fetchRawTranscript = async (): Promise<void> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const rawData = await getTranscript(currentVideoId, state.format);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          rawTranscript: rawData as string,
        }));
      } catch (err) {
        const message =
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Failed to fetch transcript';

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
      }
    };

    void fetchRawTranscript();
  }, [currentVideoId, state.format]);

  const reset = useCallback((): void => {
    setState(initialState);
    setCurrentVideoId(null);
  }, []);

  return {
    ...state,
    fetchTranscript,
    changeFormat,
    reset,
  };
}
