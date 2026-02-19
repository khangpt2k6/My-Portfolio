import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  Github,
  ExternalLink,
  X,
  ArrowUpRight,
  Code,
  Sparkles,
} from "lucide-react";
import projects from "../data/projects";
import AnimatedHeading from "./AnimatedHeading";
import MergeSortViz from "./MergeSortViz";
import ChatViz from "./ChatViz";
import NaviCVViz from "./NaviCVViz";

/* ── 3D Tilt Wrapper ─────────────────────────────────────────────────────── */
const Tilt3D = ({ children, className = "" }) => {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouse = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rotateX.set((y - 0.5) * -12);
    rotateY.set((x - 0.5) * 12);
    glareX.set(x * 100);
    glareY.set(y * 100);
    glareOpacity.set(0.15);
  }, [rotateX, rotateY, glareX, glareY, glareOpacity]);

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  }, [rotateX, rotateY, glareOpacity]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={className}
    >
      {children}
      {/* Specular glare overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl z-20"
        style={{
          opacity: glareOpacity,
          background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.25), transparent 60%)`,
        }}
      />
    </motion.div>
  );
};

/* ── Live preview ──────────────────────────────────────────────────────────── */
const LivePreview = ({ type, image, title, className = "" }) => {
  const bg = "bg-gradient-to-br from-gray-900 to-gray-800";
  if (type === "merge-sort")
    return <div className={`w-full h-full ${bg} ${className}`}><MergeSortViz /></div>;
  if (type === "chat")
    return <div className={`w-full h-full ${bg} ${className}`}><ChatViz /></div>;
  if (type === "job-search")
    return <div className={`w-full h-full ${bg} ${className}`}><NaviCVViz /></div>;
  return <img src={image} alt={title} className={`w-full h-full object-cover ${className}`} />;
};

/* ── Per-category accent ───────────────────────────────────────────────────── */
const accents = {
  "AI/ML":      { gradient: "from-indigo-600 to-cyan-500", badge: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30" },
  "Full-Stack": { gradient: "from-blue-600 to-violet-500", badge: "bg-blue-500/20 text-blue-300 border-blue-400/30" },
  Education:    { gradient: "from-purple-600 to-pink-500", badge: "bg-purple-500/20 text-purple-300 border-purple-400/30" },
};

/* ── Project Card ──────────────────────────────────────────────────────────── */
const ProjectCard = ({ project, index, onOpen, featured = false }) => {
  const accent = accents[project.category] || accents["Full-Stack"];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative ${featured ? "md:col-span-2" : ""}`}
    >
      <Tilt3D className="relative h-full">
      <div
        onClick={() => onOpen(project)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
        }}
        className={`relative h-full rounded-2xl overflow-hidden cursor-pointer
          bg-[var(--color-surface)] border border-[var(--color-border)]
          transition-all duration-500 glow-on-hover
          hover:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.25)]
          ${featured ? "animated-border" : ""}`}
      >
        <div className={`relative overflow-hidden ${featured ? "h-52 sm:h-60 lg:h-72" : "h-44 sm:h-52"}`}>
          <LivePreview
            type={project.livePreview}
            image={project.image}
            title={project.title}
            className="transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${accent.gradient}`} />
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[var(--color-surface)] to-transparent pointer-events-none" />
          <span className={`absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${accent.badge}`}>
            {project.category}
          </span>
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
            <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white/80 hover:text-white hover:bg-black/80 transition-all">
              <Github className="w-4 h-4" />
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white/80 hover:text-white hover:bg-black/80 transition-all">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text)] transition-colors duration-300">
              {project.title}
            </h3>
            <ArrowUpRight className="w-5 h-5 flex-shrink-0 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-70 transition-all duration-300" />
          </div>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4 line-clamp-2">
            {project.description[0]}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.split(", ").slice(0, featured ? 6 : 4).map((tech) => (
              <span key={tech} className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                {tech}
              </span>
            ))}
            {project.technologies.split(", ").length > (featured ? 6 : 4) && (
              <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                +{project.technologies.split(", ").length - (featured ? 6 : 4)}
              </span>
            )}
          </div>
        </div>
      </div>
      </Tilt3D>
    </motion.article>
  );
};

/* ── Project Detail Modal (portaled to body) ───────────────────────────────── */
const ProjectModal = ({ project, onClose }) => {
  const modalRef = useRef(null);
  const accent = accents[project.category] || accents["Full-Stack"];

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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Modal card */}
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
        {/* ── Preview ── */}
        <div className="relative h-48 sm:h-60 overflow-hidden">
          <LivePreview type={project.livePreview} image={project.image} title={project.title} />
          <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${accent.gradient}`} />
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[var(--color-surface)] to-transparent pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-xl text-white/80 hover:text-white hover:bg-red-500/80 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <span className={`absolute top-3 left-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold backdrop-blur-md border ${accent.badge}`}>
            {project.category}
          </span>
        </div>

        {/* ── Content ── */}
        <div className="px-6 sm:px-8 pb-6 -mt-2">
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] mb-5">
            {project.title}
          </h3>

          {/* Tech stack */}
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

          {/* Overview */}
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

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl text-sm font-semibold hover:border-[var(--color-primary)] transition-all">
              <Github className="w-4 h-4" /> Source Code
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:brightness-110"
                style={{ background: "linear-gradient(135deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))" }}>
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
          <div className="text-center mb-14">
            <AnimatedHeading>Portfolio</AnimatedHeading>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-[var(--color-text-muted)] mt-3 text-sm sm:text-base max-w-md mx-auto"
            >
              A selection of projects I've built — from AI systems to real-time apps.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onOpen={setActiveProject}
                featured={i === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal portaled to body — fully independent of section layout */}
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
