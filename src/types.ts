export interface TaskPrompt {
  id: number;
  title: string;
  prompt: string;
  minWords: number;
  maxWords: number;
}

export type Answers = [string, string, string];

export type TaskSet = [TaskPrompt, TaskPrompt, TaskPrompt];

export interface ExamState {
  started: boolean;
  startedAt: number | null;
  endsAt: number | null;
  currentTaskIndex: number;
  answers: Answers;
  submitted: boolean;
  tasks: TaskSet;
}

export type WordRangeStatus = "below" | "within" | "above";
