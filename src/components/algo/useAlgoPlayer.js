import { useState, useRef, useCallback, useEffect } from "react";

const SPEED_PRESETS = [
  { label: "0.25x", value: 0.25 },
  { label: "0.5x", value: 0.5 },
  { label: "1x", value: 1 },
  { label: "2x", value: 2 },
  { label: "4x", value: 4 },
];

const BASE_INTERVAL = 400; // ms per step at 1x speed

export default function useAlgoPlayer(steps = []) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const rafRef = useRef(null);
  const lastTickRef = useRef(0);
  const stepsRef = useRef(steps);

  // Keep ref in sync
  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  // Stop when steps change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentStep(steps.length > 0 ? 0 : -1);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [steps]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    const interval = BASE_INTERVAL / speed;
    lastTickRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - lastTickRef.current;
      if (elapsed >= interval) {
        lastTickRef.current = now;
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= stepsRef.current.length) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  const play = useCallback(() => {
    if (steps.length === 0) return;
    // If at end, restart
    setCurrentStep((prev) => {
      if (prev >= steps.length - 1) return 0;
      return prev;
    });
    setIsPlaying(true);
  }, [steps.length]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const stepBack = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const seekTo = useCallback(
    (n) => {
      setIsPlaying(false);
      setCurrentStep(Math.max(0, Math.min(n, steps.length - 1)));
    },
    [steps.length]
  );

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(steps.length > 0 ? 0 : -1);
  }, [steps.length]);

  return {
    currentStep,
    totalSteps: steps.length,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    stepForward,
    stepBack,
    seekTo,
    reset,
    SPEED_PRESETS,
    isAtEnd: currentStep >= steps.length - 1,
    isAtStart: currentStep <= 0,
    currentStepData: steps[currentStep] || null,
  };
}
