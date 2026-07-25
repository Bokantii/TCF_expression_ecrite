import { useState } from "react";
import { TASKS } from "../data/prompts";
import type { TaskSet } from "../types";

interface StartScreenProps {
  onStart: (tasks: TaskSet) => void;
}

type TopicMode = "default" | "custom";

export function StartScreen({ onStart }: StartScreenProps) {
  const [mode, setMode] = useState<TopicMode>("default");
  const [customTopics, setCustomTopics] = useState<[string, string, string]>([
    "",
    "",
    "",
  ]);

  const canStart =
    mode === "default" || customTopics.every((topic) => topic.trim().length > 0);

  const handleCustomTopicChange = (index: number, value: string) => {
    setCustomTopics((prev) => {
      const next = [...prev] as [string, string, string];
      next[index] = value;
      return next;
    });
  };

  const handleStartClick = () => {
    if (!canStart) return;
    const tasks: TaskSet = TASKS.map((task, index) => ({
      ...task,
      prompt: mode === "custom" ? customTopics[index].trim() : task.prompt,
    })) as TaskSet;
    onStart(tasks);
  };

  return (
    <div className="screen start-screen">
      <div className="card">
        <h1>TCF Canada — Expression écrite</h1>
        <p>
          Vous allez passer l'épreuve d'expression écrite du TCF Canada. Cette
          épreuve comporte trois tâches à réaliser en 60 minutes au total.
        </p>
        <ul className="start-screen__rules">
          <li>Le chronomètre démarre dès que vous cliquez sur "Start Exam".</li>
          <li>Vous ne pouvez pas revenir à une tâche précédente.</li>
          <li>À la fin du temps imparti, l'examen est soumis automatiquement.</li>
        </ul>

        <fieldset className="start-screen__mode">
          <legend>Sujets des tâches</legend>
          <label className="start-screen__mode-option">
            <input
              type="radio"
              name="topic-mode"
              value="default"
              checked={mode === "default"}
              onChange={() => setMode("default")}
            />
            Utiliser les sujets d'exemple
          </label>
          <label className="start-screen__mode-option">
            <input
              type="radio"
              name="topic-mode"
              value="custom"
              checked={mode === "custom"}
              onChange={() => setMode("custom")}
            />
            Coller mes propres sujets
          </label>
        </fieldset>

        {mode === "custom" && (
          <div className="start-screen__custom-topics">
            {TASKS.map((task, index) => (
              <div className="start-screen__custom-field" key={task.id}>
                <label htmlFor={`custom-topic-${task.id}`}>
                  {task.title} — sujet ({task.minWords}–{task.maxWords} mots
                  recommandés)
                </label>
                <textarea
                  id={`custom-topic-${task.id}`}
                  className="start-screen__custom-textarea"
                  value={customTopics[index]}
                  onChange={(e) => handleCustomTopicChange(index, e.target.value)}
                  placeholder={`Collez le sujet de ${task.title} ici...`}
                />
              </div>
            ))}
            {!canStart && (
              <p className="start-screen__hint">
                Collez un sujet pour chacune des trois tâches pour continuer.
              </p>
            )}
          </div>
        )}

        <button
          className="btn btn--primary"
          onClick={handleStartClick}
          disabled={!canStart}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
}
