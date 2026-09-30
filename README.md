# TCF Canada — Expression écrite

A single-page practice app for the TCF Canada Expression écrite exam: a 60-minute timed writing test with three tasks, live word counts, and shareable results. No backend, no accounts — everything is stored in `localStorage` on your device.

## Practice modes

- **Examen complet**: all three tasks, 60 minutes.
- **Tâche 1 / 2 / 3 seulement**: one task on its own timer (10 / 20 / 30 minutes, set in `TASK_DURATIONS_MS` in `src/constants.ts`).

On the results page, each task has a Copy button that copies the topic and the answer together, ready to paste into an AI chat for feedback. In full-exam mode, Copy All copies every task at once.

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

## Topics

Students paste their own topics on the start screen. In full-exam mode they can paste all three at once (e.g. copied from ChatGPT): the text is split on the "Tâche 1 / 2 / 3" headings ([`src/utils/parseTopics.ts`](src/utils/parseTopics.ts)) and fills each task's field, which stays editable. Single-task modes have just one topic field.

Task titles and word ranges live in [`src/data/prompts.ts`](src/data/prompts.ts).

## How the timer works

- Clicking "Start Exam" writes an `endsAt` timestamp (`Date.now() + 60 minutes`) to `localStorage`.
- The countdown is always derived from that real timestamp, so refreshing the page does not reset it.
- When the countdown reaches zero, the current answer is saved, all textareas lock, the exam is marked submitted, and the app navigates to the results page automatically.
# TCF_expression_ecrite
