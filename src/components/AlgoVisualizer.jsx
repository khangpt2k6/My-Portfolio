import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, GitBranch, Grid3X3, Play, Pause, RotateCcw,
  Shuffle, ChevronDown, Zap, Minus, Plus
} from "lucide-react";

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
  const [sorting, setSorting] = useState(false);
  const [algo, setAlgo] = useState("Quick Sort");
  const [speed, setSpeed] = useState(20);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [highlighted, setHighlighted] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [pivot, setPivot] = useState(-1);
  const stopRef = useRef(false);
  const canvasRef = useRef(null);

  const delay = useCallback(() => new Promise(r => setTimeout(r, Math.max(1, 100 - speed * 2))), [speed]);

  const reset = () => {
    stopRef.current = true;
    setTimeout(() => {
      stopRef.current = false;
      setArray(generateArray(50));
      setComparisons(0);
      setSwaps(0);
      setHighlighted([]);
      setSorted([]);
      setPivot(-1);
      setSorting(false);
    }, 50);
  };

  const shuffle = () => {
    if (sorting) return;
    setArray(generateArray(50));
    setComparisons(0);
    setSwaps(0);
    setSorted([]);
  };

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
    const barW = w / array.length;
    const maxVal = 100;

    ctx.clearRect(0, 0, w, h);

    array.forEach((val, i) => {
      const barH = (val / maxVal) * (h - 10);
      const x = i * barW;
      const y = h - barH;

      let color;
      if (sorted.includes(i)) {
        color = "#34d399"; // green for sorted
      } else if (i === pivot) {
        color = "#f59e0b"; // amber for pivot
      } else if (highlighted.includes(i)) {
        color = "#f43f5e"; // red for comparing
      } else {
        // gradient based on value
        const t = val / maxVal;
        const r = Math.round(99 + t * 60);
        const g = Math.round(102 + t * 80);
        const b = Math.round(241);
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

      // subtle glow for highlighted
      if (highlighted.includes(i) || i === pivot) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });
  }, [array, highlighted, sorted, pivot]);

  // ── Sorting algorithms ───────────────────────────────────────────────────
  const sort = async () => {
    setSorting(true);
    setComparisons(0);
    setSwaps(0);
    setSorted([]);
    setPivot(-1);
    stopRef.current = false;

    const arr = [...array];
    let compCount = 0;
    let swapCount = 0;

    const update = (h = [], p = -1) => {
      if (stopRef.current) throw new Error("stopped");
      setArray([...arr]);
      setHighlighted(h);
      setPivot(p);
      setComparisons(compCount);
      setSwaps(swapCount);
    };

    const swap = (i, j) => { [arr[i], arr[j]] = [arr[j], arr[i]]; swapCount++; };

    try {
      switch (algo) {
        case "Bubble Sort": {
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
              compCount++;
              update([j, j + 1]);
              if (arr[j] > arr[j + 1]) { swap(j, j + 1); update([j, j + 1]); }
              await delay();
            }
            setSorted(prev => [...prev, arr.length - i - 1]);
          }
          break;
        }
        case "Selection Sort": {
          for (let i = 0; i < arr.length; i++) {
            let minIdx = i;
            for (let j = i + 1; j < arr.length; j++) {
              compCount++;
              update([j, minIdx], i);
              if (arr[j] < arr[minIdx]) minIdx = j;
              await delay();
            }
            if (minIdx !== i) { swap(i, minIdx); update([i, minIdx]); }
            setSorted(prev => [...prev, i]);
            await delay();
          }
          break;
        }
        case "Insertion Sort": {
          setSorted([0]);
          for (let i = 1; i < arr.length; i++) {
            let j = i;
            while (j > 0 && arr[j - 1] > arr[j]) {
              compCount++;
              swap(j, j - 1);
              update([j, j - 1]);
              j--;
              await delay();
            }
            compCount++;
            setSorted(prev => [...prev, i]);
          }
          break;
        }
        case "Quick Sort": {
          const qs = async (lo, hi) => {
            if (lo >= hi || stopRef.current) return;
            const pivotVal = arr[hi];
            update([], hi);
            let i = lo;
            for (let j = lo; j < hi; j++) {
              compCount++;
              update([j, i], hi);
              if (arr[j] < pivotVal) { swap(i, j); update([j, i], hi); i++; }
              await delay();
            }
            swap(i, hi);
            update([i], -1);
            setSorted(prev => [...prev, i]);
            await delay();
            await qs(lo, i - 1);
            await qs(i + 1, hi);
          };
          await qs(0, arr.length - 1);
          break;
        }
        case "Merge Sort": {
          const ms = async (lo, hi) => {
            if (lo >= hi || stopRef.current) return;
            const mid = Math.floor((lo + hi) / 2);
            await ms(lo, mid);
            await ms(mid + 1, hi);
            // merge
            const left = arr.slice(lo, mid + 1);
            const right = arr.slice(mid + 1, hi + 1);
            let i = 0, j = 0, k = lo;
            while (i < left.length && j < right.length) {
              compCount++;
              update([k], -1);
              if (left[i] <= right[j]) { arr[k] = left[i]; i++; }
              else { arr[k] = right[j]; j++; }
              k++;
              swapCount++;
              update([k - 1]);
              await delay();
            }
            while (i < left.length) { arr[k] = left[i]; i++; k++; update([k - 1]); await delay(); }
            while (j < right.length) { arr[k] = right[j]; j++; k++; update([k - 1]); await delay(); }
          };
          await ms(0, arr.length - 1);
          break;
        }
      }

      // Mark all as sorted
      setSorted(arr.map((_, i) => i));
      setHighlighted([]);
      setPivot(-1);
    } catch {
      // stopped
    }
    setSorting(false);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={algo}
            onChange={e => setAlgo(e.target.value)}
            disabled={sorting}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm font-medium bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer disabled:opacity-50 [&>option]:bg-white [&>option]:dark:bg-zinc-800 [&>option]:text-zinc-900 [&>option]:dark:text-zinc-100"
          >
            {SORT_ALGOS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
        </div>

        <button
          onClick={sorting ? () => { stopRef.current = true; } : sort}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{ backgroundColor: sorting ? "#f43f5e" : "var(--color-primary)" }}
        >
          {sorting ? <><Pause size={14} /> Stop</> : <><Play size={14} /> Sort</>}
        </button>

        <button onClick={shuffle} disabled={sorting}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-[var(--color-surface2)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors disabled:opacity-50">
          <Shuffle size={14} /> Randomize
        </button>

        <button onClick={reset} disabled={!sorting}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-[var(--color-surface2)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors disabled:opacity-50">
          <RotateCcw size={14} /> Reset
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-[var(--color-text-muted)]">Speed</span>
          <input type="range" min="1" max="50" value={speed} onChange={e => setSpeed(+e.target.value)}
            className="w-20 accent-[var(--color-primary)]" />
          <Zap size={12} className="text-[var(--color-primary)]" />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs font-mono">
        <span className="px-3 py-1 rounded-lg bg-[var(--color-surface2)] text-[var(--color-text-muted)]">
          Comparisons: <span className="text-[var(--color-primary)] font-bold">{comparisons}</span>
        </span>
        <span className="px-3 py-1 rounded-lg bg-[var(--color-surface2)] text-[var(--color-text-muted)]">
          Swaps: <span className="text-[var(--color-primary)] font-bold">{swaps}</span>
        </span>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
        <canvas ref={canvasRef} className="w-full" style={{ height: "clamp(250px, 40vh, 420px)" }} />
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[11px] text-[var(--color-text-muted)]">
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

const CELL = { EMPTY: 0, WALL: 1, START: 2, END: 3, VISITED: 4, PATH: 5, FRONTIER: 6 };

function PathfindingVisualizer() {
  const ROWS = 21;
  const COLS = 41;
  const [grid, setGrid] = useState(() => makeGrid(ROWS, COLS));
  const [algo, setAlgo] = useState("A* Search");
  const [running, setRunning] = useState(false);
  const [startPos, setStartPos] = useState([10, 5]);
  const [endPos, setEndPos] = useState([10, 35]);
  const [mouseDown, setMouseDown] = useState(false);
  const [dragging, setDragging] = useState(null); // "start" | "end" | null
  const [stats, setStats] = useState({ visited: 0, pathLen: 0 });
  const stopRef = useRef(false);

  function makeGrid(rows, cols) {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => CELL.EMPTY));
  }

  const resetGrid = () => {
    stopRef.current = true;
    setTimeout(() => {
      stopRef.current = false;
      setGrid(makeGrid(ROWS, COLS));
      setStartPos([10, 5]);
      setEndPos([10, 35]);
      setStats({ visited: 0, pathLen: 0 });
      setRunning(false);
    }, 50);
  };

  const clearPath = () => {
    setGrid(g => g.map(row => row.map(c => c === CELL.VISITED || c === CELL.PATH || c === CELL.FRONTIER ? CELL.EMPTY : c)));
    setStats({ visited: 0, pathLen: 0 });
  };

  const generateMaze = () => {
    if (running) return;
    const g = makeGrid(ROWS, COLS);
    // Recursive backtracker maze
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
    // Ensure start and end are clear
    const [sr, sc] = [1, 1];
    const [er, ec] = [ROWS - 2, COLS - 2];
    g[sr][sc] = CELL.EMPTY; g[er][ec] = CELL.EMPTY;
    setStartPos([sr, sc]); setEndPos([er, ec]);
    setGrid(g);
    setStats({ visited: 0, pathLen: 0 });
  };

  const handleCellEvent = (r, c, isDown = false) => {
    if (running) return;
    if (isDown) {
      if (r === startPos[0] && c === startPos[1]) { setDragging("start"); return; }
      if (r === endPos[0] && c === endPos[1]) { setDragging("end"); return; }
      setMouseDown(true);
    }
    if (dragging === "start") { setStartPos([r, c]); return; }
    if (dragging === "end") { setEndPos([r, c]); return; }
    if (!mouseDown && !isDown) return;
    setGrid(g => {
      const ng = g.map(row => [...row]);
      if (r === startPos[0] && c === startPos[1]) return ng;
      if (r === endPos[0] && c === endPos[1]) return ng;
      ng[r][c] = ng[r][c] === CELL.WALL ? CELL.EMPTY : CELL.WALL;
      return ng;
    });
  };

  const run = async () => {
    clearPath();
    setRunning(true);
    stopRef.current = false;

    const g = grid.map(row => row.map(c => c === CELL.WALL ? CELL.WALL : CELL.EMPTY));
    const [sr, sc] = startPos;
    const [er, ec] = endPos;

    const delay = () => new Promise(r => setTimeout(r, 12));
    const dirs4 = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const inBounds = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;
    const heuristic = (r, c) => Math.abs(r - er) + Math.abs(c - ec);

    const parent = {};
    let visitCount = 0;

    const markVisited = (r, c) => {
      if (stopRef.current) throw new Error("stopped");
      if (!(r === sr && c === sc) && !(r === er && c === ec)) {
        g[r][c] = CELL.VISITED;
      }
      visitCount++;
    };

    const markFrontier = (r, c) => {
      if (!(r === sr && c === sc) && !(r === er && c === ec) && g[r][c] === CELL.EMPTY) {
        g[r][c] = CELL.FRONTIER;
      }
    };

    const batchUpdate = () => {
      setGrid(g.map(row => [...row]));
      setStats(s => ({ ...s, visited: visitCount }));
    };

    try {
      if (algo === "BFS") {
        const queue = [[sr, sc]];
        const visited = new Set([`${sr},${sc}`]);
        let steps = 0;
        while (queue.length > 0) {
          const [cr, cc] = queue.shift();
          markVisited(cr, cc);
          if (cr === er && cc === ec) break;
          for (const [dr, dc] of dirs4) {
            const nr = cr + dr, nc = cc + dc;
            if (inBounds(nr, nc) && !visited.has(`${nr},${nc}`) && g[nr][nc] !== CELL.WALL && g[nr][nc] !== CELL.VISITED) {
              visited.add(`${nr},${nc}`);
              parent[`${nr},${nc}`] = [cr, cc];
              markFrontier(nr, nc);
              queue.push([nr, nc]);
            }
          }
          if (++steps % 3 === 0) { batchUpdate(); await delay(); }
        }
      } else if (algo === "DFS") {
        const stack = [[sr, sc]];
        const visited = new Set([`${sr},${sc}`]);
        let steps = 0;
        while (stack.length > 0) {
          const [cr, cc] = stack.pop();
          markVisited(cr, cc);
          if (cr === er && cc === ec) break;
          for (const [dr, dc] of dirs4) {
            const nr = cr + dr, nc = cc + dc;
            if (inBounds(nr, nc) && !visited.has(`${nr},${nc}`) && g[nr][nc] !== CELL.WALL && g[nr][nc] !== CELL.VISITED) {
              visited.add(`${nr},${nc}`);
              parent[`${nr},${nc}`] = [cr, cc];
              markFrontier(nr, nc);
              stack.push([nr, nc]);
            }
          }
          if (++steps % 2 === 0) { batchUpdate(); await delay(); }
        }
      } else {
        // A* / Dijkstra
        const open = [[sr, sc, 0, heuristic(sr, sc)]];
        const gScore = { [`${sr},${sc}`]: 0 };
        let steps = 0;
        while (open.length > 0) {
          open.sort((a, b) => (algo === "Dijkstra" ? a[2] - b[2] : (a[2] + a[3]) - (b[2] + b[3])));
          const [cr, cc, dist] = open.shift();
          if (g[cr][cc] === CELL.VISITED) continue;
          markVisited(cr, cc);
          if (cr === er && cc === ec) break;
          for (const [dr, dc] of dirs4) {
            const nr = cr + dr, nc = cc + dc;
            if (!inBounds(nr, nc) || g[nr][nc] === CELL.WALL || g[nr][nc] === CELL.VISITED) continue;
            const nd = dist + 1;
            const key = `${nr},${nc}`;
            if (gScore[key] === undefined || nd < gScore[key]) {
              gScore[key] = nd;
              parent[key] = [cr, cc];
              markFrontier(nr, nc);
              open.push([nr, nc, nd, heuristic(nr, nc)]);
            }
          }
          if (++steps % 3 === 0) { batchUpdate(); await delay(); }
        }
      }

      // Trace path
      let pathLen = 0;
      let cur = `${er},${ec}`;
      while (parent[cur]) {
        const [pr, pc] = parent[cur];
        if (!(pr === sr && pc === sc)) g[pr][pc] = CELL.PATH;
        cur = `${pr},${pc}`;
        pathLen++;
        if (pathLen % 2 === 0) { batchUpdate(); await delay(); }
      }
      setStats({ visited: visitCount, pathLen });
      batchUpdate();
    } catch {
      // stopped
    }
    setRunning(false);
  };

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

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select value={algo} onChange={e => setAlgo(e.target.value)} disabled={running}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm font-medium bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer disabled:opacity-50 [&>option]:bg-white [&>option]:dark:bg-zinc-800 [&>option]:text-zinc-900 [&>option]:dark:text-zinc-100">
            {PF_ALGOS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
        </div>

        <button onClick={running ? () => { stopRef.current = true; } : run}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{ backgroundColor: running ? "#f43f5e" : "var(--color-primary)" }}>
          {running ? <><Pause size={14} /> Stop</> : <><Play size={14} /> Find Path</>}
        </button>

        <button onClick={generateMaze} disabled={running}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-[var(--color-surface2)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors disabled:opacity-50">
          <Grid3X3 size={14} /> Generate Maze
        </button>

        <button onClick={resetGrid}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-[var(--color-surface2)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors">
          <RotateCcw size={14} /> Clear
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs font-mono">
        <span className="px-3 py-1 rounded-lg bg-[var(--color-surface2)] text-[var(--color-text-muted)]">
          Visited: <span className="text-[var(--color-primary)] font-bold">{stats.visited}</span>
        </span>
        <span className="px-3 py-1 rounded-lg bg-[var(--color-surface2)] text-[var(--color-text-muted)]">
          Path: <span className="text-yellow-400 font-bold">{stats.pathLen}</span>
        </span>
      </div>

      {/* Grid */}
      <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-2"
        onMouseLeave={() => { setMouseDown(false); setDragging(null); }}
        onMouseUp={() => { setMouseDown(false); setDragging(null); }}>
        <div className="grid gap-0 select-none" style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          aspectRatio: `${COLS}/${ROWS}`,
        }}>
          {grid.map((row, r) =>
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
                  cursor: running ? "default" : "pointer",
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

function TreeVisualizer() {
  const [root, setRoot] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const [highlighted, setHighlighted] = useState(new Set());
  const [current, setCurrent] = useState(null);
  const [traversal, setTraversal] = useState("In-Order");
  const [traversing, setTraversing] = useState(false);
  const [traversalOrder, setTraversalOrder] = useState([]);
  const canvasRef = useRef(null);
  const stopRef = useRef(false);

  const insert = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    setRoot(r => insertBST(r ? JSON.parse(JSON.stringify(r, (_, v) => v === undefined ? null : v)) : null, val) || new TreeNode(val));
    setInputVal("");
    setHighlighted(new Set());
    setCurrent(null);
    setTraversalOrder([]);
  };

  // Deep clone for BST insert (since we use class instances)
  useEffect(() => {
    // Re-clone root from scratch for clean state after re-renders
  }, []);

  const insertRandom = () => {
    const val = Math.floor(Math.random() * 99) + 1;
    setRoot(r => {
      const clone = cloneTree(r);
      return insertBST(clone, val);
    });
    setHighlighted(new Set());
    setCurrent(null);
    setTraversalOrder([]);
  };

  const cloneTree = (node) => {
    if (!node) return null;
    const n = new TreeNode(node.val);
    n.left = cloneTree(node.left);
    n.right = cloneTree(node.right);
    return n;
  };

  const clear = () => {
    stopRef.current = true;
    setTimeout(() => {
      stopRef.current = false;
      setRoot(null);
      setHighlighted(new Set());
      setCurrent(null);
      setTraversalOrder([]);
      setTraversing(false);
    }, 50);
  };

  const buildDefault = () => {
    let tree = null;
    [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45].forEach(v => { tree = insertBST(tree, v); });
    setRoot(tree);
    setHighlighted(new Set());
    setCurrent(null);
    setTraversalOrder([]);
  };

  const runTraversal = async () => {
    if (!root) return;
    setTraversing(true);
    stopRef.current = false;
    setHighlighted(new Set());
    setTraversalOrder([]);

    const order = [];
    const delay = () => new Promise(r => setTimeout(r, 500));

    const visit = async (val) => {
      if (stopRef.current) throw new Error("stopped");
      setCurrent(val);
      await delay();
      order.push(val);
      setTraversalOrder([...order]);
      setHighlighted(new Set(order));
      setCurrent(null);
    };

    try {
      switch (traversal) {
        case "In-Order": {
          const go = async (n) => { if (!n || stopRef.current) return; await go(n.left); await visit(n.val); await go(n.right); };
          await go(root);
          break;
        }
        case "Pre-Order": {
          const go = async (n) => { if (!n || stopRef.current) return; await visit(n.val); await go(n.left); await go(n.right); };
          await go(root);
          break;
        }
        case "Post-Order": {
          const go = async (n) => { if (!n || stopRef.current) return; await go(n.left); await go(n.right); await visit(n.val); };
          await go(root);
          break;
        }
        case "Level-Order": {
          const queue = [root];
          while (queue.length > 0 && !stopRef.current) {
            const node = queue.shift();
            await visit(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
          }
          break;
        }
      }
    } catch { /* stopped */ }
    setTraversing(false);
  };

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

    // Calculate bounds
    const minX = Math.min(...nodes.map(n => n.x));
    const maxX = Math.max(...nodes.map(n => n.x));
    const maxY = Math.max(...nodes.map(n => n.y));
    const padX = 60, padY = 50;
    const scaleX = maxX === minX ? 1 : (w - padX * 2) / (maxX - minX);
    const scaleY = maxY === 0 ? 1 : (h - padY * 2) / maxY;
    const mapX = (x) => padX + (x - minX) * scaleX;
    const mapY = (y) => padY + y * scaleY;

    const nodeRadius = Math.min(22, w / (nodes.length + 4));

    // Get computed styles
    const cs = getComputedStyle(document.documentElement);
    const primaryColor = cs.getPropertyValue("--color-primary").trim() || "#6366F1";
    const textColor = cs.getPropertyValue("--color-text").trim() || "#333";
    const mutedColor = cs.getPropertyValue("--color-text-muted").trim() || "#999";
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
      const isHighlighted = highlighted.has(n.val);
      const isCurrent = current === n.val;

      // Glow for current
      if (isCurrent) {
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 20;
      }

      // Circle
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

      // Border
      ctx.strokeStyle = isCurrent ? "#f43f5e" : isHighlighted ? primaryColor : (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)");
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.fillStyle = (isCurrent || isHighlighted) ? "#fff" : textColor;
      ctx.font = `bold ${Math.min(14, nodeRadius * 0.8)}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n.val, cx, cy);
    });
  }, [root, highlighted, current]);

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
            <select value={traversal} onChange={e => setTraversal(e.target.value)} disabled={traversing}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm font-medium bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer disabled:opacity-50 [&>option]:bg-white [&>option]:dark:bg-zinc-800 [&>option]:text-zinc-900 [&>option]:dark:text-zinc-100">
              {TRAVERSALS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
          </div>
          <button onClick={traversing ? () => { stopRef.current = true; } : runTraversal} disabled={!root}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: traversing ? "#f43f5e" : "var(--color-primary)" }}>
            {traversing ? <><Pause size={14} /> Stop</> : <><Play size={14} /> Traverse</>}
          </button>
        </div>
      </div>

      {/* Traversal output */}
      {traversalOrder.length > 0 && (
        <div className="px-3 py-2 rounded-xl bg-[var(--color-surface2)] border border-[var(--color-border)] text-sm font-mono">
          <span className="text-[var(--color-text-muted)]">Traversal: </span>
          {traversalOrder.map((v, i) => (
            <span key={i}>
              <span className="text-[var(--color-primary)] font-bold">{v}</span>
              {i < traversalOrder.length - 1 && <span className="text-[var(--color-text-muted)]"> → </span>}
            </span>
          ))}
        </div>
      )}

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
        <canvas ref={canvasRef} className="w-full" style={{ height: "clamp(280px, 45vh, 500px)" }} />
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
          Interactive visualizations of sorting algorithms, pathfinding, and data structures.
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
