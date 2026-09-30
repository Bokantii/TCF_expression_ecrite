import { useState } from "react";
import type { Answers, TaskPrompt, TaskSet } from "../types";
import { countWords } from "../utils/wordCount";

interface ResultsPageProps {
  tasks: TaskSet;
  answers: Answers;
  selectedTasks: number[];
  onRestart: () => void;
}

// Includes the topic so the text can be pasted straight into an AI chat for feedback.
function formatAnswer(task: TaskPrompt, answer: string): string {
  return [
    `${task.title.toUpperCase()} (${task.minWords}–${task.maxWords} mots)`,
    "Sujet :",
    task.prompt,
    "",
    `Ma réponse (${countWords(answer)} mots) :`,
    answer || "(Aucune réponse)",
  ].join("\n");
}

function formatAllAnswers(tasks: TaskSet, answers: Answers, selectedTasks: number[]): string {
  return selectedTasks
    .map((i) => formatAnswer(tasks[i], answers[i]))
    .join("\n\n---\n\n");
}

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // Fall back below for browsers/contexts that block the Clipboard API.
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function ResultsPage({ tasks, answers, selectedTasks, onRestart }: ResultsPageProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyOne = async (index: number) => {
    await copyText(formatAnswer(tasks[index], answers[index]));
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = async () => {
    await copyText(formatAllAnswers(tasks, answers, selectedTasks));
    setCopiedAll(true);
    window.setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="screen results-screen">
      <div className="card card--wide">
        <h1>Résultats</h1>

        {tasks.map((task, index) => selectedTasks.includes(index) && (
          <section className="results-screen__task" key={task.id}>
            <div className="results-screen__task-header">
              <h2>{task.title}</h2>
              <span>Words: {countWords(answers[index])}</span>
            </div>
            <p className="task-screen__prompt">{task.prompt}</p>
            <pre className="results-screen__answer">
              {answers[index] || "(Aucune réponse)"}
            </pre>
            <button className="btn btn--secondary" onClick={() => copyOne(index)}>
              {copiedIndex === index ? "Copied!" : "Copy"}
            </button>
          </section>
        ))}

        <div className="results-screen__actions">
          {selectedTasks.length > 1 && (
            <button className="btn btn--secondary" onClick={copyAll}>
              {copiedAll ? "Copied!" : "Copy All"}
            </button>
          )}
          <button className="btn btn--primary" onClick={onRestart}>
            Start New Exam
          </button>
        </div>
      </div>
    </div>
  );
}
