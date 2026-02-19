import { useState, useEffect, useRef, useCallback } from "react";

/**
 * NaviCVViz — Animated mini job-search dashboard visualization for the NaviCV project.
 * Shows a header bar, then job listing cards slide in one by one with match-score bars,
 * pauses, then loops.
 */

const JOBS = [
  {
    title: "Full Stack Engineer",
    company: "CompassX",
    location: "Remote",
    tags: [
      { label: "React", color: "#3B82F6" },
      { label: "Node", color: "#22C55E" },
      { label: "Docker", color: "#06B6D4" },
    ],
    match: 94,
    icon: "🖥",
  },
  {
    title: "ML Engineer",
    company: "DeepTech",
    location: "San Francisco",
    tags: [
      { label: "Python", color: "#F59E0B" },
      { label: "PyTorch", color: "#EF4444" },
    ],
    match: 87,
    icon: "🧠",
  },
  {
    title: "Backend Developer",
    company: "CloudNine",
    location: "New York",
    tags: [
      { label: "Go", color: "#06B6D4" },
      { label: "AWS", color: "#F59E0B" },
      { label: "Postgres", color: "#8B5CF6" },
    ],
    match: 78,
    icon: "⚙",
  },
];

const NaviCVViz = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const [filledBars, setFilledBars] = useState({});
  const mountedRef = useRef(true);
  const timeoutRef = useRef(null);

  const clearAllTimeouts = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const runLoop = () => {
      if (!mountedRef.current) return;
      setVisibleCards([]);
      setFilledBars({});

      let step = 0;

      const nextStep = () => {
        if (!mountedRef.current) return;

        if (step >= JOBS.length) {
          // All cards shown and bars filled — pause then restart
          timeoutRef.current = setTimeout(() => {
            if (mountedRef.current) runLoop();
          }, 3000);
          return;
        }

        // Show the next card
        const currentStep = step;
        setVisibleCards((prev) => [...prev, JOBS[currentStep]]);

        // After a short delay, animate the match bar
        timeoutRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          setFilledBars((prev) => ({ ...prev, [currentStep]: true }));

          step++;
          timeoutRef.current = setTimeout(nextStep, 600);
        }, 400);
      };

      timeoutRef.current = setTimeout(nextStep, 500);
    };

    runLoop();

    return () => {
      mountedRef.current = false;
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden select-none"
      style={{ background: "#0C1222", fontFamily: "inherit" }}
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 shrink-0"
        style={{
          background: "linear-gradient(135deg, #475569, #1E293B)",
        }}
      >
        {/* Paper-plane icon */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0"
        >
          <path
            d="M15 1L7 9M15 1L10 15L7 9M15 1L1 6L7 9"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
        <span
          className="font-bold text-white/90"
          style={{ fontSize: "9px" }}
        >
          NaviCV
        </span>
        <span
          className="text-white/40 ml-auto"
          style={{ fontSize: "7px" }}
        >
          Job Dashboard
        </span>
      </div>

      {/* Stats bar */}
      <div
        className="flex items-center gap-3 px-3 py-1.5 border-b shrink-0"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div className="flex items-center gap-1">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#22C55E" }}
          />
          <span style={{ fontSize: "7px" }} className="text-white/50">
            3 Matches
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#3B82F6" }}
          />
          <span style={{ fontSize: "7px" }} className="text-white/50">
            12 Applied
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#F59E0B" }}
          />
          <span style={{ fontSize: "7px" }} className="text-white/50">
            5 Interviews
          </span>
        </div>
      </div>

      {/* Job listings area */}
      <div
        className="flex-1 overflow-hidden px-2 py-1.5 space-y-1.5"
        style={{ background: "rgba(0,0,0,0.15)" }}
      >
        {visibleCards.map((job, i) => (
          <div
            key={`${job.title}-${i}`}
            className="rounded-lg px-2 py-1.5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              animation: "naviSlideIn 0.35s ease-out forwards",
            }}
          >
            {/* Top row: icon + title + company + location */}
            <div className="flex items-center gap-1.5 mb-1">
              <span style={{ fontSize: "9px", lineHeight: 1 }}>
                {job.icon}
              </span>
              <span
                className="font-bold text-white/90 truncate"
                style={{ fontSize: "7.5px" }}
              >
                {job.title}
              </span>
              <span className="text-white/30" style={{ fontSize: "6px" }}>
                •
              </span>
              <span
                className="text-white/50 truncate"
                style={{ fontSize: "6.5px" }}
              >
                {job.company}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mb-1">
              <svg
                width="6"
                height="6"
                viewBox="0 0 12 12"
                fill="none"
                className="shrink-0"
              >
                <path
                  d="M6 1C4 1 2.5 2.5 2.5 4.5C2.5 7.5 6 11 6 11S9.5 7.5 9.5 4.5C9.5 2.5 8 1 6 1Z"
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.3"
                />
                <circle
                  cx="6"
                  cy="4.5"
                  r="1"
                  fill="white"
                  opacity="0.3"
                />
              </svg>
              <span className="text-white/35" style={{ fontSize: "6px" }}>
                {job.location}
              </span>
            </div>

            {/* Tags row */}
            <div className="flex items-center gap-1 mb-1">
              {job.tags.map((tag) => (
                <span
                  key={tag.label}
                  className="rounded-full px-1.5 py-px font-medium"
                  style={{
                    fontSize: "5.5px",
                    background: `${tag.color}20`,
                    color: tag.color,
                    border: `0.5px solid ${tag.color}40`,
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>

            {/* Match score bar */}
            <div className="flex items-center gap-1.5">
              <div
                className="flex-1 h-[5px] rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: filledBars[i] ? `${job.match}%` : "0%",
                    background:
                      job.match >= 90
                        ? "linear-gradient(90deg, #22C55E, #34D399)"
                        : job.match >= 80
                          ? "linear-gradient(90deg, #3B82F6, #60A5FA)"
                          : "linear-gradient(90deg, #F59E0B, #FBBF24)",
                    transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
              <span
                className="font-bold shrink-0"
                style={{
                  fontSize: "7px",
                  color:
                    job.match >= 90
                      ? "#34D399"
                      : job.match >= 80
                        ? "#60A5FA"
                        : "#FBBF24",
                  opacity: filledBars[i] ? 1 : 0,
                  transition: "opacity 0.5s ease",
                }}
              >
                {job.match}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Inline animation keyframe */}
      <style>{`
        @keyframes naviSlideIn {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NaviCVViz;
