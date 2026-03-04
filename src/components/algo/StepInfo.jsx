import { motion, AnimatePresence } from "framer-motion";
import { Info, Clock, Layers } from "lucide-react";

const ALGO_INFO = {
  "Bubble Sort": { time: "O(n²)", space: "O(1)", desc: "Repeatedly swaps adjacent elements if they are in the wrong order." },
  "Selection Sort": { time: "O(n²)", space: "O(1)", desc: "Finds the minimum element and places it at the beginning." },
  "Insertion Sort": { time: "O(n²)", space: "O(1)", desc: "Builds the sorted array one element at a time by inserting into position." },
  "Quick Sort": { time: "O(n log n)", space: "O(log n)", desc: "Picks a pivot and partitions the array around it." },
  "Merge Sort": { time: "O(n log n)", space: "O(n)", desc: "Divides array in half, sorts each, then merges them." },
  "A* Search": { time: "O(E log V)", space: "O(V)", desc: "Uses heuristic + cost to find shortest path efficiently." },
  "Dijkstra": { time: "O(E log V)", space: "O(V)", desc: "Explores lowest-cost nodes first to find shortest paths." },
  "BFS": { time: "O(V + E)", space: "O(V)", desc: "Explores level by level — guarantees shortest unweighted path." },
  "DFS": { time: "O(V + E)", space: "O(V)", desc: "Explores as deep as possible before backtracking." },
  "In-Order": { time: "O(n)", space: "O(h)", desc: "Left → Root → Right. Produces sorted order for BST." },
  "Pre-Order": { time: "O(n)", space: "O(h)", desc: "Root → Left → Right. Useful for copying/serializing trees." },
  "Post-Order": { time: "O(n)", space: "O(h)", desc: "Left → Right → Root. Useful for deletion/evaluation." },
  "Level-Order": { time: "O(n)", space: "O(w)", desc: "Visits level by level using a queue (BFS on tree)." },
};

export default function StepInfo({ algo, stepData, stats }) {
  const info = ALGO_INFO[algo];

  return (
    <div className="space-y-2">
      {/* Algorithm info badges */}
      {info && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Clock size={10} /> {info.time}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-violet-500/15 text-violet-600 dark:text-violet-400">
            <Layers size={10} /> {info.space}
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)] italic">{info.desc}</span>
        </div>
      )}

      {/* Stats row */}
      {stats && (
        <div className="flex flex-wrap gap-3 text-xs font-mono">
          {stats.map(({ label, value, color }) => (
            <span key={label} className="px-2.5 py-1 rounded-lg bg-[var(--color-surface2)] text-[var(--color-text-muted)]">
              {label}: <span className="font-bold" style={{ color: color || "var(--color-primary)" }}>{value}</span>
            </span>
          ))}
        </div>
      )}

      {/* Step description — the intuition layer */}
      <AnimatePresence mode="wait">
        {stepData?.description && (
          <motion.div
            key={stepData.description}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-start gap-2 px-3 py-2 rounded-xl bg-[var(--color-surface2)] border border-[var(--color-border)]"
          >
            <Info size={14} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
            <span className="text-sm text-[var(--color-text)]">{stepData.description}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
