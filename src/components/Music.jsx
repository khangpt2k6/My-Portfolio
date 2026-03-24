import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Music as MusicIcon,
  ListMusic,
} from "lucide-react";
import tracks from "../data/music";

/* ── Equalizer CSS keyframes (injected once) ────────────── */
const equalizerStyles = `
@keyframes eq-bounce {
  0%, 100% { height: 20%; }
  10%      { height: 60%; }
  20%      { height: 35%; }
  30%      { height: 80%; }
  40%      { height: 50%; }
  50%      { height: 95%; }
  60%      { height: 40%; }
  70%      { height: 70%; }
  80%      { height: 55%; }
  90%      { height: 85%; }
}
@keyframes pulse-play {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0.4); }
  50%      { box-shadow: 0 0 0 14px rgba(var(--color-primary-rgb), 0); }
}
`;

/* ── Floating Gradient Orb ─────────────────────────────── */
const FloatingOrb = ({ size, color, left, top, delay = 0, duration = 20 }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color}, transparent 70%)`,
      left,
      top,
      filter: "blur(60px)",
    }}
    animate={{
      x: [0, 50, -30, 25, 0],
      y: [0, -40, 35, -20, 0],
      scale: [1, 1.2, 0.85, 1.1, 1],
    }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

/* ── Equalizer Bars ────────────────────────────────────── */
const EqualizerBars = ({ isPlaying }) => {
  const bars = [0, 1, 2, 3, 4, 5];
  const delays = [0, 0.15, 0.3, 0.08, 0.22, 0.38];
  const durations = [1.2, 1.0, 1.4, 0.9, 1.1, 1.3];

  return (
    <div className="flex items-end justify-center gap-[3px] h-10">
      {bars.map((i) => (
        <div
          key={i}
          className="w-[5px] rounded-full"
          style={{
            height: isPlaying ? undefined : "20%",
            background:
              "linear-gradient(to top, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))",
            animation: isPlaying
              ? `eq-bounce ${durations[i]}s ease-in-out ${delays[i]}s infinite`
              : "none",
            transition: "height 0.3s ease",
          }}
        />
      ))}
    </div>
  );
};

/* ── Format time helper ────────────────────────────────── */
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

/* ══════════════════════════════════════════════════════════
   MUSIC PAGE COMPONENT
   ══════════════════════════════════════════════════════════ */
const Music = () => {
  /* ── State ── */
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [prevVolume, setPrevVolume] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // off | one | all
  const [errorMsg, setErrorMsg] = useState("");
  const [isSeeking, setIsSeeking] = useState(false);

  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const currentTrack = tracks[currentTrackIndex];

  /* ── Audio event listeners ── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime);
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setCurrentTime(0);
    };
    const onEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (isShuffle) {
        playRandomNext();
      } else if (repeatMode === "all") {
        setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
      } else {
        // repeat off — stop at end of playlist
        if (currentTrackIndex < tracks.length - 1) {
          setCurrentTrackIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }
    };
    const onError = () => {
      setErrorMsg("Could not load audio file. Check that the file exists in /public/music/.");
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [currentTrackIndex, repeatMode, isShuffle, isSeeking]);

  /* ── Play/pause when track changes ── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.src;
    audio.volume = volume;
    setErrorMsg("");

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          setErrorMsg("Could not play audio. Add your .mp3 files to /public/music/.");
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex]);

  /* ── Volume changes ── */
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  /* ── Controls ── */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            setErrorMsg("Could not play audio. Add your .mp3 files to /public/music/.");
          });
      }
    }
  }, [isPlaying]);

  const playRandomNext = useCallback(() => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } while (nextIndex === currentTrackIndex && tracks.length > 1);
    setCurrentTrackIndex(nextIndex);
  }, [currentTrackIndex]);

  const handlePrev = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    }
  };

  const handleNext = () => {
    if (isShuffle) {
      playRandomNext();
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
  };

  const handleTrackSelect = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const cycleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  };

  /* ── Progress bar seek ── */
  const handleProgressClick = (e) => {
    const bar = progressRef.current;
    if (!bar || !audioRef.current) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressMouseDown = (e) => {
    setIsSeeking(true);
    handleProgressClick(e);

    const onMouseMove = (e) => handleProgressClick(e);
    const onMouseUp = () => {
      setIsSeeking(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  /* ── Volume controls ── */
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setPrevVolume(val > 0 ? val : prevVolume);
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume || 0.7);
    }
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */
  return (
    <section className="relative min-h-screen px-4 py-24 md:py-32 overflow-hidden">
      {/* ── Inject equalizer keyframes ── */}
      <style>{equalizerStyles}</style>

      {/* ── Hidden audio element ── */}
      <audio ref={audioRef} preload="metadata" />

      {/* ── Floating Gradient Orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb size="320px" color="rgba(var(--color-primary-rgb), 0.08)" left="8%" top="12%" delay={0} duration={24} />
        <FloatingOrb size="260px" color="rgba(var(--color-secondary-rgb), 0.06)" left="68%" top="58%" delay={4} duration={20} />
        <FloatingOrb size="200px" color="rgba(147, 51, 234, 0.05)" left="75%" top="5%" delay={6} duration={18} />
        <FloatingOrb size="240px" color="rgba(236, 72, 153, 0.04)" left="20%" top="72%" delay={8} duration={22} />
      </div>

      {/* ── Page Content ── */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Page Title ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <ListMusic
                className="w-8 h-8 text-[var(--color-primary)]"
                strokeWidth={1.5}
              />
            </motion.div>
            <h2
              className="text-4xl md:text-5xl font-bold text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              My Playlist
            </h2>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-[2px] mx-auto"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgb(var(--color-primary-rgb)), transparent)",
            }}
          />
        </motion.div>

        {/* ── Error Toast ── */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card rounded-xl px-5 py-3 mb-6 text-center text-sm text-[var(--color-text-muted)] max-w-lg mx-auto"
              style={{ borderColor: "rgba(239, 68, 68, 0.3)" }}
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main Layout: Now Playing + Playlist ── */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* ────────────────────────────────────────
              NOW PLAYING SECTION
              ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-[45%] flex-shrink-0"
          >
            <div className="glass-card glow-border rounded-3xl p-6 md:p-8 flex flex-col items-center">
              {/* ── Album Art ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTrack.id}
                  initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative w-52 h-52 md:w-64 md:h-64 rounded-2xl overflow-hidden mb-6 shadow-elevated flex-shrink-0"
                  style={{ background: currentTrack.gradient }}
                >
                  {currentTrack.image ? (
                    <img src={currentTrack.image} alt={currentTrack.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      {/* Overlay pattern */}
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 0%, transparent 60%)",
                        }}
                      />
                      {/* Music note icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MusicIcon
                          className="w-16 h-16 md:w-20 md:h-20 text-white/40"
                          strokeWidth={1}
                        />
                      </div>
                    </>
                  )}
                  {/* Vinyl ring decoration */}
                  <motion.div
                    className="absolute inset-4 rounded-full border border-white/10"
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={
                      isPlaying
                        ? { duration: 8, repeat: Infinity, ease: "linear" }
                        : {}
                    }
                  >
                    <div className="absolute inset-4 rounded-full border border-white/10" />
                    <div className="absolute inset-8 rounded-full border border-white/5" />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* ── Track Info ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTrack.id + "-info"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-center mb-5 w-full"
                >
                  <h3
                    className="text-xl md:text-2xl font-bold text-[var(--color-text)] truncate"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {currentTrack.title}
                  </h3>
                  <p className="text-[var(--color-text-muted)] mt-1 text-sm">
                    {currentTrack.artist} &mdash; {currentTrack.album}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* ── Equalizer ── */}
              <div className="mb-5">
                <EqualizerBars isPlaying={isPlaying} />
              </div>

              {/* ── Progress Bar ── */}
              <div className="w-full mb-2">
                <div
                  ref={progressRef}
                  className="relative w-full h-2 rounded-full cursor-pointer group"
                  style={{ background: "rgba(var(--color-primary-rgb), 0.15)" }}
                  onMouseDown={handleProgressMouseDown}
                >
                  {/* Filled portion */}
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-[width] duration-100"
                    style={{
                      width: `${progress}%`,
                      background:
                        "linear-gradient(90deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))",
                    }}
                  />
                  {/* Seek thumb */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                    style={{
                      left: `calc(${progress}% - 8px)`,
                      background: "rgb(var(--color-primary-rgb))",
                      boxShadow: "0 0 8px rgba(var(--color-primary-rgb), 0.5)",
                    }}
                  />
                </div>
                {/* Time display */}
                <div className="flex justify-between mt-1.5 text-xs text-[var(--color-text-muted)]">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* ── Playback Controls ── */}
              <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 w-full">
                {/* Shuffle */}
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className="p-2 rounded-full transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.1)]"
                  title="Shuffle"
                >
                  <Shuffle
                    className="w-[18px] h-[18px]"
                    style={{
                      color: isShuffle
                        ? "rgb(var(--color-primary-rgb))"
                        : "var(--color-text-muted)",
                    }}
                    strokeWidth={isShuffle ? 2.5 : 1.5}
                  />
                </button>

                {/* Previous */}
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full text-[var(--color-text)] transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.1)]"
                  title="Previous"
                >
                  <SkipBack className="w-5 h-5" strokeWidth={1.5} />
                </button>

                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  className="relative w-14 h-14 rounded-full flex items-center justify-center text-white transition-transform duration-200 active:scale-90"
                  style={{
                    background:
                      "linear-gradient(135deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))",
                    animation: !isPlaying ? "pulse-play 2s ease-in-out infinite" : "none",
                    boxShadow: isPlaying
                      ? "0 4px 20px rgba(var(--color-primary-rgb), 0.4)"
                      : undefined,
                  }}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  <AnimatePresence mode="wait">
                    {isPlaying ? (
                      <motion.div
                        key="pause"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Pause className="w-6 h-6" fill="currentColor" strokeWidth={0} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ scale: 0, rotate: 90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: -90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Play className="w-6 h-6 ml-0.5" fill="currentColor" strokeWidth={0} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {/* Next */}
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full text-[var(--color-text)] transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.1)]"
                  title="Next"
                >
                  <SkipForward className="w-5 h-5" strokeWidth={1.5} />
                </button>

                {/* Repeat */}
                <button
                  onClick={cycleRepeat}
                  className="p-2 rounded-full transition-colors duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.1)]"
                  title={`Repeat: ${repeatMode}`}
                >
                  {repeatMode === "one" ? (
                    <Repeat1
                      className="w-[18px] h-[18px]"
                      style={{ color: "rgb(var(--color-primary-rgb))" }}
                      strokeWidth={2.5}
                    />
                  ) : (
                    <Repeat
                      className="w-[18px] h-[18px]"
                      style={{
                        color:
                          repeatMode === "all"
                            ? "rgb(var(--color-primary-rgb))"
                            : "var(--color-text-muted)",
                      }}
                      strokeWidth={repeatMode === "all" ? 2.5 : 1.5}
                    />
                  )}
                </button>
              </div>

              {/* ── Volume ── */}
              <div className="flex items-center gap-3 w-full max-w-[240px]">
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-full text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
                  title={volume === 0 ? "Unmute" : "Mute"}
                >
                  <VolumeIcon className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <div className="relative flex-1 group">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(var(--color-primary-rgb)) 0%, rgb(var(--color-primary-rgb)) ${volume * 100}%, rgba(var(--color-primary-rgb), 0.15) ${volume * 100}%, rgba(var(--color-primary-rgb), 0.15) 100%)`,
                      accentColor: "rgb(var(--color-primary-rgb))",
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ────────────────────────────────────────
              PLAYLIST SECTION
              ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex-1 min-w-0"
          >
            <div className="glass-card glow-border rounded-3xl p-5 md:p-6 h-full flex flex-col">
              {/* Playlist header */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--color-border)]">
                <ListMusic className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={1.5} />
                <h3
                  className="text-lg font-semibold text-[var(--color-text)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Tracklist
                </h3>
                <span className="ml-auto text-xs text-[var(--color-text-muted)]">
                  {tracks.length} tracks
                </span>
              </div>

              {/* Scrollable track list */}
              <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-1 max-h-[480px] lg:max-h-[540px]">
                {tracks.map((track, index) => {
                  const isActive = index === currentTrackIndex;
                  return (
                    <motion.button
                      key={track.id}
                      onClick={() => handleTrackSelect(index)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                        isActive
                          ? "bg-[rgba(var(--color-primary-rgb),0.12)]"
                          : "hover:bg-[rgba(var(--color-primary-rgb),0.05)]"
                      }`}
                      style={
                        isActive
                          ? {
                              boxShadow:
                                "inset 0 0 20px rgba(var(--color-primary-rgb), 0.08), 0 0 15px rgba(var(--color-primary-rgb), 0.06)",
                            }
                          : undefined
                      }
                    >
                      {/* Track number / playing indicator */}
                      <div className="w-7 text-center flex-shrink-0">
                        {isActive && isPlaying ? (
                          <div className="flex items-end justify-center gap-[2px] h-4">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="w-[3px] rounded-full"
                                style={{
                                  background: "rgb(var(--color-primary-rgb))",
                                  animation: `eq-bounce ${1 + i * 0.2}s ease-in-out ${i * 0.1}s infinite`,
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <span
                            className={`text-sm font-medium ${
                              isActive
                                ? "text-[var(--color-primary)]"
                                : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]"
                            }`}
                          >
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Mini album art */}
                      <div
                        className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
                        style={{ background: track.image ? "none" : track.gradient }}
                      >
                        {track.image ? (
                          <img src={track.image} alt={track.title} className="w-full h-full object-cover" />
                        ) : (
                          <MusicIcon
                            className="w-4 h-4 text-white/50"
                            strokeWidth={1.5}
                          />
                        )}
                      </div>

                      {/* Track details */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold truncate transition-colors duration-200 ${
                            isActive
                              ? "text-[var(--color-primary)]"
                              : "text-[var(--color-text)] group-hover:text-[var(--color-text)]"
                          }`}
                        >
                          {track.title}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] truncate">
                          {track.artist}
                        </p>
                      </div>

                      {/* Duration */}
                      <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0 tabular-nums">
                        {track.duration}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Music;
