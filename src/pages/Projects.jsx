import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, X, Code, Sparkles } from "lucide-react";
import projects from "../data/projects";
import AnimatedHeading from "../components/ui/AnimatedHeading";
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
        className="relative rounded-3xl glow-on-hover"
      >
        {/* Spinning gradient border — visible on hover */}
        <div
          className="absolute -inset-[1px] rounded-3xl z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animated-border-spin"
          style={{
            background: `conic-gradient(from var(--border-angle, 0deg), ${accent.solid}, transparent, ${accent.solid})`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            padding: "1.5px",
          }}
        />

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
              className="relative h-64 sm:h-72 lg:h-[360px] cursor-pointer overflow-hidden"
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
      <section className="relative min-h-screen pt-24 pb-28 bg-[var(--color-bg)] dark:bg-transparent">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <AnimatedHeading>Projects</AnimatedHeading>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-[var(--color-text-muted)] mt-3 text-sm sm:text-base max-w-lg mx-auto"
            >
              Real problems I've solved, from AI career tools to campus apps.
            </motion.p>
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
