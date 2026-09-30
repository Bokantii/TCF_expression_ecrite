import type { TaskSet } from "../types";

// Task titles and word ranges. Students paste the topic (prompt) for each
// task on the start screen, so prompts start empty.
export const TASKS: TaskSet = [
  {
    id: 1,
    title: "Tâche 1",
    prompt: "",
    minWords: 60,
    maxWords: 120,
  },
  {
    id: 2,
    title: "Tâche 2",
    prompt: "",
    minWords: 120,
    maxWords: 150,
  },
  {
    id: 3,
    title: "Tâche 3",
    prompt: "",
    minWords: 120,
    maxWords: 180,
  },
];
