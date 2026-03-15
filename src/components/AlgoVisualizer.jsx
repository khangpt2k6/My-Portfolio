import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, GitBranch, Grid3X3, Play, Pause, RotateCcw,
  Shuffle, ChevronDown, Zap, Plus, SkipBack, SkipForward
} from "lucide-react";
import useAlgoPlayer from "./algo/useAlgoPlayer";
import { SORTING_GENERATORS } from "./algo/algorithms/sorting";
import { generatePathSteps, CELL } from "./algo/algorithms/pathfinding";
import { generateTraversalSteps } from "./algo/algorithms/tree";

// ── Custom dropdown select ──────────────────────────────────────────────────
function Sel({ value, onChange, options, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
        className="flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 focus:outline-none cursor-pointer disabled:opacity-50 transition-all"
      >
        <span>{value}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={12} className="text-[var(--color-text-muted)]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 z-50 min-w-[140px] py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl overflow-hidden"
          >
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange({ target: { value: opt } }); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                  opt === value
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text)] hover:bg-[rgba(var(--color-primary-rgb),0.1)]"
                }`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Tiny button ─────────────────────────────────────────────────────────────
function Btn({ onClick, disabled, primary, icon: Icon, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-35 disabled:cursor-not-allowed ${
        primary
          ? "text-white bg-[var(--color-primary)] shadow-sm hover:brightness-110"
          : "bg-[var(--color-surface2)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40"
      }`}>
      {Icon && <Icon size={12} />}{children}
    </button>
  );
}

// ── Inline playback bar ─────────────────────────────────────────────────────
function PlaybackBar({ player }) {
  const { currentStep, totalSteps, isPlaying, speed, setSpeed, play, pause, stepForward, stepBack, seekTo, reset, SPEED_PRESETS, isAtEnd, isAtStart } = player;
  if (totalSteps === 0) return null;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--color-surface2)]/60 border border-[var(--color-border)]">
      {/* Transport */}
      <button onClick={stepBack} disabled={isAtStart} className="p-1 rounded hover:bg-[var(--color-border)]/60 disabled:opacity-20">
        <SkipBack size={12} className="text-[var(--color-text)]" />
      </button>
      <button onClick={isPlaying ? pause : play}
        className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white flex items-center gap-1"
        style={{ backgroundColor: isPlaying ? "#f43f5e" : "var(--color-primary)" }}>
        {isPlaying ? <><Pause size={10} />Pause</> : <><Play size={10} />Play</>}
      </button>
      <button onClick={stepForward} disabled={isAtEnd} className="p-1 rounded hover:bg-[var(--color-border)]/60 disabled:opacity-20">
        <SkipForward size={12} className="text-[var(--color-text)]" />
      </button>
      <button onClick={reset} className="p-1 rounded hover:bg-[var(--color-border)]/60">
        <RotateCcw size={11} className="text-[var(--color-text-muted)]" />
      </button>

      {/* Divider */}
      <div className="w-px h-4 bg-[var(--color-border)]" />

      {/* Step counter */}
      <span className="text-[10px] font-mono text-[var(--color-text-muted)] tabular-nums">
        <span className="text-[var(--color-primary)] font-bold">{currentStep + 1}</span>/{totalSteps}
      </span>

      {/* Progress bar */}
      <div className="flex-1 h-1 rounded-full bg-[var(--color-border)] overflow-hidden min-w-[60px] relative">
        <div className="h-full rounded-full transition-all duration-100"
          style={{ width: `${progress}%`, background: isPlaying ? "#f43f5e" : "var(--color-primary)" }} />
        <input type="range" min="0" max={totalSteps - 1} value={Math.max(0, currentStep)}
          onChange={(e) => seekTo(+e.target.value)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer" />
      </div>

      {/* Speed */}
      <div className="flex items-center gap-0.5">
        {SPEED_PRESETS.map((p) => (
          <button key={p.value} onClick={() => setSpeed(p.value)}
            className="px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors"
            style={{
              backgroundColor: speed === p.value ? "var(--color-primary)" : "transparent",
              color: speed === p.value ? "#fff" : "var(--color-text-muted)",
            }}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Info bar (complexity + description) ─────────────────────────────────────
const ALGO_INFO = {
  "Bubble Sort": { time: "O(n²)", space: "O(1)" },
  "Selection Sort": { time: "O(n²)", space: "O(1)" },
  "Insertion Sort": { time: "O(n²)", space: "O(1)" },
  "Quick Sort": { time: "O(n log n)", space: "O(log n)" },
  "Merge Sort": { time: "O(n log n)", space: "O(n)" },
  "A* Search": { time: "O(E log V)", space: "O(V)" },
  "Dijkstra": { time: "O(E log V)", space: "O(V)" },
  "BFS": { time: "O(V+E)", space: "O(V)" },
  "DFS": { time: "O(V+E)", space: "O(V)" },
  "In-Order": { time: "O(n)", space: "O(h)" },
  "Pre-Order": { time: "O(n)", space: "O(h)" },
  "Post-Order": { time: "O(n)", space: "O(h)" },
  "Level-Order": { time: "O(n)", space: "O(w)" },
};

function InfoBar({ algo, stepData, stats }) {
  const info = ALGO_INFO[algo];
  if (!info && !stepData?.description && (!stats || stats.length === 0)) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-[10px]">
      {info && (
        <>
          <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            {info.time}
          </span>
          <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-violet-500/10 text-violet-500 border border-violet-500/20">
            {info.space}
          </span>
        </>
      )}
      {stats?.map(({ label, value, color }) => (
        <span key={label} className="px-2 py-0.5 rounded-md font-mono bg-[var(--color-surface2)] border border-[var(--color-border)]">
          <span className="text-[var(--color-text-muted)]">{label}: </span>
          <span className="font-bold" style={{ color: color || "var(--color-primary)" }}>{value}</span>
        </span>
      ))}
      {stepData?.description && (
        <span className="text-[var(--color-text-muted)] italic truncate max-w-xs">
          {stepData.description}
        </span>
      )}
    </div>
  );
}

// ── Legend ───────────────────────────────────────────────────────────────────
function Legend({ items }) {
  return (
    <div className="flex flex-wrap gap-3 text-[10px] text-[var(--color-text-muted)]">
      {items.map(({ label, color, rounded }) => (
        <span key={label} className="flex items-center gap-1">
          <span className={`w-2.5 h-2.5 ${rounded ? "rounded-full" : "rounded-sm"}`}
            style={{ background: color, border: color === "transparent" ? "1px solid var(--color-border)" : undefined }} />
          {label}
        </span>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SORTING VISUALIZER
// ═══════════════════════════════════════════════════════════════════════════════
const SORT_ALGOS = ["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort", "Merge Sort"];
function generateArray(size) { return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10); }

function SortingVisualizer() {
  const [array, setArray] = useState(() => generateArray(50));
  const [algo, setAlgo] = useState("Quick Sort");
  const [arraySize, setArraySize] = useState(50);
  const [steps, setSteps] = useState([]);
  const canvasRef = useRef(null);
  const player = useAlgoPlayer(steps);

  const shuffle = () => { const a = generateArray(arraySize); setArray(a); setSteps([]); };
  const generate = () => { const gen = SORTING_GENERATORS[algo]; if (gen) setSteps(gen(array)); };
  const handleSize = (s) => { setArraySize(s); setArray(generateArray(s)); setSteps([]); };

  const visual = useMemo(() => {
    const step = player.currentStepData;
    if (!step) return { array, highlighted: [], sorted: [], pivot: -1 };
    return { array: step.array, highlighted: step.indices || [], sorted: step.sorted || [], pivot: step.pivot ?? -1 };
  }, [player.currentStepData, array]);

  const stats = useMemo(() => {
    if (!steps.length) return [];
    const upTo = steps.slice(0, player.currentStep + 1);
    return [
      { label: "Cmp", value: upTo.filter(s => s.type === "compare").length, color: "#6366f1" },
      { label: "Swp", value: upTo.filter(s => s.type === "swap").length, color: "#f43f5e" },
    ];
  }, [steps, player.currentStep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width, h = rect.height, arr = visual.array;
    const gap = 1.5, barW = (w - gap * (arr.length - 1)) / arr.length;
    ctx.clearRect(0, 0, w, h);

    arr.forEach((val, i) => {
      const barH = (val / 100) * (h - 12), x = i * (barW + gap), y = h - barH;
      let color;
      if (visual.sorted.includes(i)) color = "#34d399";
      else if (i === visual.pivot) color = "#f59e0b";
      else if (visual.highlighted.includes(i)) color = "#f43f5e";
      else { const t = val / 100; color = `rgb(${Math.round(99 + t * 40)}, ${Math.round(102 + t * 60)}, 241)`; }

      const r = Math.min(barW * 0.3, 5);
      ctx.beginPath(); ctx.moveTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + barW - r, y); ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, h); ctx.lineTo(x, h); ctx.closePath();
      ctx.fillStyle = color; ctx.fill();

      if (visual.highlighted.includes(i) || i === visual.pivot) {
        ctx.shadowColor = color; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0;
      }
      if (arr.length <= 30) {
        const cs = getComputedStyle(document.documentElement);
        ctx.fillStyle = barH > 20 ? "#fff" : (cs.getPropertyValue("--color-text").trim() || "#0F172A");
        ctx.font = `bold ${Math.min(11, barW * 0.5)}px system-ui`;
        ctx.textAlign = "center"; ctx.textBaseline = barH > 20 ? "top" : "bottom";
        ctx.fillText(val, x + barW / 2, barH > 20 ? y + 4 : y - 2);
      }
    });
  }, [visual]);

  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (!steps.length) return;
      if (e.key === " ") { e.preventDefault(); player.isPlaying ? player.pause() : player.play(); }
      if (e.key === "ArrowRight") { e.preventDefault(); player.stepForward(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); player.stepBack(); }
    };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [player, steps.length]);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Sel value={algo} onChange={e => setAlgo(e.target.value)} options={SORT_ALGOS} disabled={player.isPlaying} />
        <Btn onClick={generate} disabled={player.isPlaying} primary icon={Play}>Visualize</Btn>
        <Btn onClick={shuffle} disabled={player.isPlaying} icon={Shuffle}>Shuffle</Btn>
        <div className="flex items-center gap-1.5 ml-auto text-[10px] text-[var(--color-text-muted)]">
          <span className="font-medium">Size</span>
          <input type="range" min="10" max="100" value={arraySize} onChange={e => handleSize(+e.target.value)}
            disabled={player.isPlaying} className="w-16 accent-[var(--color-primary)] h-0.5" />
          <span className="font-mono font-bold text-[var(--color-primary)] w-5 tabular-nums">{arraySize}</span>
        </div>
      </div>

      {/* Playback + Info */}
      <PlaybackBar player={player} />
      <InfoBar algo={algo} stepData={player.currentStepData} stats={stats} />

      {/* Canvas — fills remaining space */}
      <div className="flex-1 min-h-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <Legend items={[
        { label: "Unsorted", color: "rgb(130,142,241)" }, { label: "Comparing", color: "#f43f5e" },
        { label: "Pivot", color: "#f59e0b" }, { label: "Sorted", color: "#34d399" },
      ]} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATHFINDING VISUALIZER
// ═══════════════════════════════════════════════════════════════════════════════
const PF_ALGOS = ["A* Search", "Dijkstra", "BFS", "DFS"];

function PathfindingVisualizer() {
  const ROWS = 15, COLS = 31;
  const makeGrid = () => Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => CELL.EMPTY));

  const [wallGrid, setWallGrid] = useState(() => makeGrid());
  const [algo, setAlgo] = useState("A* Search");
  const [startPos, setStartPos] = useState([7, 3]);
  const [endPos, setEndPos] = useState([7, 27]);
  const [mouseDown, setMouseDown] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [steps, setSteps] = useState([]);
  const player = useAlgoPlayer(steps);

  const resetGrid = () => { setWallGrid(makeGrid()); setStartPos([7, 3]); setEndPos([7, 27]); setSteps([]); };
  const generateMaze = () => {
    if (player.isPlaying) return;
    const g = makeGrid();
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) g[r][c] = CELL.WALL;
    const stack = [[1, 1]]; g[1][1] = CELL.EMPTY;
    const dirs = [[0,2],[2,0],[0,-2],[-2,0]];
    while (stack.length) {
      const [cr, cc] = stack[stack.length - 1];
      const nb = dirs.map(([dr,dc]) => [cr+dr, cc+dc]).filter(([nr,nc]) => nr > 0 && nr < ROWS-1 && nc > 0 && nc < COLS-1 && g[nr][nc] === CELL.WALL);
      if (!nb.length) { stack.pop(); continue; }
      const [nr, nc] = nb[Math.floor(Math.random() * nb.length)];
      g[(cr+nr)/2][(cc+nc)/2] = CELL.EMPTY; g[nr][nc] = CELL.EMPTY; stack.push([nr, nc]);
    }
    setStartPos([1,1]); setEndPos([ROWS-2, COLS-2]); setWallGrid(g); setSteps([]);
  };

  const handleCellEvent = (r, c, isDown = false) => {
    if (player.isPlaying || steps.length > 0) return;
    if (isDown) {
      if (r === startPos[0] && c === startPos[1]) { setDragging("start"); return; }
      if (r === endPos[0] && c === endPos[1]) { setDragging("end"); return; }
      setMouseDown(true);
    }
    if (dragging === "start") { setStartPos([r, c]); return; }
    if (dragging === "end") { setEndPos([r, c]); return; }
    if (!mouseDown && !isDown) return;
    setWallGrid(g => {
      const ng = g.map(row => [...row]);
      if (r === startPos[0] && c === startPos[1]) return ng;
      if (r === endPos[0] && c === endPos[1]) return ng;
      ng[r][c] = ng[r][c] === CELL.WALL ? CELL.EMPTY : CELL.WALL; return ng;
    });
  };

  const run = () => { setSteps([]); setSteps(generatePathSteps(wallGrid, startPos, endPos, algo)); };

  const displayGrid = useMemo(() => player.currentStepData?.grid || wallGrid, [player.currentStepData, wallGrid]);
  const currentStats = useMemo(() => {
    const s = player.currentStepData?.stats;
    return s ? [{ label: "Visited", value: s.visited, color: "#10b981" }, { label: "Path", value: s.pathLen, color: "#facc15" }] : [];
  }, [player.currentStepData]);

  const cellColor = (c, r, col) => {
    if (r === startPos[0] && col === startPos[1]) return "var(--color-primary)";
    if (r === endPos[0] && col === endPos[1]) return "#f43f5e";
    switch (c) {
      case CELL.WALL: return "var(--color-text)";
      case CELL.VISITED: return "rgba(var(--color-primary-rgb), 0.35)";
      case CELL.FRONTIER: return "rgba(var(--color-primary-rgb), 0.15)";
      case CELL.PATH: return "#facc15";
      default: return "var(--color-surface2)";
    }
  };

  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (!steps.length) return;
      if (e.key === " ") { e.preventDefault(); player.isPlaying ? player.pause() : player.play(); }
      if (e.key === "ArrowRight") { e.preventDefault(); player.stepForward(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); player.stepBack(); }
    };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [player, steps.length]);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Sel value={algo} onChange={e => setAlgo(e.target.value)} options={PF_ALGOS} disabled={player.isPlaying} />
        <Btn onClick={run} disabled={player.isPlaying} primary icon={Play}>Find Path</Btn>
        <Btn onClick={generateMaze} disabled={player.isPlaying} icon={Grid3X3}>Maze</Btn>
        <Btn onClick={resetGrid} icon={RotateCcw}>Clear</Btn>
      </div>

      <PlaybackBar player={player} />
      <InfoBar algo={algo} stepData={player.currentStepData} stats={currentStats} />

      {/* Grid */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 overflow-hidden"
        onMouseLeave={() => { setMouseDown(false); setDragging(null); }}
        onMouseUp={() => { setMouseDown(false); setDragging(null); }}>
        <div className="grid" style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(12px, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, minmax(12px, 1fr))`,
          gap: "1px",
          aspectRatio: `${COLS} / ${ROWS}`,
        }}>
          {displayGrid.map((row, r) => row.map((cell, c) => {
            const isStart = r === startPos[0] && c === startPos[1];
            const isEnd = r === endPos[0] && c === endPos[1];
            return (
              <div key={`${r}-${c}`}
                onMouseDown={() => handleCellEvent(r, c, true)}
                onMouseEnter={() => handleCellEvent(r, c)}
                className="transition-colors duration-75"
                style={{
                  backgroundColor: cellColor(cell, r, c),
                  cursor: (player.isPlaying || steps.length > 0) ? "default" : "pointer",
                  borderRadius: isStart || isEnd ? "50%" : "2px",
                  boxShadow: isStart ? "0 0 8px var(--color-primary)" : isEnd ? "0 0 8px #f43f5e" : "none",
                }}
              />
            );
          }))}
        </div>
      </div>

      <Legend items={[
        { label: "Start", color: "var(--color-primary)", rounded: true },
        { label: "End", color: "#f43f5e", rounded: true },
        { label: "Wall", color: "var(--color-text)" },
        { label: "Visited", color: "rgba(var(--color-primary-rgb), 0.35)" },
        { label: "Path", color: "#facc15" },
      ]} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BINARY TREE VISUALIZER
// ═══════════════════════════════════════════════════════════════════════════════
class TreeNode { constructor(val) { this.val = val; this.left = null; this.right = null; } }
function insertBST(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insertBST(root.left, val);
  else if (val > root.val) root.right = insertBST(root.right, val);
  return root;
}
function deleteBST(root, val) {
  if (!root) return null;
  if (val < root.val) { root.left = deleteBST(root.left, val); }
  else if (val > root.val) { root.right = deleteBST(root.right, val); }
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let min = root.right;
    while (min.left) min = min.left;
    root.val = min.val;
    root.right = deleteBST(root.right, min.val);
  }
  return root;
}
function treeToLayout(node, depth = 0, pos = 0, spread = 1, nodes = [], edges = []) {
  if (!node) return { nodes, edges };
  nodes.push({ val: node.val, x: pos, y: depth, id: `${node.val}-${depth}-${pos}` });
  if (node.left) { const cx = pos - spread / 2; edges.push({ from: { x: pos, y: depth }, to: { x: cx, y: depth + 1 } }); treeToLayout(node.left, depth + 1, cx, spread / 2, nodes, edges); }
  if (node.right) { const cx = pos + spread / 2; edges.push({ from: { x: pos, y: depth }, to: { x: cx, y: depth + 1 } }); treeToLayout(node.right, depth + 1, cx, spread / 2, nodes, edges); }
  return { nodes, edges };
}
const TRAVERSALS = ["In-Order", "Pre-Order", "Post-Order", "Level-Order"];
function cloneTree(n) { if (!n) return null; const c = new TreeNode(n.val); c.left = cloneTree(n.left); c.right = cloneTree(n.right); return c; }

function TreeVisualizer() {
  const [root, setRoot] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const [traversal, setTraversal] = useState("In-Order");
  const [steps, setSteps] = useState([]);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [offsets, setOffsets] = useState({});
  const dragRef = useRef(null);
  const player = useAlgoPlayer(steps);

  const insert = () => { const v = parseInt(inputVal); if (isNaN(v) || v < 1 || v > 99) return; setRoot(r => insertBST(cloneTree(r), v)); setInputVal(""); setSteps([]); };
  const insertRandom = () => { setRoot(r => insertBST(cloneTree(r), Math.floor(Math.random() * 99) + 1)); setSteps([]); };
  const clear = () => { setRoot(null); setSteps([]); setOffsets({}); };
  const buildDefault = () => { let t = null; [50,30,70,20,40,60,80,10,25,35,45].forEach(v => { t = insertBST(t, v); }); setRoot(t); setSteps([]); setOffsets({}); };
  const runTraversal = () => { if (root) setSteps(generateTraversalSteps(root, traversal)); };
  const removeNode = (val) => { setRoot(r => deleteBST(cloneTree(r), val)); setSteps([]); setOffsets(o => { const n = { ...o }; delete n[val]; return n; }); };

  const visual = useMemo(() => {
    const s = player.currentStepData;
    if (!s) return { highlighted: new Set(), current: null, traversalOrder: [], dataStructure: null };
    return { highlighted: new Set(s.highlighted || []), current: s.current, traversalOrder: s.traversalOrder || [], dataStructure: s.dataStructure || null };
  }, [player.currentStepData]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => { setSize({ w: e.contentRect.width, h: e.contentRect.height }); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = useMemo(() => {
    if (!root || !size.w) return { nodes: [], edges: [] };
    const { nodes, edges } = treeToLayout(root, 0, 0, 4);
    const { w, h } = size;
    const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs), maxY = Math.max(...ys);
    const padX = 60, padY = 50;
    const sx = maxX === minX ? 1 : (w - padX * 2) / (maxX - minX);
    const sy = maxY === 0 ? 1 : (h - padY * 2) / maxY;
    const mx = x => padX + (x - minX) * sx;
    const my = y => padY + y * sy;
    const r = Math.max(18, Math.min(26, w / (nodes.length + 6)));

    const positioned = nodes.map(n => ({
      val: n.val, r,
      cx: mx(n.x) + (offsets[n.val]?.dx || 0),
      cy: my(n.y) + (offsets[n.val]?.dy || 0),
    }));

    const lookup = {};
    nodes.forEach((n, i) => { lookup[`${n.x},${n.y}`] = positioned[i]; });

    const mapped = edges.map(e => {
      const f = lookup[`${e.from.x},${e.from.y}`], t = lookup[`${e.to.x},${e.to.y}`];
      return f && t ? { from: f, to: t } : null;
    }).filter(Boolean);

    return { nodes: positioned, edges: mapped };
  }, [root, size, offsets]);

  const onPointerDown = (e, node) => {
    e.preventDefault(); e.stopPropagation();
    containerRef.current?.setPointerCapture(e.pointerId);
    dragRef.current = { val: node.val, sx: e.clientX, sy: e.clientY, odx: offsets[node.val]?.dx || 0, ody: offsets[node.val]?.dy || 0 };
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const { val, sx, sy, odx, ody } = dragRef.current;
    setOffsets(p => ({ ...p, [val]: { dx: odx + e.clientX - sx, dy: ody + e.clientY - sy } }));
  };
  const onPointerUp = () => { dragRef.current = null; };

  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (!steps.length) return;
      if (e.key === " ") { e.preventDefault(); player.isPlaying ? player.pause() : player.play(); }
      if (e.key === "ArrowRight") { e.preventDefault(); player.stepForward(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); player.stepBack(); }
    };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [player, steps.length]);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && insert()} placeholder="1–99" min="1" max="99"
          className="w-16 px-2 py-1.5 rounded-lg text-xs bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] placeholder:text-[var(--color-text-muted)]/50" />
        <Btn onClick={insert} primary icon={Plus}>Insert</Btn>
        <Btn onClick={insertRandom} icon={Shuffle}>Random</Btn>
        <Btn onClick={buildDefault} icon={GitBranch}>Sample</Btn>
        <Btn onClick={clear} icon={RotateCcw}>Clear</Btn>

        <div className="w-px h-5 bg-[var(--color-border)] mx-1 hidden sm:block" />

        <Sel value={traversal} onChange={e => setTraversal(e.target.value)} options={TRAVERSALS} disabled={player.isPlaying} />
        <Btn onClick={runTraversal} disabled={!root || player.isPlaying} primary icon={Play}>Traverse</Btn>
      </div>

      <PlaybackBar player={player} />
      <InfoBar algo={traversal} stepData={player.currentStepData} />

      {/* Traversal result + data structure */}
      {(visual.traversalOrder.length > 0 || (visual.dataStructure?.items.length > 0)) && (
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          {visual.dataStructure?.items.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--color-surface2)] border border-[var(--color-border)]">
              <span className="font-bold text-[var(--color-text-muted)] uppercase text-[8px] tracking-wider">{visual.dataStructure.label}:</span>
              {visual.dataStructure.items.map((item, i) => (
                <span key={i} className="font-mono font-bold text-[var(--color-primary)]">{item}</span>
              ))}
            </div>
          )}
          {visual.traversalOrder.length > 0 && (
            <div className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-[var(--color-surface2)] border border-[var(--color-border)]">
              <span className="font-bold text-[var(--color-text-muted)] uppercase text-[8px] tracking-wider mr-1">Result:</span>
              {visual.traversalOrder.map((v, i) => (
                <span key={i} className="font-mono font-bold text-[var(--color-primary)]">
                  {v}{i < visual.traversalOrder.length - 1 && <span className="text-[var(--color-text-muted)]/30 mx-0.5">→</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SVG Tree */}
      <div ref={containerRef}
        className="flex-1 min-h-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden relative touch-none"
        onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
        {!root ? (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)] text-sm">
            Insert values to build a tree
          </div>
        ) : (
          <svg width={size.w} height={size.h} className="w-full h-full">
            <style>{`
              .tree-node { cursor: grab; }
              .tree-node:active { cursor: grabbing; }
              .tree-node .node-ring { opacity: 0; transition: opacity 0.2s ease; }
              .tree-node:hover .node-ring { opacity: 0.35; }
              .tree-node .node-body { transition: filter 0.2s ease, fill 0.15s ease, stroke 0.15s ease; }
              .tree-node:hover .node-body { filter: brightness(1.15); }
              .tree-edge { transition: d 0.2s ease; }
              @keyframes treePulse {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
              }
            `}</style>
            <defs>
              <filter id="treeGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="treeShadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(0,0,0,0.3)" floodOpacity="0.3" />
              </filter>
              <radialGradient id="nodeSheen" cx="40%" cy="30%" r="60%">
                <stop offset="0%" stopColor="white" stopOpacity="0.15" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Edges — curved bezier */}
            {layout.edges.map((e, i) => {
              const midY = (e.from.cy + e.to.cy) / 2;
              const isFromH = visual.highlighted.has(e.from.val) || visual.current === e.from.val;
              const isToH = visual.highlighted.has(e.to.val) || visual.current === e.to.val;
              const edgeActive = isFromH && isToH;
              return (
                <path key={i} className="tree-edge"
                  d={`M ${e.from.cx},${e.from.cy + e.from.r} C ${e.from.cx},${midY} ${e.to.cx},${midY} ${e.to.cx},${e.to.cy - e.to.r}`}
                  fill="none"
                  stroke={edgeActive ? "var(--color-primary)" : "var(--color-border)"}
                  strokeWidth={edgeActive ? 3 : 2}
                  strokeLinecap="round"
                  opacity={edgeActive ? 0.9 : 0.5}
                />
              );
            })}

            {/* Nodes */}
            {layout.nodes.map(n => {
              const isH = visual.highlighted.has(n.val);
              const isC = visual.current === n.val;
              const fill = isC ? "#f43f5e" : isH ? "var(--color-primary)" : "var(--color-surface2)";
              const stroke = isC ? "#f43f5e" : isH ? "var(--color-primary)" : "var(--color-border)";
              const textFill = (isC || isH) ? "#fff" : "var(--color-text)";
              return (
                <g key={n.val} className="tree-node"
                  onPointerDown={e => onPointerDown(e, n)}
                  onDoubleClick={() => removeNode(n.val)}>
                  {/* Hover glow ring */}
                  <circle className="node-ring" cx={n.cx} cy={n.cy} r={n.r + 8}
                    fill="none" stroke="var(--color-primary)" strokeWidth="2" />
                  {/* Pulse ring for current node */}
                  {isC && (
                    <circle cx={n.cx} cy={n.cy} r={n.r + 5}
                      fill="none" stroke="#f43f5e" strokeWidth="2"
                      style={{ animation: "treePulse 1.2s ease-in-out infinite" }} />
                  )}
                  {/* Main node circle */}
                  <circle className="node-body" cx={n.cx} cy={n.cy} r={n.r}
                    fill={fill} stroke={stroke}
                    strokeWidth={isC || isH ? 3 : 2}
                    filter={(isC || isH) ? "url(#treeGlow)" : "url(#treeShadow)"} />
                  {/* Glass sheen */}
                  <circle cx={n.cx} cy={n.cy} r={n.r}
                    fill="url(#nodeSheen)" style={{ pointerEvents: "none" }} />
                  {/* Value text */}
                  <text x={n.cx} y={n.cy} textAnchor="middle" dominantBaseline="central"
                    fill={textFill} fontSize={Math.min(14, n.r * 0.85)} fontWeight="700" fontFamily="system-ui"
                    style={{ pointerEvents: "none", userSelect: "none" }}>
                    {n.val}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      <Legend items={[
        { label: "Visited", color: "var(--color-primary)", rounded: true },
        { label: "Current", color: "#f43f5e", rounded: true },
        { label: "Drag to move · Double-click to delete", color: "transparent", rounded: true },
      ]} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function AlgoVisualizer() { return null; }
export { SortingVisualizer, PathfindingVisualizer, TreeVisualizer };
