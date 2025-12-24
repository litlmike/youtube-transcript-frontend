import { useState, useCallback } from 'react';
import { VideoInput } from '@/components/VideoInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function App(): React.ReactElement {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoSubmit = useCallback((id: string): void => {
    setIsLoading(true);
    setVideoId(id);
    // TODO: Fetch video info and transcript
    setIsLoading(false);
  }, []);

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

        {videoId && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Video ID: {videoId}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Transcript display coming soon...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App
