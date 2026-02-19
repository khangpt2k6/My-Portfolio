"use client";

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";

// ── Navigation links ────────────────────────────────────────────────────────
const navLinks = [
  { name: "About", to: "hero" },
  { name: "Experience", to: "experience" },
  { name: "Projects", to: "projects" },
  { name: "Skills", to: "skills" },
];

// ── Component ───────────────────────────────────────────────────────────────
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [theme, setTheme] = useState("light");

  // ── Scroll detection & scroll-spy ─────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["hero", "experience", "projects", "skills"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Theme: initialise from localStorage / system preference ───────────────
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  // ── Theme: persist & apply ────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  // ── Close mobile menu on resize to desktop ────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Derived glass background color ────────────────────────────────────────
  const isDark = theme === "dark";
  const glassBg = isDark
    ? scrolled
      ? "rgba(10, 14, 26, 0.90)"
      : "rgba(10, 14, 26, 0.70)"
    : scrolled
      ? "rgba(255, 255, 255, 0.90)"
      : "rgba(255, 255, 255, 0.70)";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-3 pointer-events-none">
      <motion.div
        initial={false}
        animate={{ backgroundColor: glassBg }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="
          pointer-events-auto
          w-full max-w-6xl rounded-2xl
          backdrop-blur-xl
          shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]
        "
      >
        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <Link
            to="hero"
            smooth
            duration={500}
            className="cursor-pointer flex-shrink-0"
          >
            <motion.img
              src="RiK.png"
              alt="RiK Logo"
              className="h-9 w-auto"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.to;
              return (
                <Link
                  key={link.name}
                  to={link.to}
                  spy
                  smooth
                  offset={-80}
                  duration={500}
                  className="
                    relative px-4 py-2 text-sm font-medium
                    cursor-pointer select-none rounded-full
                    transition-colors duration-200
                  "
                  style={{
                    color: isActive
                      ? "var(--color-primary)"
                      : "var(--color-text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.color = "var(--color-text)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.color = "var(--color-text-muted)";
                  }}
                >
                  {/* Animated pill that slides between the active link */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        opacity: 0.1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle — animated Sun / Moon swap */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              className="
                relative h-9 w-9 flex items-center justify-center
                rounded-full transition-colors duration-200
              "
              style={{ color: "var(--color-text)" }}
              aria-label="Toggle theme"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--color-surface2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute flex items-center justify-center"
                  >
                    <Sun size={18} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute flex items-center justify-center"
                  >
                    <Moon size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile hamburger — animated Menu / X swap */}
            <motion.button
              onClick={() => setIsOpen((prev) => !prev)}
              whileTap={{ scale: 0.9 }}
              className="
                md:hidden relative h-9 w-9 flex items-center justify-center
                rounded-full transition-colors duration-200
              "
              style={{ color: "var(--color-text)" }}
              aria-label="Toggle menu"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--color-surface2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute flex items-center justify-center"
                  >
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute flex items-center justify-center"
                  >
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ── Mobile dropdown ──────────────────────────────────────────── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1 px-4 pb-4 pt-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.to;
                  return (
                    <Link
                      key={link.name}
                      to={link.to}
                      spy
                      smooth
                      offset={-80}
                      duration={500}
                      onClick={() => setIsOpen(false)}
                      className="
                        relative px-4 py-2.5 text-sm font-medium
                        cursor-pointer select-none rounded-xl
                        transition-colors duration-200
                      "
                      style={{
                        color: isActive
                          ? "var(--color-primary)"
                          : "var(--color-text-muted)",
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-pill-mobile"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            backgroundColor: "var(--color-primary)",
                            opacity: 0.1,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10">{link.name}</span>
                    </Link>
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
