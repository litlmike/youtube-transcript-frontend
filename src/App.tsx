import { useCallback, useState } from 'react';
import { VideoInput } from '@/components/VideoInput';
import { TranscriptDisplay } from '@/components/TranscriptDisplay';
import { TranscriptActions } from '@/components/TranscriptActions';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTranscript } from '@/hooks/useTranscript';
import { formatDuration } from '@/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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

        {isLoading && !videoInfo && (
          <Card className="mt-4">
            <CardHeader>
              <div className="flex gap-4">
                {/* Thumbnail skeleton */}
                <Skeleton className="w-32 h-18 rounded-md shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Title skeleton */}
                  <Skeleton className="h-6 w-3/4" />
                  {/* Channel and duration skeleton */}
                  <Skeleton className="h-4 w-1/2" />
                  {/* Action buttons skeleton */}
                  <div className="flex gap-2 mt-3">
                    <Skeleton className="h-10 w-[120px]" />
                    <Skeleton className="h-10 w-16" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and badges skeleton */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-24" />
              </div>
              {/* Transcript area skeleton */}
              <Skeleton className="h-[400px] w-full rounded-md" />
            </CardContent>
          </Card>
        )}

        {!isLoading && videoInfo && (
          <Card className="mt-4">
            <CardHeader>
              <div className="flex gap-4">
                <a
                  href={`https://www.youtube.com/watch?v=${videoInfo.video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    className="w-32 h-auto rounded-md object-cover hover:opacity-80 transition-opacity"
                  />
                </a>
                <div className="flex-1 min-w-0">
                  <a
                    href={`https://www.youtube.com/watch?v=${videoInfo.video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    <CardTitle className="line-clamp-2">{videoInfo.title}</CardTitle>
                  </a>
                  <CardDescription className="mt-1">
                    {videoInfo.channel} • {formatDuration(videoInfo.duration)}
                  </CardDescription>
                  {hasTranscript && transcript && (
                    <div className="mt-3">
                      <TranscriptActions
                        entries={transcript.snippets}
                        videoId={videoInfo.video_id}
                        videoTitle={videoInfo.title}
                        format={format}
                        rawTranscript={rawTranscript}
                        isLoading={isLoading}
                        onFormatChange={changeFormat}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {hasTranscript && transcript ? (
                <TranscriptDisplay
                  entries={transcript.snippets}
                  language={transcript.language}
                />
              ) : (
                <div className="text-center py-8 bg-muted/50 rounded-lg">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="font-medium text-foreground">
                    No transcript available
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This video doesn't have captions or subtitles enabled.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App
