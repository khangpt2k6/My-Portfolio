import { useState, useEffect, useRef, useCallback } from "react";

/**
 * VaultXViz — Ultra-premium dark fintech dashboard with glowing chart,
 * animated gradient mesh, glassmorphism, animated number counters,
 * and dramatic transaction stream.
 */

const TRANSACTIONS = [
  { type: "credit", desc: "Deposit", amount: "+$2,500.00", icon: "↑" },
  { type: "debit", desc: "Transfer to Savings", amount: "-$800.00", icon: "↓" },
  { type: "credit", desc: "Dividend - AAPL", amount: "+$142.50", icon: "★" },
  { type: "debit", desc: "Wire Transfer", amount: "-$1,200.00", icon: "↓" },
];

const CHART_POINTS = [40, 38, 42, 45, 43, 48, 52, 49, 55, 58, 54, 60, 63, 58, 62, 67, 65, 70, 68, 74, 72, 78, 75, 80];

const VaultXViz = () => {
  const canvasRef = useRef(null);
  const [visibleTxns, setVisibleTxns] = useState([]);
  const [balance, setBalance] = useState(24850);
  const [chartProgress, setChartProgress] = useState(0);
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
      setChartProgress(0);
      setVisibleTxns([]);
      setBalance(24850);
      let progress = 0;
      const step = () => {
        if (!mountedRef.current) return;
        progress += 0.015;
        if (progress > 1) progress = 1;
        setChartProgress(progress);
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
      let txIdx = 0;
      const showNext = () => {
        if (!mountedRef.current || txIdx >= TRANSACTIONS.length) {
          addTimeout(() => { if (mountedRef.current) runLoop(); }, 3000);
          return;
        }
        const t = txIdx;
        setVisibleTxns((prev) => [...prev, TRANSACTIONS[t]]);
        setBalance((prev) => prev + (TRANSACTIONS[t].type === "credit" ? 250 : -180));
        txIdx++;
        addTimeout(showNext, 900);
      };
      addTimeout(showNext, 1500);
    };
    runLoop();
    return () => { mountedRef.current = false; clearAll(); if (frame) cancelAnimationFrame(frame); };
  }, [addTimeout, clearAll]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = 2;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;
    ctx.clearRect(0, 0, W, H);

    const points = CHART_POINTS;
    const maxVal = Math.max(...points);
    const minVal = Math.min(...points);
    const range = maxVal - minVal || 1;
    const padX = 4, padY = 6;
    const drawW = W - padX * 2, drawH = H - padY * 2;
    const visibleCount = Math.floor(chartProgress * points.length);
    if (visibleCount < 2) return;

    const getX = (i) => padX + (i / (points.length - 1)) * drawW;
    const getY = (v) => padY + drawH - ((v - minVal) / range) * drawH;

    // Gradient fill under the line
    const grad = ctx.createLinearGradient(0, padY, 0, H);
    grad.addColorStop(0, "rgba(56,189,248,0.25)");
    grad.addColorStop(0.3, "rgba(59,130,246,0.12)");
    grad.addColorStop(0.7, "rgba(59,130,246,0.03)");
    grad.addColorStop(1, "rgba(59,130,246,0)");

    ctx.beginPath();
    ctx.moveTo(getX(0), H);
    for (let i = 0; i < visibleCount; i++) ctx.lineTo(getX(i), getY(points[i]));
    ctx.lineTo(getX(visibleCount - 1), H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Glow line
    const lineGrad = ctx.createLinearGradient(getX(0), 0, getX(visibleCount - 1), 0);
    lineGrad.addColorStop(0, "#3B82F6");
    lineGrad.addColorStop(0.5, "#38BDF8");
    lineGrad.addColorStop(1, "#06B6D4");

    // Draw glow (thicker, transparent behind)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(points[0]));
    for (let i = 1; i < visibleCount; i++) ctx.lineTo(getX(i), getY(points[i]));
    ctx.strokeStyle = "rgba(56,189,248,0.15)";
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();

    // Main line
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(points[0]));
    for (let i = 1; i < visibleCount; i++) ctx.lineTo(getX(i), getY(points[i]));
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1.8;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    // Pulse tip
    if (visibleCount > 0) {
      const lastI = visibleCount - 1;
      const cx = getX(lastI), cy = getY(points[lastI]);

      // Outer glow
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56,189,248,0.1)";
      ctx.fill();

      // Mid ring
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56,189,248,0.15)";
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#38BDF8";
      ctx.fill();
    }

    // Grid lines
    for (let i = 0; i < 4; i++) {
      const y = padY + (drawH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(W - padX, y);
      ctx.strokeStyle = "rgba(56,189,248,0.03)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }, [chartProgress]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden select-none" style={{
      background: "linear-gradient(170deg, #040810 0%, #0A1428 50%, #060E1E 100%)",
      fontFamily: "inherit",
      position: "relative",
    }}>
      {/* ── Animated gradient mesh ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", width: "160px", height: "160px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)",
          top: "-40px", right: "-30px", animation: "vxMesh1 10s ease-in-out infinite",
          filter: "blur(24px)",
        }} />
        <div style={{
          position: "absolute", width: "120px", height: "120px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
          bottom: "-20px", left: "-20px", animation: "vxMesh2 12s ease-in-out infinite",
          filter: "blur(16px)",
        }} />
        {/* Subtle dot grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.02,
          backgroundImage: "radial-gradient(circle, #38BDF8 0.5px, transparent 0.5px)",
          backgroundSize: "14px 14px",
        }} />
      </div>

      {/* ── Header — glass ── */}
      <div className="flex items-center gap-1.5 px-3 py-2 shrink-0 relative z-10" style={{
        background: "rgba(56,189,248,0.02)",
        borderBottom: "1px solid rgba(56,189,248,0.06)",
        backdropFilter: "blur(12px)",
      }}>
        <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          boxShadow: "0 0 12px rgba(56,189,248,0.4)",
        }}>
          <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="6" width="3" height="8" rx="0.5" fill="white" opacity="0.9" />
            <rect x="6.5" y="3" width="3" height="11" rx="0.5" fill="white" opacity="0.9" />
            <rect x="11" y="1" width="3" height="13" rx="0.5" fill="white" opacity="0.9" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold" style={{ fontSize: "8px", color: "#E0F2FE" }}>VaultX</span>
          <span style={{ fontSize: "5px", color: "rgba(56,189,248,0.35)" }}>Portfolio Manager</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          {/* Metrics chips */}
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md" style={{
            background: "rgba(16,185,129,0.06)",
            border: "0.5px solid rgba(16,185,129,0.12)",
          }}>
            <svg width="5" height="5" viewBox="0 0 10 10" fill="none"><path d="M5 2L8 6H2L5 2Z" fill="#10B981" /></svg>
            <span style={{ fontSize: "5px", color: "#10B981", fontWeight: 600 }}>+3.24%</span>
          </div>
          {/* Live */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{
            background: "rgba(56,189,248,0.06)",
            border: "0.5px solid rgba(56,189,248,0.1)",
          }}>
            <div className="relative">
              <div className="w-[4px] h-[4px] rounded-full" style={{ background: "#38BDF8", boxShadow: "0 0 6px rgba(56,189,248,0.8)" }} />
              <div className="absolute inset-0 w-[4px] h-[4px] rounded-full" style={{ background: "#38BDF8", animation: "vxPing 2s ease-out infinite" }} />
            </div>
            <span style={{ fontSize: "5px", color: "#38BDF8", fontWeight: 600 }}>Live</span>
          </div>
        </div>
      </div>

      {/* ── Balance ── */}
      <div className="px-3 py-2 shrink-0 relative z-10">
        <span className="block" style={{ fontSize: "5.5px", color: "rgba(148,197,248,0.4)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Balance</span>
        <div className="flex items-baseline gap-1">
          <span className="font-bold" style={{ fontSize: "14px", color: "#F0F9FF", letterSpacing: "-0.3px" }}>
            ${balance.toLocaleString()}
            <span style={{ fontSize: "8px", color: "rgba(148,197,248,0.3)" }}>.00</span>
          </span>
        </div>
        {/* Mini metrics row */}
        <div className="flex items-center gap-2 mt-1">
          {[
            { label: "Positions", value: "12", color: "#38BDF8" },
            { label: "P&L Today", value: "+$847", color: "#10B981" },
            { label: "Volume", value: "$4.2K", color: "#8B5CF6" },
          ].map(m => (
            <div key={m.label} className="flex items-center gap-0.5">
              <div className="w-[3px] h-[3px] rounded-full" style={{ background: m.color, boxShadow: `0 0 4px ${m.color}40` }} />
              <span style={{ fontSize: "4.5px", color: "rgba(148,197,248,0.3)" }}>{m.label}</span>
              <span style={{ fontSize: "4.5px", color: m.color, fontWeight: 600 }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="px-2 shrink-0 relative z-10" style={{ height: "60px" }}>
        <div className="w-full h-full rounded-xl overflow-hidden relative" style={{
          background: "rgba(56,189,248,0.015)",
          border: "0.5px solid rgba(56,189,248,0.06)",
          boxShadow: "inset 0 0 20px rgba(56,189,248,0.02)",
        }}>
          <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
          {/* Animated scan line on chart */}
          <div style={{
            position: "absolute", top: 0, bottom: 0, width: "1px",
            left: `${chartProgress * 100}%`,
            background: "rgba(56,189,248,0.15)",
            boxShadow: "0 0 8px rgba(56,189,248,0.2)",
            pointerEvents: "none",
            transition: "left 0.1s",
          }} />
        </div>
      </div>

      {/* ── Transactions header ── */}
      <div className="px-2 pt-2 pb-1 shrink-0 relative z-10">
        <div className="flex items-center justify-between">
          <span className="block" style={{ fontSize: "5.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(148,197,248,0.3)" }}>Recent Activity</span>
          <span style={{ fontSize: "4.5px", color: "rgba(56,189,248,0.3)" }}>{visibleTxns.length} transactions</span>
        </div>
      </div>

      {/* ── Transaction stream ── */}
      <div className="flex-1 overflow-hidden px-2 space-y-1 relative z-10">
        {visibleTxns.map((txn, i) => {
          const isCredit = txn.type === "credit";
          return (
            <div key={`${txn.desc}-${i}`} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg relative overflow-hidden" style={{
              background: "rgba(56,189,248,0.02)",
              border: "0.5px solid rgba(56,189,248,0.06)",
              animation: "vxSlide 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            }}>
              {/* Entry shimmer */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.04), transparent)",
                animation: "vxShimmer 2s ease-out",
              }} />
              <div className="w-4 h-4 rounded-md flex items-center justify-center shrink-0 relative z-10" style={{
                background: isCredit ? "rgba(16,185,129,0.08)" : "rgba(248,113,113,0.08)",
                border: `0.5px solid ${isCredit ? "rgba(16,185,129,0.15)" : "rgba(248,113,113,0.15)"}`,
              }}>
                <svg width="6" height="6" viewBox="0 0 10 10" fill="none">
                  {isCredit
                    ? <path d="M5 8V2M2 5l3-3 3 3" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
                    : <path d="M5 2v6M2 5l3 3 3-3" stroke="#F87171" strokeWidth="1.2" strokeLinecap="round" />
                  }
                </svg>
              </div>
              <span className="flex-1 truncate relative z-10" style={{ fontSize: "6.5px", color: "#BAE6FD" }}>{txn.desc}</span>
              <span className="font-semibold shrink-0 relative z-10" style={{
                fontSize: "6.5px",
                color: isCredit ? "#10B981" : "#F87171",
                textShadow: isCredit ? "0 0 8px rgba(16,185,129,0.3)" : "0 0 8px rgba(248,113,113,0.3)",
              }}>{txn.amount}</span>
            </div>
          );
        })}
      </div>

      {/* ── Bottom nav — glass ── */}
      <div className="flex items-center justify-around px-2 py-1.5 shrink-0 relative z-10" style={{
        borderTop: "1px solid rgba(56,189,248,0.06)",
        background: "rgba(56,189,248,0.01)",
        backdropFilter: "blur(12px)",
      }}>
        {[
          { label: "Dashboard", active: true, icon: <><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" /><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" /><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" /><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" /></> },
          { label: "Accounts", active: false, icon: <><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" /><circle cx="7" cy="15" r="1.5" fill="currentColor" /></> },
          { label: "Trading", active: false, icon: <><path d="M3 17l4-4 4 2 4-6 4 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M15 6h5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></> },
          { label: "Settings", active: false, icon: <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></> },
        ].map((tab) => (
          <div key={tab.label} className="flex flex-col items-center gap-0.5 relative">
            {tab.active && (
              <div style={{
                position: "absolute", top: "-6px", width: "16px", height: "2px",
                borderRadius: "1px", background: "#38BDF8",
                boxShadow: "0 0 8px rgba(56,189,248,0.5)",
              }} />
            )}
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" style={{
              color: tab.active ? "#38BDF8" : "rgba(148,197,248,0.15)",
              filter: tab.active ? "drop-shadow(0 0 4px rgba(56,189,248,0.3))" : "none",
            }}>
              {tab.icon}
            </svg>
            <span style={{
              fontSize: "4px",
              color: tab.active ? "#38BDF8" : "rgba(148,197,248,0.15)",
              fontWeight: tab.active ? 600 : 400,
            }}>{tab.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes vxSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes vxPing { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(4); opacity: 0; } }
        @keyframes vxShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        @keyframes vxMesh1 { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(12px,-15px) scale(1.2); } 66% { transform: translate(-8px,10px) scale(0.9); } }
        @keyframes vxMesh2 { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(-10px,12px) scale(1.1); } 66% { transform: translate(10px,-8px) scale(1.15); } }
      `}</style>
    </div>
  );
};

export default VaultXViz;
