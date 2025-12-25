import { formatTimestamp, formatTimestampSrt, formatTimestampVtt } from '@/lib/formatters';
import type { ITranscriptEntry, TranscriptFormat } from '@/types';

/**
 * Convert transcript entries to various output formats
 */
export function generateTranscriptContent(
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
