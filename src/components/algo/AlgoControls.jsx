import { motion } from "framer-motion";
import {
  Play, Pause, SkipForward, SkipBack, RotateCcw,
} from "lucide-react";

export default function AlgoControls({ player, children }) {
  const {
    currentStep, totalSteps, isPlaying, speed, setSpeed,
    play, pause, stepForward, stepBack, seekTo, reset,
    SPEED_PRESETS, isAtEnd, isAtStart,
  } = player;

  const hasSteps = totalSteps > 0;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Top row: extra controls */}
      {children && (
        <div className="flex flex-wrap items-center gap-3">
          {children}
        </div>
      )}

      {/* Playback controls */}
      {hasSteps && (
        <div className="flex flex-wrap items-center gap-3">
          {/* Transport */}
          <div className="flex items-center gap-0.5 p-1 rounded-2xl bg-[var(--color-surface2)]/80 border border-[var(--color-border)] backdrop-blur-sm">
            <button
              onClick={stepBack}
              disabled={isAtStart}
              className="p-2 rounded-xl hover:bg-[var(--color-border)]/60 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
              title="Step back (←)"
            >
              <SkipBack size={14} className="text-[var(--color-text)]" />
            </button>

            <motion.button
              onClick={isPlaying ? pause : play}
              whileTap={{ scale: 0.92 }}
              className="relative px-4 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-1.5 transition-all duration-300 overflow-hidden"
              style={{
                backgroundColor: isPlaying ? "#f43f5e" : "var(--color-primary)",
                boxShadow: isPlaying
                  ? "0 4px 20px rgba(244, 63, 94, 0.35)"
                  : "0 4px 20px rgba(var(--color-primary-rgb), 0.3)",
              }}
            >
              {/* Pulse ring when playing */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-white/30"
                  animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              {isPlaying ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play</>}
            </motion.button>

            <button
              onClick={stepForward}
              disabled={isAtEnd}
              className="p-2 rounded-xl hover:bg-[var(--color-border)]/60 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
              title="Step forward (→)"
            >
              <SkipForward size={14} className="text-[var(--color-text)]" />
            </button>

            <div className="w-px h-5 bg-[var(--color-border)] mx-0.5" />

            <button
              onClick={reset}
              className="p-2 rounded-xl hover:bg-[var(--color-border)]/60 transition-all duration-200"
              title="Reset to start"
            >
              <RotateCcw size={13} className="text-[var(--color-text-muted)]" />
            </button>
          </div>

          {/* Step counter — pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface2)] border border-[var(--color-border)] text-xs font-mono">
            <span className="text-[var(--color-text-muted)]">Step</span>
            <span className="text-[var(--color-primary)] font-bold tabular-nums">
              {Math.max(0, currentStep + 1)}
            </span>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span className="text-[var(--color-text-muted)] tabular-nums">{totalSteps}</span>
          </div>

          {/* Speed pills */}
          <div className="flex items-center gap-1 ml-auto">
            {SPEED_PRESETS.map((p) => {
              const isActive = speed === p.value;
              return (
                <motion.button
                  key={p.value}
                  onClick={() => setSpeed(p.value)}
                  whileTap={{ scale: 0.9 }}
                  className="relative px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors duration-200"
                  style={{
                    color: isActive ? "#fff" : "var(--color-text-muted)",
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="speed-indicator"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: "var(--color-primary)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{p.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom timeline / progress bar */}
      {hasSteps && (
        <div className="relative group">
          {/* Track background */}
          <div className="h-1.5 rounded-full bg-[var(--color-surface2)] border border-[var(--color-border)]/50 overflow-hidden">
            {/* Progress fill */}
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: isPlaying
                  ? "linear-gradient(90deg, #f43f5e, #ec4899)"
                  : `linear-gradient(90deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, #fff))`,
                boxShadow: isPlaying
                  ? "0 0 12px rgba(244, 63, 94, 0.4)"
                  : "0 0 12px rgba(var(--color-primary-rgb), 0.3)",
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            />
          </div>
          {/* Invisible range input overlay for interaction */}
          <input
            type="range"
            min="0"
            max={totalSteps - 1}
            value={Math.max(0, currentStep)}
            onChange={(e) => seekTo(+e.target.value)}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            style={{ height: "100%" }}
          />
          {/* Thumb indicator */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              left: `calc(${progress}% - 7px)`,
              backgroundColor: isPlaying ? "#f43f5e" : "var(--color-primary)",
              boxShadow: `0 2px 8px ${isPlaying ? "rgba(244,63,94,0.4)" : "rgba(var(--color-primary-rgb),0.4)"}`,
            }}
          />
        </div>
      )}
    </div>
  );
}
