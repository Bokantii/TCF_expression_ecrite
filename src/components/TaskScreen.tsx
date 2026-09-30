import type { TaskPrompt } from "../types";
import { countWords, getWordRangeStatus, wordRangeLabel } from "../utils/wordCount";
import { formatCountdown } from "../utils/time";

interface TaskScreenProps {
  task: TaskPrompt;
  taskNumber: number;
  totalTasks: number;
  answer: string;
  remainingMs: number;
  isLast: boolean;
  onChange: (value: string) => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function TaskScreen({
  task,
  taskNumber,
  totalTasks,
  answer,
  remainingMs,
  isLast,
  onChange,
  onNext,
  onSubmit,
}: TaskScreenProps) {
  const wordCount = countWords(answer);
  const status = getWordRangeStatus(wordCount, task.minWords, task.maxWords);

  const handleAdvance = () => {
    const confirmed = window.confirm(
      "You will not be able to return to this task. Continue?"
    );
    if (!confirmed) return;
    if (isLast) {
      onSubmit();
    } else {
      onNext();
    }
  };

  // No copy/paste during the exam, as in the real TCF.
  const blockClipboard = (e: React.SyntheticEvent) => e.preventDefault();

  return (
    <div className="screen task-screen" onCopy={blockClipboard} onCut={blockClipboard}>
      <div className="card">
        <div className="task-screen__header">
          <h2>{task.title}</h2>
          <span className="task-screen__progress">
            {taskNumber} / {totalTasks}
          </span>
        </div>

        <p className="task-screen__prompt">{task.prompt}</p>
        <p className="task-screen__range">
          Nombre de mots recommandé : {task.minWords}–{task.maxWords} mots
        </p>

        <textarea
          className="task-screen__textarea"
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          onPaste={blockClipboard}
          onDrop={blockClipboard}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          placeholder="Écrivez votre réponse ici..."
          aria-label={`Réponse pour ${task.title}`}
        />

        <div className="task-screen__meta">
          <span className="task-screen__word-count">Words: {wordCount}</span>
          <span className={`task-screen__status task-screen__status--${status}`}>
            {wordRangeLabel(status)}
          </span>
          <span className="task-screen__remaining">
            Remaining: {formatCountdown(remainingMs)}
          </span>
        </div>

        <div className="task-screen__actions">
          <button className="btn btn--primary" onClick={handleAdvance}>
            {isLast ? "Submit Exam" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
