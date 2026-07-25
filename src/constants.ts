// Total exam duration. Kept as a single constant so it can be temporarily
// shortened for testing auto-submit, then restored to 60 minutes.
export const EXAM_DURATION_MS = 60 * 60 * 1000;

// Countdown becomes visually urgent once remaining time drops below this.
export const URGENT_THRESHOLD_MS = 5 * 60 * 1000;
