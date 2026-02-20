import { useState, useEffect, useRef, useCallback } from "react";

/**
 * VaultXViz — Animated financial dashboard preview
 * Shows a mini trading chart with animated line, account balance,
 * and a live transaction feed.
 */

const TRANSACTIONS = [
  { type: "credit", desc: "Deposit", amount: "+$2,500.00", color: "#22C55E" },
  { type: "debit", desc: "Transfer to Savings", amount: "-$800.00", color: "#EF4444" },
  { type: "credit", desc: "Dividend - AAPL", amount: "+$142.50", color: "#22C55E" },
  { type: "debit", desc: "Wire Transfer", amount: "-$1,200.00", color: "#EF4444" },
];

const CHART_POINTS = [
  40, 38, 42, 45, 43, 48, 52, 49, 55, 58, 54, 60, 63, 58, 62, 67, 65, 70, 68, 74, 72, 78, 75, 80,
];

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

  // Animate chart line
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
        if (progress < 1) {
          frame = requestAnimationFrame(step);
        }
      };
      frame = requestAnimationFrame(step);

      // Show transactions sequentially
      let txIdx = 0;
      const showNext = () => {
        if (!mountedRef.current || txIdx >= TRANSACTIONS.length) {
          addTimeout(() => {
            if (mountedRef.current) runLoop();
          }, 3000);
          return;
        }
        const t = txIdx;
        setVisibleTxns((prev) => [...prev, TRANSACTIONS[t]]);
        setBalance((prev) => {
          const amt = TRANSACTIONS[t].type === "credit" ? 250 : -180;
          return prev + amt;
        });
        txIdx++;
        addTimeout(showNext, 900);
      };
      addTimeout(showNext, 1200);
    };

    runLoop();
    return () => {
      mountedRef.current = false;
      clearAll();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [addTimeout, clearAll]);

  // Draw chart on canvas
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
    const padX = 4;
    const padY = 4;
    const drawW = W - padX * 2;
    const drawH = H - padY * 2;

    const visibleCount = Math.floor(chartProgress * points.length);
    if (visibleCount < 2) return;

    const getX = (i) => padX + (i / (points.length - 1)) * drawW;
    const getY = (v) => padY + drawH - ((v - minVal) / range) * drawH;

    // Gradient fill under curve
    const grad = ctx.createLinearGradient(0, padY, 0, H);
    grad.addColorStop(0, "rgba(59,130,246,0.3)");
    grad.addColorStop(1, "rgba(59,130,246,0.02)");

    ctx.beginPath();
    ctx.moveTo(getX(0), H);
    for (let i = 0; i < visibleCount; i++) {
      ctx.lineTo(getX(i), getY(points[i]));
    }
    ctx.lineTo(getX(visibleCount - 1), H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(points[0]));
    for (let i = 1; i < visibleCount; i++) {
      ctx.lineTo(getX(i), getY(points[i]));
    }
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    // Glow dot at the tip
    if (visibleCount > 0) {
      const lastI = visibleCount - 1;
      const cx = getX(lastI);
      const cy = getY(points[lastI]);

      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59,130,246,0.3)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#3B82F6";
      ctx.fill();
    }
  }, [chartProgress]);

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden select-none"
      style={{ background: "#0B1120", fontFamily: "inherit" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 shrink-0"
        style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="w-5 h-5 rounded flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
        >
          <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="6" width="3" height="8" rx="0.5" fill="white" opacity="0.9" />
            <rect x="6.5" y="3" width="3" height="11" rx="0.5" fill="white" opacity="0.9" />
            <rect x="11" y="1" width="3" height="13" rx="0.5" fill="white" opacity="0.9" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white" style={{ fontSize: "8px" }}>
            VaultX
          </span>
          <span className="text-white/40" style={{ fontSize: "5px" }}>
            Financial Management
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.1)", border: "0.5px solid rgba(34,197,94,0.2)" }}>
          <div className="w-[4px] h-[4px] rounded-full" style={{ background: "#22C55E" }} />
          <span style={{ fontSize: "5px", color: "#22C55E" }}>Markets Open</span>
        </div>
      </div>

      {/* Balance */}
      <div className="px-3 py-2 shrink-0">
        <span className="text-white/40 block" style={{ fontSize: "5.5px" }}>
          Total Balance
        </span>
        <span className="text-white font-bold block" style={{ fontSize: "12px" }}>
          ${balance.toLocaleString()}.00
        </span>
        <span className="flex items-center gap-0.5" style={{ fontSize: "5px", color: "#22C55E" }}>
          <svg width="5" height="5" viewBox="0 0 10 10" fill="none">
            <path d="M5 2L8 6H2L5 2Z" fill="#22C55E" />
          </svg>
          +3.24% today
        </span>
      </div>

      {/* Chart */}
      <div className="px-2 shrink-0" style={{ height: "50px" }}>
        <div className="w-full h-full rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
          <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
        </div>
      </div>

      {/* Transactions */}
      <div className="px-2 pt-2 pb-1 shrink-0">
        <span className="text-white/40 block mb-1" style={{ fontSize: "5.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Recent Activity
        </span>
      </div>
      <div className="flex-1 overflow-hidden px-2 space-y-1">
        {visibleTxns.map((txn, i) => (
          <div
            key={`${txn.desc}-${i}`}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.06)",
              animation: "vxSlide 0.35s ease-out",
            }}
          >
            <div
              className="w-4 h-4 rounded flex items-center justify-center shrink-0"
              style={{ background: txn.type === "credit" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)" }}
            >
              <svg width="6" height="6" viewBox="0 0 10 10" fill="none">
                {txn.type === "credit" ? (
                  <path d="M5 8V2M2 5l3-3 3 3" stroke="#22C55E" strokeWidth="1.2" strokeLinecap="round" />
                ) : (
                  <path d="M5 2v6M2 5l3 3 3-3" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
                )}
              </svg>
            </div>
            <span className="text-white/70 flex-1 truncate" style={{ fontSize: "6.5px" }}>
              {txn.desc}
            </span>
            <span className="font-semibold shrink-0" style={{ fontSize: "6.5px", color: txn.color }}>
              {txn.amount}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div
        className="flex items-center justify-around px-2 py-1.5 shrink-0"
        style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {["Dashboard", "Accounts", "Trading", "Settings"].map((tab, i) => (
          <div key={tab} className="flex flex-col items-center gap-0.5">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{
                background: i === 0 ? "#3B82F6" : "rgba(255,255,255,0.1)",
              }}
            />
            <span
              style={{
                fontSize: "4px",
                color: i === 0 ? "#3B82F6" : "rgba(255,255,255,0.3)",
              }}
            >
              {tab}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes vxSlide {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default VaultXViz;
