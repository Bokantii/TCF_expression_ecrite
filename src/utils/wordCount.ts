import type { WordRangeStatus } from "../types";

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function getWordRangeStatus(
  count: number,
  minWords: number,
  maxWords: number
): WordRangeStatus {
  if (count < minWords) return "below";
  if (count > maxWords) return "above";
  return "within";
}

export function wordRangeLabel(status: WordRangeStatus): string {
  switch (status) {
    case "below":
      return "Below recommended range";
    case "above":
      return "Above recommended range";
    case "within":
      return "Within recommended range";
  }
}
