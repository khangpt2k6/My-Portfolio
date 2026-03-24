import { Code, Wrench, Cloud, Sparkles, Check } from "lucide-react";
import skillCategories from "../data/skills";

const CATEGORY_ICONS = {
  Code,
  Wrench,
  Cloud,
  Sparkles,
};

const skillIcon = (key) =>
  `https://skillicons.dev/icons?i=${key}&theme=dark`;

export default function SkillsApp() {
  return (
    <div
      className="h-full overflow-auto p-4 space-y-4"
      style={{ background: "var(--window-bg)" }}
    >
      {skillCategories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.icon] || Code;
        return (
          <section key={cat.title}>
            {/* Category header */}
            <div className="flex items-center gap-2 mb-2.5">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: "rgba(var(--color-primary-rgb), 0.1)" }}
              >
                <Icon
                  size={13}
                  style={{ color: "var(--color-primary)" }}
                />
              </div>
              <h3
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--color-text-muted)" }}
              >
                {cat.title}
              </h3>
              <span
                className="text-[10px] ml-auto"
                style={{ color: "var(--color-text-muted)" }}
              >
                {cat.skills.length}
              </span>
            </div>

            {/* Skills grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {cat.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg border transition-colors hover:border-[var(--color-primary)]/40"
                  style={{
                    background: "var(--color-surface2)",
                    borderColor: "var(--glass-border)",
                  }}
                >
                  <img
                    src={skillIcon(skill.icon)}
                    alt={skill.name}
                    className="w-5 h-5 rounded"
                    draggable={false}
                    loading="lazy"
                  />
                  <span
                    className="text-[11px] font-medium flex-1 truncate"
                    style={{ color: "var(--color-text)" }}
                  >
                    {skill.name}
                  </span>
                  <Check
                    size={12}
                    className="flex-shrink-0"
                    style={{ color: "var(--color-primary)", opacity: 0.5 }}
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
