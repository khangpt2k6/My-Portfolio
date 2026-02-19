import { useState, useEffect, useRef, useCallback } from "react";

/**
 * NaviCVViz — Matches the real NaviCV light-themed UI:
 * dark navy header, light background, white job cards with tags,
 * green "View Position" buttons, match scores.
 */

const JOBS = [
  {
    title: "Full Stack Software Engineer",
    company: "CompassX Group",
    tags: ["Software", "React", "Frontend", "Full-stack"],
    extra: 9,
    location: "Remote - CST Timezone",
    date: "11/14/2025",
    salary: "Not specified",
    salaryColor: "#EF4444",
    match: 94,
  },
  {
    title: "ML Engineer",
    company: "DeepTech AI",
    tags: ["Python", "PyTorch", "ML"],
    extra: 4,
    location: "San Francisco, CA",
    date: "11/12/2025",
    salary: "$140k - $180k",
    salaryColor: "#22C55E",
    match: 87,
  },
];

const NaviCVViz = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const [scanning, setScanning] = useState(false);
  const mountedRef = useRef(true);
  const timeoutRef = useRef(null);

  const clear = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const runLoop = () => {
      if (!mountedRef.current) return;
      setVisibleCards([]);
      setScanning(true);

      // Scanning animation, then show cards
      timeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setScanning(false);

        let step = 0;
        const showNext = () => {
          if (!mountedRef.current || step >= JOBS.length) {
            timeoutRef.current = setTimeout(() => {
              if (mountedRef.current) runLoop();
            }, 3500);
            return;
          }
          const s = step;
          setVisibleCards((prev) => [...prev, JOBS[s]]);
          step++;
          timeoutRef.current = setTimeout(showNext, 700);
        };
        showNext();
      }, 1200);
    };

    runLoop();
    return () => { mountedRef.current = false; clear(); };
  }, [clear]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden select-none" style={{ background: "#F1F5F9", fontFamily: "inherit" }}>
      {/* ── NaviCV Header (dark navy like the real app) ── */}
      <div className="flex items-center gap-1.5 px-3 py-2 shrink-0" style={{ background: "#1E293B" }}>
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d="M15 1L7 9M15 1L10 15L7 9M15 1L1 6L7 9" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex flex-col">
          <span className="font-bold text-white" style={{ fontSize: "8px" }}>NaviCV</span>
          <span className="text-white/40" style={{ fontSize: "5px" }}>AI-Powered Career Navigation</span>
        </div>
        <div className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.12)" }}>
          <svg width="6" height="6" viewBox="0 0 12 12" fill="none">
            <path d="M1 6a5 5 0 019.5-1.5M11 6a5 5 0 01-9.5 1.5" stroke="white" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
          </svg>
          <span className="text-white/60" style={{ fontSize: "5.5px" }}>Refresh Data</span>
        </div>
      </div>

      {/* ── Scanning bar ── */}
      {scanning && (
        <div className="h-[3px] w-full overflow-hidden shrink-0" style={{ background: "#E2E8F0" }}>
          <div className="h-full rounded-full" style={{ width: "60%", background: "linear-gradient(90deg, #818CF8, #06B6D4)", animation: "naviScan 1s ease-in-out infinite alternate" }} />
        </div>
      )}

      {/* ── Job Cards (light bg, white cards like real NaviCV) ── */}
      <div className="flex-1 overflow-hidden px-2 py-1.5 space-y-1.5">
        {visibleCards.map((job, i) => (
          <div
            key={`${job.title}-${i}`}
            className="rounded-lg px-2.5 py-2"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              animation: "naviSlideIn 0.4s ease-out forwards",
            }}
          >
            {/* Title row with icon */}
            <div className="flex items-start gap-1.5 mb-1">
              <div className="w-4 h-4 rounded shrink-0 flex items-center justify-center mt-px" style={{ background: "#EEF2FF" }}>
                <svg width="7" height="7" viewBox="0 0 12 12" fill="none">
                  <rect x="1" y="3" width="10" height="7" rx="1" stroke="#6366F1" strokeWidth="1" />
                  <path d="M4 3V2a2 2 0 014 0v1" stroke="#6366F1" strokeWidth="1" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-800 block truncate" style={{ fontSize: "7.5px" }}>{job.title}</span>
                <span className="text-slate-500" style={{ fontSize: "6px" }}>{job.company}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1 mb-1 flex-wrap">
              {job.tags.map((tag) => (
                <span key={tag} className="rounded-full px-1.5 py-px" style={{ fontSize: "5px", background: "#F1F5F9", color: "#475569", border: "0.5px solid #CBD5E1" }}>
                  {tag}
                </span>
              ))}
              {job.extra > 0 && (
                <span className="text-slate-400" style={{ fontSize: "5px" }}>+{job.extra} more</span>
              )}
            </div>

            {/* Location / Date / Salary row */}
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center gap-0.5">
                <svg width="5" height="5" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1C4 1 2.5 2.5 2.5 4.5C2.5 7.5 6 11 6 11S9.5 7.5 9.5 4.5C9.5 2.5 8 1 6 1Z" stroke="#94A3B8" strokeWidth="1" />
                  <circle cx="6" cy="4.5" r="1" fill="#94A3B8" />
                </svg>
                <span className="text-slate-400" style={{ fontSize: "5px" }}>{job.location}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <svg width="5" height="5" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="#94A3B8" strokeWidth="1" />
                  <path d="M6 3v3l2 1" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
                </svg>
                <span className="text-slate-400" style={{ fontSize: "5px" }}>{job.date}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span style={{ fontSize: "5px", color: job.salaryColor, fontWeight: 600 }}>$ {job.salary}</span>
              </div>
            </div>

            {/* Bottom row: View Position button + match */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: "linear-gradient(90deg, #1E293B, #334155)" }}>
                <span className="text-white font-semibold" style={{ fontSize: "5.5px" }}>View Position</span>
                <span className="text-white/60" style={{ fontSize: "6px" }}>→</span>
              </div>
              <span className="text-slate-300" style={{ fontSize: "5px" }}>#{1128948 + i}</span>
            </div>
          </div>
        ))}

        {/* Empty state while scanning */}
        {visibleCards.length === 0 && !scanning && (
          <div className="flex items-center justify-center h-full">
            <span className="text-slate-400" style={{ fontSize: "7px" }}>Matching jobs to resume...</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes naviSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes naviScan {
          from { transform: translateX(-20%); }
          to { transform: translateX(80%); }
        }
      `}</style>
    </div>
  );
};

export default NaviCVViz;
