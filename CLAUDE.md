# YouTube Transcript Frontend

## Project Overview
A React frontend for fetching and displaying YouTube video transcripts.

## Tech Stack
- React 19 with TypeScript
- Vite 6 (build tool)
- Tailwind CSS v4 with @tailwindcss/vite plugin
- shadcn/ui components (Radix UI based)
- Lucide React icons

## Backend API
Base URL: `https://youtube-transcript.solomonadvising.online`

### Endpoints:
- `GET /api/video/{video_id}/info` - Video metadata (title, thumbnail, duration)
- `GET /api/video/{video_id}` - Full video data with transcript
- `GET /api/video/{video_id}/transcript?format={json|text|srt|vtt}&languages={en}` - Transcript data
- `GET /api/health` - Health check

## Project Structure
```
src/
├── components/      # React components
│   ├── ui/          # shadcn/ui components
│   └── ...          # App-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utilities (cn, api client)
├── types/           # TypeScript interfaces
└── App.tsx          # Main app component
```

## Development Commands
- `npm run dev` - Start dev server (port 5173)
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Code Standards
- Use TypeScript strict mode
- NEVER use `any` type under any circumstances
- NEVER use `unknown` without immediately narrowing with type guards
- Always use explicit return types on all functions
- Always use explicit type annotations on function parameters
- Use functional components with hooks
- Use shadcn/ui components from `@/components/ui`
- Use `cn()` utility from `@/lib/utils` for class merging
- API calls should use async/await with proper error handling
- Create custom hooks for data fetching (e.g., useTranscript)
- Prefer `interface` over `type` for object shapes

## Features to Implement
1. YouTube URL input with validation
2. Video info display (thumbnail, title, duration)
3. Transcript display with timestamps
4. Format selector (JSON, Text, SRT, VTT)
5. Copy to clipboard functionality
6. Download transcript as file
7. Search within transcript
8. Loading states and error handling

## UI Guidelines
- Use Card component for main content sections
- Use Button variants: default, outline, ghost
- Use Input for URL entry
- Use Select for format dropdown
- Use Skeleton for loading states
- Use Toast for notifications
- Dark mode support via Tailwind

## Environment Variables
Create `.env` file:
```
VITE_API_BASE_URL=https://youtube-transcript.solomonadvising.online
```
Access via: `import.meta.env.VITE_API_BASE_URL`
