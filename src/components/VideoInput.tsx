import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { extractVideoId } from '@/lib/api';

interface VideoInputProps {
  onSubmit: (videoId: string) => void;
  isLoading?: boolean;
}

export function VideoInput({ onSubmit, isLoading = false }: VideoInputProps): React.ReactElement {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      setError(null);

      const trimmedInput = inputValue.trim();
      if (!trimmedInput) {
        setError('Please enter a YouTube URL or video ID');
        return;
      }

      const videoId = extractVideoId(trimmedInput);
      if (!videoId) {
        setError('Invalid YouTube URL or video ID');
        return;
      }

      onSubmit(videoId);
    },
    [inputValue, onSubmit]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setInputValue(e.target.value);
      if (error) {
        setError(null);
      }
    },
    [error]
  );

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter YouTube URL or video ID..."
          value={inputValue}
          onChange={handleInputChange}
          disabled={isLoading}
          className="flex-1"
          aria-label="YouTube URL or video ID"
          aria-invalid={!!error}
          aria-describedby={error ? 'input-error' : undefined}
        />
        <Button type="submit" disabled={isLoading || !inputValue.trim()}>
          {isLoading ? 'Loading...' : 'Get Transcript'}
        </Button>
      </div>
      {error && (
        <p id="input-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Supported formats: youtube.com/watch?v=..., youtu.be/..., or just the video ID
      </p>
    </form>
  );
}
