# Stackline

Stackline is a private, browser-based ATS resume builder for software professionals with 3–8+ years of experience.

## What it does

- Guides candidates through target role, profile, experience, and final checks
- Extracts recognizable software keywords from a pasted job description
- Drafts a focused professional summary from the candidate's own details
- Scores contact details, role focus, skills, experience completeness, quantified impact, action verbs, and keyword alignment
- Shows a live, single-column ATS-safe resume preview
- Autosaves locally in the browser
- Downloads selectable-text DOCX and PDF files

The research rules behind the generator are documented in [ATS_RESEARCH.md](./ATS_RESEARCH.md).

## Run locally

```bash
pnpm install
pnpm dev
```

Then open the local URL shown by Vite.

## Verify

```bash
pnpm test
pnpm lint
pnpm build
```

## Implementation

- React + TypeScript + Vite
- `docx` for a simple, parser-safe Word document
- `jsPDF` for a selectable-text PDF
- Lucide for interface icons only; exported resumes contain no icons or graphics

All resume data and job-description analysis stay in the browser. There is no backend or account system.

## Docker deployment

Choose an available host port and start the production container:

```bash
STACKLINE_PORT=8080 docker compose up -d --build
```

The container serves the application on port 80 internally and publishes it on
the host port supplied through `STACKLINE_PORT`.

## License

[MIT](./LICENSE)
