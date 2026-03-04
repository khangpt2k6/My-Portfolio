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

// ── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "sorting", label: "Sorting", icon: BarChart3, desc: "Watch algorithms race to sort" },
  { id: "pathfinding", label: "Pathfinding", icon: Grid3X3, desc: "Find the shortest path" },
  { id: "tree", label: "Binary Tree", icon: GitBranch, desc: "Explore tree structures" },
];

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

  // Get current visual state from step
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

  // Derive stats from steps up to current
  const stats = useMemo(() => {
    if (steps.length === 0) return [];
    const upTo = steps.slice(0, player.currentStep + 1);
    const comparisons = upTo.filter(s => s.type === "compare").length;
    const swaps = upTo.filter(s => s.type === "swap").length;
    return [
      { label: "Comparisons", value: comparisons },
      { label: "Swaps", value: swaps },
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
    const barW = w / arr.length;
    const maxVal = 100;

    ctx.clearRect(0, 0, w, h);

    arr.forEach((val, i) => {
      const barH = (val / maxVal) * (h - 10);
      const x = i * barW;
      const y = h - barH;

      let color;
      if (visual.sorted.includes(i)) {
        color = "#34d399";
      } else if (i === visual.pivot) {
        color = "#f59e0b";
      } else if (visual.highlighted.includes(i)) {
        color = "#f43f5e";
      } else {
        const t = val / maxVal;
        const r = Math.round(99 + t * 60);
        const g = Math.round(102 + t * 80);
        const b = 241;
        color = `rgb(${r}, ${g}, ${b})`;
      }

      // Draw bar with rounded top
      const radius = Math.min(barW * 0.3, 4);
      ctx.beginPath();
      ctx.moveTo(x + 1, y + radius);
      ctx.quadraticCurveTo(x + 1, y, x + 1 + radius, y);
      ctx.lineTo(x + barW - 1 - radius, y);
      ctx.quadraticCurveTo(x + barW - 1, y, x + barW - 1, y + radius);
      ctx.lineTo(x + barW - 1, h);
      ctx.lineTo(x + 1, h);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();

      // Glow for highlighted/pivot
      if (visual.highlighted.includes(i) || i === visual.pivot) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Show values on bars when array is small enough
      if (arr.length <= 30) {
        ctx.fillStyle = barH > 20 ? "#fff" : "var(--color-text)";
        ctx.font = `bold ${Math.min(11, barW * 0.5)}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = barH > 20 ? "top" : "bottom";
        ctx.fillText(val, x + barW / 2, barH > 20 ? y + 4 : y - 2);
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
        <div className="relative">
          <select
            value={algo}
            onChange={e => setAlgo(e.target.value)}
            disabled={player.isPlaying}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm font-medium bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer disabled:opacity-50 [&>option]:bg-white [&>option]:dark:bg-zinc-800 [&>option]:text-zinc-900 [&>option]:dark:text-zinc-100"
          >
            {SORT_ALGOS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
        </div>

        <button
          onClick={generate}
          disabled={player.isPlaying}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <Play size={14} /> Visualize
        </button>

        <button onClick={shuffle} disabled={player.isPlaying}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-[var(--color-surface2)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors disabled:opacity-50">
          <Shuffle size={14} /> Randomize
        </button>

        {/* Array size */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-[var(--color-text-muted)]">Size</span>
          <input type="range" min="10" max="100" value={arraySize}
            onChange={e => handleSizeChange(+e.target.value)}
            disabled={player.isPlaying}
            className="w-20 accent-[var(--color-primary)]" />
          <span className="text-xs font-mono text-[var(--color-text-muted)] w-6">{arraySize}</span>
        </div>
      </div>

      {/* Playback controls */}
      <AlgoControls player={player} />

      {/* Step info + stats */}
      <StepInfo algo={algo} stepData={player.currentStepData} stats={stats} />

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
        <canvas ref={canvasRef} className="w-full" style={{ height: "clamp(250px, 40vh, 420px)" }} />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[11px] text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "rgb(130, 142, 241)" }} /> Unsorted</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-rose-500" /> Comparing</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-500" /> Pivot</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-400" /> Sorted</span>
      </div>
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

  // Get current grid from step or base wall grid
  const displayGrid = useMemo(() => {
    const step = player.currentStepData;
    if (!step) return wallGrid;
    return step.grid;
  }, [player.currentStepData, wallGrid]);

  const currentStats = useMemo(() => {
    const step = player.currentStepData;
    if (!step?.stats) return [];
    return [
      { label: "Visited", value: step.stats.visited },
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
        <div className="relative">
          <select value={algo} onChange={e => setAlgo(e.target.value)} disabled={player.isPlaying}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm font-medium bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer disabled:opacity-50 [&>option]:bg-white [&>option]:dark:bg-zinc-800 [&>option]:text-zinc-900 [&>option]:dark:text-zinc-100">
            {PF_ALGOS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
        </div>

        <button onClick={run} disabled={player.isPlaying}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)" }}>
          <Play size={14} /> Find Path
        </button>

        <button onClick={generateMaze} disabled={player.isPlaying}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-[var(--color-surface2)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors disabled:opacity-50">
          <Grid3X3 size={14} /> Generate Maze
        </button>

        <button onClick={resetGrid}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-[var(--color-surface2)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
          <RotateCcw size={14} /> Clear
        </button>
      </div>

      {/* Playback controls */}
      <AlgoControls player={player} />

      {/* Step info */}
      <StepInfo algo={algo} stepData={player.currentStepData} stats={currentStats} />

      {/* Grid */}
      <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-2"
        onMouseLeave={() => { setMouseDown(false); setDragging(null); }}
        onMouseUp={() => { setMouseDown(false); setDragging(null); }}>
        <div className="grid gap-0 select-none" style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          aspectRatio: `${COLS}/${ROWS}`,
        }}>
          {displayGrid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                onMouseDown={() => handleCellEvent(r, c, true)}
                onMouseEnter={() => handleCellEvent(r, c)}
                className="aspect-square border border-[var(--color-border)] transition-colors duration-100"
                style={{
                  backgroundColor: cellColor(cell, r, c),
                  borderColor: cell === CELL.WALL ? "transparent" : undefined,
                  borderWidth: "0.5px",
                  cursor: (player.isPlaying || steps.length > 0) ? "default" : "pointer",
                  borderRadius: (r === startPos[0] && c === startPos[1]) || (r === endPos[0] && c === endPos[1]) ? "50%" : "1px",
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[11px] text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: "var(--color-primary)" }} /> Start (drag)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> End (drag)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "var(--color-text)" }} /> Wall (click)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "rgba(var(--color-primary-rgb), 0.35)" }} /> Visited</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-400" /> Path</span>
      </div>
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

  // Get visual state from step
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
      ctx.fillStyle = "var(--color-text-muted)";
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

    // Draw edges
    edges.forEach(({ from, to }) => {
      ctx.beginPath();
      ctx.moveTo(mapX(from.x), mapY(from.y));
      ctx.lineTo(mapX(to.x), mapY(to.y));
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(n => {
      const cx = mapX(n.x), cy = mapY(n.y);
      const isHighlighted = visual.highlighted.has(n.val);
      const isCurrent = visual.current === n.val;

      if (isCurrent) {
        ctx.shadowColor = "#f43f5e";
        ctx.shadowBlur = 20;
      }

      ctx.beginPath();
      ctx.arc(cx, cy, nodeRadius, 0, Math.PI * 2);
      if (isCurrent) {
        ctx.fillStyle = "#f43f5e";
      } else if (isHighlighted) {
        ctx.fillStyle = primaryColor;
      } else {
        ctx.fillStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = isCurrent ? "#f43f5e" : isHighlighted ? primaryColor : (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)");
      ctx.lineWidth = 2;
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
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && insert()}
            placeholder="Value (1-99)"
            min="1" max="99"
            className="w-28 px-3 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
          <button onClick={insert}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ backgroundColor: "var(--color-primary)" }}>
            <Plus size={14} /> Insert
          </button>
        </div>

        <button onClick={insertRandom}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-[var(--color-surface2)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
          <Shuffle size={14} /> Random
        </button>

        <button onClick={buildDefault}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-[var(--color-surface2)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
          <GitBranch size={14} /> Sample Tree
        </button>

        <button onClick={clear}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-[var(--color-surface2)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
          <RotateCcw size={14} /> Clear
        </button>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <select value={traversal} onChange={e => setTraversal(e.target.value)} disabled={player.isPlaying}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm font-medium bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer disabled:opacity-50 [&>option]:bg-white [&>option]:dark:bg-zinc-800 [&>option]:text-zinc-900 [&>option]:dark:text-zinc-100">
              {TRAVERSALS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
          </div>
          <button onClick={runTraversal} disabled={!root || player.isPlaying}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}>
            <Play size={14} /> Traverse
          </button>
        </div>
      </div>

      {/* Playback controls */}
      <AlgoControls player={player} />

      {/* Step info */}
      <StepInfo algo={traversal} stepData={player.currentStepData} />

      {/* Data structure visualization (stack/queue) */}
      {visual.dataStructure && visual.dataStructure.items.length > 0 && (
        <div className="px-3 py-2 rounded-xl bg-[var(--color-surface2)] border border-[var(--color-border)]">
          <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{visual.dataStructure.label}</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {visual.dataStructure.items.map((item, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md text-xs font-mono bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Traversal result */}
      {visual.traversalOrder.length > 0 && (
        <div className="px-3 py-2 rounded-xl bg-[var(--color-surface2)] border border-[var(--color-border)] text-sm font-mono">
          <span className="text-[var(--color-text-muted)]">Result: </span>
          {visual.traversalOrder.map((v, i) => (
            <span key={i}>
              <span className="text-[var(--color-primary)] font-bold">{v}</span>
              {i < visual.traversalOrder.length - 1 && <span className="text-[var(--color-text-muted)]"> → </span>}
            </span>
          ))}
        </div>
      )}

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
        <canvas ref={canvasRef} className="w-full" style={{ height: "clamp(280px, 45vh, 500px)" }} />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[11px] text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: "var(--color-primary)" }} /> Visited</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> Current</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: "var(--color-surface2)", border: "1px solid var(--color-border)" }} /> Unvisited</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const AlgoVisualizer = () => {
  const [activeTab, setActiveTab] = useState("sorting");

  return (
    <section className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "var(--color-text)" }}>
          Algorithm <span style={{ color: "var(--color-primary)" }}>Visualizer</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm max-w-md mx-auto">
          Interactive step-by-step visualizations. Use <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface2)] border border-[var(--color-border)] text-[10px] font-mono">Space</kbd> to play/pause, <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface2)] border border-[var(--color-border)] text-[10px] font-mono">←→</kbd> to step.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--color-surface2)] border border-[var(--color-border)]">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
                style={{
                  color: isActive ? "#fff" : "var(--color-text-muted)",
                  backgroundColor: isActive ? "var(--color-primary)" : "transparent",
                }}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-2xl p-5 sm:p-6 border border-[var(--color-border)]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "sorting" && <SortingVisualizer />}
            {activeTab === "pathfinding" && <PathfindingVisualizer />}
            {activeTab === "tree" && <TreeVisualizer />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default AlgoVisualizer;
export { SortingVisualizer, PathfindingVisualizer, TreeVisualizer };
