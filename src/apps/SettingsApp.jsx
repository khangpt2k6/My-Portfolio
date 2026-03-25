import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, Monitor, Image, Palette, MousePointer, Check,
  User, ChevronRight, Search, Info,
} from "lucide-react";
import { CURSOR_STYLES } from "../components/ui/CustomCursor";

/* ═══════════════════════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════════════════════ */

const WALLPAPERS = [
  { id: "bV6xf3", name: "Mountain", src: "/desktop_background/bV6xf3.webp" },
  { id: "icH5Aj", name: "Aurora", src: "/desktop_background/icH5Aj.webp" },
  { id: "lake", name: "Lakeside", src: "/desktop_background/lake-side-trees-live-desktop-jwhxpov3u0jdebb0.jpg" },
  { id: "default", name: "Default", src: "/desktop_background/default_background.webp" },
  { id: "aesthetic", name: "Aesthetic", src: "/desktop_background/aesthetic-wallpaper-1.jpg" },
  { id: "tsHljX", name: "Sunset", src: "/desktop_background/tsHljX.webp" },
  { id: "wTyWLK", name: "Night Sky", src: "/desktop_background/wTyWLK.webp" },
  { id: "wp33", name: "Abstract", src: "/desktop_background/wp3305840.jpg" },
];

const ACCENT_COLORS = [
  { name: "Multicolor", light: "#007AFF", dark: "#0A84FF", rgbLight: "99, 102, 241", rgbDark: "129, 140, 248", multi: true },
  { name: "Indigo", light: "#6366F1", dark: "#818CF8", rgbLight: "99, 102, 241", rgbDark: "129, 140, 248" },
  { name: "Cyan", light: "#06B6D4", dark: "#22D3EE", rgbLight: "6, 182, 212", rgbDark: "34, 211, 238" },
  { name: "Purple", light: "#9333EA", dark: "#A855F7", rgbLight: "147, 51, 234", rgbDark: "168, 85, 247" },
  { name: "Rose", light: "#E11D48", dark: "#FB7185", rgbLight: "225, 29, 72", rgbDark: "251, 113, 133" },
  { name: "Emerald", light: "#059669", dark: "#34D399", rgbLight: "5, 150, 105", rgbDark: "52, 211, 153" },
  { name: "Amber", light: "#D97706", dark: "#FBBF24", rgbLight: "217, 119, 6", rgbDark: "251, 191, 36" },
];

const SIDEBAR_ITEMS = [
  { id: "profile", type: "profile" },
  { type: "separator" },
  { id: "appearance", label: "Appearance", icon: Sun, iconBg: "#007AFF" },
  { id: "wallpaper", label: "Wallpaper", icon: Image, iconBg: "#30D158" },
  { type: "separator" },
  { id: "accent", label: "Accent Color", icon: Palette, iconBg: "#AF52DE" },
  { id: "cursor", label: "Cursor", icon: MousePointer, iconBg: "#FF9F0A" },
  { type: "separator" },
  { id: "about", label: "About", icon: Info, iconBg: "#8E8E93" },
];

/* ═══════════════════════════════════════════════════════════════════════
   Sidebar
   ═══════════════════════════════════════════════════════════════════════ */

function Sidebar({ active, onSelect, isDark }) {
  const [search, setSearch] = useState("");

  return (
    <div
      className="h-full flex flex-col py-2 overflow-auto flex-shrink-0"
      style={{
        width: 180,
        borderRight: `0.5px solid var(--set-border)`,
        background: "var(--set-sidebar)",
      }}
    >
      {/* Search */}
      <div className="px-2.5 mb-1">
        <div
          className="flex items-center gap-1.5 px-2 py-[5px] rounded-md"
          style={{ background: "var(--set-search-bg)" }}
        >
          <Search className="w-3 h-3 flex-shrink-0" style={{ color: "var(--set-text-ter)", opacity: 0.6 }} />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-[11px] w-full placeholder:text-[var(--set-text-ter)]"
            style={{ color: "var(--set-text)" }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-0.5 px-2">
        {SIDEBAR_ITEMS.filter((item) => {
          if (!search) return true;
          if (item.type === "separator" || item.type === "profile") return !search;
          return item.label.toLowerCase().includes(search.toLowerCase());
        }).map((item, i) => {
          if (item.type === "separator") {
            return (
              <div
                key={`sep-${i}`}
                className="h-px my-1.5 mx-1"
                style={{ background: "var(--set-border)" }}
              />
            );
          }

          if (item.type === "profile") {
            return (
              <button
                key="profile"
                onClick={() => onSelect("profile")}
                className="flex items-center gap-2.5 p-2 rounded-lg transition-colors cursor-pointer"
                style={{
                  background: active === "profile" ? "var(--set-active)" : "transparent",
                }}
              >
                <img
                  src="/profile.jpg"
                  alt="Khang Phan"
                  className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0"
                />
                <div className="text-left min-w-0">
                  <p
                    className="text-[12px] font-semibold leading-tight truncate"
                    style={{ color: active === "profile" ? "#fff" : "var(--set-text)" }}
                  >
                    Khang Phan
                  </p>
                  <p
                    className="text-[10px] leading-tight truncate"
                    style={{ color: active === "profile" ? "rgba(255,255,255,0.7)" : "var(--set-text-sec)" }}
                  >
                    Developer
                  </p>
                </div>
              </button>
            );
          }

          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="flex items-center gap-2 px-2 py-[5px] rounded-md transition-colors cursor-pointer"
              style={{
                background: isActive ? "var(--set-active)" : "transparent",
              }}
            >
              <div
                className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center flex-shrink-0"
                style={{ background: item.iconBg }}
              >
                <Icon className="w-3 h-3 text-white" strokeWidth={2.5} />
              </div>
              <span
                className="text-[12px] font-medium truncate"
                style={{ color: isActive ? "#fff" : "var(--set-text)" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Content panels
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Section wrapper ── */
function Section({ title, children }) {
  return (
    <div className="mb-5">
      {title && (
        <h3
          className="text-[13px] font-semibold mb-2.5 px-1"
          style={{ color: "var(--set-text)" }}
        >
          {title}
        </h3>
      )}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--set-card)",
          border: "0.5px solid var(--set-card-border)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Row inside a section card ── */
function Row({ label, last, children }) {
  return (
    <div
      className="flex items-center justify-between px-3.5 py-2.5"
      style={{
        borderBottom: last ? "none" : "0.5px solid var(--set-card-border)",
      }}
    >
      <span className="text-[12px] font-medium" style={{ color: "var(--set-text)" }}>
        {label}
      </span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

/* ── Profile panel ── */
function ProfilePanel() {
  return (
    <div className="p-5">
      <div className="flex flex-col items-center mb-5">
        <img
          src="/profile.jpg"
          alt="Khang Phan"
          className="w-20 h-20 rounded-full object-cover object-top mb-3"
          style={{ border: "3px solid var(--set-card-border)" }}
        />
        <h2 className="text-[16px] font-bold" style={{ color: "var(--set-text)" }}>
          Khang Phan
        </h2>
        <p className="text-[11px]" style={{ color: "var(--set-text-sec)" }}>
          CS Student · Full-Stack Developer
        </p>
      </div>

      <Section>
        <Row label="Name">
          <span className="text-[12px]" style={{ color: "var(--set-text-sec)" }}>Khang Phan</span>
        </Row>
        <Row label="School">
          <span className="text-[12px]" style={{ color: "var(--set-text-sec)" }}>University of South Florida</span>
        </Row>
        <Row label="Major">
          <span className="text-[12px]" style={{ color: "var(--set-text-sec)" }}>Computer Science</span>
        </Row>
        <Row label="Focus" last>
          <span className="text-[12px]" style={{ color: "var(--set-text-sec)" }}>Full-Stack Dev & AI/ML</span>
        </Row>
      </Section>
    </div>
  );
}

/* ── Appearance panel ── */
function AppearancePanel({ isDark, toggleTheme, accent, applyAccent }) {
  return (
    <div className="p-5">
      <Section title="Appearance">
        <div className="flex gap-3 p-3.5">
          {[
            { label: "Light", dark: false, bg: "#f5f5f7", border: "#d1d1d6", inner: "#ffffff" },
            { label: "Dark", dark: true, bg: "#1c1c1e", border: "#3a3a3c", inner: "#2c2c2e" },
          ].map((mode) => {
            const isActive = isDark === mode.dark;
            return (
              <button
                key={mode.label}
                onClick={() => { if (isDark !== mode.dark) toggleTheme(); }}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <div
                  className="w-[72px] h-[48px] rounded-lg overflow-hidden transition-all"
                  style={{
                    background: mode.bg,
                    border: isActive
                      ? "2.5px solid var(--set-active)"
                      : `1px solid ${mode.border}`,
                    boxShadow: isActive ? "0 0 0 1px var(--set-active)" : "none",
                  }}
                >
                  {/* Mini window preview */}
                  <div className="p-1.5 h-full flex flex-col">
                    <div
                      className="flex gap-[2px] mb-1"
                    >
                      <div className="w-[4px] h-[4px] rounded-full bg-[#FF5F57]" />
                      <div className="w-[4px] h-[4px] rounded-full bg-[#FFBD2E]" />
                      <div className="w-[4px] h-[4px] rounded-full bg-[#28C840]" />
                    </div>
                    <div className="flex-1 rounded" style={{ background: mode.inner }} />
                  </div>
                </div>
                <span
                  className="text-[11px] font-medium"
                  style={{ color: isActive ? "var(--set-active)" : "var(--set-text-sec)" }}
                >
                  {mode.label}
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Accent Color">
        <div className="p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] font-medium" style={{ color: "var(--set-text)" }}>Color</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {ACCENT_COLORS.map((c) => {
              const isActive = accent === c.name || (c.name === "Multicolor" && accent === "Indigo");
              const color = isDark ? c.dark : c.light;
              return (
                <button
                  key={c.name}
                  onClick={() => applyAccent(c.name === "Multicolor" ? "Indigo" : c.name)}
                  className="relative flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div
                    className="w-7 h-7 rounded-full transition-transform group-hover:scale-110 flex items-center justify-center"
                    style={{
                      background: c.multi
                        ? "conic-gradient(#FF2D55, #FF9500, #FFCC00, #34C759, #007AFF, #AF52DE, #FF2D55)"
                        : color,
                      boxShadow: isActive ? `0 0 0 2px var(--set-bg), 0 0 0 4px ${color}` : "none",
                    }}
                  >
                    {isActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  {isActive && (
                    <span className="text-[9px]" style={{ color: "var(--set-text-sec)" }}>
                      {c.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ── Wallpaper panel ── */
function WallpaperPanel({ wallpaper, applyWallpaper }) {
  return (
    <div className="p-5">
      <Section title="Desktop Wallpaper">
        <div className="p-3.5">
          {/* Current wallpaper preview */}
          <div className="mb-4">
            <div
              className="w-full aspect-[16/10] rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--set-card-border)" }}
            >
              <img
                src={WALLPAPERS.find((w) => w.id === wallpaper)?.src || WALLPAPERS[0].src}
                alt="Current wallpaper"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] text-center mt-1.5" style={{ color: "var(--set-text-sec)" }}>
              {WALLPAPERS.find((w) => w.id === wallpaper)?.name || "Default"}
            </p>
          </div>

          {/* Wallpaper grid */}
          <div className="grid grid-cols-3 gap-2">
            {WALLPAPERS.map((wp) => {
              const isActive = wallpaper === wp.id;
              return (
                <button
                  key={wp.id}
                  onClick={() => applyWallpaper(wp.id)}
                  className="relative rounded-lg overflow-hidden transition-all cursor-pointer hover:scale-[1.03]"
                  style={{
                    border: isActive
                      ? "2.5px solid var(--set-active)"
                      : "1px solid var(--set-card-border)",
                    boxShadow: isActive ? "0 0 0 1px var(--set-active)" : "none",
                  }}
                >
                  <div className="aspect-[16/10] w-full">
                    <img
                      src={wp.src}
                      alt={wp.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {isActive && (
                    <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: "var(--set-active)" }}>
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ── Accent Color panel ── */
function AccentPanel({ isDark, accent, applyAccent }) {
  return (
    <div className="p-5">
      <Section title="Theme Color">
        <div className="p-3.5">
          <div className="flex items-center gap-3 flex-wrap">
            {ACCENT_COLORS.map((c) => {
              const isActive = accent === c.name || (c.name === "Multicolor" && accent === "Indigo");
              const color = isDark ? c.dark : c.light;
              return (
                <button
                  key={c.name}
                  onClick={() => applyAccent(c.name === "Multicolor" ? "Indigo" : c.name)}
                  className="relative flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div
                    className="w-9 h-9 rounded-full transition-transform group-hover:scale-110 flex items-center justify-center"
                    style={{
                      background: c.multi
                        ? "conic-gradient(#FF2D55, #FF9500, #FFCC00, #34C759, #007AFF, #AF52DE, #FF2D55)"
                        : color,
                      boxShadow: isActive ? `0 0 0 2px var(--set-bg), 0 0 0 4px ${color}` : "none",
                    }}
                  >
                    {isActive && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                  </div>
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: isActive ? (isDark ? c.dark : c.light) : "var(--set-text-sec)" }}
                  >
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Preview */}
      <Section title="Preview">
        <div className="p-3.5 flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-md text-[11px] font-medium text-white"
            style={{ background: "var(--color-primary)" }}>
            Button
          </div>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--set-card-border)" }}>
            <div className="h-full w-2/3 rounded-full" style={{ background: "var(--color-primary)" }} />
          </div>
          <div
            className="w-10 h-5 rounded-full relative cursor-pointer"
            style={{ background: "var(--color-primary)" }}
          >
            <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ── Cursor panel ── */
function CursorPanel({ cursor, applyCursor }) {
  return (
    <div className="p-5">
      <Section title="Cursor Style">
        <div className="flex flex-col">
          {CURSOR_STYLES.map((s, i) => {
            const isActive = cursor === s.id;
            return (
              <button
                key={s.id}
                onClick={() => applyCursor(s.id)}
                className="flex items-center justify-between px-3.5 py-2.5 transition-colors cursor-pointer"
                style={{
                  borderBottom: i < CURSOR_STYLES.length - 1 ? "0.5px solid var(--set-card-border)" : "none",
                  background: isActive ? "var(--set-row-active)" : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--set-icon-bg)" }}
                  >
                    <MousePointer
                      className="w-4 h-4"
                      style={{ color: isActive ? "var(--color-primary)" : "var(--set-text-sec)" }}
                    />
                  </div>
                  <span
                    className="text-[12px] font-medium capitalize"
                    style={{ color: "var(--set-text)" }}
                  >
                    {s.label}
                  </span>
                </div>
                {isActive && (
                  <Check className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                )}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

/* ── About panel ── */
function AboutPanel() {
  return (
    <div className="p-5">
      <div className="flex flex-col items-center mb-5">
        <img
          src="/official_logo.jpg"
          alt="KP"
          className="w-16 h-16 rounded-2xl object-cover mb-3"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
        />
        <h2 className="text-[18px] font-bold" style={{ color: "var(--set-text)" }}>KhangOS</h2>
        <p className="text-[11px]" style={{ color: "var(--set-text-sec)" }}>Version 2.0.26</p>
      </div>

      <Section>
        <Row label="Built with">
          <span className="text-[11px]" style={{ color: "var(--set-text-sec)" }}>React + Vite + Tailwind</span>
        </Row>
        <Row label="Animations">
          <span className="text-[11px]" style={{ color: "var(--set-text-sec)" }}>Framer Motion</span>
        </Row>
        <Row label="3D">
          <span className="text-[11px]" style={{ color: "var(--set-text-sec)" }}>Three.js + R3F</span>
        </Row>
        <Row label="Developer" last>
          <span className="text-[11px]" style={{ color: "var(--set-text-sec)" }}>Khang Phan</span>
        </Row>
      </Section>

      <p className="text-[10px] text-center mt-4" style={{ color: "var(--set-text-ter)" }}>
        © {new Date().getFullYear()} Khang Phan. All rights reserved.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Main
   ═══════════════════════════════════════════════════════════════════════ */

export default function SettingsApp() {
  const [active, setActive] = useState("appearance");
  const [accent, setAccent] = useState(() => localStorage.getItem("accent-color") || "Indigo");
  const [cursor, setCursor] = useState(() => localStorage.getItem("cursor-style") || "ring");
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem("wallpaper") || "default");
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const applyAccent = (name) => {
    setAccent(name);
    const c = ACCENT_COLORS.find((a) => a.name === name);
    if (!c) return;
    const root = document.documentElement;
    const color = isDark ? c.dark : c.light;
    const rgb = isDark ? c.rgbDark : c.rgbLight;
    root.style.setProperty("--color-primary", color);
    root.style.setProperty("--color-primary-rgb", rgb);
    localStorage.setItem("accent-color", name);
  };

  const applyCursor = (style) => {
    setCursor(style);
    localStorage.setItem("cursor-style", style);
    window.dispatchEvent(new Event("storage"));
  };

  const applyWallpaper = (id) => {
    setWallpaper(id);
    localStorage.setItem("wallpaper", id);
    window.dispatchEvent(new Event("wallpaper-change"));
  };

  const toggleTheme = () => {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    window.dispatchEvent(new Event("theme-change"));
    setIsDark(nextIsDark);
  };

  const panels = {
    profile: <ProfilePanel />,
    appearance: <AppearancePanel isDark={isDark} toggleTheme={toggleTheme} accent={accent} applyAccent={applyAccent} />,
    wallpaper: <WallpaperPanel wallpaper={wallpaper} applyWallpaper={applyWallpaper} />,
    accent: <AccentPanel isDark={isDark} accent={accent} applyAccent={applyAccent} />,
    cursor: <CursorPanel cursor={cursor} applyCursor={applyCursor} />,
    about: <AboutPanel />,
  };

  return (
    <div
      className="h-full flex overflow-hidden"
      style={{
        "--set-bg": isDark ? "#1c1c1e" : "#f5f5f7",
        "--set-sidebar": isDark ? "rgba(28,28,30,0.95)" : "rgba(245,245,247,0.95)",
        "--set-text": isDark ? "#f5f5f7" : "#1d1d1f",
        "--set-text-sec": isDark ? "#98989d" : "#6e6e73",
        "--set-text-ter": isDark ? "#636366" : "#aeaeb2",
        "--set-border": isDark ? "#38383a" : "#d2d2d7",
        "--set-card": isDark ? "#2c2c2e" : "#ffffff",
        "--set-card-border": isDark ? "#38383a" : "#e5e5ea",
        "--set-search-bg": isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
        "--set-active": isDark ? "#0A84FF" : "#007AFF",
        "--set-row-active": isDark ? "rgba(10,132,255,0.1)" : "rgba(0,122,255,0.06)",
        "--set-icon-bg": isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)",
        background: "var(--set-bg)",
      }}
    >
      {/* Sidebar */}
      <Sidebar active={active} onSelect={setActive} isDark={isDark} />

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Title bar */}
        <div
          className="sticky top-0 z-10 px-5 py-3 flex items-center"
          style={{
            borderBottom: "0.5px solid var(--set-border)",
            background: "var(--set-bg)",
          }}
        >
          <h2
            className="text-[15px] font-semibold"
            style={{ color: "var(--set-text)" }}
          >
            {SIDEBAR_ITEMS.find((s) => s.id === active)?.label ||
              (active === "profile" ? "Profile" : "")}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            {panels[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
