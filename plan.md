# Algorithm Visualizer Overhaul Plan

## Problem
Users report the algo visualizer is poor for learning. Current issues:
- No step-by-step playback (play/pause/step forward/back)
- No intuition layer (no text explaining what's happening)
- Algorithms run inline with `await delay()` — can't scrub or go backwards
- No timeline/progress indicator
- Limited interactivity beyond start/stop

## Architecture: State Machine Pattern (Core Change)

Refactor ALL algorithms to **pre-compute steps**, then play them like a movie.

### New shared hook: `useAlgoPlayer(steps)`
```
- steps: Array<{ type, indices, data, description }>
- State: currentStep, isPlaying, speed
- Controls: play(), pause(), stepForward(), stepBack(), seekTo(n)
- Uses requestAnimationFrame for smooth playback
```

Each visualizer generates steps FIRST, then feeds them to the player.

---

## Phase 1: Shared Infrastructure (New Files)

### 1a. `src/components/algo/useAlgoPlayer.js` — Playback engine hook
- Accepts `steps[]` array
- Returns `{ currentStep, totalSteps, isPlaying, play, pause, stepForward, stepBack, seekTo, speed, setSpeed }`
- Uses `requestAnimationFrame` + accumulated delta for frame-rate-independent playback
- Speed presets: 0.25x, 0.5x, 1x, 2x, 4x

### 1b. `src/components/algo/AlgoControls.jsx` — Shared playback controls
- Play/Pause button
- Step Forward / Step Back buttons
- Timeline scrubber (range input showing progress: step N/total)
- Speed selector (dropdown or button group)
- Styled to match existing glass-card / button patterns

### 1c. `src/components/algo/StepInfo.jsx` — Intuition panel
- Shows current step description text (e.g., "Comparing arr[2]=15 with arr[3]=8 → Swap!")
- Step counter badge: "Step 12 / 156"
- Algorithm complexity info (time/space) as small badge
- Animated text transitions with Framer Motion

---

## Phase 2: Sorting Visualizer Rewrite

### 2a. Step generation functions (`src/components/algo/algorithms/sorting.js`)
Pure functions that take an array and return steps:
```js
// Each step: { type: 'compare'|'swap'|'sorted'|'pivot'|'done', indices: [], array: [...], description: string }
function* bubbleSortSteps(arr) { ... yield { type: 'compare', ... } }
function* selectionSortSteps(arr) { ... }
function* insertionSortSteps(arr) { ... }
function* quickSortSteps(arr) { ... }
function* mergeSortSteps(arr) { ... }
```
Using generators so we can collect all steps upfront with `[...bubbleSortSteps(arr)]`.

### 2b. Rewrite `SortingVisualizer`
- On "Sort" click: generate all steps, feed to `useAlgoPlayer`
- Canvas renders based on `steps[currentStep]` snapshot
- Add array size slider (20-100, default 50)
- Show bar values on top when array size ≤ 30
- Smooth bar transitions using interpolation between step snapshots
- Keep existing rounded-bar canvas style + glow effects
- Intuition text: "Comparing arr[2]=15 with arr[3]=8", "Swapping!", "Pivot selected: 42"
- Color consistency: indigo=unsorted, rose=comparing, amber=pivot, emerald=sorted

### 2c. Enhanced stats panel
- Comparisons + Swaps counters (derived from steps up to currentStep)
- Time complexity badge (e.g., "O(n²)" for bubble sort)
- Small algorithm description tooltip

---

## Phase 3: Pathfinding Visualizer Rewrite

### 3a. Step generation (`src/components/algo/algorithms/pathfinding.js`)
```js
// Each step: { type: 'visit'|'frontier'|'path'|'done', cell: [r,c], grid: snapshot, description: string }
function generatePathSteps(grid, start, end, algo) { ... }
```

### 3b. Rewrite `PathfindingVisualizer`
- Pre-compute all steps when "Find Path" is clicked
- Play/pause/step/scrub using shared controls
- Keep existing grid interaction (draw walls, drag start/end)
- Add speed control (currently fixed 12ms)
- Intuition text: "Visiting (5,3), distance from start: 7", "Adding 3 neighbors to frontier"
- Show distance values in cells for A*/Dijkstra (small text overlay)
- Smoother cell color transitions (CSS transition on background-color)

---

## Phase 4: Tree Visualizer Rewrite

### 4a. Step generation (`src/components/algo/algorithms/tree.js`)
```js
// Each step: { type: 'visit'|'go_left'|'go_right'|'backtrack'|'done', nodeVal, highlighted: Set, description: string }
function generateTraversalSteps(root, traversalType) { ... }
```

### 4b. Rewrite `TreeVisualizer`
- Pre-compute traversal steps, use shared player
- Intuition text: "Visiting node 30", "Going to left child 20", "Backtracking to 50"
- Show call stack / queue state visually (small panel beside tree)
- Keep existing canvas rendering + node glow effects
- Add node deletion (click node to remove)
- Result array building: show values being added to result in real-time

---

## Phase 5: Polish

- Keyboard shortcuts: Space=play/pause, Arrow Left/Right=step, [ ]=speed
- Responsive: stack controls vertically on mobile
- Color legend always visible per visualizer
- Ensure dark/light mode works for all new elements

---

## Files Changed/Created

### New files:
1. `src/components/algo/useAlgoPlayer.js`
2. `src/components/algo/AlgoControls.jsx`
3. `src/components/algo/StepInfo.jsx`
4. `src/components/algo/algorithms/sorting.js`
5. `src/components/algo/algorithms/pathfinding.js`
6. `src/components/algo/algorithms/tree.js`

### Modified files:
7. `src/components/AlgoVisualizer.jsx` — Major rewrite of all 3 visualizers to use step-based pattern

### NOT changed:
- `src/pages/Lab.jsx` — No changes needed (already imports from AlgoVisualizer)

---

## Key Principles
- **State machine**: Pre-compute steps → play like a movie → scrub freely
- **Intuition first**: Every step has a human-readable description
- **Consistent colors**: Same meaning across all visualizers
- **Smooth motion**: requestAnimationFrame, CSS transitions, interpolation
- **Interactivity**: Step forward/back, timeline scrubbing, speed control, keyboard shortcuts
