import { useEffect, useState } from "react";
import skillCategories from "../data/skills";
import AnimatedHeading from "../components/ui/AnimatedHeading";

/* Alternating scroll direction & speed per row */
const rowConfig = [
  { direction: "marquee-left", duration: "50s" },
  { direction: "marquee-right", duration: "45s" },
  { direction: "marquee-left", duration: "35s" },
  { direction: "marquee-right", duration: "40s" },
  { direction: "marquee-left", duration: "42s" },
  { direction: "marquee-right", duration: "38s" },
];

const Skills = () => {
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

  const theme = isDark ? "dark" : "light";

  return (
    <section id="skills" className="relative min-h-screen pt-24 pb-28 bg-[var(--color-surface)] dark:bg-transparent noise-overlay">

      {/* Section Header — constrained width */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 text-center mb-8">
        <AnimatedHeading>Technical Skills</AnimatedHeading>

        {/* Decorative glow line */}
        <div className="glow-line mx-auto mt-6" style={{ maxWidth: 140 }} />
      </div>

      {/* Marquee Rows — full width */}
      <div className="flex flex-col gap-10">
        {skillCategories.map((category, rowIndex) => {
          const { direction, duration } =
            rowConfig[rowIndex] || rowConfig[rowIndex % rowConfig.length];

          /* Duplicate the skills array so the strip loops seamlessly */
          const doubled = [...category.skills, ...category.skills];

          return (
            <div key={category.title}>
              {/* Category Label */}
              <div className="max-w-6xl mx-auto px-4 md:px-6">
                <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3">
                  {category.title}
                </p>
              </div>

              {/* Marquee Strip */}
              <div
                className="relative overflow-hidden"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
                }}
              >
                <div
                  className={`marquee-track ${direction}`}
                  style={{ "--marquee-duration": duration }}
                >
                  {doubled.map((skill, i) => (
                    <div
                      key={`${skill.icon}-${i}`}
                      className="inline-flex items-center gap-3 px-5 py-3 mx-2 rounded-xl glass-card backdrop-blur-xl transition-colors duration-200 hover:border-[var(--color-primary)]/30"
                    >
                      <img
                        src={`https://skillicons.dev/icons?i=${skill.icon}&theme=${theme}`}
                        alt={skill.name}
                        width={40}
                        height={40}
                        className="w-10 h-10"
                        loading="lazy"
                      />
                      <span className="text-sm font-medium text-[var(--color-text)] whitespace-nowrap">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
