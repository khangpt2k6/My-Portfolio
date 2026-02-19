import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  Github,
  ExternalLink,
  X,
  ChevronRight,
  Zap,
  Code,
  Sparkles,
} from "lucide-react";
import projects from "../data/projects";
import FadeInView from "./FadeInView";

const isTouchDevice =
  typeof window !== "undefined" && "ontouchstart" in window;

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeProject]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setActiveProject(null);
    }
  };

  return (
    <section id="projects" className="relative py-28 bg-[var(--color-bg)]">
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-text)]">
            Portfolio
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-cyan-600 mx-auto rounded-full mt-4" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <FadeInView key={project.id} delay={index * 0.1}>
              <Tilt
                tiltMaxAngleX={isTouchDevice ? 0 : 8}
                tiltMaxAngleY={isTouchDevice ? 0 : 8}
                glareEnable={!isTouchDevice}
                glareMaxOpacity={0.1}
                glareColor="var(--color-primary)"
                perspective={1000}
              >
                <div
                  className="group relative h-full"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className={`relative h-full bg-[var(--color-surface)] border rounded-2xl overflow-hidden shadow-card transition-all duration-500 ${
                      hoveredCard === index
                        ? "-translate-y-1 shadow-card-hover border-indigo-500/40"
                        : "border-[var(--color-border)]"
                    }`}
                  >
                    {/* Image Area */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          hoveredCard === index ? "scale-105" : "scale-100"
                        }`}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--color-surface)]/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[var(--color-text)]">
                          <Zap className="w-3 h-3 text-indigo-500" />
                          {project.category}
                        </span>
                      </div>

                      {/* Quick Action Icons */}
                      <div
                        className={`absolute bottom-3 right-3 flex gap-2 transition-all duration-300 ${
                          hoveredCard === index
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-3"
                        }`}
                      >
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-[var(--color-surface)]/90 backdrop-blur-sm rounded-full text-[var(--color-text)] hover:text-white hover:bg-indigo-600 transition-all duration-300 shadow-lg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-4 h-4" />
                        </a>
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[var(--color-surface)]/90 backdrop-blur-sm rounded-full text-[var(--color-text)] hover:text-white hover:bg-indigo-600 transition-all duration-300 shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-[var(--color-text)] mb-3 group-hover:text-indigo-500 transition-colors">
                        {project.title}
                      </h3>

                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.technologies
                          .split(", ")
                          .slice(0, 3)
                          .map((tech, i) => (
                            <span
                              key={i}
                              className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-bg)] text-[var(--color-muted)] font-medium border border-[var(--color-border)]"
                            >
                              {tech}
                            </span>
                          ))}
                        {project.technologies.split(", ").length > 3 && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold">
                            +{project.technologies.split(", ").length - 3}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-[var(--color-muted)] text-sm mb-4 line-clamp-1 leading-relaxed">
                        {project.description[0]}
                      </p>

                      {/* View Details */}
                      <button
                        onClick={() => setActiveProject(project)}
                        className="group/btn inline-flex items-center gap-1.5 text-sm text-indigo-500 hover:text-indigo-400 font-semibold transition-colors"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </Tilt>
            </FadeInView>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClickOutside}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-[var(--color-surface)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-elevated"
            >
              {/* Modal Header Image */}
              <div className="relative">
                <div className="h-72 overflow-hidden">
                  <img
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${activeProject.color} opacity-20`}
                  />
                </div>

                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveProject(null);
                  }}
                  className="absolute top-4 right-4 p-2 bg-[var(--color-surface)]/90 backdrop-blur-sm rounded-full text-[var(--color-muted)] hover:text-white hover:bg-red-500 transition-all duration-300 shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Category Badge */}
                <div className="absolute bottom-4 left-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)]/90 backdrop-blur-sm rounded-full font-semibold text-[var(--color-text)] shadow-lg border border-[var(--color-border)]">
                    <Zap className="w-4 h-4 text-indigo-500" />
                    {activeProject.category}
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <h3 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-6">
                  {activeProject.title}
                </h3>

                {/* Tech Stack */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-indigo-500" />
                    <h4 className="text-xl font-bold text-[var(--color-text)]">
                      Tech Stack
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.technologies.split(", ").map((tech, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-lg bg-[var(--color-bg)] text-[var(--color-muted)] font-medium border border-[var(--color-border)] hover:border-indigo-500/50 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description Bullets */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    <h4 className="text-xl font-bold text-[var(--color-text)]">
                      Project Overview
                    </h4>
                  </div>
                  <div className="space-y-4">
                    {activeProject.description.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        </div>
                        <p className="text-[var(--color-muted)] leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-semibold hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Github className="w-5 h-5" />
                    View Code
                  </a>
                  {activeProject.demo && (
                    <a
                      href={activeProject.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 shadow-lg"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
