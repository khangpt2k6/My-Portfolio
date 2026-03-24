import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Palette, MousePointer, Monitor, Image, Check } from "lucide-react";
import { CURSOR_STYLES } from "../components/ui/CustomCursor";

const WALLPAPERS = [
  { id: "dynamic", name: "Dynamic", src: null },
  { id: "bV6xf3", name: "Mountain", src: "/desktop_background/bV6xf3.webp" },
  { id: "sea", name: "Sea", src: "/desktop_background/colourful-textured-background-desktop-sea-600nw-2432936989.webp" },
  { id: "icH5Aj", name: "Aurora", src: "/desktop_background/icH5Aj.webp" },
  { id: "lake", name: "Lakeside", src: "/desktop_background/lake-side-trees-live-desktop-jwhxpov3u0jdebb0.jpg" },
  { id: "nature", name: "Nature", src: "/desktop_background/nature-background-high-resolution-wallpaper-for-a-serene-and-stunning-view-free-photo.jpg" },
  { id: "landscape", name: "Landscape", src: "/desktop_background/stunning-high-resolution-nature-and-landscape-backgrounds-breathtaking-scenery-in-hd-free-photo.jpg" },
];

const ACCENT_COLORS = [
  { name: "Indigo", light: "#6366F1", dark: "#818CF8", rgbLight: "99, 102, 241", rgbDark: "129, 140, 248" },
  { name: "Cyan", light: "#06B6D4", dark: "#22D3EE", rgbLight: "6, 182, 212", rgbDark: "34, 211, 238" },
  { name: "Purple", light: "#9333EA", dark: "#A855F7", rgbLight: "147, 51, 234", rgbDark: "168, 85, 247" },
  { name: "Emerald", light: "#059669", dark: "#34D399", rgbLight: "5, 150, 105", rgbDark: "52, 211, 153" },
  { name: "Rose", light: "#E11D48", dark: "#FB7185", rgbLight: "225, 29, 72", rgbDark: "251, 113, 133" },
  { name: "Amber", light: "#D97706", dark: "#FBBF24", rgbLight: "217, 119, 6", rgbDark: "251, 191, 36" },
];

export default function SettingsApp() {
  const [accent, setAccent] = useState(() => localStorage.getItem("accent-color") || "Indigo");
  const [cursor, setCursor] = useState(() => localStorage.getItem("cursor-style") || "ring");
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem("wallpaper") || "dynamic");
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

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
    document.documentElement.classList.toggle("dark");
    setIsDark((prev) => !prev);
  };

  return (
    <div className="h-full overflow-auto p-4 space-y-5" style={{ background: "var(--color-surface)" }}>
      {/* Appearance */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-bold text-[var(--color-text)]">Appearance</h3>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => { if (isDark) toggleTheme(); }}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
              ${!isDark ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10" : "border-[var(--glass-border)]"}`}
          >
            <div className="w-16 h-10 rounded-lg bg-white border border-gray-200" />
            <span className="text-xs font-medium text-[var(--color-text)]">Light</span>
          </button>
          <button
            onClick={() => { if (!isDark) toggleTheme(); }}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
              ${isDark ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10" : "border-[var(--glass-border)]"}`}
          >
            <div className="w-16 h-10 rounded-lg bg-gray-900 border border-gray-700" />
            <span className="text-xs font-medium text-[var(--color-text)]">Dark</span>
          </button>
        </div>
      </section>

      {/* Wallpaper */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Image className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-bold text-[var(--color-text)]">Wallpaper</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {WALLPAPERS.map((wp) => (
            <button
              key={wp.id}
              onClick={() => applyWallpaper(wp.id)}
              className={`relative rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.03]
                ${wallpaper === wp.id
                  ? "border-[var(--color-primary)] shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.4)]"
                  : "border-transparent"
                }`}
            >
              <div className="aspect-[16/10] w-full">
                {wp.src ? (
                  <img
                    src={wp.src}
                    alt={wp.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{
                      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[10px] text-white/50 font-medium">Dynamic</span>
                    </div>
                  </div>
                )}
              </div>
              {wallpaper === wp.id && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 py-1 text-center text-[10px] font-medium text-white bg-black/40 backdrop-blur-sm">
                {wp.name}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Accent Color */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-bold text-[var(--color-text)]">Accent Color</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.name}
              className="relative w-8 h-8 rounded-full transition-transform hover:scale-110"
              style={{ background: isDark ? c.dark : c.light }}
              onClick={() => applyAccent(c.name)}
            >
              {accent === c.name && (
                <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Cursor Style */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MousePointer className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-bold text-[var(--color-text)]">Cursor Style</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {CURSOR_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => applyCursor(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all
                ${cursor === s.id
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--glass-bg)] text-[var(--color-text)] border border-[var(--glass-border)]"
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
