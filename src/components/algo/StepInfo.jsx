import { motion, AnimatePresence } from "framer-motion";
import { Info, Clock, Layers, Zap } from "lucide-react";

const ALGO_INFO = {
  "Bubble Sort": { time: "O(n²)", space: "O(1)", desc: "Repeatedly swaps adjacent elements if they are in the wrong order.", color: "#6366f1" },
  "Selection Sort": { time: "O(n²)", space: "O(1)", desc: "Finds the minimum element and places it at the beginning.", color: "#8b5cf6" },
  "Insertion Sort": { time: "O(n²)", space: "O(1)", desc: "Builds the sorted array one element at a time by inserting into position.", color: "#a855f7" },
  "Quick Sort": { time: "O(n log n)", space: "O(log n)", desc: "Picks a pivot and partitions the array around it.", color: "#6366f1" },
  "Merge Sort": { time: "O(n log n)", space: "O(n)", desc: "Divides array in half, sorts each, then merges them.", color: "#8b5cf6" },
  "A* Search": { time: "O(E log V)", space: "O(V)", desc: "Uses heuristic + cost to find shortest path efficiently.", color: "#10b981" },
  "Dijkstra": { time: "O(E log V)", space: "O(V)", desc: "Explores lowest-cost nodes first to find shortest paths.", color: "#14b8a6" },
  "BFS": { time: "O(V + E)", space: "O(V)", desc: "Explores level by level — guarantees shortest unweighted path.", color: "#06b6d4" },
  "DFS": { time: "O(V + E)", space: "O(V)", desc: "Explores as deep as possible before backtracking.", color: "#0ea5e9" },
  "In-Order": { time: "O(n)", space: "O(h)", desc: "Left → Root → Right. Produces sorted order for BST.", color: "#f59e0b" },
  "Pre-Order": { time: "O(n)", space: "O(h)", desc: "Root → Left → Right. Useful for copying/serializing trees.", color: "#f97316" },
  "Post-Order": { time: "O(n)", space: "O(h)", desc: "Left → Right → Root. Useful for deletion/evaluation.", color: "#ef4444" },
  "Level-Order": { time: "O(n)", space: "O(w)", desc: "Visits level by level using a queue (BFS on tree).", color: "#ec4899" },
};

export default function StepInfo({ algo, stepData, stats }) {
  const info = ALGO_INFO[algo];

  return (
    <div className="space-y-2.5">
      {/* Algorithm info badges */}
      {info && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Time complexity badge */}
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold"
            style={{
              background: `linear-gradient(135deg, ${info.color}15, ${info.color}08)`,
              color: info.color,
              border: `1px solid ${info.color}25`,
            }}
          >
            <Clock size={10} />
            Time: {info.time}
          </span>

          {/* Space complexity badge */}
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold"
            style={{
              background: `linear-gradient(135deg, ${info.color}15, ${info.color}08)`,
              color: info.color,
              border: `1px solid ${info.color}25`,
            }}
          >
            <Layers size={10} />
            Space: {info.space}
          </span>

          {/* Description */}
          <span className="text-[11px] text-[var(--color-text-muted)] italic leading-tight">
            {info.desc}
          </span>
        </div>
      )}

      {/* Stats row with animated values */}
      {stats && stats.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {stats.map(({ label, value, color }) => (
            <motion.span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border"
              style={{
                backgroundColor: `${color || "var(--color-primary)"}08`,
                borderColor: `${color || "var(--color-primary)"}20`,
              }}
            >
              <Zap size={10} style={{ color: color || "var(--color-primary)" }} />
              <span className="text-[var(--color-text-muted)]">{label}</span>
              <motion.span
                key={value}
                initial={{ scale: 1.3, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-bold tabular-nums"
                style={{ color: color || "var(--color-primary)" }}
              >
                {value}
              </motion.span>
            </motion.span>
          ))}
        </div>
      )}

      {/* Step description with animated transition */}
      <AnimatePresence mode="wait">
        {stepData?.description && (
          <motion.div
            key={stepData.description}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border"
            style={{
              backgroundColor: "var(--color-surface2)",
              borderColor: "var(--color-border)",
            }}
          >
            <div
              className="mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, #fff))`,
              }}
            >
              <Info size={11} className="text-white" />
            </div>
            <span className="text-sm text-[var(--color-text)] leading-relaxed">
              {stepData.description}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
