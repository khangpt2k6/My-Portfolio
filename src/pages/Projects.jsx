import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";
import projects from "../data/projects";
import AnimatedHeading from "../components/ui/AnimatedHeading";

export default function Projects() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const project = projects[idx];
  const techs = project.technologies.split(",").map((t) => t.trim());
  const setDoubleSpeed = (e) => {
    e.currentTarget.playbackRate = 2;
  };

  const go = (d) => {
    setDir(d);
    setIdx((i) => (i + d + projects.length) % projects.length);
  };

  return (
    <section id="projects" className="relative py-20 md:py-28 px-4 overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-12">
        <AnimatedHeading className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-text)]">
          Projects
        </AnimatedHeading>
      </div>

      {/* Gallery */}
      <div className="relative max-w-5xl mx-auto">
        {/* Nav arrows */}
        <button
          onClick={() => go(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full
                     flex items-center justify-center bg-black/30 backdrop-blur-sm text-white
                     hover:bg-black/50 transition-colors border border-white/10
                     -translate-x-1/2 md:translate-x-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full
                     flex items-center justify-center bg-black/30 backdrop-blur-sm text-white
                     hover:bg-black/50 transition-colors border border-white/10
                     translate-x-1/2 md:translate-x-0"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Project card */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={project.id}
            className="flex flex-col md:flex-row items-center gap-8 px-8 md:px-16"
            custom={dir}
            initial={{ opacity: 0, x: dir * 120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -120 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Image */}
            <div className="w-full md:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl
                            border border-[var(--glass-border)]">
              {project.video ? (
                <video
                  src={project.video}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  onLoadedMetadata={setDoubleSpeed}
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Info */}
            <div className="w-full md:w-1/2">
              {/* Number + Title */}
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-6xl md:text-7xl font-black text-[var(--color-primary)] opacity-20">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                  {project.title}
                </h3>
              </div>

              <p className="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed mb-6">
                {project.description[0]}
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {techs.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs font-medium
                               border border-[var(--glass-border)]
                               text-[var(--color-text-muted)]
                               bg-[var(--color-surface)]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                               bg-[var(--color-primary)] text-white hover:brightness-110 transition
                               shadow-lg shadow-[var(--color-primary)]/20"
                  >
                    <Github className="w-4 h-4" /> Code
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                               border border-[var(--glass-border)] text-[var(--color-text)]
                               hover:bg-[var(--color-primary)]/10 transition"
                  >
                    <ExternalLink className="w-4 h-4" /> Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots / Thumbnails */}
        <div className="flex justify-center gap-3 mt-10">
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
              className={`w-16 h-10 rounded-lg overflow-hidden border-2 transition-all
                ${i === idx
                  ? "border-[var(--color-primary)] shadow-md scale-110"
                  : "border-transparent opacity-40 hover:opacity-70"
                }`}
            >
              {p.video ? (
                <video
                  src={p.video}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedMetadata={setDoubleSpeed}
                />
              ) : (
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
