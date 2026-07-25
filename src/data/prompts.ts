import type { TaskSet } from "../types";

// Replace these with real TCF Canada prompts when available.
export const TASKS: TaskSet = [
  {
    id: 1,
    title: "Tâche 1",
    prompt:
      "Votre ami vous demande des nouvelles de votre nouveau travail. Décrivez votre lieu de travail, vos collègues et vos impressions.",
    minWords: 60,
    maxWords: 120,
  },
  {
    id: 2,
    title: "Tâche 2",
    prompt:
      "Vous avez participé comme bénévole dans une association. Racontez votre expérience et dites ce que vous avez appris.",
    minWords: 120,
    maxWords: 150,
  },
  {
    id: 3,
    title: "Tâche 3",
    prompt:
      "Document 1 : Le télétravail permet de gagner du temps et de mieux organiser sa journée.\nDocument 2 : Le télétravail peut isoler les employés et rendre la communication plus difficile.\nSujet : Le télétravail est-il une bonne solution ?",
    minWords: 120,
    maxWords: 180,
  },
];
