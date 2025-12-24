import type { TranscriptFormat } from '@/types';

/**
 * Get file extension for a transcript format
 */
export function getFileExtension(format: TranscriptFormat): string {
  switch (format) {
    case 'json':
      return 'json';
    case 'text':
      return 'txt';
    case 'srt':
      return 'srt';
    case 'vtt':
      return 'vtt';
    default:
      return 'txt';
  }
}

/**
 * Get MIME type for a transcript format
 */
export function getMimeType(format: TranscriptFormat): string {
  switch (format) {
    case 'json':
      return 'application/json';
    case 'vtt':
      return 'text/vtt';
    case 'srt':
      return 'application/x-subrip';
    default:
      return 'text/plain';
  }
}

/**
 * Sanitize a string for use as a filename
 */
export function sanitizeFilename(title: string): string {
  return title
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 100);
}
