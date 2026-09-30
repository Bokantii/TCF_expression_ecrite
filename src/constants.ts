// Total exam duration. Kept as a single constant so it can be temporarily
// shortened for testing auto-submit, then restored to 60 minutes.
export const EXAM_DURATION_MS = 60 * 60 * 1000;

// Countdown becomes visually urgent once remaining time drops below this.
export const URGENT_THRESHOLD_MS = 5 * 60 * 1000;

// Recommended time per task (Tâche 1, 2, 3). Used for single-task practice;
// they add up to EXAM_DURATION_MS for the full exam.
export const TASK_DURATIONS_MS = [10, 20, 30].map((min) => min * 60 * 1000);

export const ALL_TASKS = [0, 1, 2];
