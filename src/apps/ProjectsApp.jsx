import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";
import projects from "../data/projects";

export default function ProjectsApp() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const project = projects[idx];
  const setDoubleSpeed = (e) => {
    e.currentTarget.playbackRate = 4;
  };

  const go = (d) => {
    setDir(d);
    setIdx((i) => (i + d + projects.length) % projects.length);
  };

  const techs = project.technologies.split(",").map((t) => t.trim());

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--window-bg)" }}>
      {/* Gallery area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-4 py-3">
        {/* Nav arrows */}
        <button
          onClick={() => go(-1)}
          className="absolute left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center
                     bg-black/30 text-white hover:bg-black/50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center
                     bg-black/30 text-white hover:bg-black/50 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Project card */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={project.id}
            className="w-full max-w-[560px] flex flex-col items-center gap-3"
            custom={dir}
            initial={{ opacity: 0, x: dir * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -80 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Image */}
            <div className="w-full aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
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
            <div className="w-full text-center">
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-1">{project.title}</h2>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-2 line-clamp-2">
                {project.description[0]}
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap justify-center gap-1 mb-3">
                {techs.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium
                               border border-[var(--color-border)]
                               text-[var(--color-text-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                               bg-[var(--color-primary)] text-white hover:brightness-110 transition"
                  >
                    <Github className="w-3.5 h-3.5" /> Code
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                               border border-[var(--color-border)] text-[var(--color-text)]
                               hover:bg-[var(--color-primary)]/10 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail strip */}
      <div className="flex justify-start sm:justify-center gap-2 px-4 py-2 border-t border-[var(--color-border)] overflow-x-auto">
        {projects.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
            className={`w-12 h-8 rounded overflow-hidden border-2 transition-all flex-shrink-0
              ${i === idx
                ? "border-[var(--color-primary)] shadow-sm scale-105"
                : "border-transparent opacity-50 hover:opacity-80"
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
  );
}
