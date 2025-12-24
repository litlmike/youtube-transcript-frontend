import { useCallback } from 'react';
import { VideoInput } from '@/components/VideoInput';
import { TranscriptDisplay } from '@/components/TranscriptDisplay';
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
    isLoading,
    error,
    fetchTranscript,
  } = useTranscript();

  const handleVideoSubmit = useCallback(
    (videoId: string): void => {
      void fetchTranscript(videoId);
    },
    [fetchTranscript]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">YouTube Transcript</h1>
          <p className="text-muted-foreground">
            Fetch and download transcripts from any YouTube video
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Enter Video URL</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoInput onSubmit={handleVideoSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>

        {error && (
          <Card className="mt-4 border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {isLoading && (
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

        {!isLoading && videoInfo && transcript && (
          <Card className="mt-4">
            <CardHeader>
              <div className="flex gap-4">
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-32 h-auto rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <CardTitle className="line-clamp-2">{videoInfo.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {videoInfo.channel} • {formatDuration(videoInfo.duration)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TranscriptDisplay
                entries={transcript.transcript}
                language={transcript.language}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App
