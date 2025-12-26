import { useState, useEffect, useCallback } from 'react';
import { getVideoData, getTranscriptRaw, ApiClientError } from '@/lib/api';
import type { IVideoInfo, ITranscript, TranscriptFormat } from '@/types';

interface UseTranscriptState {
  videoInfo: IVideoInfo | null;
  transcript: ITranscript | null;
  rawTranscript: string | null;
  isLoading: boolean;
  error: string | null;
  format: TranscriptFormat;
  hasTranscript: boolean;
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
  format: 'text',
  hasTranscript: false,
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
      hasTranscript: false,
    }));
    setCurrentVideoId(videoId);

    try {
      const videoData = await getVideoData(videoId);

      const hasTranscript = videoData.transcript !== null &&
        videoData.transcript.snippets !== undefined &&
        videoData.transcript.snippets.length > 0;

      setState((prev) => ({
        ...prev,
        isLoading: false,
        videoInfo: videoData.info,
        transcript: videoData.transcript,
        rawTranscript: null,
        format: 'text',
        hasTranscript,
        error: null,
      }));
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to fetch video data';

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

  // Refetch transcript when format changes to non-JSON
  useEffect(() => {
    if (!currentVideoId || state.format === 'json' || !state.hasTranscript) {
      return;
    }

    const fetchRawTranscript = async (): Promise<void> => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const rawData = await getTranscriptRaw(currentVideoId, state.format);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          rawTranscript: rawData,
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
  }, [currentVideoId, state.format, state.hasTranscript]);

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
