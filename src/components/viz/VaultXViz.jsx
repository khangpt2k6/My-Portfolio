import { useState, useEffect, useRef, useCallback } from "react";

/**
 * VaultXViz — Modern blue gradient fintech dashboard.
 * Clean, professional, futuristic. Deep navy + electric blue + cyan.
 */

const TRANSACTIONS = [
  { type: "credit", desc: "Deposit", amount: "+$2,500.00" },
  { type: "debit", desc: "Transfer to Savings", amount: "-$800.00" },
  { type: "credit", desc: "Dividend - AAPL", amount: "+$142.50" },
  { type: "debit", desc: "Wire Transfer", amount: "-$1,200.00" },
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
        progress += 0.02;
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
      addTimeout(showNext, 1200);
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

    // Gradient fill
    const grad = ctx.createLinearGradient(0, padY, 0, H);
    grad.addColorStop(0, "rgba(56,189,248,0.2)");
    grad.addColorStop(0.5, "rgba(59,130,246,0.08)");
    grad.addColorStop(1, "rgba(59,130,246,0)");

    ctx.beginPath();
    ctx.moveTo(getX(0), H);
    for (let i = 0; i < visibleCount; i++) ctx.lineTo(getX(i), getY(points[i]));
    ctx.lineTo(getX(visibleCount - 1), H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line with gradient stroke
    const lineGrad = ctx.createLinearGradient(getX(0), 0, getX(visibleCount - 1), 0);
    lineGrad.addColorStop(0, "#3B82F6");
    lineGrad.addColorStop(0.6, "#38BDF8");
    lineGrad.addColorStop(1, "#06B6D4");

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(points[0]));
    for (let i = 1; i < visibleCount; i++) ctx.lineTo(getX(i), getY(points[i]));
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    // Tip glow
    if (visibleCount > 0) {
      const lastI = visibleCount - 1;
      const cx = getX(lastI), cy = getY(points[lastI]);
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56,189,248,0.2)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#38BDF8";
      ctx.fill();
    }
  }, [chartProgress]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden select-none" style={{ background: "linear-gradient(180deg, #0A0F1E 0%, #0D1526 100%)", fontFamily: "inherit" }}>
      {/* Header — glass-like */}
      <div className="flex items-center gap-1.5 px-3 py-2 shrink-0" style={{ background: "rgba(59,130,246,0.03)", borderBottom: "1px solid rgba(56,189,248,0.08)" }}>
        <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)" }}>
          <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="6" width="3" height="8" rx="0.5" fill="white" opacity="0.9" />
            <rect x="6.5" y="3" width="3" height="11" rx="0.5" fill="white" opacity="0.9" />
            <rect x="11" y="1" width="3" height="13" rx="0.5" fill="white" opacity="0.9" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold" style={{ fontSize: "8px", color: "#E0F2FE" }}>VaultX</span>
          <span style={{ fontSize: "5px", color: "rgba(56,189,248,0.4)" }}>Portfolio Manager</span>
        </div>
        <div className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded-md" style={{ background: "rgba(56,189,248,0.06)", border: "0.5px solid rgba(56,189,248,0.12)" }}>
          <div className="w-[4px] h-[4px] rounded-full" style={{ background: "#38BDF8", boxShadow: "0 0 4px rgba(56,189,248,0.5)" }} />
          <span style={{ fontSize: "5px", color: "#38BDF8" }}>Live</span>
        </div>
      </div>

      {/* Balance */}
      <div className="px-3 py-2 shrink-0">
        <span className="block" style={{ fontSize: "5.5px", color: "rgba(148,197,248,0.5)" }}>Total Balance</span>
        <span className="font-bold block" style={{ fontSize: "13px", color: "#F0F9FF", letterSpacing: "-0.3px" }}>${balance.toLocaleString()}<span style={{ fontSize: "8px", color: "rgba(148,197,248,0.4)" }}>.00</span></span>
        <span className="flex items-center gap-0.5" style={{ fontSize: "5px", color: "#38BDF8" }}>
          <svg width="5" height="5" viewBox="0 0 10 10" fill="none"><path d="M5 2L8 6H2L5 2Z" fill="#38BDF8" /></svg>
          +3.24% today
        </span>
      </div>

      {/* Chart */}
      <div className="px-2 shrink-0" style={{ height: "55px" }}>
        <div className="w-full h-full rounded-xl overflow-hidden" style={{ background: "rgba(56,189,248,0.02)", border: "0.5px solid rgba(56,189,248,0.06)" }}>
          <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
        </div>
      </div>

      {/* Transactions */}
      <div className="px-2 pt-2 pb-1 shrink-0">
        <span className="block mb-1" style={{ fontSize: "5.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(148,197,248,0.35)" }}>Recent Activity</span>
      </div>
      <div className="flex-1 overflow-hidden px-2 space-y-1">
        {visibleTxns.map((txn, i) => {
          const isCredit = txn.type === "credit";
          return (
            <div key={`${txn.desc}-${i}`} className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{
              background: "rgba(56,189,248,0.02)",
              border: "0.5px solid rgba(56,189,248,0.06)",
              animation: "vxSlide 0.35s ease-out",
            }}>
              <div className="w-4 h-4 rounded-md flex items-center justify-center shrink-0" style={{ background: isCredit ? "rgba(56,189,248,0.08)" : "rgba(248,113,113,0.08)" }}>
                <svg width="6" height="6" viewBox="0 0 10 10" fill="none">
                  {isCredit
                    ? <path d="M5 8V2M2 5l3-3 3 3" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />
                    : <path d="M5 2v6M2 5l3 3 3-3" stroke="#F87171" strokeWidth="1.2" strokeLinecap="round" />
                  }
                </svg>
              </div>
              <span className="flex-1 truncate" style={{ fontSize: "6.5px", color: "#BAE6FD" }}>{txn.desc}</span>
              <span className="font-semibold shrink-0" style={{ fontSize: "6.5px", color: isCredit ? "#38BDF8" : "#F87171" }}>{txn.amount}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-around px-2 py-1.5 shrink-0" style={{ borderTop: "1px solid rgba(56,189,248,0.06)" }}>
        {[
          { label: "Dashboard", icon: <><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" /><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" /><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" /><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" /></> },
          { label: "Accounts", icon: <><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" /><circle cx="7" cy="15" r="1.5" fill="currentColor" /></> },
          { label: "Trading", icon: <><path d="M3 17l4-4 4 2 4-6 4 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M15 6h5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></> },
          { label: "Settings", icon: <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></> },
        ].map((tab, i) => (
          <div key={tab.label} className="flex flex-col items-center gap-0.5">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" style={{ color: i === 0 ? "#38BDF8" : "rgba(148,197,248,0.25)" }}>
              {tab.icon}
            </svg>
            <span style={{ fontSize: "4px", color: i === 0 ? "#38BDF8" : "rgba(148,197,248,0.25)" }}>{tab.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes vxSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default VaultXViz;
