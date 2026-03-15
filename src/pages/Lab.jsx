import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Paintbrush, BarChart3, Grid3X3, GitBranch, FlaskConical, Sparkles, ChevronRight } from "lucide-react";
import Playground from "../components/Playground";
import { SortingVisualizer, PathfindingVisualizer, TreeVisualizer } from "../components/AlgoVisualizer";

// ── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "playground",
    label: "Artpad",
    icon: Paintbrush,
    desc: "Draw, paint & create art",
    gradient: "from-pink-500 to-rose-500",
    bgGlow: "bg-rose-500/20",
    accent: "#f43f5e",
  },
  {
    id: "sorting",
    label: "Sorting",
    icon: BarChart3,
    desc: "Watch algorithms race to sort",
    gradient: "from-violet-500 to-indigo-500",
    bgGlow: "bg-violet-500/20",
    accent: "#8b5cf6",
  },
  {
    id: "pathfinding",
    label: "Pathfinding",
    icon: Grid3X3,
    desc: "Find the shortest path",
    gradient: "from-emerald-500 to-teal-500",
    bgGlow: "bg-emerald-500/20",
    accent: "#10b981",
  },
  {
    id: "tree",
    label: "Binary Tree",
    icon: GitBranch,
    desc: "Explore tree structures",
    gradient: "from-amber-500 to-orange-500",
    bgGlow: "bg-amber-500/20",
    accent: "#f59e0b",
  },
];

// ── Floating orb decoration ─────────────────────────────────────────────────
const FloatingOrb = ({ size, x, y, color, delay }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      background: color,
      opacity: 0.12,
    }}
    animate={{
      y: [0, -30, 0, 20, 0],
      x: [0, 15, -10, 5, 0],
      scale: [1, 1.1, 0.95, 1.05, 1],
    }}
    transition={{
      duration: 12,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// ── Tab card with tilt effect ───────────────────────────────────────────────
function TabCard({ tab, isActive, onClick }) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const Icon = tab.icon;

  return (
    <motion.button
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 800 }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex flex-col items-center gap-2 p-4 sm:p-5 rounded-2xl text-center transition-all duration-300 cursor-pointer w-full"
    >
      {/* Animated border glow */}
      {isActive && (
        <motion.div
          layoutId="tab-glow"
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${tab.accent}30, ${tab.accent}10)`,
            border: `1.5px solid ${tab.accent}60`,
            boxShadow: `0 0 30px ${tab.accent}20, inset 0 1px 0 ${tab.accent}15`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Inactive border */}
      {!isActive && (
        <div
          className="absolute inset-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 group-hover:border-[var(--color-primary)]/30 group-hover:bg-[var(--color-surface2)]/80 transition-all duration-300"
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Icon with gradient background */}
        <div
          className={`relative mx-auto mb-2 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isActive
              ? `bg-gradient-to-br ${tab.gradient} shadow-lg`
              : "bg-[var(--color-surface2)] group-hover:bg-[var(--color-surface2)]"
          }`}
          style={isActive ? { boxShadow: `0 8px 24px ${tab.accent}35` } : {}}
        >
          <Icon
            size={20}
            className={`transition-colors duration-300 ${
              isActive ? "text-white" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]"
            }`}
          />
          {/* Sparkle indicator */}
          {isActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white shadow-md flex items-center justify-center"
            >
              <Sparkles size={7} style={{ color: tab.accent }} />
            </motion.div>
          )}
        </div>

        <span
          className={`text-sm font-semibold transition-colors duration-300 ${
            isActive ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]"
          }`}
        >
          {tab.label}
        </span>

        <p
          className={`text-[10px] mt-0.5 transition-colors duration-300 leading-tight ${
            isActive ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-muted)]/60"
          }`}
        >
          {tab.desc}
        </p>
      </div>
    </motion.button>
  );
}

// ── Breadcrumb indicator ────────────────────────────────────────────────────
function BreadcrumbBar({ activeTab }) {
  const tab = TABS.find((t) => t.id === activeTab);
  if (!tab) return null;
  const Icon = tab.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 mb-5"
    >
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface2)] border border-[var(--color-border)]">
        <FlaskConical size={12} className="text-[var(--color-text-muted)]" />
        <span className="text-[11px] text-[var(--color-text-muted)] font-medium">Lab</span>
        <ChevronRight size={10} className="text-[var(--color-text-muted)]/50" />
        <Icon size={12} style={{ color: tab.accent }} />
        <span className="text-[11px] font-semibold" style={{ color: tab.accent }}>
          {tab.label}
        </span>
      </div>

      {/* Keyboard hint */}
      <div className="hidden sm:flex items-center gap-1 ml-auto text-[10px] text-[var(--color-text-muted)]/60">
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface2)] border border-[var(--color-border)] font-mono">
          Space
        </kbd>
        <span>play/pause</span>
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface2)] border border-[var(--color-border)] font-mono ml-1">
          ← →
        </kbd>
        <span>step</span>
      </div>
    </motion.div>
  );
}

// ── Main Lab Page ───────────────────────────────────────────────────────────
const Lab = () => {
  const [activeTab, setActiveTab] = useState("playground");
  const activeTabData = TABS.find((t) => t.id === activeTab);

  return (
    <section className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Decorative floating orbs */}
      <FloatingOrb size={300} x="5%" y="10%" color="#6366f1" delay={0} />
      <FloatingOrb size={200} x="75%" y="5%" color="#f43f5e" delay={2} />
      <FloatingOrb size={250} x="60%" y="60%" color="#10b981" delay={4} />
      <FloatingOrb size={180} x="10%" y="70%" color="#f59e0b" delay={6} />

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10 relative z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 mb-5"
        >
          <FlaskConical size={14} className="text-[var(--color-primary)]" />
          <span className="text-xs font-semibold text-[var(--color-primary)] tracking-wide uppercase">
            Interactive Lab
          </span>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight" style={{ color: "var(--color-text)" }}>
          Experiment &{" "}
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r"
            style={{
              backgroundImage: `linear-gradient(135deg, var(--color-primary), ${activeTabData?.accent || "var(--color-primary)"})`,
            }}
          >
            Explore
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-[var(--color-text-muted)] text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
        >
          Paint masterpieces, visualize sorting algorithms, discover pathfinding, and explore data structures — all in your browser.
        </motion.p>
      </motion.div>

      {/* ── Tab Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 max-w-3xl mx-auto relative z-10"
      >
        {TABS.map((tab, i) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <TabCard
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Breadcrumb ── */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <BreadcrumbBar key={activeTab} activeTab={activeTab} />
        </AnimatePresence>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === "playground" && <Playground embedded />}
            {activeTab !== "playground" && (
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: "var(--glass-bg, var(--color-surface))",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid var(--color-border)",
                  boxShadow: `0 0 60px ${activeTabData?.accent || "var(--color-primary)"}08, 0 4px 40px rgba(0,0,0,0.06)`,
                }}
              >
                {/* Accent line at top */}
                <div
                  className="h-[2px] w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${activeTabData?.accent || "var(--color-primary)"}60, transparent)`,
                  }}
                />
                <div className="p-5 sm:p-6">
                  {activeTab === "sorting" && <SortingVisualizer />}
                  {activeTab === "pathfinding" && <PathfindingVisualizer />}
                  {activeTab === "tree" && <TreeVisualizer />}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Lab;
