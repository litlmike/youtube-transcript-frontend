import { useState, useMemo, useCallback, memo } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatTimestamp } from '@/lib/formatters';
import type { ITranscriptEntry } from '@/types';

/**
 * Convert seconds to ISO 8601 duration format (PTnHnMnS)
 * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
 */
function toIsoDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  let duration = 'PT';
  if (hours > 0) duration += `${hours}H`;
  if (minutes > 0) duration += `${minutes}M`;
  if (secs > 0 || duration === 'PT') duration += `${secs}S`;
  return duration;
}

interface TranscriptDisplayProps {
  entries: ITranscriptEntry[];
  language: string;
}

function highlightText(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm.trim()) {
    return text;
  }

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">
          {part}
        </mark>
      );
    }
    return part;
  });
}

export const TranscriptDisplay = memo(function TranscriptDisplay({
  entries,
  language,
}: TranscriptDisplayProps): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const filteredEntries = useMemo(() => {
    if (!searchTerm.trim()) {
      return entries;
    }

    const lowerSearch = searchTerm.toLowerCase();
    return entries.filter((entry) =>
      entry.text.toLowerCase().includes(lowerSearch)
    );
  }, [entries, searchTerm]);

  const matchCount = useMemo(() => {
    if (!searchTerm.trim()) {
      return 0;
    }
    return filteredEntries.length;
  }, [filteredEntries, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search transcript..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pr-20"
            aria-label="Search transcript"
          />
          {searchTerm && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
              aria-live="polite"
              aria-atomic="true"
            >
              {matchCount} {matchCount === 1 ? 'match' : 'matches'}
            </span>
          )}
        </div>
        <Badge variant="secondary">{language.toUpperCase()}</Badge>
        <Badge variant="outline">{entries.length} segments</Badge>
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {filteredEntries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8" role="status">
            {searchTerm ? 'No matches found' : 'No transcript entries'}
          </p>
        ) : (
          <ul
            className="space-y-3 list-none m-0 p-0"
            aria-label="Transcript entries"
          >
            {filteredEntries.map((entry, index) => (
              <li
                key={`${entry.start}-${index}`}
                className="flex gap-3 group hover:bg-muted/50 rounded-md p-2 -m-2 transition-colors"
              >
                <time
                  className="text-xs text-muted-foreground font-mono min-w-[60px] pt-0.5"
                  dateTime={toIsoDuration(entry.start)}
                >
                  {formatTimestamp(entry.start)}
                </time>
                <p className="text-sm leading-relaxed flex-1 m-0">
                  {highlightText(entry.text, searchTerm)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
});
