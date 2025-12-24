import { useState, useCallback, useMemo, memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatTimestamp, formatTimestampSrt, formatTimestampVtt } from '@/lib/formatters';
import { getFileExtension, getMimeType, sanitizeFilename } from '@/lib/file-utils';
import type { ITranscriptEntry, TranscriptFormat } from '@/types';

interface TranscriptActionsProps {
  entries: ITranscriptEntry[];
  videoId: string;
  videoTitle: string;
  format: TranscriptFormat;
  rawTranscript: string | null;
  isLoading: boolean;
  onFormatChange: (format: TranscriptFormat) => void;
}

function generateTranscriptContent(
  entries: ITranscriptEntry[],
  format: TranscriptFormat
): string {
  switch (format) {
    case 'json':
      return JSON.stringify(entries, null, 2);

    case 'text':
      return entries
        .map((entry) => `[${formatTimestamp(entry.start)}] ${entry.text}`)
        .join('\n');

    case 'srt':
      return entries
        .map((entry, index) => {
          const startTime = formatTimestampSrt(entry.start);
          const endTime = formatTimestampSrt(entry.start + entry.duration);
          return `${index + 1}\n${startTime} --> ${endTime}\n${entry.text}\n`;
        })
        .join('\n');

    case 'vtt': {
      const header = 'WEBVTT\n\n';
      const content = entries
        .map((entry) => {
          const startTime = formatTimestampVtt(entry.start);
          const endTime = formatTimestampVtt(entry.start + entry.duration);
          return `${startTime} --> ${endTime}\n${entry.text}\n`;
        })
        .join('\n');
      return header + content;
    }

    default:
      return '';
  }
}

export const TranscriptActions = memo(function TranscriptActions({
  entries,
  videoId,
  videoTitle,
  format,
  rawTranscript,
  isLoading,
  onFormatChange,
}: TranscriptActionsProps): React.ReactElement {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const transcriptContent = useMemo((): string => {
    if (rawTranscript && format !== 'json') {
      return rawTranscript;
    }
    return generateTranscriptContent(entries, format);
  }, [entries, format, rawTranscript]);

  const handleCopy = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(transcriptContent);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  }, [transcriptContent]);

  const handleDownload = useCallback((): void => {
    const blob = new Blob([transcriptContent], { type: getMimeType(format) });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `${sanitizeFilename(videoTitle)}_${videoId}.${getFileExtension(format)}`;

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [transcriptContent, format, videoId, videoTitle]);

  const handleFormatChange = useCallback(
    (value: string): void => {
      onFormatChange(value as TranscriptFormat);
    },
    [onFormatChange]
  );

  const getCopyButtonText = (): string => {
    switch (copyStatus) {
      case 'copied':
        return 'Copied!';
      case 'error':
        return 'Failed';
      default:
        return 'Copy';
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select value={format} onValueChange={handleFormatChange} disabled={isLoading}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="json">JSON</SelectItem>
          <SelectItem value="text">Text</SelectItem>
          <SelectItem value="srt">SRT</SelectItem>
          <SelectItem value="vtt">VTT</SelectItem>
        </SelectContent>
      </Select>

      {isLoading && (
        <span className="text-sm text-muted-foreground animate-pulse">
          Loading...
        </span>
      )}

      <Button
        variant="outline"
        size="default"
        onClick={handleCopy}
        disabled={isLoading || entries.length === 0}
      >
        {getCopyButtonText()}
      </Button>

      <Button
        variant="outline"
        size="default"
        onClick={handleDownload}
        disabled={isLoading || entries.length === 0}
      >
        Download
      </Button>
    </div>
  );
});
