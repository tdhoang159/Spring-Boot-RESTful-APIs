import { useEffect, useMemo, useState } from "react";

interface UseCountdownOptions {
  durationSeconds: number;
  autoStart?: boolean;
  onExpire?: () => void;
}

export const useCountdown = ({
  durationSeconds,
  autoStart = true,
  onExpire,
}: UseCountdownOptions) => {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    setRemaining(durationSeconds);
    setIsRunning(autoStart);
  }, [durationSeconds, autoStart]);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;

    const timer = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, remaining, onExpire]);

  const minutes = useMemo(() => Math.floor(remaining / 60), [remaining]);
  const seconds = useMemo(() => remaining % 60, [remaining]);

  return {
    remaining,
    minutes,
    seconds,
    isRunning,
    isExpired: remaining <= 0,
    start: () => setIsRunning(true),
    stop: () => setIsRunning(false),
    reset: (nextDuration = durationSeconds) => {
      setRemaining(nextDuration);
      setIsRunning(autoStart);
    },
  };
};

export default useCountdown;
