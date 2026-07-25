import { useState } from "react";
import type { Answers, TaskSet } from "../types";
import { countWords } from "../utils/wordCount";

interface ResultsPageProps {
  tasks: TaskSet;
  answers: Answers;
  onRestart: () => void;
}

function formatAnswer(index: number, answer: string): string {
  return `TÂCHE ${index + 1}\n${answer}`;
}

function formatAllAnswers(answers: Answers): string {
  return answers.map((answer, i) => formatAnswer(i, answer)).join("\n\n");
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

export function ResultsPage({ tasks, answers, onRestart }: ResultsPageProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyOne = async (index: number) => {
    await copyText(formatAnswer(index, answers[index]));
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = async () => {
    await copyText(formatAllAnswers(answers));
    setCopiedAll(true);
    window.setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="screen results-screen">
      <div className="card card--wide">
        <h1>Résultats</h1>

        {tasks.map((task, index) => (
          <section className="results-screen__task" key={task.id}>
            <div className="results-screen__task-header">
              <h2>{task.title}</h2>
              <span>Words: {countWords(answers[index])}</span>
            </div>
            <pre className="results-screen__answer">
              {answers[index] || "(Aucune réponse)"}
            </pre>
            <button className="btn btn--secondary" onClick={() => copyOne(index)}>
              {copiedIndex === index ? "Copied!" : "Copy"}
            </button>
          </section>
        ))}

        <div className="results-screen__actions">
          <button className="btn btn--secondary" onClick={copyAll}>
            {copiedAll ? "Copied!" : "Copy All"}
          </button>
          <button className="btn btn--primary" onClick={onRestart}>
            Start New Exam
          </button>
        </div>
      </div>
    </div>
  );
}
