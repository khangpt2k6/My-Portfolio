"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Palette, Check, MousePointer } from "lucide-react";
import { CURSOR_STYLES } from "../ui/CustomCursor";
import ThemeToggle from "../ui/ThemeToggle";
import MiniPlayer from "../ui/MiniPlayer";

// ── Navigation links ────────────────────────────────────────────────────────
const navLinks = [
  { name: "About", to: "/", hash: "#about" },
  { name: "Experience", to: "/", hash: "#experience" },
  { name: "Projects", to: "/", hash: "#projects" },
  { name: "Skills", to: "/", hash: "#skills" },
  { name: "Contact", to: "/", hash: "#contact" },
  { name: "Lab", to: "/lab" },
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

/* ── Desktop nav with sliding indicator ── */
const DesktopNav = ({ navLinks, getIsActive, handleNavClick }) => {
  const containerRef = useRef(null);
  const linkRefs = useRef({});
  const pillRef = useRef(null);
  const underlineRef = useRef(null);

  // Find active link name to use as dependency
  const activeName = navLinks.find((l) => getIsActive(l))?.name || "";

  // Measure active link and move indicator via refs (no state, no re-render loop)
  useEffect(() => {
    const el = linkRefs.current[activeName];
    const container = containerRef.current;
    if (!el || !container) {
      if (pillRef.current) pillRef.current.style.opacity = "0";
      if (underlineRef.current) underlineRef.current.style.opacity = "0";
      return;
    }
    const cRect = container.getBoundingClientRect();
    const lRect = el.getBoundingClientRect();
    const left = lRect.left - cRect.left;
    const width = lRect.width;

    if (pillRef.current) {
      pillRef.current.style.opacity = "0.12";
      pillRef.current.style.left = `${left}px`;
      pillRef.current.style.width = `${width}px`;
    }
    if (underlineRef.current) {
      underlineRef.current.style.opacity = "1";
      underlineRef.current.style.left = `${left + width * 0.15}px`;
      underlineRef.current.style.width = `${width * 0.7}px`;
    }
  }, [activeName]);

  return (
    <div ref={containerRef} className="hidden md:flex items-center gap-0.5 relative">
      {/* Sliding pill background */}
      <div
        ref={pillRef}
        className="absolute top-0 bottom-0 rounded-full pointer-events-none"
        style={{
          backgroundColor: "var(--color-primary)",
          opacity: 0,
          boxShadow: "0 0 20px rgba(var(--color-primary-rgb), 0.15)",
          transition: "left 0.35s cubic-bezier(0.25, 1, 0.5, 1), width 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s ease",
        }}
      />

      {/* Sliding underline */}
      <div
        ref={underlineRef}
        className="absolute -bottom-0.5 h-[2px] rounded-full pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, var(--color-primary), transparent)",
          boxShadow: "0 1px 8px rgba(var(--color-primary-rgb), 0.4)",
          opacity: 0,
          transition: "left 0.35s cubic-bezier(0.25, 1, 0.5, 1), width 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s ease",
        }}
      />

      {navLinks.map((link) => {
        const isActive = getIsActive(link);
        return (
          <NavLink
            key={link.name}
            ref={(el) => { linkRefs.current[link.name] = el; }}
            to={link.hash ? "/" : link.to}
            onClick={(e) => handleNavClick(link, e)}
            className="relative px-4 py-2 text-sm font-medium cursor-pointer select-none rounded-full transition-colors duration-200 group"
            style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-muted)" }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "var(--color-text)"; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "var(--color-text-muted)"; }}
          >
            {/* Hover underline (non-active) */}
            <span
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[1.5px] bg-[var(--color-text-muted)]/30 rounded-full transition-all duration-300 w-0 group-hover:w-3/5"
              style={{ display: isActive ? "none" : "block" }}
            />
            <span className="relative z-10">{link.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

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
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("Indigo");
  const [selectedTransition, setSelectedTransition] = useState("Fade");
  const [selectedCursor, setSelectedCursor] = useState("ring");

  const [activeSection, setActiveSection] = useState("about");

  const paletteRef = useRef(null);
  const paletteBtnRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // ── Scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Scroll spy for active section ────────────────────────────────────────
  useEffect(() => {
    if (location.pathname !== "/") return;
    const sectionIds = ["contact", "skills", "projects", "experience", "about"];
    const onScroll = () => {
      const scrollY = window.scrollY + 200;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection("about");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  // ── Theme: init ───────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial = stored || "dark";
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
    const savedC = localStorage.getItem("cursor-style") || "ring";
    setSelectedColor(saved);
    setSelectedTransition(savedT);
    setSelectedCursor(savedC);
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

  const handleCursorChange = useCallback((id) => {
    setSelectedCursor(id);
    localStorage.setItem("cursor-style", id);
  }, []);

  // ── Close mobile menu on resize ───────────────────────────────────────────
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setIsOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollToSection = useCallback((hash) => {
    const el = document.querySelector(hash);
    if (!el) return;
    const navHeight = 80;
    const y = el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  const handleNavClick = useCallback((link, e) => {
    if (link.hash) {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => scrollToSection(link.hash), 150);
      } else {
        scrollToSection(link.hash);
      }
    }
  }, [location.pathname, navigate, scrollToSection]);

  const getIsActive = (link) => {
    if (link.hash) {
      return location.pathname === "/" && activeSection === link.hash.slice(1);
    }
    return location.pathname === link.to;
  };

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
          <DesktopNav navLinks={navLinks} getIsActive={getIsActive} handleNavClick={handleNavClick} />

          {/* Right-side actions */}
          <div className="flex items-center gap-1.5">
            {/* Palette button — pill style to match theme toggle */}
            <div className="relative">
              <motion.button
                ref={paletteBtnRef}
                onClick={() => setPaletteOpen((p) => !p)}
                whileTap={{ scale: 0.9 }}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[var(--color-text)]/8 transition-colors duration-200 cursor-pointer"
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
                    className="absolute top-12 right-0 z-50 w-[260px] p-4 rounded-xl border border-[var(--color-border)]"
                    style={{ background: "var(--window-bg)", boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}
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
                    <div className="flex items-center gap-1.5 mb-4">
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

                    {/* Cursor */}
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2.5 flex items-center gap-1.5">
                      <MousePointer size={10} /> Cursor
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {CURSOR_STYLES.map((c) => {
                        const isActive = selectedCursor === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={() => handleCursorChange(c.id)}
                            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 min-w-[52px]"
                            style={{
                              backgroundColor: isActive ? "var(--color-primary)" : "var(--color-surface2)",
                              color: isActive ? "#fff" : "var(--color-text-muted)",
                            }}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Music player dropdown */}
            <MiniPlayer />

            {/* Theme toggle — animated sun/moon */}
            <div style={{ transform: "scale(1.5)", transformOrigin: "center" }}>
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            </div>

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
                  const isActive = getIsActive(link);
                  return (
                    <NavLink
                      key={link.name}
                      to={link.hash ? "/" : link.to}
                      onClick={(e) => { handleNavClick(link, e); setIsOpen(false); }}
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
