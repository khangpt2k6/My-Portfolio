import {
  Play, Pause, SkipForward, SkipBack, RotateCcw,
} from "lucide-react";

export default function AlgoControls({ player, onGenerate, generateLabel = "Run", generating = false, canGenerate = true, children }) {
  const {
    currentStep, totalSteps, isPlaying, speed, setSpeed,
    play, pause, stepForward, stepBack, seekTo, reset,
    SPEED_PRESETS, isAtEnd, isAtStart,
  } = player;

  const hasSteps = totalSteps > 0;

  return (
    <div className="space-y-3">
      {/* Top row: Generate button + extra controls */}
      <div className="flex flex-wrap items-center gap-3">
        {children}
      </div>

      {/* Playback controls */}
      {hasSteps && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Transport */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-surface2)] border border-[var(--color-border)]">
            <button
              onClick={stepBack}
              disabled={isAtStart}
              className="p-1.5 rounded-lg hover:bg-[var(--color-border)] transition-colors disabled:opacity-30"
              title="Step back"
            >
              <SkipBack size={14} className="text-[var(--color-text)]" />
            </button>

            <button
              onClick={isPlaying ? pause : play}
              className="p-1.5 px-3 rounded-lg text-white text-sm font-semibold flex items-center gap-1 transition-all"
              style={{ backgroundColor: isPlaying ? "#f43f5e" : "var(--color-primary)" }}
            >
              {isPlaying ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play</>}
            </button>

            <button
              onClick={stepForward}
              disabled={isAtEnd}
              className="p-1.5 rounded-lg hover:bg-[var(--color-border)] transition-colors disabled:opacity-30"
              title="Step forward"
            >
              <SkipForward size={14} className="text-[var(--color-text)]" />
            </button>

            <button
              onClick={reset}
              className="p-1.5 rounded-lg hover:bg-[var(--color-border)] transition-colors"
              title="Reset to start"
            >
              <RotateCcw size={13} className="text-[var(--color-text-muted)]" />
            </button>
          </div>

          {/* Step counter */}
          <span className="text-xs font-mono px-2 py-1 rounded-lg bg-[var(--color-surface2)] text-[var(--color-text-muted)]">
            Step <span className="text-[var(--color-primary)] font-bold">{Math.max(0, currentStep + 1)}</span> / {totalSteps}
          </span>

          {/* Speed */}
          <div className="flex items-center gap-1 ml-auto">
            {SPEED_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => setSpeed(p.value)}
                className="px-2 py-1 rounded-lg text-[11px] font-medium transition-colors"
                style={{
                  backgroundColor: speed === p.value ? "var(--color-primary)" : "var(--color-surface2)",
                  color: speed === p.value ? "#fff" : "var(--color-text-muted)",
                  border: `1px solid ${speed === p.value ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timeline scrubber */}
      {hasSteps && (
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max={totalSteps - 1}
            value={Math.max(0, currentStep)}
            onChange={(e) => seekTo(+e.target.value)}
            className="flex-1 h-1.5 accent-[var(--color-primary)] cursor-pointer"
            style={{ accentColor: "var(--color-primary)" }}
          />
        </div>
      )}
    </div>
  );
}
