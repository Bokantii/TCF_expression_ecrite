import { useCallback, useState } from "react";
import type { ExamState, TaskSet } from "./types";
import { EXAM_DURATION_MS } from "./constants";
import { getDefaultState, loadState, saveState, clearState } from "./utils/storage";
import { useCountdown } from "./hooks/useCountdown";
import { StartScreen } from "./components/StartScreen";
import { TaskScreen } from "./components/TaskScreen";
import { ResultsPage } from "./components/ResultsPage";
import { Timer } from "./components/Timer";

function App() {
  const [state, setState] = useState<ExamState>(() => loadState());

  const handleExpire = useCallback(() => {
    setState((prev) => {
      if (prev.submitted || !prev.started) return prev;
      const next: ExamState = { ...prev, submitted: true };
      saveState(next);
      return next;
    });
  }, []);

  const isCountingDown = state.started && !state.submitted;
  const remainingMs = useCountdown(isCountingDown ? state.endsAt : null, handleExpire);

  const handleStart = (tasks: TaskSet) => {
    const now = Date.now();
    const next: ExamState = {
      started: true,
      startedAt: now,
      endsAt: now + EXAM_DURATION_MS,
      currentTaskIndex: 0,
      answers: ["", "", ""],
      submitted: false,
      tasks,
    };
    setState(next);
    saveState(next);
  };

  const handleAnswerChange = (value: string) => {
    setState((prev) => {
      const answers = [...prev.answers] as ExamState["answers"];
      answers[prev.currentTaskIndex] = value;
      const next = { ...prev, answers };
      saveState(next);
      return next;
    });
  };

  const handleNext = () => {
    setState((prev) => {
      const next = { ...prev, currentTaskIndex: prev.currentTaskIndex + 1 };
      saveState(next);
      return next;
    });
  };

  const handleSubmit = () => {
    setState((prev) => {
      const next = { ...prev, submitted: true };
      saveState(next);
      return next;
    });
  };

  const handleRestart = () => {
    clearState();
    setState(getDefaultState());
  };

  if (!state.started) {
    return <StartScreen onStart={handleStart} />;
  }

  if (state.submitted) {
    return (
      <ResultsPage
        tasks={state.tasks}
        answers={state.answers}
        onRestart={handleRestart}
      />
    );
  }

  const task = state.tasks[state.currentTaskIndex];

  return (
    <>
      <Timer remainingMs={remainingMs} />
      <TaskScreen
        task={task}
        taskNumber={state.currentTaskIndex + 1}
        totalTasks={state.tasks.length}
        answer={state.answers[state.currentTaskIndex]}
        remainingMs={remainingMs}
        isLast={state.currentTaskIndex === state.tasks.length - 1}
        onChange={handleAnswerChange}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default App;
