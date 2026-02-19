import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import skillCategories from "../data/skills";

const isTouchDevice =
  typeof window !== "undefined" && "ontouchstart" in window;

const Skills = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  const currentCategory = skillCategories[selectedCategory];

  return (
    <section id="skills" className="py-28 bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
            Technical Skills
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-cyan-600 mx-auto rounded-full" />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {skillCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(index)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
                selectedCategory === index
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {selectedCategory === index && (
                <motion.span
                  layoutId="skills-tab"
                  className="absolute inset-0 rounded-full bg-[var(--color-primary)]/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category.title}</span>
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {currentCategory.skills.map((skill, index) => (
                <Tilt
                  key={index}
                  tiltMaxAngleX={isTouchDevice ? 0 : 5}
                  tiltMaxAngleY={isTouchDevice ? 0 : 5}
                  scale={1.02}
                >
                  <div className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-card transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-card-hover cursor-pointer">
                    <img
                      src={`https://skillicons.dev/icons?i=${skill.icon}&theme=${isDark ? "dark" : "light"}`}
                      alt={skill.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 transition-transform duration-200 group-hover:-translate-y-1"
                    />
                    <span className="text-xs font-semibold text-[var(--color-text)] text-center">
                      {skill.name}
                    </span>
                  </div>
                </Tilt>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Skills;
