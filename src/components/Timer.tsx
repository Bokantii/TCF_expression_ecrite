import { formatCountdown } from "../utils/time";
import { URGENT_THRESHOLD_MS } from "../constants";

interface TimerProps {
  remainingMs: number;
}

export function Timer({ remainingMs }: TimerProps) {
  const isUrgent = remainingMs <= URGENT_THRESHOLD_MS;

  return (
    <div className={`timer-bar${isUrgent ? " timer-bar--urgent" : ""}`}>
      <span className="timer-bar__label">Temps restant</span>
      <span className="timer-bar__value">{formatCountdown(remainingMs)}</span>
    </div>
  );
}
