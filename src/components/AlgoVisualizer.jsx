import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, GitBranch, Grid3X3, Play, Pause, RotateCcw,
  Shuffle, ChevronDown, Zap, Minus, Plus
} from "lucide-react";
import useAlgoPlayer from "./algo/useAlgoPlayer";
import AlgoControls from "./algo/AlgoControls";
import StepInfo from "./algo/StepInfo";
import { SORTING_GENERATORS } from "./algo/algorithms/sorting";
import { generatePathSteps, CELL } from "./algo/algorithms/pathfinding";
import { generateTraversalSteps } from "./algo/algorithms/tree";

// ── Shared styled select ────────────────────────────────────────────────────
function StyledSelect({ value, onChange, options, disabled }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm font-medium bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] cursor-pointer disabled:opacity-50 transition-all duration-200 hover:border-[var(--color-primary)]/40"
      >
        {options.map(a => (
          <option key={a} value={a} className="bg-[var(--color-surface)] text-[var(--color-text)]">
            {a}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
    </div>
  );
}

// ── Shared action button ────────────────────────────────────────────────────
function ActionButton({ onClick, disabled, variant = "primary", icon: Icon, children }) {
  const base = "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";

  if (variant === "primary") {
    return (
      <motion.button
        onClick={onClick}
        disabled={disabled}
        whileTap={{ scale: 0.95 }}
        className={`${base} text-white`}
        style={{
          backgroundColor: "var(--color-primary)",
          boxShadow: "0 4px 16px rgba(var(--color-primary-rgb), 0.3)",
        }}
      >
        {Icon && <Icon size={14} />}
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      className={`${base} bg-[var(--color-surface2)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface2)]/80`}
    >
      {Icon && <Icon size={14} />}
      {children}
    </motion.button>
  );
}

// ── Legend item ──────────────────────────────────────────────────────────────
function Legend({ items }) {
  return (
    <div className="flex flex-wrap gap-3 text-[11px] text-[var(--color-text-muted)]">
      {items.map(({ label, color, rounded }) => (
        <span key={label} className="flex items-center gap-1.5">
          <span
            className={`w-3 h-3 ${rounded ? "rounded-full" : "rounded-sm"}`}
            style={{ background: color, border: color === "transparent" ? "1px solid var(--color-border)" : undefined }}
          />
          {label}
        </span>
      ))}
    </div>
  );
}

// ── Canvas wrapper with glow border ─────────────────────────────────────────
function CanvasPanel({ children, accent, className = "" }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      {/* Glow effect at top */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent || "var(--color-primary)"}50, transparent)`,
        }}
      />
      <div className="border border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)] p-2 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SORTING VISUALIZER
// ═══════════════════════════════════════════════════════════════════════════════
const SORT_ALGOS = ["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort", "Merge Sort"];

function generateArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

function SortingVisualizer() {
  const [array, setArray] = useState(() => generateArray(50));
  const [algo, setAlgo] = useState("Quick Sort");
  const [arraySize, setArraySize] = useState(50);
  const [steps, setSteps] = useState([]);
  const canvasRef = useRef(null);
  const player = useAlgoPlayer(steps);

  const handleSizeChange = (size) => {
    setArraySize(size);
    const newArr = generateArray(size);
    setArray(newArr);
    setSteps([]);
  };

  const shuffle = () => {
    const newArr = generateArray(arraySize);
    setArray(newArr);
    setSteps([]);
  };

  const generate = () => {
    const gen = SORTING_GENERATORS[algo];
    if (!gen) return;
    const newSteps = gen(array);
    setSteps(newSteps);
  };

  const visual = useMemo(() => {
    const step = player.currentStepData;
    if (!step) return { array, highlighted: [], sorted: [], pivot: -1 };
    return {
      array: step.array,
      highlighted: step.indices || [],
      sorted: step.sorted || [],
      pivot: step.pivot ?? -1,
    };
  }, [player.currentStepData, array]);

  const stats = useMemo(() => {
    if (steps.length === 0) return [];
    const upTo = steps.slice(0, player.currentStep + 1);
    const comparisons = upTo.filter(s => s.type === "compare").length;
    const swaps = upTo.filter(s => s.type === "swap").length;
    return [
      { label: "Comparisons", value: comparisons, color: "#6366f1" },
      { label: "Swaps", value: swaps, color: "#f43f5e" },
    ];
  }, [steps, player.currentStep]);

  // ── Draw bars on canvas ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const arr = visual.array;
    const gap = 1.5;
    const barW = (w - gap * (arr.length - 1)) / arr.length;
    const maxVal = 100;

    ctx.clearRect(0, 0, w, h);

    arr.forEach((val, i) => {
      const barH = (val / maxVal) * (h - 16);
      const x = i * (barW + gap);
      const y = h - barH;

      let color;
      if (visual.sorted.includes(i)) {
        color = "#34d399";
      } else if (i === visual.pivot) {
        color = "#f59e0b";
      } else if (visual.highlighted.includes(i)) {
        color = "#f43f5e";
      } else {
        // Gradient blue based on value
        const t = val / maxVal;
        const r = Math.round(99 + t * 40);
        const g = Math.round(102 + t * 60);
        const b = 241;
        color = `rgb(${r}, ${g}, ${b})`;
      }

      // Draw bar with rounded top
      const radius = Math.min(barW * 0.3, 5);
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.lineTo(x + barW - radius, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
      ctx.lineTo(x + barW, h);
      ctx.lineTo(x, h);
      ctx.closePath();

      // Gradient fill for unsorted bars
      if (!visual.sorted.includes(i) && !visual.highlighted.includes(i) && i !== visual.pivot) {
        const grad = ctx.createLinearGradient(x, y, x, h);
        grad.addColorStop(0, color);
        grad.addColorStop(1, `rgba(${99 + (val / maxVal) * 40}, ${102 + (val / maxVal) * 60}, 241, 0.6)`);
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = color;
      }
      ctx.fill();

      // Glow for highlighted/pivot
      if (visual.highlighted.includes(i) || i === visual.pivot) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Value labels for small arrays
      if (arr.length <= 30) {
        const cs = getComputedStyle(document.documentElement);
        const textColor = cs.getPropertyValue("--color-text").trim() || "#0F172A";
        ctx.fillStyle = barH > 20 ? "#fff" : textColor;
        ctx.font = `bold ${Math.min(11, barW * 0.5)}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = barH > 20 ? "top" : "bottom";
        ctx.fillText(val, x + barW / 2, barH > 20 ? y + 5 : y - 3);
      }
    });
  }, [visual]);

  // Keyboard shortcuts
  useEffect(() => {
    const handle = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (steps.length === 0) return;
      switch (e.key) {
        case " ": e.preventDefault(); player.isPlaying ? player.pause() : player.play(); break;
        case "ArrowRight": e.preventDefault(); player.stepForward(); break;
        case "ArrowLeft": e.preventDefault(); player.stepBack(); break;
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [player, steps.length]);

  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex flex-wrap items-center gap-3">
        <StyledSelect value={algo} onChange={e => setAlgo(e.target.value)} options={SORT_ALGOS} disabled={player.isPlaying} />
        <ActionButton onClick={generate} disabled={player.isPlaying} icon={Play}>Visualize</ActionButton>
        <ActionButton onClick={shuffle} disabled={player.isPlaying} variant="secondary" icon={Shuffle}>Randomize</ActionButton>

        {/* Array size */}
        <div className="flex items-center gap-2 ml-auto px-3 py-1.5 rounded-xl bg-[var(--color-surface2)] border border-[var(--color-border)]">
          <span className="text-[10px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider">Size</span>
          <input type="range" min="10" max="100" value={arraySize}
            onChange={e => handleSizeChange(+e.target.value)}
            disabled={player.isPlaying}
            className="w-20 accent-[var(--color-primary)] h-1" />
          <span className="text-xs font-mono text-[var(--color-primary)] font-bold w-6 tabular-nums">{arraySize}</span>
        </div>
      </div>

      {/* Playback controls */}
      <AlgoControls player={player} />

      {/* Step info + stats */}
      <StepInfo algo={algo} stepData={player.currentStepData} stats={stats} />

      {/* Canvas */}
      <CanvasPanel accent="#6366f1">
        <canvas ref={canvasRef} className="w-full" style={{ height: "clamp(250px, 40vh, 420px)" }} />
      </CanvasPanel>

      {/* Legend */}
      <Legend items={[
        { label: "Unsorted", color: "rgb(130, 142, 241)" },
        { label: "Comparing", color: "#f43f5e" },
        { label: "Pivot", color: "#f59e0b" },
        { label: "Sorted", color: "#34d399" },
      ]} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATHFINDING VISUALIZER
// ═══════════════════════════════════════════════════════════════════════════════
const PF_ALGOS = ["A* Search", "Dijkstra", "BFS", "DFS"];

function PathfindingVisualizer() {
  const ROWS = 21;
  const COLS = 41;

  function makeGrid() {
    return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => CELL.EMPTY));
  }

  const [wallGrid, setWallGrid] = useState(() => makeGrid());
  const [algo, setAlgo] = useState("A* Search");
  const [startPos, setStartPos] = useState([10, 5]);
  const [endPos, setEndPos] = useState([10, 35]);
  const [mouseDown, setMouseDown] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [steps, setSteps] = useState([]);
  const player = useAlgoPlayer(steps);

  const resetGrid = () => {
    setWallGrid(makeGrid());
    setStartPos([10, 5]);
    setEndPos([10, 35]);
    setSteps([]);
  };

  const generateMaze = () => {
    if (player.isPlaying) return;
    const g = makeGrid();
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) g[r][c] = CELL.WALL;
    const stack = [[1, 1]];
    g[1][1] = CELL.EMPTY;
    const dirs = [[0, 2], [2, 0], [0, -2], [-2, 0]];
    while (stack.length > 0) {
      const [cr, cc] = stack[stack.length - 1];
      const neighbors = dirs
        .map(([dr, dc]) => [cr + dr, cc + dc])
        .filter(([nr, nc]) => nr > 0 && nr < ROWS - 1 && nc > 0 && nc < COLS - 1 && g[nr][nc] === CELL.WALL);
      if (neighbors.length === 0) { stack.pop(); continue; }
      const [nr, nc] = neighbors[Math.floor(Math.random() * neighbors.length)];
      g[(cr + nr) / 2][(cc + nc) / 2] = CELL.EMPTY;
      g[nr][nc] = CELL.EMPTY;
      stack.push([nr, nc]);
    }
    g[1][1] = CELL.EMPTY; g[ROWS - 2][COLS - 2] = CELL.EMPTY;
    setStartPos([1, 1]); setEndPos([ROWS - 2, COLS - 2]);
    setWallGrid(g);
    setSteps([]);
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
      ng[r][c] = ng[r][c] === CELL.WALL ? CELL.EMPTY : CELL.WALL;
      return ng;
    });
  };

  const run = () => {
    setSteps([]);
    const newSteps = generatePathSteps(wallGrid, startPos, endPos, algo);
    setSteps(newSteps);
  };

  const displayGrid = useMemo(() => {
    const step = player.currentStepData;
    if (!step) return wallGrid;
    return step.grid;
  }, [player.currentStepData, wallGrid]);

  const currentStats = useMemo(() => {
    const step = player.currentStepData;
    if (!step?.stats) return [];
    return [
      { label: "Visited", value: step.stats.visited, color: "#10b981" },
      { label: "Path", value: step.stats.pathLen, color: "#facc15" },
    ];
  }, [player.currentStepData]);

  const cellColor = (c, r, col) => {
    if (r === startPos[0] && col === startPos[1]) return "var(--color-primary)";
    if (r === endPos[0] && col === endPos[1]) return "#f43f5e";
    switch (c) {
      case CELL.WALL: return "var(--color-text)";
      case CELL.VISITED: return "rgba(var(--color-primary-rgb), 0.35)";
      case CELL.FRONTIER: return "rgba(var(--color-primary-rgb), 0.15)";
      case CELL.PATH: return "#facc15";
      default: return "transparent";
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handle = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (steps.length === 0) return;
      switch (e.key) {
        case " ": e.preventDefault(); player.isPlaying ? player.pause() : player.play(); break;
        case "ArrowRight": e.preventDefault(); player.stepForward(); break;
        case "ArrowLeft": e.preventDefault(); player.stepBack(); break;
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [player, steps.length]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <StyledSelect value={algo} onChange={e => setAlgo(e.target.value)} options={PF_ALGOS} disabled={player.isPlaying} />
        <ActionButton onClick={run} disabled={player.isPlaying} icon={Play}>Find Path</ActionButton>
        <ActionButton onClick={generateMaze} disabled={player.isPlaying} variant="secondary" icon={Grid3X3}>Maze</ActionButton>
        <ActionButton onClick={resetGrid} variant="secondary" icon={RotateCcw}>Clear</ActionButton>
      </div>

      {/* Playback controls */}
      <AlgoControls player={player} />

      {/* Step info */}
      <StepInfo algo={algo} stepData={player.currentStepData} stats={currentStats} />

      {/* Grid */}
      <CanvasPanel accent="#10b981">
        <div
          className="select-none"
          onMouseLeave={() => { setMouseDown(false); setDragging(null); }}
          onMouseUp={() => { setMouseDown(false); setDragging(null); }}
        >
          <div className="grid gap-0" style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            aspectRatio: `${COLS}/${ROWS}`,
          }}>
            {displayGrid.map((row, r) =>
              row.map((cell, c) => {
                const isStart = r === startPos[0] && c === startPos[1];
                const isEnd = r === endPos[0] && c === endPos[1];
                const isPath = cell === CELL.PATH;

                return (
                  <div
                    key={`${r}-${c}`}
                    onMouseDown={() => handleCellEvent(r, c, true)}
                    onMouseEnter={() => handleCellEvent(r, c)}
                    className="aspect-square transition-colors duration-75"
                    style={{
                      backgroundColor: cellColor(cell, r, c),
                      borderColor: cell === CELL.WALL ? "transparent" : "var(--color-border)",
                      borderWidth: "0.5px",
                      borderStyle: "solid",
                      cursor: (player.isPlaying || steps.length > 0) ? "default" : "pointer",
                      borderRadius: isStart || isEnd ? "50%" : "1px",
                      boxShadow: isStart
                        ? "0 0 8px var(--color-primary)"
                        : isEnd
                          ? "0 0 8px #f43f5e"
                          : isPath
                            ? "0 0 4px rgba(250, 204, 21, 0.4)"
                            : "none",
                    }}
                  />
                );
              })
            )}
          </div>
        </div>
      </CanvasPanel>

      {/* Legend */}
      <Legend items={[
        { label: "Start (drag)", color: "var(--color-primary)", rounded: true },
        { label: "End (drag)", color: "#f43f5e", rounded: true },
        { label: "Wall (click)", color: "var(--color-text)" },
        { label: "Visited", color: "rgba(var(--color-primary-rgb), 0.35)" },
        { label: "Path", color: "#facc15" },
      ]} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BINARY TREE VISUALIZER
// ═══════════════════════════════════════════════════════════════════════════════
class TreeNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; }
}

function insertBST(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insertBST(root.left, val);
  else if (val > root.val) root.right = insertBST(root.right, val);
  return root;
}

function treeToLayout(node, depth = 0, pos = 0, spread = 1, nodes = [], edges = []) {
  if (!node) return { nodes, edges };
  const x = pos;
  const y = depth;
  nodes.push({ val: node.val, x, y, id: `${node.val}-${depth}-${pos}` });
  if (node.left) {
    const childX = pos - spread / 2;
    edges.push({ from: { x, y }, to: { x: childX, y: depth + 1 } });
    treeToLayout(node.left, depth + 1, childX, spread / 2, nodes, edges);
  }
  if (node.right) {
    const childX = pos + spread / 2;
    edges.push({ from: { x, y }, to: { x: childX, y: depth + 1 } });
    treeToLayout(node.right, depth + 1, childX, spread / 2, nodes, edges);
  }
  return { nodes, edges };
}

const TRAVERSALS = ["In-Order", "Pre-Order", "Post-Order", "Level-Order"];

function cloneTree(node) {
  if (!node) return null;
  const n = new TreeNode(node.val);
  n.left = cloneTree(node.left);
  n.right = cloneTree(node.right);
  return n;
}

function TreeVisualizer() {
  const [root, setRoot] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const [traversal, setTraversal] = useState("In-Order");
  const [steps, setSteps] = useState([]);
  const canvasRef = useRef(null);
  const player = useAlgoPlayer(steps);

  const insert = () => {
    const val = parseInt(inputVal);
    if (isNaN(val) || val < 1 || val > 99) return;
    setRoot(r => insertBST(cloneTree(r), val));
    setInputVal("");
    setSteps([]);
  };

  const insertRandom = () => {
    const val = Math.floor(Math.random() * 99) + 1;
    setRoot(r => insertBST(cloneTree(r), val));
    setSteps([]);
  };

  const clear = () => {
    setRoot(null);
    setSteps([]);
  };

  const buildDefault = () => {
    let tree = null;
    [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45].forEach(v => { tree = insertBST(tree, v); });
    setRoot(tree);
    setSteps([]);
  };

  const runTraversal = () => {
    if (!root) return;
    const newSteps = generateTraversalSteps(root, traversal);
    setSteps(newSteps);
  };

  const visual = useMemo(() => {
    const step = player.currentStepData;
    if (!step) return { highlighted: new Set(), current: null, traversalOrder: [], dataStructure: null };
    return {
      highlighted: new Set(step.highlighted || []),
      current: step.current,
      traversalOrder: step.traversalOrder || [],
      dataStructure: step.dataStructure || null,
    };
  }, [player.currentStepData]);

  // ── Draw tree on canvas ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width, h = rect.height;
    ctx.clearRect(0, 0, w, h);

    if (!root) {
      const cs = getComputedStyle(document.documentElement);
      ctx.fillStyle = cs.getPropertyValue("--color-text-muted").trim() || "#94A3B8";
      ctx.font = "14px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Insert values to build a tree", w / 2, h / 2);
      return;
    }

    const { nodes, edges } = treeToLayout(root, 0, 0, 4);
    if (nodes.length === 0) return;

    const minX = Math.min(...nodes.map(n => n.x));
    const maxX = Math.max(...nodes.map(n => n.x));
    const maxY = Math.max(...nodes.map(n => n.y));
    const padX = 60, padY = 50;
    const scaleX = maxX === minX ? 1 : (w - padX * 2) / (maxX - minX);
    const scaleY = maxY === 0 ? 1 : (h - padY * 2) / maxY;
    const mapX = (x) => padX + (x - minX) * scaleX;
    const mapY = (y) => padY + y * scaleY;

    const nodeRadius = Math.min(22, w / (nodes.length + 4));

    const cs = getComputedStyle(document.documentElement);
    const primaryColor = cs.getPropertyValue("--color-primary").trim() || "#6366F1";
    const textColor = cs.getPropertyValue("--color-text").trim() || "#333";
    const isDark = document.documentElement.classList.contains("dark");

    // Draw edges with gradient
    edges.forEach(({ from, to }) => {
      const x1 = mapX(from.x), y1 = mapY(from.y);
      const x2 = mapX(to.x), y2 = mapY(to.y);
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)");
      grad.addColorStop(1, isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)");

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(n => {
      const cx = mapX(n.x), cy = mapY(n.y);
      const isHighlighted = visual.highlighted.has(n.val);
      const isCurrent = visual.current === n.val;

      // Glow for current node
      if (isCurrent) {
        ctx.shadowColor = "#f43f5e";
        ctx.shadowBlur = 24;
      } else if (isHighlighted) {
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 16;
      }

      ctx.beginPath();
      ctx.arc(cx, cy, nodeRadius, 0, Math.PI * 2);

      if (isCurrent) {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, nodeRadius);
        grad.addColorStop(0, "#fb7185");
        grad.addColorStop(1, "#f43f5e");
        ctx.fillStyle = grad;
      } else if (isHighlighted) {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, nodeRadius);
        grad.addColorStop(0, `${primaryColor}cc`);
        grad.addColorStop(1, primaryColor);
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)";
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = isCurrent ? "#f43f5e" : isHighlighted ? primaryColor : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)");
      ctx.lineWidth = isCurrent || isHighlighted ? 2.5 : 1.5;
      ctx.stroke();

      ctx.fillStyle = (isCurrent || isHighlighted) ? "#fff" : textColor;
      ctx.font = `bold ${Math.min(14, nodeRadius * 0.8)}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n.val, cx, cy);
    });
  }, [root, visual.highlighted, visual.current]);

  // Keyboard shortcuts
  useEffect(() => {
    const handle = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (steps.length === 0) return;
      switch (e.key) {
        case " ": e.preventDefault(); player.isPlaying ? player.pause() : player.play(); break;
        case "ArrowRight": e.preventDefault(); player.stepForward(); break;
        case "ArrowLeft": e.preventDefault(); player.stepBack(); break;
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [player, steps.length]);

  return (
    <div className="space-y-4">
      {/* Controls — split into build + traverse sections */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Build section */}
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && insert()}
            placeholder="1–99"
            min="1" max="99"
            className="w-20 px-3 py-2 rounded-xl text-sm bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] placeholder:text-[var(--color-text-muted)]/50 transition-all duration-200"
          />
          <ActionButton onClick={insert} icon={Plus}>Insert</ActionButton>
        </div>

        <ActionButton onClick={insertRandom} variant="secondary" icon={Shuffle}>Random</ActionButton>
        <ActionButton onClick={buildDefault} variant="secondary" icon={GitBranch}>Sample</ActionButton>
        <ActionButton onClick={clear} variant="secondary" icon={RotateCcw}>Clear</ActionButton>

        {/* Traverse section */}
        <div className="ml-auto flex items-center gap-2">
          <StyledSelect value={traversal} onChange={e => setTraversal(e.target.value)} options={TRAVERSALS} disabled={player.isPlaying} />
          <ActionButton onClick={runTraversal} disabled={!root || player.isPlaying} icon={Play}>Traverse</ActionButton>
        </div>
      </div>

      {/* Playback controls */}
      <AlgoControls player={player} />

      {/* Step info */}
      <StepInfo algo={traversal} stepData={player.currentStepData} />

      {/* Data structure visualization (stack/queue) */}
      <AnimatePresence>
        {visual.dataStructure && visual.dataStructure.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 py-2.5 rounded-xl bg-[var(--color-surface2)] border border-[var(--color-border)]">
              <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
                {visual.dataStructure.label}
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {visual.dataStructure.items.map((item, i) => (
                  <motion.span
                    key={`${item}-${i}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold"
                    style={{
                      background: "linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.12), rgba(var(--color-primary-rgb), 0.06))",
                      color: "var(--color-primary)",
                      border: "1px solid rgba(var(--color-primary-rgb), 0.2)",
                    }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Traversal result */}
      <AnimatePresence>
        {visual.traversalOrder.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--color-surface2)] border border-[var(--color-border)]"
          >
            <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
              Result
            </span>
            <div className="flex flex-wrap items-center gap-0.5 mt-1.5 font-mono text-sm">
              {visual.traversalOrder.map((v, i) => (
                <motion.span
                  key={`${v}-${i}`}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-0.5"
                >
                  <span className="px-2 py-0.5 rounded-md font-bold" style={{ color: "var(--color-primary)" }}>
                    {v}
                  </span>
                  {i < visual.traversalOrder.length - 1 && (
                    <span className="text-[var(--color-text-muted)]/40 text-xs">→</span>
                  )}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas */}
      <CanvasPanel accent="#f59e0b">
        <canvas ref={canvasRef} className="w-full" style={{ height: "clamp(280px, 45vh, 500px)" }} />
      </CanvasPanel>

      {/* Legend */}
      <Legend items={[
        { label: "Visited", color: "var(--color-primary)", rounded: true },
        { label: "Current", color: "#f43f5e", rounded: true },
        { label: "Unvisited", color: "transparent", rounded: true },
      ]} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════
export default function AlgoVisualizer() {
  return null; // Not used standalone anymore — Lab.jsx imports visualizers directly
}
export { SortingVisualizer, PathfindingVisualizer, TreeVisualizer };
