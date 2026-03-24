import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  Volume2,
  VolumeX,
} from "lucide-react";
import tracks from "../../data/music";

const formatTime = (s) => {
  if (!s || isNaN(s)) return "0:00";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
};

/* ── Equalizer bars for active track ── */
const EqBars = () => (
  <div className="flex items-end gap-[2px] h-3">
    {[0, 1, 2].map((b) => (
      <div
        key={b}
        className="w-[2px] rounded-full bg-white"
        style={{ animation: `eq-bar ${0.8 + b * 0.15}s ease-in-out ${b * 0.1}s infinite alternate` }}
      />
    ))}
  </div>
);

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
    a.src = encodeURI(track.src);
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

      <div className="relative">
        {/* ── Music button in navbar ── */}
        <motion.button
          ref={btnRef}
          onClick={() => setIsOpen((p) => !p)}
          whileTap={{ scale: 0.9 }}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[var(--color-text)]/8 transition-all duration-300 cursor-pointer"
          style={{ color: isOpen || isPlaying ? "var(--color-primary)" : "var(--color-text)" }}
          aria-label="Music player"
        >
          {/* Animated icon */}
          <motion.div
            animate={isPlaying ? { rotate: [0, 10, -10, 0] } : {}}
            transition={isPlaying ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : {}}
          >
            <Music size={14} />
          </motion.div>

          {/* Playing indicator bars */}
          {isPlaying && (
            <div className="flex items-end gap-[1.5px] h-3">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-[2px] rounded-full"
                  style={{ backgroundColor: "var(--color-primary)" }}
                  animate={{ height: ["3px", `${8 + i * 2}px`, "3px"] }}
                  transition={{
                    duration: 0.6 + i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          )}

          {!isPlaying && (
            <span className="text-xs font-medium select-none hidden sm:inline">Music</span>
          )}
        </motion.button>

        {/* ── Dropdown panel ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-12 right-0 z-50 w-[300px] rounded-xl overflow-hidden border border-[var(--color-border)]"
              style={{ boxShadow: "0 12px 48px rgba(0,0,0,0.3)", background: "var(--window-bg)" }}
            >
              {/* ── Now playing header ── */}
              <div className="relative h-14 flex items-center gap-3 px-3" style={{ background: track.gradient }}>
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm flex-shrink-0">
                    {isPlaying ? <EqBars /> : <Music className="w-4 h-4 text-white" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{track.title}</p>
                    <p className="text-[10px] text-white/70 truncate">{track.artist}</p>
                  </div>
                </div>
              </div>

              {/* ── Progress bar ── */}
              <div
                className="h-[3px] cursor-pointer relative"
                style={{ background: "rgba(var(--color-primary-rgb), 0.15)" }}
                onClick={seek}
              >
                <motion.div
                  className="absolute top-0 left-0 h-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))",
                  }}
                  layout
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* ── Controls ── */}
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-[10px] text-[var(--color-text-muted)] tabular-nums w-8">
                  {formatTime(currentTime)}
                </span>

                <div className="flex items-center gap-1.5">
                  <button onClick={prev} className="p-1.5 rounded-full text-[var(--color-text)] hover:bg-[rgba(var(--color-primary-rgb),0.1)] transition-colors">
                    <SkipBack size={14} />
                  </button>
                  <motion.button
                    onClick={togglePlay}
                    whileTap={{ scale: 0.85 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ background: "linear-gradient(135deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))" }}
                  >
                    {isPlaying
                      ? <Pause size={14} fill="currentColor" strokeWidth={0} />
                      : <Play size={14} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                    }
                  </motion.button>
                  <button onClick={next} className="p-1.5 rounded-full text-[var(--color-text)] hover:bg-[rgba(var(--color-primary-rgb),0.1)] transition-colors">
                    <SkipForward size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-1 w-8 justify-end">
                  <button onClick={() => setMuted((m) => !m)} className="p-1 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                    {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  </button>
                </div>
              </div>

              {/* ── Track list ── */}
              <div className="border-t border-[var(--color-border)] max-h-[180px] overflow-y-auto">
                {tracks.map((t, i) => {
                  const active = i === currentIndex;
                  return (
                    <button
                      key={t.id}
                      onClick={() => { setCurrentIndex(i); setIsPlaying(true); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                        active ? "bg-[rgba(var(--color-primary-rgb),0.1)]" : "hover:bg-[rgba(var(--color-primary-rgb),0.05)]"
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center"
                        style={{ background: t.gradient }}
                      >
                        {active && isPlaying ? (
                          <EqBars />
                        ) : (
                          <span className="text-[9px] font-bold text-white/80">{String(i + 1).padStart(2, "0")}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[11px] font-semibold truncate ${active ? "text-[var(--color-primary)]" : "text-[var(--color-text)]"}`}>
                          {t.title}
                        </p>
                        <p className="text-[9px] text-[var(--color-text-muted)] truncate">{t.artist}</p>
                      </div>
                      <span className="text-[9px] text-[var(--color-text-muted)] tabular-nums flex-shrink-0">
                        {active ? formatTime(currentTime) : ""}
                      </span>
                    </button>
                  );
                })}
              </div>

              {error && (
                <div className="px-3 py-1.5 text-[9px] text-center text-red-400 border-t border-[var(--color-border)]">
                  Add .mp3 files to /public/music/
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
