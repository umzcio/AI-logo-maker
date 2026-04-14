# Logo Maker

AI-powered logo and icon generator. Describe what you want, get a logo back — either as clean vector SVG or artistic raster imagery.

## Features

- **SVG Mode** — Anthropic generates editable vector logos from your description
- **Artistic Mode** — OpenAI (gpt-image-1) generates rich, stylized logo imagery
- **Session Gallery** — all generated logos accumulate in the sidebar for quick comparison
- **Dark/Light Preview** — toggle background to see how your logo looks on both
- **Multi-Format Export** — download as SVG, PNG (16px–1024px), ICO, WebP, or PDF

## Quick Start

```bash
# Install dependencies
npm install

# Add your API keys
cp .env.example .env
# Edit .env with your real keys:
#   ANTHROPIC_API_KEY=sk-ant-...
#   OPENAI_API_KEY=sk-...

# Start dev server
npm run dev
```

Open [http://localhost:5176](http://localhost:5176) and start generating.

## Usage

1. Type a description of the logo you want
2. Choose **SVG** (vector, editable) or **Artistic** (raster, stylized)
3. Hit **Generate** or press `Cmd+Enter`
4. Export in your preferred format from the bar below the preview
5. Previous logos stay in the sidebar — click any to bring it back

## Tech Stack

- React 19 + TypeScript + Vite
- Anthropic API for SVG generation
- OpenAI API for artistic image generation
- jsPDF for PDF export
- Client-side canvas for PNG/WebP/ICO conversion

## Project Structure

```
logo-maker/
├── server/                 # Express API middleware (runs inside Vite dev server)
│   ├── index.ts            # Route registration
│   ├── generate-svg.ts     # Anthropic API → SVG
│   └── generate-image.ts   # OpenAI API → base64 PNG
├── src/
│   ├── App.tsx             # Root component, state management
│   ├── App.css             # All styles (dark theme)
│   ├── types.ts            # Shared TypeScript types
│   ├── components/
│   │   ├── PromptInput.tsx # Text input + mode toggle + generate/clear
│   │   ├── Preview.tsx     # Logo preview with dark/light toggle
│   │   ├── ExportBar.tsx   # Download buttons for all formats
│   │   └── Gallery.tsx     # Session history sidebar
│   └── lib/
│       ├── export.ts       # Canvas-based format conversion + download
│       └── ico.ts          # ICO binary format encoder
├── .env                    # API keys (not committed)
└── vite.config.ts          # Vite + Express middleware plugin
```

## API Keys

You need two API keys:

| Key | Where to get it |
|-----|----------------|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/) |
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com/) |

SVG mode only requires the Anthropic key. Artistic mode only requires the OpenAI key. You can use either independently.

## License

MIT
