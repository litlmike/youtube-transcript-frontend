import { useCallback, useState } from 'react';
import { VideoInput } from '@/components/VideoInput';
import { VideoCard } from '@/components/VideoCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTranscript } from '@/hooks/useTranscript';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

function App(): React.ReactElement {
  const [lastVideoId, setLastVideoId] = useState<string | null>(null);
  const {
    videoInfo,
    transcript,
    rawTranscript,
    isLoading,
    error,
    format,
    hasTranscript,
    fetchTranscript,
    changeFormat,
  } = useTranscript();

  const handleVideoSubmit = useCallback(
    (videoId: string): void => {
      setLastVideoId(videoId);
      void fetchTranscript(videoId);
    },
    [fetchTranscript]
  );

  const handleRetry = useCallback((): void => {
    if (lastVideoId) {
      void fetchTranscript(lastVideoId);
    }
  }, [fetchTranscript, lastVideoId]);

  return (
    <div className="min-h-screen bg-background transition-colors">
      <Toaster position="bottom-right" />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">YouTube Transcript</h1>
            <p className="text-muted-foreground">
              Fetch and download transcripts from any YouTube video
            </p>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Enter Video URL</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoInput onSubmit={handleVideoSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>

        {error && !videoInfo && (
          <Card className="mt-4 border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive mb-4">{error}</p>
              {lastVideoId && (
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  disabled={isLoading}
                >
                  {isLoading ? 'Retrying...' : 'Try Again'}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {isLoading && !videoInfo && <LoadingSkeleton />}

        {!isLoading && videoInfo && (
          <VideoCard
            videoInfo={videoInfo}
            transcript={transcript}
            rawTranscript={rawTranscript}
            format={format}
            isLoading={isLoading}
            hasTranscript={hasTranscript}
            onFormatChange={changeFormat}
          />
        )}
      </div>
    </div>
  );
}

export default App
