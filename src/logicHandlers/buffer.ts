import { useRef } from "react";

export function useRateLimit(delay = 2000) {
  const lastRun = useRef(0);

  const canRun = () => {
    const now = Date.now();

    if (now - lastRun.current < delay) {
      return false;
    }

    lastRun.current = now;
    return true;
  };

  return canRun;
}