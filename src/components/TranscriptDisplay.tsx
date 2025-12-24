import { useState, useMemo, useCallback, memo } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatTimestamp } from '@/lib/formatters';
import type { ITranscriptEntry } from '@/types';

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
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {matchCount} {matchCount === 1 ? 'match' : 'matches'}
            </span>
          )}
        </div>
        <Badge variant="secondary">{language.toUpperCase()}</Badge>
        <Badge variant="outline">{entries.length} segments</Badge>
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {filteredEntries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {searchTerm ? 'No matches found' : 'No transcript entries'}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry, index) => (
              <div
                key={`${entry.start}-${index}`}
                className="flex gap-3 group hover:bg-muted/50 rounded-md p-2 -m-2 transition-colors"
              >
                <span className="text-xs text-muted-foreground font-mono min-w-[60px] pt-0.5">
                  {formatTimestamp(entry.start)}
                </span>
                <p className="text-sm leading-relaxed flex-1">
                  {highlightText(entry.text, searchTerm)}
                </p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
});
