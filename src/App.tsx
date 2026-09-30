import { useCallback, useState } from "react";
import type { ExamState, TaskSet } from "./types";
import { TASK_DURATIONS_MS } from "./constants";
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

  const handleStart = (tasks: TaskSet, selectedTasks: number[]) => {
    const now = Date.now();
    const duration = selectedTasks.reduce((sum, i) => sum + TASK_DURATIONS_MS[i], 0);
    const next: ExamState = {
      started: true,
      startedAt: now,
      endsAt: now + duration,
      currentTaskIndex: selectedTasks[0],
      answers: ["", "", ""],
      submitted: false,
      tasks,
      selectedTasks,
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
      const position = prev.selectedTasks.indexOf(prev.currentTaskIndex);
      const next = { ...prev, currentTaskIndex: prev.selectedTasks[position + 1] };
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
        selectedTasks={state.selectedTasks}
        onRestart={handleRestart}
      />
    );
  }

  const task = state.tasks[state.currentTaskIndex];
  const position = state.selectedTasks.indexOf(state.currentTaskIndex);

  return (
    <>
      <Timer remainingMs={remainingMs} />
      <TaskScreen
        task={task}
        taskNumber={position + 1}
        totalTasks={state.selectedTasks.length}
        answer={state.answers[state.currentTaskIndex]}
        remainingMs={remainingMs}
        isLast={position === state.selectedTasks.length - 1}
        onChange={handleAnswerChange}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default App;
