"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, Palette, Check } from "lucide-react";

// ── Navigation links ────────────────────────────────────────────────────────
const navLinks = [
  { name: "About", to: "/" },
  { name: "Experience", to: "/experience" },
  { name: "Projects", to: "/projects" },
  { name: "Skills", to: "/skills" },
  { name: "Education", to: "/education" },
  { name: "Playground", to: "/playground" },
];

// ── Accent colors ───────────────────────────────────────────────────────────
const ACCENT_COLORS = [
  { name: "Indigo", light: "#6366F1", dark: "#818CF8", rgbLight: "99, 102, 241", rgbDark: "129, 140, 248" },
  { name: "Cyan", light: "#06B6D4", dark: "#22D3EE", rgbLight: "6, 182, 212", rgbDark: "34, 211, 238" },
  { name: "Purple", light: "#9333EA", dark: "#A855F7", rgbLight: "147, 51, 234", rgbDark: "168, 85, 247" },
  { name: "Emerald", light: "#059669", dark: "#34D399", rgbLight: "5, 150, 105", rgbDark: "52, 211, 153" },
  { name: "Rose", light: "#E11D48", dark: "#FB7185", rgbLight: "225, 29, 72", rgbDark: "251, 113, 133" },
  { name: "Amber", light: "#D97706", dark: "#FBBF24", rgbLight: "217, 119, 6", rgbDark: "251, 191, 36" },
];

const TRANSITIONS = ["Fade", "Slide", "Zoom"];

const isDarkMode = () => document.documentElement.classList.contains("dark");

const applyAccentColor = (colorObj) => {
  const dark = isDarkMode();
  document.documentElement.style.setProperty("--color-primary", dark ? colorObj.dark : colorObj.light);
  document.documentElement.style.setProperty("--color-primary-rgb", dark ? colorObj.rgbDark : colorObj.rgbLight);
};

// ── Component ───────────────────────────────────────────────────────────────
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("light");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("Indigo");
  const [selectedTransition, setSelectedTransition] = useState("Fade");

  const paletteRef = useRef(null);
  const paletteBtnRef = useRef(null);
  const location = useLocation();

  // ── Scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Theme: init ───────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  // ── Theme: persist ────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  // ── Accent color: init ────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("accent-color") || "Indigo";
    const savedT = localStorage.getItem("page-transition") || "Fade";
    setSelectedColor(saved);
    setSelectedTransition(savedT);
    const colorObj = ACCENT_COLORS.find((c) => c.name === saved) || ACCENT_COLORS[0];
    applyAccentColor(colorObj);
  }, []);

  // ── Re-apply accent on theme change ───────────────────────────────────────
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const colorObj = ACCENT_COLORS.find((c) => c.name === selectedColor) || ACCENT_COLORS[0];
      applyAccentColor(colorObj);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [selectedColor]);

  // ── Close palette on outside click ────────────────────────────────────────
  useEffect(() => {
    if (!paletteOpen) return;
    const handler = (e) => {
      if (
        paletteRef.current && !paletteRef.current.contains(e.target) &&
        paletteBtnRef.current && !paletteBtnRef.current.contains(e.target)
      ) {
        setPaletteOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [paletteOpen]);

  const handleColorChange = useCallback((colorObj) => {
    setSelectedColor(colorObj.name);
    localStorage.setItem("accent-color", colorObj.name);
    applyAccentColor(colorObj);
  }, []);

  const handleTransitionChange = useCallback((t) => {
    setSelectedTransition(t);
    localStorage.setItem("page-transition", t);
  }, []);

  // ── Close mobile menu on resize ───────────────────────────────────────────
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setIsOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isDark = theme === "dark";
  const glassBg = isDark
    ? scrolled ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.3)"
    : scrolled ? "rgba(255, 255, 255, 0.90)" : "rgba(255, 255, 255, 0.70)";

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-3 pointer-events-none">
      <motion.div
        initial={false}
        animate={{ backgroundColor: glassBg }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="pointer-events-auto w-full max-w-6xl rounded-2xl border border-white/[0.06] backdrop-blur-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]"
      >
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <NavLink to="/" className="cursor-pointer flex-shrink-0">
            <motion.img
              src="/official_logo.jpg"
              alt="Khang Phan"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-[var(--color-border)] hover:ring-[var(--color-primary)] transition-all"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            />
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <NavLink
                  key={link.name}
                  to={link.to}
                  className="relative px-4 py-2 text-sm font-medium cursor-pointer select-none rounded-full transition-colors duration-200"
                  style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-muted)" }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "var(--color-text)"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "var(--color-text-muted)"; }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: "var(--color-primary)", opacity: 0.15 }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-1.5">
            {/* Palette button — pill style to match theme toggle */}
            <div className="relative">
              <motion.button
                ref={paletteBtnRef}
                onClick={() => setPaletteOpen((p) => !p)}
                whileTap={{ scale: 0.9 }}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface2)] border border-[var(--color-border)] backdrop-blur-xl transition-colors duration-200"
                style={{ color: paletteOpen ? "var(--color-primary)" : "var(--color-text)" }}
                aria-label="Customize colors"
              >
                <Palette size={16} />
                <span className="text-xs font-medium select-none hidden sm:inline">Theme</span>
              </motion.button>

              {/* Palette dropdown */}
              <AnimatePresence>
                {paletteOpen && (
                  <motion.div
                    ref={paletteRef}
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-12 right-0 z-50 w-[240px] p-4 rounded-xl glass-card backdrop-blur-2xl border border-[var(--color-border)] shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
                  >
                    {/* Color swatches */}
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2.5">
                      Accent Color
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      {ACCENT_COLORS.map((c) => {
                        const isSelected = selectedColor === c.name;
                        const swatch = isDark ? c.dark : c.light;
                        return (
                          <button
                            key={c.name}
                            onClick={() => handleColorChange(c)}
                            className="relative w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
                            style={{
                              backgroundColor: swatch,
                              boxShadow: isSelected ? `0 0 0 2px var(--color-bg), 0 0 0 4px ${swatch}` : "none",
                            }}
                            aria-label={`Select ${c.name}`}
                          >
                            {isSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Transitions */}
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2.5">
                      Transitions
                    </p>
                    <div className="flex items-center gap-1.5">
                      {TRANSITIONS.map((t) => {
                        const isActive = selectedTransition === t;
                        return (
                          <button
                            key={t}
                            onClick={() => handleTransitionChange(t)}
                            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                            style={{
                              backgroundColor: isActive ? "var(--color-primary)" : "var(--color-surface2)",
                              color: isActive ? "#fff" : "var(--color-text-muted)",
                            }}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface2)] border border-[var(--color-border)] backdrop-blur-xl transition-colors duration-200"
              style={{ color: "var(--color-text)" }}
              aria-label="Toggle theme"
            >
              <span className="relative h-[18px] w-[18px] flex items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  {theme === "dark" ? (
                    <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="absolute flex items-center justify-center">
                      <Sun size={18} />
                    </motion.span>
                  ) : (
                    <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="absolute flex items-center justify-center">
                      <Moon size={18} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="text-xs font-medium select-none">
                {theme === "dark" ? "Light" : "Dark"}
              </span>
            </motion.button>

            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setIsOpen((prev) => !prev)}
              whileTap={{ scale: 0.9 }}
              className="md:hidden relative h-9 w-9 flex items-center justify-center rounded-full transition-colors duration-200"
              style={{ color: "var(--color-text)" }}
              aria-label="Toggle menu"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface2)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }} className="absolute flex items-center justify-center">
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} className="absolute flex items-center justify-center">
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1 px-4 pb-4 pt-1 backdrop-blur-xl">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <NavLink
                      key={link.name}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className="relative px-4 py-2.5 text-sm font-medium cursor-pointer select-none rounded-xl transition-colors duration-200"
                      style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-muted)" }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-pill-mobile"
                          className="absolute inset-0 rounded-xl"
                          style={{ backgroundColor: "var(--color-primary)", opacity: 0.15 }}
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{link.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
};

export default Navbar;
