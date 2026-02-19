import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import tracks from "../data/music";

const formatTime = (s) => {
  if (!s || isNaN(s)) return "0:00";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
};

const MiniPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(false);

  const audioRef = useRef(null);
  const panelRef = useRef(null);
  const btnRef = useRef(null);
  const track = tracks[currentIndex];

  /* ── Audio event listeners ── */
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrentTime(a.currentTime);
    const onMeta = () => { setDuration(a.duration); setCurrentTime(0); };
    const onEnd = () => { setCurrentIndex((p) => (p + 1) % tracks.length); };
    const onErr = () => { setError(true); setIsPlaying(false); };

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    a.addEventListener("error", onErr);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("error", onErr);
    };
  }, [currentIndex]);

  /* ── Load track on index change ── */
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.src = track.src;
    a.muted = muted;
    setError(false);
    if (isPlaying) {
      a.play().catch(() => { setError(true); setIsPlaying(false); });
    }
  }, [currentIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  /* ── Close on outside click ── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  /* ── Controls ── */
  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) { a.pause(); setIsPlaying(false); }
    else {
      a.play()
        .then(() => setIsPlaying(true))
        .catch(() => { setError(true); });
    }
  }, [isPlaying]);

  const prev = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      setCurrentIndex((p) => (p - 1 + tracks.length) % tracks.length);
    }
  };

  const next = () => setCurrentIndex((p) => (p + 1) % tracks.length);

  const seek = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audioRef.current) {
      audioRef.current.currentTime = ratio * duration;
      setCurrentTime(ratio * duration);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio ref={audioRef} preload="metadata" />

      {/* ── Floating music button — bottom-right, above chat button ── */}
      <motion.button
        ref={btnRef}
        onClick={() => setIsOpen((p) => !p)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-20 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg transition-shadow duration-300"
        style={{
          background: "linear-gradient(135deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))",
          boxShadow: isPlaying
            ? "0 0 20px rgba(var(--color-primary-rgb), 0.5)"
            : "0 4px 12px rgba(0,0,0,0.2)",
        }}
        aria-label="Music player"
      >
        <Music size={18} />
        {isPlaying && !isOpen && (
          <span
            className="absolute inset-0 rounded-full opacity-40"
            style={{
              background: "linear-gradient(135deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))",
              animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
            }}
          />
        )}
      </motion.button>

      {/* ── Player panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-[8.5rem] right-6 z-50 w-[300px] glass-card backdrop-blur-2xl rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}
          >
            {/* ── Now playing header ── */}
            <div className="relative h-16 flex items-center gap-3 px-4" style={{ background: track.gradient }}>
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm flex-shrink-0">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{track.title}</p>
                  <p className="text-xs text-white/70 truncate">{track.artist}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="relative z-10 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white/80" />
              </button>
            </div>

            {/* ── Progress bar ── */}
            <div
              className="h-1 cursor-pointer relative"
              style={{ background: "rgba(var(--color-primary-rgb), 0.15)" }}
              onClick={seek}
            >
              <div
                className="absolute top-0 left-0 h-full transition-[width] duration-100"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))",
                }}
              />
            </div>

            {/* ── Controls ── */}
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-[10px] text-[var(--color-text-muted)] tabular-nums w-10">
                {formatTime(currentTime)}
              </span>

              <div className="flex items-center gap-2">
                <button onClick={prev} className="p-1.5 rounded-full text-[var(--color-text)] hover:bg-[rgba(var(--color-primary-rgb),0.1)] transition-colors">
                  <SkipBack size={16} />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                  style={{ background: "linear-gradient(135deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))" }}
                >
                  {isPlaying ? <Pause size={16} fill="currentColor" strokeWidth={0} /> : <Play size={16} fill="currentColor" strokeWidth={0} className="ml-0.5" />}
                </button>
                <button onClick={next} className="p-1.5 rounded-full text-[var(--color-text)] hover:bg-[rgba(var(--color-primary-rgb),0.1)] transition-colors">
                  <SkipForward size={16} />
                </button>
              </div>

              <button onClick={() => setMuted((m) => !m)} className="p-1 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>

            {/* ── Track list ── */}
            <div className="border-t border-[var(--color-border)] max-h-[200px] overflow-y-auto">
              {tracks.map((t, i) => {
                const active = i === currentIndex;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setCurrentIndex(i); setIsPlaying(true); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      active ? "bg-[rgba(var(--color-primary-rgb),0.1)]" : "hover:bg-[rgba(var(--color-primary-rgb),0.05)]"
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded flex-shrink-0 flex items-center justify-center"
                      style={{ background: t.gradient }}
                    >
                      {active && isPlaying ? (
                        <div className="flex items-end gap-[2px] h-3">
                          {[0, 1, 2].map((b) => (
                            <div
                              key={b}
                              className="w-[2px] rounded-full bg-white"
                              style={{ animation: `eq-bar ${0.8 + b * 0.15}s ease-in-out ${b * 0.1}s infinite alternate` }}
                            />
                          ))}
                        </div>
                      ) : (
                        <Music className="w-3 h-3 text-white/60" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold truncate ${active ? "text-[var(--color-primary)]" : "text-[var(--color-text)]"}`}>
                        {t.title}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)] truncate">{t.artist}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="px-4 py-2 text-[10px] text-center text-red-400 border-t border-[var(--color-border)]">
                Add .mp3 files to /public/music/
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes eq-bar {
          0% { height: 3px; }
          100% { height: 10px; }
        }
      `}</style>
    </>
  );
};

export default MiniPlayer;
