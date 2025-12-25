import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TranscriptDisplay } from '@/components/TranscriptDisplay';
import { TranscriptActions } from '@/components/TranscriptActions';
import { formatDuration } from '@/lib/formatters';
import type { IVideoInfo, ITranscript, TranscriptFormat } from '@/types';

interface VideoCardProps {
  videoInfo: IVideoInfo;
  transcript: ITranscript | null;
  rawTranscript: string | null;
  format: TranscriptFormat;
  isLoading: boolean;
  hasTranscript: boolean;
  onFormatChange: (format: TranscriptFormat) => void;
}

export const VideoCard = memo(function VideoCard({
  videoInfo,
  transcript,
  rawTranscript,
  format,
  isLoading,
  hasTranscript,
  onFormatChange,
}: VideoCardProps): React.ReactElement {
  const videoUrl = `https://www.youtube.com/watch?v=${videoInfo.video_id}`;

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex gap-4">
          <a
            href={videoUrl}
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
              href={videoUrl}
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
                  onFormatChange={onFormatChange}
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
  );
});
