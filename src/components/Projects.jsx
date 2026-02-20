import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Github, ExternalLink, X, Code, Sparkles } from "lucide-react";
import projects from "../data/projects";
import AnimatedHeading from "./AnimatedHeading";
import ChatViz from "./ChatViz";
import NaviCVViz from "./NaviCVViz";
import BullSpaceViz from "./BullSpaceViz";
import VaultXViz from "./VaultXViz";

/* ── Live preview renderer ────────────────────────────────────────────────── */
const LivePreview = ({ type, image, title, className = "" }) => {
  const bg = "bg-gradient-to-br from-gray-900 to-gray-800";
  if (type === "chat")
    return <div className={`w-full h-full ${bg} ${className}`}><ChatViz /></div>;
  if (type === "job-search")
    return <div className={`w-full h-full ${bg} ${className}`}><NaviCVViz /></div>;
  if (type === "room-booking")
    return <div className={`w-full h-full ${bg} ${className}`}><BullSpaceViz /></div>;
  if (type === "finance")
    return <div className={`w-full h-full ${bg} ${className}`}><VaultXViz /></div>;
  return <img src={image} alt={title} className={`w-full h-full object-cover ${className}`} />;
};

/* ── Per-project accent color ─────────────────────────────────────────────── */
const projectAccents = {
  1: { line: "from-indigo-500 via-cyan-400 to-indigo-500", glow: "rgba(99,102,241,0.15)" },
  2: { line: "from-emerald-500 via-green-400 to-emerald-500", glow: "rgba(16,185,129,0.15)" },
  3: { line: "from-violet-500 via-blue-400 to-violet-500", glow: "rgba(139,92,246,0.15)" },
  4: { line: "from-blue-500 via-amber-400 to-blue-500", glow: "rgba(59,130,246,0.15)" },
};

/* ── Project Showcase Row ─────────────────────────────────────────────────── */
const ProjectRow = ({ project, index, onOpen }) => {
  const isReversed = index % 2 !== 0;
  const num = String(index + 1).padStart(2, "0");
  const accent = projectAccents[project.id] || projectAccents[1];
  const vizRef = useRef(null);

  const handleGlow = useCallback((e) => {
    const el = vizRef.current;
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
      className="group"
    >
      <div className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-0 lg:gap-0
        rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]
        transition-all duration-500 hover:shadow-[0_32px_80px_-16px_rgba(0,0,0,0.2)]`}
      >
        {/* ── Viz Side ── */}
        <div
          ref={vizRef}
          onMouseMove={handleGlow}
          onClick={() => onOpen(project)}
          className="relative w-full lg:w-[55%] h-64 sm:h-72 lg:h-[340px] cursor-pointer overflow-hidden glow-on-hover"
        >
          <LivePreview
            type={project.livePreview}
            image={project.image}
            title={project.title}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          {/* Gradient accent line along the edge */}
          <div className={`absolute ${isReversed ? "left-0 top-0 bottom-0 w-[3px]" : "right-0 top-0 bottom-0 w-[3px]"}
            bg-gradient-to-b ${accent.line} opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden lg:block`} />
          {/* Bottom fade for mobile */}
          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[var(--color-surface)] to-transparent pointer-events-none lg:hidden" />
        </div>

        {/* ── Content Side ── */}
        <div className="relative w-full lg:w-[45%] p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          {/* Project number */}
          <span
            className="absolute top-6 right-6 lg:top-8 lg:right-8 font-bold text-[var(--color-border)] select-none pointer-events-none"
            style={{ fontSize: "clamp(48px, 6vw, 72px)", lineHeight: 1 }}
          >
            {num}
          </span>

          {/* Title */}
          <motion.h3
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text)] mb-3 relative z-10"
            initial={{ opacity: 0, x: isReversed ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {project.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            className="text-[var(--color-text-muted)] leading-relaxed mb-6 text-sm sm:text-base relative z-10 max-w-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {project.description[0]}
          </motion.p>

          {/* Tech stack */}
          <motion.div
            className="flex flex-wrap gap-2 mb-6 relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {project.technologies.split(", ").map((tech) => (
              <span
                key={tech}
                className="text-xs px-3 py-1 rounded-full font-medium
                  bg-[var(--color-surface2)] text-[var(--color-text-muted)]
                  border border-[var(--color-border)] transition-colors duration-200
                  hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text)]"
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
            transition={{ duration: 0.5, delay: 0.5 }}
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
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
            <button
              onClick={() => onOpen(project)}
              className="ml-auto text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)]
                transition-colors duration-200 underline underline-offset-2 decoration-[var(--color-border)]
                hover:decoration-[var(--color-primary)]"
            >
              Details
            </button>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

/* ── Project Detail Modal ─────────────────────────────────────────────────── */
const ProjectModal = ({ project, onClose }) => {
  const modalRef = useRef(null);

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
        <div className="relative h-48 sm:h-60 overflow-hidden">
          <LivePreview type={project.livePreview} image={project.image} title={project.title} />
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
              <Code className="w-3.5 h-3.5 text-[var(--color-primary)]" />
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
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Overview</h4>
            </div>
            <div className="space-y-2">
              {project.description.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
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
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}>
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
              Real problems I've solved — from AI career tools to campus infrastructure.
            </motion.p>
          </div>

          {/* Project rows */}
          <div className="space-y-10 lg:space-y-14">
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
