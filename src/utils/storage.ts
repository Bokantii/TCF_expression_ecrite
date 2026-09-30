import type { ExamState } from "../types";
import { TASKS } from "../data/prompts";
import { ALL_TASKS } from "../constants";

const STORAGE_KEY = "tcf-exam-state-v1";

export function getDefaultState(): ExamState {
  return {
    started: false,
    startedAt: null,
    endsAt: null,
    currentTaskIndex: 0,
    answers: ["", "", ""],
    submitted: false,
    tasks: TASKS,
    selectedTasks: ALL_TASKS,
  };
}

export function loadState(): ExamState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as Partial<ExamState>;
    return { ...getDefaultState(), ...parsed };
  } catch {
    return getDefaultState();
  }
}

export function saveState(state: ExamState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
