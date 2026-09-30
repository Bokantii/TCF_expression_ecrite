import { useState } from "react";
import { TASKS } from "../data/prompts";
import type { TaskSet } from "../types";
import { ALL_TASKS, EXAM_DURATION_MS, TASK_DURATIONS_MS } from "../constants";
import { parseTopics } from "../utils/parseTopics";

interface StartScreenProps {
  onStart: (tasks: TaskSet, selectedTasks: number[]) => void;
}

// "full" = the whole exam; a number = practice that single task only.
type ExamMode = "full" | number;

function toMinutes(ms: number): number {
  return Math.round(ms / 60000);
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [examMode, setExamMode] = useState<ExamMode>("full");
  const [bulkText, setBulkText] = useState("");
  const [customTopics, setCustomTopics] = useState<[string, string, string]>([
    "",
    "",
    "",
  ]);

  const selectedTasks = examMode === "full" ? ALL_TASKS : [examMode];
  const durationMinutes = toMinutes(
    selectedTasks.reduce((sum, i) => sum + TASK_DURATIONS_MS[i], 0)
  );

  const canStart = selectedTasks.every((i) => customTopics[i].trim().length > 0);

  const bulkTopics = parseTopics(bulkText);
  const missingTitles = TASKS.filter((_, i) => bulkTopics[i] === null).map(
    (task) => task.title
  );

  const handleCustomTopicChange = (index: number, value: string) => {
    setCustomTopics((prev) => {
      const next = [...prev] as [string, string, string];
      next[index] = value;
      return next;
    });
  };

  // Fill each task's field from the pasted block; tasks not found keep their current text.
  const handleBulkChange = (value: string) => {
    setBulkText(value);
    const topics = parseTopics(value);
    setCustomTopics((prev) =>
      prev.map((topic, i) => topics[i] ?? topic) as [string, string, string]
    );
  };

  const handleStartClick = () => {
    if (!canStart) return;
    const tasks: TaskSet = TASKS.map((task, index) => ({
      ...task,
      prompt: customTopics[index].trim(),
    })) as TaskSet;
    onStart(tasks, selectedTasks);
  };

  return (
    <div className="screen start-screen">
      <div className="card">
        <h1>TCF Canada — Expression écrite</h1>
        <p>
          {examMode === "full"
            ? `Vous allez passer l'épreuve d'expression écrite du TCF Canada. Cette épreuve comporte trois tâches à réaliser en ${durationMinutes} minutes au total.`
            : `Vous allez vous entraîner sur la ${TASKS[examMode].title} uniquement, en ${durationMinutes} minutes.`}
        </p>
        <ul className="start-screen__rules">
          <li>Le chronomètre démarre dès que vous cliquez sur "Start Exam".</li>
          {examMode === "full" && (
            <li>Vous ne pouvez pas revenir à une tâche précédente.</li>
          )}
          <li>
            Le correcteur orthographique et le copier-coller sont désactivés,
            comme à l'examen.
          </li>
          <li>À la fin du temps imparti, l'examen est soumis automatiquement.</li>
        </ul>

        <fieldset className="start-screen__mode">
          <legend>Mode</legend>
          <label className="start-screen__mode-option">
            <input
              type="radio"
              name="exam-mode"
              value="full"
              checked={examMode === "full"}
              onChange={() => setExamMode("full")}
            />
            Examen complet — 3 tâches, {toMinutes(EXAM_DURATION_MS)} min
          </label>
          {TASKS.map((task, index) => (
            <label className="start-screen__mode-option" key={task.id}>
              <input
                type="radio"
                name="exam-mode"
                value={index}
                checked={examMode === index}
                onChange={() => setExamMode(index)}
              />
              {task.title} seulement — {toMinutes(TASK_DURATIONS_MS[index])} min
            </label>
          ))}
        </fieldset>

        <div className="start-screen__custom-topics">
          {examMode === "full" && (
            <div className="start-screen__custom-field">
              <label htmlFor="bulk-topics">Coller les 3 sujets d'un coup</label>
              <textarea
                id="bulk-topics"
                className="start-screen__custom-textarea"
                value={bulkText}
                onChange={(e) => handleBulkChange(e.target.value)}
                placeholder={"Tâche 1\n...\nTâche 2\n...\nTâche 3\n..."}
              />
              {bulkText.trim() && (
                <p className="start-screen__hint">
                  {missingTitles.length === 0
                    ? "3 sujets détectés — vérifiez-les ci-dessous."
                    : `Introuvable : ${missingTitles.join(", ")} — ${missingTitles.length > 1 ? "collez-les" : "collez-la"} ci-dessous.`}
                </p>
              )}
            </div>
          )}

          {TASKS.map((task, index) => selectedTasks.includes(index) && (
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
              {selectedTasks.length > 1
                ? "Collez un sujet pour chacune des trois tâches pour continuer."
                : "Collez le sujet de la tâche pour continuer."}
            </p>
          )}
        </div>

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
