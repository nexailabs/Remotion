# NexAI Video Editor

AI-powered video production for NexAI Labs. Clone this repo, point Claude Code at your video, and get a polished IG Reel.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- Python 3
- [Claude Code](https://claude.ai/code) (CLI, Desktop App, or Web)

```bash
# One-time Python setup
pip install faster-whisper
```

## Quick Start

```bash
git clone https://github.com/nexailabs/Remotion.git
cd Remotion
npm install
```

Then open Claude Code in this directory and say:

> "Make me an IG Reel from C:\path\to\my-video.mp4"

Claude Code will:
1. Extract frames from your video and analyze the content
2. Transcribe speech with word-level timestamps
3. Generate captions, topic overlays, and branded CTA
4. Preview in Remotion Studio (`npm run dev`)
5. Render the final MP4 (`npx remotion render IGReel out/ig-reel.mp4`)

## Project Structure

```
src/
  Root.tsx           # Composition config (dimensions, fps, duration)
  IGReel.tsx         # Main composition — video, gradients, hook, CTA
  Captions.tsx       # TikTok-style word-by-word captions
  TopicOverlays.tsx  # Segment overlays + progress bar + zoom punches
public/
  nexai-icon.png     # Brand icon (watermark)
  nexai-logo.png     # Brand logo
  video.mp4          # Your video (not in git — add your own)
  captions.json      # Generated transcription (not in git)
.claude/skills/      # Remotion best-practices skill for Claude Code
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Remotion Studio preview |
| `npx remotion render IGReel out/ig-reel.mp4` | Render final video |
| `npm run lint` | Run ESLint + TypeScript checks |

## Notes

- `video.mp4` and `captions.json` are generated per session and gitignored
- The Remotion skill in `.claude/skills/` gives Claude Code domain knowledge for video editing
- Timestamps in `TopicOverlays.tsx` and `Root.tsx` are examples — Claude Code regenerates them per video
