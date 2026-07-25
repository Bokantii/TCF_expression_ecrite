# TCF Canada — Expression écrite

A single-page practice app for the TCF Canada Expression écrite exam: a 60-minute timed writing test with three tasks, live word counts, and shareable results. No backend, no accounts — everything is stored in `localStorage` on your device.

## Tech stack

- React + TypeScript
- Vite
- Plain CSS

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is written to `dist/`.

## Deploying to Vercel

This is a standard Vite project, so it deploys to Vercel with no extra configuration: import the repo (or run `vercel`) and Vercel will detect the Vite preset automatically (build command `npm run build`, output directory `dist`).

## Editing the prompts

Sample task prompts live in [`src/data/prompts.ts`](src/data/prompts.ts) — replace the `prompt` (and `minWords`/`maxWords` if needed) for each task there.

## How the timer works

- Clicking "Start Exam" writes an `endsAt` timestamp (`Date.now() + 60 minutes`) to `localStorage`.
- The countdown is always derived from that real timestamp, so refreshing the page does not reset it.
- When the countdown reaches zero, the current answer is saved, all textareas lock, the exam is marked submitted, and the app navigates to the results page automatically.
# TCF_expression_ecrite
