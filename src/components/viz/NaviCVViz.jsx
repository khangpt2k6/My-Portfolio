import { useState, useEffect, useRef, useCallback } from "react";

/**
 * NaviCVViz — Premium AI career navigator with dark navy theme,
 * animated scan lines, shimmer card loads, glowing ATS gauge,
 * and animated skill analysis bars.
 */

const JOBS = [
  { title: "Senior AI Python Developer", company: "Koombea", location: "Remote, LATAM", salary: "$60K–$110K", match: 95, tags: ["Full Time", "5+ yrs"] },
  { title: "ML Engineer", company: "DeepTech AI", location: "San Francisco, CA", salary: "$120K–$180K", match: 88, tags: ["Full Time", "3+ yrs"] },
  { title: "Full Stack Engineer", company: "CompassX Group", location: "New York, NY", salary: "$90K–$140K", match: 82, tags: ["Full Time", "2+ yrs"] },
];

const SKILLS = [
  { label: "Keywords Match", score: 95, color: "#10B981" },
  { label: "Format & Structure", score: 88, color: "#3B82F6" },
  { label: "Experience Fit", score: 94, color: "#8B5CF6" },
];

const NaviCVViz = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [visibleJobs, setVisibleJobs] = useState([]);
  const [atsScore, setAtsScore] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [visibleSkills, setVisibleSkills] = useState([]);
  const [analyzeStage, setAnalyzeStage] = useState("idle");
  const [scanY, setScanY] = useState(-1);
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
      setActiveTab("jobs");
      setVisibleJobs([]);
      setAtsScore(0);
      setUploadProgress(0);
      setVisibleSkills([]);
      setAnalyzeStage("idle");
      setScanY(0);

      // Animate scan line across job area
      let sy = 0;
      const scanStep = () => {
        if (!mountedRef.current) return;
        sy += 1.5;
        if (sy > 100) { setScanY(-1); return; }
        setScanY(sy);
        frame = requestAnimationFrame(scanStep);
      };
      frame = requestAnimationFrame(scanStep);

      // Show job cards one by one
      JOBS.forEach((_, i) => {
        addTimeout(() => {
          if (!mountedRef.current) return;
          setVisibleJobs((prev) => [...prev, JOBS[i]]);
        }, 800 + i * 700);
      });

      // Switch to Resume Analysis tab
      addTimeout(() => {
        if (!mountedRef.current) return;
        setActiveTab("resume");
        setAnalyzeStage("uploading");
        let prog = 0;
        const step = () => {
          if (!mountedRef.current) return;
          prog += 0.025;
          if (prog > 1) prog = 1;
          setUploadProgress(prog);
          if (prog < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      }, 3500);

      // Start analyzing
      addTimeout(() => {
        if (!mountedRef.current) return;
        setAnalyzeStage("analyzing");
        let score = 0;
        const animScore = () => {
          if (!mountedRef.current) return;
          score += 1.5;
          if (score > 92) score = 92;
          setAtsScore(Math.round(score));
          if (score < 92) frame = requestAnimationFrame(animScore);
        };
        frame = requestAnimationFrame(animScore);

        SKILLS.forEach((_, i) => {
          addTimeout(() => {
            if (!mountedRef.current) return;
            setVisibleSkills((prev) => [...prev, SKILLS[i]]);
          }, 300 + i * 400);
        });
      }, 5200);

      // Done
      addTimeout(() => { if (mountedRef.current) setAnalyzeStage("done"); }, 7200);
      // Restart
      addTimeout(() => { if (mountedRef.current) runLoop(); }, 9500);
    };

    runLoop();
    return () => { mountedRef.current = false; clearAll(); if (frame) cancelAnimationFrame(frame); };
  }, [addTimeout, clearAll]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden select-none" style={{
      background: "linear-gradient(170deg, #0B1120 0%, #111827 50%, #0B1120 100%)",
      fontFamily: "inherit",
      position: "relative",
    }}>
      {/* ── Background mesh ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", width: "120px", height: "120px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
          top: "-20px", left: "-20px", animation: "ncOrb1 10s ease-in-out infinite",
          filter: "blur(16px)",
        }} />
        <div style={{
          position: "absolute", width: "100px", height: "100px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          bottom: "-10px", right: "-20px", animation: "ncOrb2 12s ease-in-out infinite",
          filter: "blur(12px)",
        }} />
        {/* Dot grid pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }} />
      </div>

      {/* ── Header ── */}
      <div className="flex items-center gap-1.5 px-3 py-2 shrink-0 relative z-10" style={{
        borderBottom: "1px solid rgba(59,130,246,0.08)",
        background: "rgba(59,130,246,0.02)",
        backdropFilter: "blur(12px)",
      }}>
        <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{
          background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
          boxShadow: "0 0 12px rgba(59,130,246,0.4)",
        }}>
          <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
            <path d="M15 1L7 9M15 1L10 15L7 9M15 1L1 6L7 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold" style={{ fontSize: "8px", color: "#E0EAFF" }}>NaviCV</span>
          <span style={{ fontSize: "5px", color: "rgba(59,130,246,0.45)" }}>AI-Powered Career Navigation</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{
            background: "rgba(59,130,246,0.08)",
            border: "0.5px solid rgba(59,130,246,0.12)",
          }}>
            <div className="relative">
              <div className="w-[4px] h-[4px] rounded-full" style={{ background: "#3B82F6", boxShadow: "0 0 6px rgba(59,130,246,0.8)" }} />
              <div className="absolute inset-0 w-[4px] h-[4px] rounded-full" style={{ background: "#3B82F6", animation: "ncPing 2s ease-out infinite" }} />
            </div>
            <span style={{ fontSize: "5px", color: "#60A5FA", fontWeight: 600 }}>AI Active</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 px-3 py-1.5 shrink-0 relative z-10" style={{
        borderBottom: "1px solid rgba(59,130,246,0.06)",
      }}>
        {[
          { id: "jobs", label: "Explore Jobs", icon: <><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" /><line x1="8" y1="8" x2="11" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></> },
          { id: "resume", label: "Resume Analysis", icon: <><path d="M6 2v8M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></> },
        ].map(tab => (
          <div key={tab.id} className="flex items-center gap-0.5 px-2 py-1 rounded-md" style={{
            background: activeTab === tab.id ? "rgba(59,130,246,0.12)" : "transparent",
            border: activeTab === tab.id ? "0.5px solid rgba(59,130,246,0.2)" : "0.5px solid transparent",
            color: activeTab === tab.id ? "#60A5FA" : "rgba(148,163,184,0.5)",
            fontSize: "6px", fontWeight: 600,
            boxShadow: activeTab === tab.id ? "0 0 8px rgba(59,130,246,0.1)" : "none",
            transition: "all 0.3s",
          }}>
            <svg width="6" height="6" viewBox="0 0 12 12" fill="none">{tab.icon}</svg>
            {tab.label}
          </div>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-hidden relative z-10">
        {/* ── Jobs Tab ── */}
        {activeTab === "jobs" && (
          <div className="h-full flex flex-col" style={{ animation: "ncFadeIn 0.3s ease-out" }}>
            {/* Scan line */}
            {scanY >= 0 && scanY <= 100 && (
              <div style={{
                position: "absolute", left: 0, right: 0,
                top: `${scanY}%`, height: "2px", zIndex: 20,
                background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)",
                boxShadow: "0 0 12px rgba(59,130,246,0.3)",
                pointerEvents: "none",
              }} />
            )}

            {/* Search section */}
            <div className="px-3 py-2 shrink-0" style={{ borderBottom: "1px solid rgba(59,130,246,0.06)" }}>
              <div className="flex items-center gap-1 mb-1.5">
                <svg width="7" height="7" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="#3B82F6" strokeWidth="1" fill="none" opacity="0.4" />
                  <path d="M6 3.5v5M3.5 6h5" stroke="#3B82F6" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                </svg>
                <span className="font-bold" style={{ fontSize: "7px", color: "#E0EAFF" }}>Discover Your Next Opportunity</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex-1 flex items-center gap-1 h-5 rounded-lg px-2" style={{
                  background: "rgba(59,130,246,0.04)",
                  border: "1px solid rgba(59,130,246,0.08)",
                }}>
                  <svg width="6" height="6" viewBox="0 0 12 12" fill="none">
                    <circle cx="5" cy="5" r="4" stroke="rgba(148,163,184,0.4)" strokeWidth="1.2" />
                    <line x1="8" y1="8" x2="11" y2="11" stroke="rgba(148,163,184,0.4)" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: "5px", color: "rgba(148,163,184,0.3)" }}>Search for positions...</span>
                </div>
                <div className="flex items-center gap-0.5 h-5 px-2 rounded-lg shrink-0" style={{
                  background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                  boxShadow: "0 0 10px rgba(59,130,246,0.3)",
                }}>
                  <svg width="5" height="5" viewBox="0 0 12 12" fill="none">
                    <circle cx="5" cy="5" r="4" stroke="white" strokeWidth="1.2" />
                    <line x1="8" y1="8" x2="11" y2="11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: "5px", color: "#FFFFFF", fontWeight: 600 }}>Search</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex items-center justify-between px-3 py-1 shrink-0">
              <span className="font-bold" style={{ fontSize: "6px", color: "#94A3B8" }}>
                {visibleJobs.length > 0 ? `${visibleJobs.length * 7} Matches Found` : ""}
              </span>
            </div>

            {/* Job cards */}
            <div className="flex-1 overflow-hidden px-3 py-1 space-y-1.5">
              {visibleJobs.map((job) => (
                <div key={job.title} className="rounded-xl px-2.5 py-2 relative overflow-hidden" style={{
                  background: "rgba(59,130,246,0.04)",
                  border: "1px solid rgba(59,130,246,0.08)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  animation: "ncSlide 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                }}>
                  {/* Shimmer overlay on load */}
                  <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.06), transparent)",
                    animation: "ncShimmer 2s ease-out",
                  }} />
                  <div className="flex items-start gap-1.5 relative z-10">
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{
                      background: "rgba(59,130,246,0.08)",
                      border: "0.5px solid rgba(59,130,246,0.12)",
                    }}>
                      <svg width="8" height="8" viewBox="0 0 14 14" fill="none">
                        <rect x="2" y="4" width="10" height="8" rx="1.5" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
                        <path d="M5 4V3a2 2 0 014 0v1" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold block truncate" style={{ fontSize: "7px", color: "#E0EAFF" }}>{job.title}</span>
                      <span style={{ fontSize: "5.5px", color: "rgba(148,163,184,0.6)" }}>{job.company}</span>
                    </div>
                    {/* Match badge */}
                    <div className="px-1.5 py-0.5 rounded-full shrink-0" style={{
                      background: job.match >= 90 ? "rgba(16,185,129,0.12)" : "rgba(59,130,246,0.1)",
                      border: `0.5px solid ${job.match >= 90 ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.15)"}`,
                    }}>
                      <span style={{ fontSize: "5px", fontWeight: 700, color: job.match >= 90 ? "#10B981" : "#60A5FA" }}>{job.match}%</span>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-2 relative z-10">
                    <div className="flex items-center gap-0.5">
                      <svg width="5" height="5" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="5" r="3" stroke="rgba(148,163,184,0.3)" strokeWidth="1" fill="none" /><path d="M6 8v3" stroke="rgba(148,163,184,0.3)" strokeWidth="1" strokeLinecap="round" /></svg>
                      <span style={{ fontSize: "5px", color: "rgba(148,163,184,0.4)" }}>{job.location}</span>
                    </div>
                    <span style={{ fontSize: "5px", color: "#10B981", fontWeight: 600 }}>{job.salary}</span>
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
              <div className="w-full rounded-xl px-3 py-3 flex flex-col items-center gap-1.5 relative overflow-hidden" style={{
                border: "1.5px dashed rgba(59,130,246,0.2)",
                background: "rgba(59,130,246,0.03)",
              }}>
                {/* Rotating dashed border effect */}
                <div style={{
                  position: "absolute", inset: "-2px", borderRadius: "inherit",
                  border: "1.5px dashed rgba(59,130,246,0.15)",
                  animation: analyzeStage === "uploading" ? "ncRotate 4s linear infinite" : "none",
                  pointerEvents: "none",
                }} />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V8m0 0l-3 3m3-3l3 3" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                  <path d="M20 16.7428C21.2215 15.734 22 14.2195 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                </svg>
                {uploadProgress === 0 ? (
                  <span style={{ fontSize: "6px", color: "rgba(148,163,184,0.4)" }}>Drop your resume here or click to upload</span>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 w-full px-2 py-1 rounded-lg" style={{
                      background: "rgba(59,130,246,0.04)",
                      border: "1px solid rgba(59,130,246,0.1)",
                      animation: "ncSlide 0.3s ease-out",
                    }}>
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                        <path d="M4 1h5l4 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
                        <path d="M9 1v4h4" stroke="#60A5FA" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                      </svg>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate" style={{ fontSize: "6px", color: "#E0EAFF" }}>resume_khang.pdf</span>
                        <span style={{ fontSize: "5px", color: "rgba(148,163,184,0.4)" }}>248 KB</span>
                      </div>
                      {uploadProgress >= 1 && (
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="5" fill="rgba(16,185,129,0.15)" />
                          <path d="M3.5 6l2 2 3-3.5" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    {uploadProgress < 1 && (
                      <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(59,130,246,0.08)" }}>
                        <div className="h-full rounded-full" style={{
                          width: `${uploadProgress * 100}%`,
                          background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
                          boxShadow: "0 0 8px rgba(59,130,246,0.4)",
                          transition: "width 0.1s",
                        }} />
                      </div>
                    )}
                    {uploadProgress >= 1 && (
                      <div className="flex items-center gap-1">
                        <div className="flex gap-[2px]">
                          {[0,1,2].map(d => (
                            <div key={d} className="w-[3px] h-[3px] rounded-full" style={{
                              background: "#3B82F6",
                              animation: `ncDot 1.2s ease-in-out ${d * 0.15}s infinite`,
                            }} />
                          ))}
                        </div>
                        <span style={{ fontSize: "5.5px", color: "#60A5FA" }}>AI analyzing resume...</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ATS Analysis */}
            {(analyzeStage === "analyzing" || analyzeStage === "done") && (
              <>
                {/* Score */}
                <div className="flex items-center gap-2 px-2 py-2 rounded-xl" style={{
                  background: "rgba(59,130,246,0.04)",
                  border: "1px solid rgba(59,130,246,0.08)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                  animation: "ncSlide 0.4s ease-out",
                }}>
                  <div className="relative shrink-0">
                    <svg width="40" height="40">
                      <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="3" />
                      <circle
                        cx="20" cy="20" r="17" fill="none"
                        stroke="url(#ncScoreGrad)" strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={Math.PI * 2 * 17}
                        strokeDashoffset={Math.PI * 2 * 17 - (atsScore / 100) * Math.PI * 2 * 17}
                        style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 0.3s ease-out", filter: "drop-shadow(0 0 4px rgba(59,130,246,0.4))" }}
                      />
                      <defs>
                        <linearGradient id="ncScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bold" style={{ fontSize: "11px", color: "#E0EAFF" }}>{atsScore}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold" style={{ fontSize: "7px", color: "#E0EAFF" }}>ATS Compatibility Score</span>
                    <span style={{ fontSize: "5px", fontWeight: 600, color: atsScore >= 80 ? "#10B981" : "rgba(148,163,184,0.5)" }}>
                      {atsScore >= 80 ? "Excellent — Well optimized" : "Analyzing..."}
                    </span>
                  </div>
                </div>

                {/* Skill bars */}
                <div className="w-full space-y-1.5">
                  <span className="block font-bold" style={{ fontSize: "6px", color: "#94A3B8" }}>Detailed Breakdown</span>
                  {visibleSkills.map((skill) => (
                    <div key={skill.label} style={{ animation: "ncSlide 0.4s ease-out" }}>
                      <div className="flex justify-between mb-0.5">
                        <span style={{ fontSize: "5.5px", color: "rgba(148,163,184,0.6)" }}>{skill.label}</span>
                        <span style={{ fontSize: "5.5px", color: skill.color, fontWeight: 600 }}>{skill.score}%</span>
                      </div>
                      <div className="h-[3px] rounded-full w-full relative overflow-hidden" style={{ background: "rgba(59,130,246,0.06)" }}>
                        <div className="h-full rounded-full relative" style={{
                          width: `${skill.score}%`,
                          background: `linear-gradient(90deg, ${skill.color}, ${skill.color}CC)`,
                          boxShadow: `0 0 6px ${skill.color}40`,
                          transition: "width 0.6s ease-out",
                        }}>
                          {/* Glow tip */}
                          <div style={{
                            position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
                            width: "4px", height: "4px", borderRadius: "50%",
                            background: skill.color,
                            boxShadow: `0 0 6px ${skill.color}80`,
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Success message */}
                {analyzeStage === "done" && (
                  <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg" style={{
                    background: "rgba(16,185,129,0.06)",
                    border: "1px solid rgba(16,185,129,0.15)",
                    boxShadow: "0 0 12px rgba(16,185,129,0.08)",
                    animation: "ncSlide 0.4s ease-out",
                  }}>
                    <svg width="7" height="7" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="5" fill="rgba(16,185,129,0.15)" />
                      <path d="M3.5 6l2 2 3-3.5" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: "5.5px", color: "#10B981", fontWeight: 600 }}>Resume compatible with 20+ positions</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex items-center justify-around px-2 py-1.5 shrink-0 relative z-10" style={{
        borderTop: "1px solid rgba(59,130,246,0.06)",
        background: "rgba(59,130,246,0.02)",
        backdropFilter: "blur(12px)",
      }}>
        {[
          { label: "Explore", icon: <><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" fill="none" /><line x1="14" y1="14" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>, active: activeTab === "jobs" },
          { label: "Analysis", icon: <><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M8 16V12M12 16V8M16 16V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>, active: activeTab === "resume" },
          { label: "Saved", icon: <><path d="M5 4a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V4z" stroke="currentColor" strokeWidth="2" fill="none" /></>, active: false },
        ].map((tab) => (
          <div key={tab.label} className="flex flex-col items-center gap-0.5 relative">
            {tab.active && (
              <div style={{
                position: "absolute", top: "-6px", width: "16px", height: "2px",
                borderRadius: "1px", background: "#3B82F6",
                boxShadow: "0 0 8px rgba(59,130,246,0.5)",
              }} />
            )}
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" style={{
              color: tab.active ? "#60A5FA" : "rgba(148,163,184,0.2)",
              filter: tab.active ? "drop-shadow(0 0 4px rgba(59,130,246,0.3))" : "none",
            }}>
              {tab.icon}
            </svg>
            <span style={{ fontSize: "4.5px", color: tab.active ? "#60A5FA" : "rgba(148,163,184,0.2)", fontWeight: tab.active ? 600 : 400 }}>{tab.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ncFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ncSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ncPing { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(4); opacity: 0; } }
        @keyframes ncShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        @keyframes ncRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ncDot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.3; } 30% { transform: translateY(-3px); opacity: 1; } }
        @keyframes ncOrb1 { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(10px,-10px) scale(1.15); } 66% { transform: translate(-6px,8px) scale(0.9); } }
        @keyframes ncOrb2 { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(-10px,10px) scale(1.1); } 66% { transform: translate(8px,-6px) scale(1.05); } }
      `}</style>
    </div>
  );
};

export default NaviCVViz;
