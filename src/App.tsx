import { useCallback } from 'react';
import { VideoInput } from '@/components/VideoInput';
import { TranscriptDisplay } from '@/components/TranscriptDisplay';
import { TranscriptActions } from '@/components/TranscriptActions';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTranscript } from '@/hooks/useTranscript';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function App(): React.ReactElement {
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
      void fetchTranscript(videoId);
    },
    [fetchTranscript]
  );

  return (
    <div className="min-h-screen bg-background transition-colors">
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
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {isLoading && !videoInfo && (
          <Card className="mt-4">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-[400px] w-full" />
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
                        entries={transcript}
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
                  entries={transcript}
                  language="en"
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No transcript available for this video.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
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
