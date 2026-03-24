import { useState } from "react";
import {
  Search,
  Compass,
  Code,
  Wrench,
  Cloud,
  Sparkles,
} from "lucide-react";
import skillCategories from "../data/skills";

const NAV = [
  { id: "discover", label: "Discover", Icon: Compass },
  { id: 0, label: "Languages", Icon: Code },
  { id: 1, label: "Frameworks", Icon: Wrench },
  { id: 2, label: "Cloud & Infra", Icon: Cloud },
  { id: 3, label: "Data & AI", Icon: Sparkles },
];

const FEATURED = [
  {
    icon: "react",
    name: "React",
    tagline: "Build Modern UIs",
    desc: "Component-based library for building interactive user interfaces.",
    bg: "linear-gradient(135deg, #6366f1, #a855f7)",
  },
  {
    icon: "python",
    name: "Python",
    tagline: "Versatile & Powerful",
    desc: "From web development to machine learning — Python does it all.",
    bg: "linear-gradient(135deg, #3b82f6, #06b6d4)",
  },
  {
    icon: "docker",
    name: "Docker",
    tagline: "Containerize Everything",
    desc: "Build, ship, and run applications anywhere with containers.",
    bg: "linear-gradient(135deg, #f97316, #ef4444)",
  },
];

const iconUrl = (key) =>
  `https://skillicons.dev/icons?i=${key}&theme=dark`;

export default function SkillsApp() {
  const [tab, setTab] = useState("discover");
  const [query, setQuery] = useState("");

  const categories =
    tab === "discover" ? skillCategories : [skillCategories[tab]];

  const filtered = categories
    .map((c) => ({
      ...c,
      skills: c.skills.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((c) => c.skills.length > 0);

  return (
    <div className="app-store">
      {/* ── Sidebar ── */}
      <nav className="app-store-sidebar">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`app-store-nav${tab === id ? " active" : ""}`}
            onClick={() => {
              setTab(id);
              setQuery("");
            }}
          >
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* ── Main ── */}
      <main className="app-store-main">
        {/* Top bar */}
        <div className="app-store-topbar">
          {typeof tab === "number" && (
            <h1 className="app-store-page-title">
              {skillCategories[tab].title}
            </h1>
          )}
          {tab === "discover" && !query && (
            <h1 className="app-store-page-title">Discover</h1>
          )}
          <div className="app-store-search">
            <Search size={13} />
            <input
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="app-store-scroll">
          {/* Featured cards — only on discover without search */}
          {tab === "discover" && !query && (
            <div className="app-store-featured">
              {FEATURED.map((f) => (
                <div
                  key={f.icon}
                  className="app-store-feat-card"
                  style={{ background: f.bg }}
                >
                  <span className="app-store-feat-label">FEATURED</span>
                  <div className="app-store-feat-body">
                    <img
                      src={iconUrl(f.icon)}
                      alt={f.name}
                      className="app-store-feat-img"
                      draggable={false}
                    />
                    <div>
                      <div className="app-store-feat-tag">{f.tagline}</div>
                      <div className="app-store-feat-name">{f.name}</div>
                      <div className="app-store-feat-desc">{f.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Category sections */}
          {filtered.map((cat) => {
            const catIdx = skillCategories.findIndex(
              (c) => c.title === cat.title
            );
            return (
              <section key={cat.title} className="app-store-section">
                {/* Section header — show on discover or when searching */}
                {(tab === "discover" || query) && (
                  <div className="app-store-sec-head">
                    <h2>{cat.title}</h2>
                    {tab === "discover" && !query && (
                      <button
                        className="app-store-see-all"
                        onClick={() => setTab(catIdx)}
                      >
                        See All
                      </button>
                    )}
                  </div>
                )}

                {/* App rows */}
                <div className="app-store-list">
                  {cat.skills.map((skill) => (
                    <div key={skill.name} className="app-store-row">
                      <img
                        src={iconUrl(skill.icon)}
                        alt={skill.name}
                        className="app-store-icon"
                        draggable={false}
                        loading="lazy"
                      />
                      <div className="app-store-info">
                        <span className="app-store-name">{skill.name}</span>
                        <span className="app-store-sub">{skill.subtitle}</span>
                      </div>
                      <button className="app-store-get">GET</button>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
