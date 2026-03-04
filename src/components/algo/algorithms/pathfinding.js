// Pure step generators for pathfinding algorithms
// Returns array of steps: { type, cell, grid (2D snapshot), description, stats }

const CELL = { EMPTY: 0, WALL: 1, START: 2, END: 3, VISITED: 4, PATH: 5, FRONTIER: 6 };

function snapGrid(g) {
  return g.map(row => [...row]);
}

export function generatePathSteps(inputGrid, startPos, endPos, algo) {
  const ROWS = inputGrid.length;
  const COLS = inputGrid[0].length;
  const g = inputGrid.map(row => row.map(c => c === CELL.WALL ? CELL.WALL : CELL.EMPTY));
  const [sr, sc] = startPos;
  const [er, ec] = endPos;
  const steps = [];
  const dirs4 = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const dirNames = ["right", "down", "left", "up"];
  const inBounds = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;
  const heuristic = (r, c) => Math.abs(r - er) + Math.abs(c - ec);
  const parent = {};
  let visitCount = 0;

  const markVisited = (r, c) => {
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

  steps.push({ type: "start", cell: startPos, grid: snapGrid(g), description: `Starting ${algo} from (${sr},${sc}) to (${er},${ec})`, stats: { visited: 0, pathLen: 0 } });

  let found = false;

  if (algo === "BFS") {
    const queue = [[sr, sc]];
    const visited = new Set([`${sr},${sc}`]);

    while (queue.length > 0) {
      const [cr, cc] = queue.shift();
      markVisited(cr, cc);

      steps.push({ type: "visit", cell: [cr, cc], grid: snapGrid(g), description: `Visiting (${cr},${cc}). Queue size: ${queue.length}`, stats: { visited: visitCount, pathLen: 0 } });

      if (cr === er && cc === ec) { found = true; break; }

      let addedCount = 0;
      for (let d = 0; d < 4; d++) {
        const [dr, dc] = dirs4[d];
        const nr = cr + dr, nc = cc + dc;
        if (inBounds(nr, nc) && !visited.has(`${nr},${nc}`) && g[nr][nc] !== CELL.WALL && g[nr][nc] !== CELL.VISITED) {
          visited.add(`${nr},${nc}`);
          parent[`${nr},${nc}`] = [cr, cc];
          markFrontier(nr, nc);
          queue.push([nr, nc]);
          addedCount++;
        }
      }

      if (addedCount > 0) {
        steps.push({ type: "frontier", cell: [cr, cc], grid: snapGrid(g), description: `Added ${addedCount} neighbor(s) to queue. Queue size: ${queue.length}`, stats: { visited: visitCount, pathLen: 0 } });
      }
    }
  } else if (algo === "DFS") {
    const stack = [[sr, sc]];
    const visited = new Set([`${sr},${sc}`]);

    while (stack.length > 0) {
      const [cr, cc] = stack.pop();
      markVisited(cr, cc);

      steps.push({ type: "visit", cell: [cr, cc], grid: snapGrid(g), description: `Visiting (${cr},${cc}). Stack depth: ${stack.length}`, stats: { visited: visitCount, pathLen: 0 } });

      if (cr === er && cc === ec) { found = true; break; }

      let addedCount = 0;
      for (let d = 0; d < 4; d++) {
        const [dr, dc] = dirs4[d];
        const nr = cr + dr, nc = cc + dc;
        if (inBounds(nr, nc) && !visited.has(`${nr},${nc}`) && g[nr][nc] !== CELL.WALL && g[nr][nc] !== CELL.VISITED) {
          visited.add(`${nr},${nc}`);
          parent[`${nr},${nc}`] = [cr, cc];
          markFrontier(nr, nc);
          stack.push([nr, nc]);
          addedCount++;
        }
      }

      if (addedCount > 0) {
        steps.push({ type: "frontier", cell: [cr, cc], grid: snapGrid(g), description: `Added ${addedCount} neighbor(s) to stack. Stack depth: ${stack.length}`, stats: { visited: visitCount, pathLen: 0 } });
      }
    }
  } else {
    // A* / Dijkstra
    const open = [[sr, sc, 0, heuristic(sr, sc)]];
    const gScore = { [`${sr},${sc}`]: 0 };

    while (open.length > 0) {
      open.sort((a, b) => algo === "Dijkstra" ? a[2] - b[2] : (a[2] + a[3]) - (b[2] + b[3]));
      const [cr, cc, dist] = open.shift();
      if (g[cr][cc] === CELL.VISITED) continue;
      markVisited(cr, cc);

      const costStr = algo === "A* Search"
        ? `g=${dist}, h=${heuristic(cr, cc)}, f=${dist + heuristic(cr, cc)}`
        : `distance=${dist}`;
      steps.push({ type: "visit", cell: [cr, cc], grid: snapGrid(g), description: `Visiting (${cr},${cc}). ${costStr}. Open set: ${open.length}`, stats: { visited: visitCount, pathLen: 0 } });

      if (cr === er && cc === ec) { found = true; break; }

      let addedCount = 0;
      for (let d = 0; d < 4; d++) {
        const [dr, dc] = dirs4[d];
        const nr = cr + dr, nc = cc + dc;
        if (!inBounds(nr, nc) || g[nr][nc] === CELL.WALL || g[nr][nc] === CELL.VISITED) continue;
        const nd = dist + 1;
        const key = `${nr},${nc}`;
        if (gScore[key] === undefined || nd < gScore[key]) {
          gScore[key] = nd;
          parent[key] = [cr, cc];
          markFrontier(nr, nc);
          open.push([nr, nc, nd, heuristic(nr, nc)]);
          addedCount++;
        }
      }

      if (addedCount > 0) {
        steps.push({ type: "frontier", cell: [cr, cc], grid: snapGrid(g), description: `Expanded ${addedCount} neighbor(s). Open set: ${open.length}`, stats: { visited: visitCount, pathLen: 0 } });
      }
    }
  }

  // Trace path
  if (found) {
    let pathLen = 0;
    const pathCells = [];
    let cur = `${er},${ec}`;
    while (parent[cur]) {
      const [pr, pc] = parent[cur];
      if (!(pr === sr && pc === sc)) {
        g[pr][pc] = CELL.PATH;
        pathCells.unshift([pr, pc]);
      }
      cur = `${pr},${pc}`;
      pathLen++;
    }

    // Add path steps one cell at a time for animation
    const pathGrid = inputGrid.map(row => row.map(c => c === CELL.WALL ? CELL.WALL : CELL.EMPTY));
    // Copy visited state
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (g[r][c] === CELL.VISITED) pathGrid[r][c] = CELL.VISITED;
        if (g[r][c] === CELL.FRONTIER) pathGrid[r][c] = CELL.VISITED;
      }
    }

    for (let i = 0; i < pathCells.length; i++) {
      const [pr, pc] = pathCells[i];
      pathGrid[pr][pc] = CELL.PATH;
      steps.push({ type: "path", cell: [pr, pc], grid: snapGrid(pathGrid), description: `Tracing path... step ${i + 1}/${pathCells.length}`, stats: { visited: visitCount, pathLen: i + 1 } });
    }

    steps.push({ type: "done", cell: endPos, grid: snapGrid(g), description: `Path found! Length: ${pathLen}. Visited ${visitCount} cells.`, stats: { visited: visitCount, pathLen } });
  } else {
    steps.push({ type: "done", cell: null, grid: snapGrid(g), description: `No path found. Visited ${visitCount} cells.`, stats: { visited: visitCount, pathLen: 0 } });
  }

  return steps;
}

export { CELL };
