import { useEffect, useState } from "react";
import skillCategories from "../data/skills";

/* Alternating scroll direction & speed per row */
const rowConfig = [
  { direction: "marquee-left", duration: "78s" },
  { direction: "marquee-right", duration: "72s" },
  { direction: "marquee-left", duration: "68s" },
  { direction: "marquee-right", duration: "70s" },
  { direction: "marquee-left", duration: "74s" },
  { direction: "marquee-right", duration: "66s" },
];

const Skills = () => {
  const [isDark, setIsDark] = useState(false);
  const [viewMode, setViewMode] = useState("catalog");

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
      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight">
              Technologies and Tools
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <div
              className="relative inline-flex items-center p-1 rounded-full border w-fit self-start md:self-auto"
              style={{
                background: isDark
                  ? "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))"
                  : "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,255,255,0.62))",
                borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.72)",
                backdropFilter: "blur(18px) saturate(160%)",
                WebkitBackdropFilter: "blur(18px) saturate(160%)",
                boxShadow: isDark
                  ? "inset 0 1px 0 rgba(255,255,255,0.16), 0 10px 26px rgba(0,0,0,0.35)"
                  : "inset 0 1px 0 rgba(255,255,255,0.9), 0 10px 24px rgba(15,23,42,0.12)",
              }}
            >
              <span
                className="absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-out pointer-events-none"
                style={{
                  left: viewMode === "catalog" ? "4px" : "calc(50% + 2px)",
                  width: "calc(50% - 6px)",
                  background: isDark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.95)",
                  border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(15,23,42,0.08)",
                  boxShadow: isDark
                    ? "0 6px 18px rgba(0,0,0,0.35)"
                    : "0 6px 16px rgba(15,23,42,0.12)",
                }}
              />
              <button
                type="button"
                onClick={() => setViewMode("catalog")}
                className="relative z-10 w-[110px] md:w-[120px] px-4 py-2 rounded-full text-center text-xs md:text-sm font-semibold transition-colors"
                style={{
                  color: viewMode === "catalog" ? "var(--color-text)" : "var(--color-text-muted)",
                }}
              >
                Catalog
              </button>
              <button
                type="button"
                onClick={() => setViewMode("flow")}
                className="relative z-10 w-[110px] md:w-[120px] px-4 py-2 rounded-full text-center text-xs md:text-sm font-semibold transition-colors"
                style={{
                  color: viewMode === "flow" ? "var(--color-text)" : "var(--color-text-muted)",
                }}
              >
                Flow
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "catalog" ? (
        <div id="current-stack" className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface2)]/60 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]/65 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  {category.title}
                </p>
                <span className="text-[11px] text-[var(--color-text-muted)]">{category.skills.length} tools</span>
              </div>

              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {category.skills.map((skill) => (
                  <div
                    key={skill.icon}
                    className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]/70 px-3 py-2"
                  >
                    <img
                      src={`https://skillicons.dev/icons?i=${skill.icon}&theme=${theme}`}
                      alt={skill.name}
                      width={30}
                      height={30}
                      className="w-[30px] h-[30px] shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-text)] leading-tight">{skill.name}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)] truncate">{skill.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div id="current-stack" className="flex flex-col gap-8">
          {skillCategories.map((category, rowIndex) => {
            const { direction, duration } =
              rowConfig[rowIndex] || rowConfig[rowIndex % rowConfig.length];

            const doubled = [...category.skills, ...category.skills];

            return (
              <div key={category.title}>
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                  <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-[0.16em] mb-2">
                    {category.title}
                  </p>
                </div>

                <div
                  className="relative overflow-hidden"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
                  }}
                >
                  <div
                    className={`marquee-track ${direction}`}
                    style={{ "--marquee-duration": duration }}
                  >
                    {doubled.map((skill, i) => (
                      <div
                        key={`${skill.icon}-${i}`}
                        className="inline-flex items-center gap-3 px-4 py-2.5 mx-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]/75"
                      >
                        <img
                          src={`https://skillicons.dev/icons?i=${skill.icon}&theme=${theme}`}
                          alt={skill.name}
                          width={30}
                          height={30}
                          className="w-[30px] h-[30px]"
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
      )}
    </section>
  );
};

export default Skills;
