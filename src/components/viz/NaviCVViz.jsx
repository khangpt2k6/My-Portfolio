import { useState, useEffect, useRef, useCallback } from "react";

/**
 * NaviCVViz — Clean white UI matching real NaviCV app.
 * Two tabs: Explore Jobs (search + listings) ↔ Resume Analysis (upload + ATS).
 * Auto-animates through the flow in a loop.
 */

const JOBS = [
  { title: "Senior AI Python Developer", company: "Koombea", location: "Remote, LATAM", salary: "$60000-$110000", date: "7/17/2025", tags: ["Full Time", "5+ years"] },
  { title: "ML Engineer", company: "DeepTech AI", location: "San Francisco, CA", salary: "$120000-$180000", date: "7/15/2025", tags: ["Full Time", "3+ years"] },
  { title: "Full Stack Engineer", company: "CompassX Group", location: "New York, NY", salary: "$90000-$140000", date: "7/12/2025", tags: ["Full Time", "2+ years"] },
];

const SKILLS = [
  { label: "Keywords Match", score: 95 },
  { label: "Format & Structure", score: 88 },
  { label: "Experience Fit", score: 94 },
];

const NaviCVViz = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [visibleJobs, setVisibleJobs] = useState([]);
  const [atsScore, setAtsScore] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [visibleSkills, setVisibleSkills] = useState([]);
  const [analyzeStage, setAnalyzeStage] = useState("idle"); // idle | uploading | analyzing | done
  const mountedRef = useRef(true);
  const timeoutsRef = useRef([]);

  const addTimeout = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    let frame;

    const runLoop = () => {
      if (!mountedRef.current) return;

      // Reset to Jobs tab
      setActiveTab("jobs");
      setVisibleJobs([]);
      setAtsScore(0);
      setUploadProgress(0);
      setVisibleSkills([]);
      setAnalyzeStage("idle");

      // Show job cards one by one
      JOBS.forEach((_, i) => {
        addTimeout(() => {
          if (!mountedRef.current) return;
          setVisibleJobs((prev) => [...prev, JOBS[i]]);
        }, 600 + i * 600);
      });

      // Switch to Resume Analysis tab
      addTimeout(() => {
        if (!mountedRef.current) return;
        setActiveTab("resume");
        setAnalyzeStage("uploading");

        // Animate upload progress
        let prog = 0;
        const step = () => {
          if (!mountedRef.current) return;
          prog += 0.03;
          if (prog > 1) prog = 1;
          setUploadProgress(prog);
          if (prog < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      }, 3200);

      // Start analyzing
      addTimeout(() => {
        if (!mountedRef.current) return;
        setAnalyzeStage("analyzing");
        let score = 0;
        const animScore = () => {
          if (!mountedRef.current) return;
          score += 2;
          if (score > 92) score = 92;
          setAtsScore(score);
          if (score < 92) frame = requestAnimationFrame(animScore);
        };
        frame = requestAnimationFrame(animScore);

        SKILLS.forEach((_, i) => {
          addTimeout(() => {
            if (!mountedRef.current) return;
            setVisibleSkills((prev) => [...prev, SKILLS[i]]);
          }, 300 + i * 350);
        });
      }, 4800);

      // Mark done
      addTimeout(() => {
        if (!mountedRef.current) return;
        setAnalyzeStage("done");
      }, 6800);

      // Restart loop
      addTimeout(() => { if (mountedRef.current) runLoop(); }, 9000);
    };

    runLoop();
    return () => { mountedRef.current = false; clearAll(); if (frame) cancelAnimationFrame(frame); };
  }, [addTimeout, clearAll]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden select-none" style={{ background: "#FFFFFF", fontFamily: "inherit" }}>
      {/* ── Header ── */}
      <div className="flex items-center gap-1.5 px-3 py-2 shrink-0" style={{ borderBottom: "1px solid #E2E8F0" }}>
        <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#1E293B" }}>
          <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
            <path d="M15 1L7 9M15 1L10 15L7 9M15 1L1 6L7 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold" style={{ fontSize: "8px", color: "#1E293B" }}>NaviCV</span>
          <span style={{ fontSize: "5px", color: "#94A3B8" }}>AI-Powered Career Navigation</span>
        </div>
        <div className="ml-auto flex items-center gap-0.5 px-1.5 py-0.5 rounded-md cursor-pointer" style={{ border: "0.5px solid #E2E8F0" }}>
          <svg width="6" height="6" viewBox="0 0 12 12" fill="none">
            <path d="M1 6a5 5 0 019.33-2.5M11 6a5 5 0 01-9.33 2.5" stroke="#64748B" strokeWidth="1" strokeLinecap="round" />
            <path d="M10 1v2.5h-2.5M2 11V8.5h2.5" stroke="#64748B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: "5px", color: "#64748B" }}>Refresh Data</span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 px-3 py-1.5 shrink-0" style={{ borderBottom: "1px solid #F1F5F9" }}>
        <div
          className="flex items-center gap-0.5 px-2 py-1 rounded-md"
          style={{
            background: activeTab === "jobs" ? "#1E293B" : "transparent",
            color: activeTab === "jobs" ? "#FFFFFF" : "#64748B",
            fontSize: "6px",
            fontWeight: 600,
            transition: "all 0.3s",
          }}
        >
          <svg width="6" height="6" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" />
            <line x1="8" y1="8" x2="11" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Explore Jobs
        </div>
        <div
          className="flex items-center gap-0.5 px-2 py-1 rounded-md"
          style={{
            background: activeTab === "resume" ? "#1E293B" : "transparent",
            color: activeTab === "resume" ? "#FFFFFF" : "#64748B",
            fontSize: "6px",
            fontWeight: 600,
            transition: "all 0.3s",
          }}
        >
          <svg width="6" height="6" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Resume Analysis
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-hidden">
        {/* ── Jobs Tab ── */}
        {activeTab === "jobs" && (
          <div className="h-full flex flex-col" style={{ animation: "ncFadeIn 0.3s ease-out" }}>
            {/* Search section */}
            <div className="px-3 py-2 shrink-0" style={{ borderBottom: "1px solid #F1F5F9" }}>
              <div className="flex items-center gap-1 mb-1.5">
                <svg width="7" height="7" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="#1E293B" strokeWidth="1" fill="none" />
                  <path d="M6 3.5v5M3.5 6h5" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" />
                </svg>
                <span className="font-bold" style={{ fontSize: "7px", color: "#1E293B" }}>Discover Your Next Opportunity</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex-1 flex items-center gap-1 h-5 rounded-lg px-2" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <svg width="6" height="6" viewBox="0 0 12 12" fill="none">
                    <circle cx="5" cy="5" r="4" stroke="#94A3B8" strokeWidth="1.2" />
                    <line x1="8" y1="8" x2="11" y2="11" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: "5px", color: "#94A3B8" }}>Search for positions (e.g., Python Developer)</span>
                </div>
                <div className="flex items-center gap-0.5 h-5 px-2 rounded-lg shrink-0" style={{ background: "#1E293B" }}>
                  <svg width="5" height="5" viewBox="0 0 12 12" fill="none">
                    <circle cx="5" cy="5" r="4" stroke="white" strokeWidth="1.2" />
                    <line x1="8" y1="8" x2="11" y2="11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: "5px", color: "#FFFFFF", fontWeight: 600 }}>Search Jobs</span>
                </div>
              </div>
            </div>

            {/* Results header */}
            <div className="flex items-center justify-between px-3 py-1 shrink-0">
              <span className="font-bold" style={{ fontSize: "6px", color: "#1E293B" }}>{visibleJobs.length > 0 ? `${visibleJobs.length * 7} Positions Found` : ""}</span>
              <div className="flex items-center gap-0.5">
                <svg width="5" height="5" viewBox="0 0 12 12" fill="none">
                  <path d="M1 3h10M3 6h6M5 9h2" stroke="#64748B" strokeWidth="1" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: "5px", color: "#64748B" }}>Showing latest results</span>
              </div>
            </div>

            {/* Job cards */}
            <div className="flex-1 overflow-hidden px-3 py-1 space-y-1.5">
              {visibleJobs.map((job, i) => (
                <div key={job.title} className="rounded-xl px-2.5 py-2" style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  animation: "ncSlide 0.4s ease-out",
                }}>
                  <div className="flex items-start gap-1.5">
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#F1F5F9" }}>
                      <svg width="8" height="8" viewBox="0 0 14 14" fill="none">
                        <rect x="2" y="4" width="10" height="8" rx="1.5" stroke="#475569" strokeWidth="1" />
                        <path d="M5 4V3a2 2 0 014 0v1" stroke="#475569" strokeWidth="1" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold block truncate" style={{ fontSize: "7px", color: "#1E293B" }}>{job.title}</span>
                      <span style={{ fontSize: "5.5px", color: "#64748B" }}>{job.company}</span>
                    </div>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <div className="flex items-center gap-0.5">
                      <svg width="5" height="5" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="5" r="3" stroke="#94A3B8" strokeWidth="1" fill="none" />
                        <path d="M6 8v3" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                      <span style={{ fontSize: "5px", color: "#94A3B8" }}>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <svg width="5" height="5" viewBox="0 0 12 12" fill="none">
                        <text x="2" y="9" fill="#16A34A" fontSize="9" fontWeight="bold">$</text>
                      </svg>
                      <span style={{ fontSize: "5px", color: "#16A34A", fontWeight: 600 }}>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <svg width="5" height="5" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="5" stroke="#94A3B8" strokeWidth="1" fill="none" />
                        <path d="M6 3v3l2 1" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                      <span style={{ fontSize: "5px", color: "#94A3B8" }}>{job.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Resume Analysis Tab ── */}
        {activeTab === "resume" && (
          <div className="h-full flex flex-col px-3 py-2 gap-2" style={{ animation: "ncFadeIn 0.4s ease-out" }}>
            {/* Upload zone */}
            {(analyzeStage === "idle" || analyzeStage === "uploading") && (
              <div className="w-full rounded-xl px-3 py-3 flex flex-col items-center gap-1.5" style={{
                border: "1.5px dashed #CBD5E1",
                background: "#F8FAFC",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V8m0 0l-3 3m3-3l3 3" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 16.7428C21.2215 15.734 22 14.2195 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {uploadProgress === 0 ? (
                  <span style={{ fontSize: "6px", color: "#94A3B8" }}>Drop your resume here or click to upload</span>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 w-full px-2 py-1 rounded-lg" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", animation: "ncSlide 0.3s ease-out" }}>
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                        <path d="M4 1h5l4 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="#475569" strokeWidth="1" />
                        <path d="M9 1v4h4" stroke="#475569" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate" style={{ fontSize: "6px", color: "#1E293B" }}>resume_khang.pdf</span>
                        <span style={{ fontSize: "5px", color: "#94A3B8" }}>248 KB</span>
                      </div>
                      {uploadProgress >= 1 && (
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="5" fill="#DCFCE7" />
                          <path d="M3.5 6l2 2 3-3.5" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    {uploadProgress < 1 && (
                      <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
                        <div className="h-full rounded-full" style={{ width: `${uploadProgress * 100}%`, background: "#1E293B", transition: "width 0.1s" }} />
                      </div>
                    )}
                    {uploadProgress >= 1 && (
                      <span style={{ fontSize: "5.5px", color: "#64748B", animation: "ncPulse 1.5s ease-in-out infinite" }}>Analyzing resume...</span>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ATS Analysis */}
            {(analyzeStage === "analyzing" || analyzeStage === "done") && (
              <>
                {/* Score */}
                <div className="flex items-center gap-2 px-2 py-2 rounded-xl" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <div className="relative shrink-0">
                    <svg width="40" height="40">
                      <circle cx="20" cy="20" r="17" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                      <circle
                        cx="20" cy="20" r="17" fill="none"
                        stroke="#1E293B" strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={Math.PI * 2 * 17}
                        strokeDashoffset={Math.PI * 2 * 17 - (atsScore / 100) * Math.PI * 2 * 17}
                        style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 0.3s ease-out" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bold" style={{ fontSize: "11px", color: "#1E293B" }}>{atsScore}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold" style={{ fontSize: "7px", color: "#1E293B" }}>ATS Compatibility Score</span>
                    <span style={{ fontSize: "5px", color: atsScore >= 80 ? "#16A34A" : "#94A3B8", fontWeight: 600 }}>
                      {atsScore >= 80 ? "Excellent — Your resume is well optimized" : "Analyzing..."}
                    </span>
                  </div>
                </div>

                {/* Skill bars */}
                <div className="w-full space-y-1.5">
                  <span className="block font-bold" style={{ fontSize: "6px", color: "#1E293B" }}>Detailed Breakdown</span>
                  {visibleSkills.map((skill) => (
                    <div key={skill.label} style={{ animation: "ncSlide 0.35s ease-out" }}>
                      <div className="flex justify-between mb-0.5">
                        <span style={{ fontSize: "5.5px", color: "#475569" }}>{skill.label}</span>
                        <span style={{ fontSize: "5.5px", color: "#1E293B", fontWeight: 600 }}>{skill.score}%</span>
                      </div>
                      <div className="h-[3px] rounded-full w-full" style={{ background: "#E2E8F0" }}>
                        <div className="h-full rounded-full" style={{
                          width: `${skill.score}%`,
                          background: skill.score >= 90 ? "#1E293B" : "#64748B",
                          transition: "width 0.6s ease-out",
                        }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suggestions */}
                {analyzeStage === "done" && (
                  <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", animation: "ncSlide 0.4s ease-out" }}>
                    <svg width="7" height="7" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="5" fill="#DCFCE7" />
                      <path d="M3.5 6l2 2 3-3.5" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: "5.5px", color: "#16A34A", fontWeight: 600 }}>Resume is highly compatible with 20+ positions</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex items-center justify-around px-2 py-1.5 shrink-0" style={{ borderTop: "1px solid #E2E8F0" }}>
        {[
          { label: "Explore", icon: <><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" fill="none" /><line x1="14" y1="14" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>, active: activeTab === "jobs" },
          { label: "Analysis", icon: <><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M8 16V12M12 16V8M16 16V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>, active: activeTab === "resume" },
          { label: "Saved", icon: <><path d="M5 4a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V4z" stroke="currentColor" strokeWidth="2" fill="none" /></>, active: false },
        ].map((tab) => (
          <div key={tab.label} className="flex flex-col items-center gap-0.5">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" style={{ color: tab.active ? "#1E293B" : "#94A3B8" }}>
              {tab.icon}
            </svg>
            <span style={{ fontSize: "4.5px", color: tab.active ? "#1E293B" : "#94A3B8", fontWeight: tab.active ? 600 : 400 }}>{tab.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ncFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ncSlide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ncPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
};

export default NaviCVViz;
