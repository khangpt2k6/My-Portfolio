import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paintbrush, BarChart3, Grid3X3, GitBranch } from "lucide-react";
import Playground from "../components/Playground";
import {
  SortingVisualizer,
  PathfindingVisualizer,
  TreeVisualizer,
} from "../components/AlgoVisualizer";

const TABS = [
  { id: "playground", label: "Artpad", icon: Paintbrush, accent: "#f43f5e" },
  { id: "sorting", label: "Sorting", icon: BarChart3, accent: "#8b5cf6" },
  { id: "pathfinding", label: "Pathfind", icon: Grid3X3, accent: "#10b981" },
  { id: "tree", label: "Tree", icon: GitBranch, accent: "#f59e0b" },
];

export default function LabApp() {
  const [active, setActive] = useState("playground");
  const tab = TABS.find((t) => t.id === active);

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--window-bg)" }}>
      {/* ── Compact tab bar ── */}
      <div
        className="flex items-center gap-0.5 px-2 py-1.5 border-b"
        style={{ borderColor: "var(--glass-border)" }}
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer"
              style={{
                color: isActive ? "#fff" : "var(--color-text-muted)",
                background: isActive ? t.accent : "transparent",
              }}
            >
              <Icon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Accent line ── */}
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${tab?.accent || "var(--color-primary)"}60, transparent)`,
        }}
      />

      {/* ── Content ── */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full overflow-auto"
          >
            {active === "playground" && (
              <div className="h-full">
                <Playground embedded />
              </div>
            )}
            {active === "sorting" && (
              <div className="p-3 h-full flex flex-col">
                <SortingVisualizer />
              </div>
            )}
            {active === "pathfinding" && (
              <div className="p-3 h-full flex flex-col">
                <PathfindingVisualizer />
              </div>
            )}
            {active === "tree" && (
              <div className="p-3 h-full flex flex-col">
                <TreeVisualizer />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
