import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import tracks from "../data/music";

export default function MusicApp() {
  const audioRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = tracks[current];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = encodeURI(track.src);
    if (playing) audio.play().catch(() => {});
  }, [current]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setProgress(audio.currentTime);
    const onDur = () => setDuration(audio.duration || 0);
    const onEnd = () => next();

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDur);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDur);
      audio.removeEventListener("ended", onEnd);
    };
  }, [current]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  }, [playing]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % tracks.length);
    setPlaying(true);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + tracks.length) % tracks.length);
    setPlaying(true);
  }, []);

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = pct * duration;
    }
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full flex flex-col">
      <audio ref={audioRef} />

      {/* Album art area */}
      <div
        className="flex-1 flex items-center justify-center p-6 relative overflow-hidden"
        style={{ background: track.gradient }}
      >
        {/* Blurred background image */}
        {track.image && (
          <img
            src={track.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60"
          />
        )}
        <motion.div
          className="relative w-44 h-44 rounded-2xl shadow-2xl overflow-hidden
                     border-2 border-white/15"
          animate={{ scale: playing ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {track.image ? (
            <img
              src={track.image}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <Volume2 className="w-12 h-12 text-white/60" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="p-5 border-t border-[var(--glass-border)]"
        style={{ background: "var(--color-surface)" }}>
        <div className="text-center mb-3">
          <div className="text-sm font-bold text-[var(--color-text)]">{track.title}</div>
          <div className="text-xs text-[var(--color-text-muted)]">{track.artist}</div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] text-[var(--color-text-muted)] w-8 text-right">{fmt(progress)}</span>
          <div className="flex-1 h-1 rounded-full bg-[var(--glass-border)] cursor-pointer" onClick={seek}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${duration ? (progress / duration) * 100 : 0}%`,
                background: "var(--color-primary)",
              }}
            />
          </div>
          <span className="text-[10px] text-[var(--color-text-muted)] w-8">{fmt(duration)}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-6">
          <button onClick={prev} className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={toggle}
            className="w-10 h-10 rounded-full flex items-center justify-center
                       bg-[var(--color-primary)] text-white hover:brightness-110 transition"
          >
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button onClick={next} className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Track list */}
      <div className="max-h-40 overflow-auto border-t border-[var(--glass-border)]"
        style={{ background: "var(--color-surface)" }}>
        {tracks.map((t, i) => (
          <button
            key={t.id}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-[var(--color-primary)]/10 transition-colors
              ${i === current ? "text-[var(--color-primary)]" : "text-[var(--color-text)]"}`}
            onClick={() => { setCurrent(i); setPlaying(true); }}
          >
            <div className="w-8 h-8 rounded shrink-0 overflow-hidden">
              {t.image ? (
                <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full rounded" style={{ background: t.gradient }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{t.title}</div>
              <div className="text-xs text-[var(--color-text-muted)] truncate">{t.artist}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
