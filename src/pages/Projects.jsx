import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Github, ExternalLink, X, Code, Sparkles } from "lucide-react";
import projects from "../data/projects";
import AnimatedHeading from "../components/ui/AnimatedHeading";

/* ── SVG tracing border for project cards ── */
const TracingBorder = ({ color, isHovered }) => {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  if (!w || !h) return <div ref={ref} className="absolute inset-0 pointer-events-none" />;

  const r = 24; // border-radius matching rounded-3xl
  // Rounded rect path (clockwise from top-left + r)
  const d = `M${r},0 L${w - r},0 Q${w},0 ${w},${r} L${w},${h - r} Q${w},${h} ${w - r},${h} L${r},${h} Q0,${h} 0,${h - r} L0,${r} Q0,0 ${r},0 Z`;

  return (
    <svg
      ref={ref}
      className="absolute inset-0 pointer-events-none z-10"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
    >
      <defs>
        <filter id={`traceGlow-${color.replace(/[^a-z0-9]/gi, "")}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Faint static border */}
      <motion.path
        d={d}
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.1"
        animate={{ strokeOpacity: isHovered ? 0.2 : 0.05 }}
        transition={{ duration: 0.4 }}
      />
      {/* Tracing glow segment */}
      <motion.path
        d={d}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        filter={`url(#traceGlow-${color.replace(/[^a-z0-9]/gi, "")})`}
        initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
        animate={
          isHovered
            ? {
                pathLength: [0, 0.25, 0.25, 0],
                pathOffset: [0, 0.25, 0.75, 1],
                opacity: [0.6, 1, 1, 0.6],
              }
            : { pathLength: 0, pathOffset: 0, opacity: 0 }
        }
        transition={
          isHovered
            ? { duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.7, 1] }
            : { duration: 0.3 }
        }
      />
    </svg>
  );
};
/* ── Project image renderer ────────────────────────────────────────────────── */
const ProjectImage = ({ image, title, className = "" }) => (
  <img src={image} alt={title} className={`w-full h-full object-cover ${className}`} />
);

/* ── Per-project accent ───────────────────────────────────────────────────── */
const projectAccents = {
  1: {
    gradient: "from-indigo-500 via-cyan-400 to-indigo-500",
    glow: "rgba(99,102,241,0.12)",
    solid: "#6366F1",
    rgb: "99,102,241",
  },
  2: {
    gradient: "from-emerald-500 via-green-400 to-emerald-500",
    glow: "rgba(16,185,129,0.12)",
    solid: "#10B981",
    rgb: "16,185,129",
  },
  3: {
    gradient: "from-violet-500 via-purple-400 to-violet-500",
    glow: "rgba(139,92,246,0.12)",
    solid: "#8B5CF6",
    rgb: "139,92,246",
  },
  4: {
    gradient: "from-blue-500 via-amber-400 to-blue-500",
    glow: "rgba(59,130,246,0.12)",
    solid: "#3B82F6",
    rgb: "59,130,246",
  },
};

/* ── Project Showcase Row ─────────────────────────────────────────────────── */
const ProjectRow = ({ project, index, onOpen }) => {
  const isReversed = index % 2 !== 0;
  const num = String(index + 1).padStart(2, "0");
  const accent = projectAccents[project.id] || projectAccents[1];
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleGlow = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      {/* Ambient glow behind card */}
      <div
        className="absolute -inset-4 rounded-[2rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(600px circle at 50% 50%, ${accent.glow}, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Animated border wrapper */}
      <div
        ref={cardRef}
        onMouseMove={handleGlow}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative rounded-3xl glow-on-hover"
      >
        {/* SVG tracing border — glowing segment races around card on hover */}
        <TracingBorder color={accent.solid} isHovered={isHovered} />

        <div
          className={`relative flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"}
            rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]
            transition-all duration-500
            group-hover:border-transparent
            group-hover:shadow-[0_32px_80px_-16px_rgba(0,0,0,0.25)]`}
        >
          {/* ── Viz Side ── */}
          <motion.div
            className="w-full lg:w-[55%] relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              onClick={() => onOpen(project)}
              className="relative h-64 sm:h-72 lg:h-full cursor-pointer overflow-hidden"
            >
              <ProjectImage
                image={project.image}
                title={project.title}
                className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              {/* Shimmer sweep on hover */}
              <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                <div
                  className="absolute inset-y-0 w-40 -translate-x-full group-hover:translate-x-[500%] transition-transform duration-[1.5s] ease-in-out"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                  }}
                />
              </div>

              {/* Accent edge line */}
              <div
                className={`absolute ${isReversed ? "left-0" : "right-0"} top-0 bottom-0 w-[3px]
                  bg-gradient-to-b ${accent.gradient}
                  opacity-20 group-hover:opacity-100 transition-opacity duration-500 hidden lg:block`}
              />

              {/* Bottom fade on mobile */}
              <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[var(--color-surface)] to-transparent pointer-events-none lg:hidden" />
            </div>
          </motion.div>

          {/* ── Content Side ── */}
          <div className="relative w-full lg:w-[45%] p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            {/* Project number — gradient text */}
            <span
              className="absolute top-6 right-6 lg:top-8 lg:right-8 font-extrabold select-none pointer-events-none
                         bg-clip-text text-transparent opacity-15 group-hover:opacity-25 transition-opacity duration-500"
              style={{
                fontSize: "clamp(56px, 7vw, 80px)",
                lineHeight: 1,
                backgroundImage: `linear-gradient(135deg, ${accent.solid}, transparent)`,
              }}
            >
              {num}
            </span>

            {/* Title */}
            <motion.h3
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text)] mb-3 relative z-10"
              initial={{ opacity: 0, x: isReversed ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {project.title}
            </motion.h3>

            {/* Accent underline */}
            <motion.div
              className="h-[2px] w-12 rounded-full mb-4"
              style={{ background: `linear-gradient(90deg, ${accent.solid}, transparent)` }}
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />

            {/* Description */}
            <motion.p
              className="text-[var(--color-text-muted)] leading-relaxed mb-6 text-sm sm:text-base relative z-10 max-w-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              {project.description[0]}
            </motion.p>

            {/* Tech stack */}
            <motion.div
              className="flex flex-wrap gap-2 mb-6 relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              {project.technologies.split(", ").map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-3 py-1 rounded-full font-medium
                    bg-[var(--color-surface2)] text-[var(--color-text-muted)]
                    border border-[var(--color-border)] transition-all duration-300
                    hover:text-[var(--color-text)]"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = accent.solid;
                    e.currentTarget.style.boxShadow = `0 0 12px rgba(${accent.rgb}, 0.15)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  {tech}
                </span>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex items-center gap-3 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.65 }}
            >
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                  bg-[var(--color-surface2)] text-[var(--color-text)] border border-[var(--color-border)]
                  hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-200"
              >
                <Github className="w-4 h-4" />
                Code
              </a>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                    transition-all duration-200 shadow-lg hover:shadow-xl hover:brightness-110"
                  style={{ background: `linear-gradient(135deg, ${accent.solid}, var(--color-secondary))` }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
              <button
                onClick={() => onOpen(project)}
                className="ml-auto text-xs font-medium transition-colors duration-200 underline underline-offset-2"
                style={{ color: accent.solid }}
              >
                Details
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ── Project Detail Modal ─────────────────────────────────────────────────── */
const ProjectModal = ({ project, onClose }) => {
  const modalRef = useRef(null);
  const accent = projectAccents[project.id] || projectAccents[1];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative z-10 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl
          bg-[var(--color-surface)] border border-[var(--color-border)]
          shadow-[0_32px_80px_-12px_rgba(0,0,0,0.5)]"
      >
        {/* Top accent line */}
        <div
          className="h-[2px] w-full"
          style={{ background: `linear-gradient(90deg, ${accent.solid}, transparent)` }}
        />

        <div className="relative h-48 sm:h-60 overflow-hidden">
          <ProjectImage image={project.image} title={project.title} />
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[var(--color-surface)] to-transparent pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-xl text-white/80 hover:text-white hover:bg-red-500/80 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 sm:px-8 pb-6 -mt-2">
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] mb-5">
            {project.title}
          </h3>

          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-3.5 h-3.5" style={{ color: accent.solid }} />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Tech Stack</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.split(", ").map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5" style={{ color: accent.solid }} />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Overview</h4>
            </div>
            <div className="space-y-2">
              {project.description.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: accent.solid }}
                  />
                  <p className="text-[var(--color-text-muted)] leading-relaxed text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl text-sm font-semibold hover:border-[var(--color-primary)] transition-all">
              <Github className="w-4 h-4" /> Source Code
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:brightness-110"
                style={{ background: `linear-gradient(135deg, ${accent.solid}, var(--color-secondary))` }}>
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

/* ── Projects Page ─────────────────────────────────────────────────────────── */
const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <>
      <section id="projects" className="relative pt-24 pb-16 bg-[var(--color-bg)] dark:bg-transparent noise-overlay">
        {/* Decorative floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{ top: "5%", left: "-5%", background: "radial-gradient(circle, rgba(var(--color-primary-rgb), 0.04), transparent 70%)" }}
            animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-48 h-48 rounded-full"
            style={{ bottom: "10%", right: "-3%", background: "radial-gradient(circle, rgba(var(--color-secondary-rgb), 0.03), transparent 70%)" }}
            animate={{ scale: [1, 1.2, 1], y: [0, -25, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          {/* Decorative crosses */}
          <motion.svg
            width="24" height="24" viewBox="0 0 24 24"
            className="absolute text-[var(--color-primary)]/10"
            style={{ top: "15%", right: "10%" }}
            animate={{ rotate: [0, 90, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" />
            <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
          </motion.svg>
          <motion.svg
            width="16" height="16" viewBox="0 0 16 16"
            className="absolute text-[var(--color-secondary)]/10"
            style={{ bottom: "30%", left: "6%" }}
            animate={{ rotate: [45, 135, 45], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          >
            <line x1="8" y1="1" x2="8" y2="15" stroke="currentColor" strokeWidth="1.5" />
            <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" />
          </motion.svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <AnimatedHeading>Projects</AnimatedHeading>
          </div>

          {/* Project rows */}
          <div className="space-y-12 lg:space-y-16">
            {projects.map((project, i) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={i}
                onOpen={setActiveProject}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            key={activeProject.id}
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Projects;
