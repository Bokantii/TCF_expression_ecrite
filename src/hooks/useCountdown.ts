import { useEffect, useRef, useState } from "react";

export function useCountdown(
  endsAt: number | null,
  onExpire: () => void
): number {
  const [remaining, setRemaining] = useState(() =>
    endsAt ? Math.max(0, endsAt - Date.now()) : 0
  );
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!endsAt) {
      setRemaining(0);
      return;
    }

    let expired = false;
    const tick = () => {
      const rem = Math.max(0, endsAt - Date.now());
      setRemaining(rem);
      if (rem <= 0 && !expired) {
        expired = true;
        onExpireRef.current();
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  return remaining;
}
