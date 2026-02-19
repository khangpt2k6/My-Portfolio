import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";

// ── Accent color definitions ────────────────────────────────────────────────
const ACCENT_COLORS = [
  {
    name: "Indigo",
    light: "#6366F1",
    dark: "#818CF8",
    rgbLight: "99, 102, 241",
    rgbDark: "129, 140, 248",
  },
  {
    name: "Cyan",
    light: "#06B6D4",
    dark: "#22D3EE",
    rgbLight: "6, 182, 212",
    rgbDark: "34, 211, 238",
  },
  {
    name: "Purple",
    light: "#9333EA",
    dark: "#A855F7",
    rgbLight: "147, 51, 234",
    rgbDark: "168, 85, 247",
  },
  {
    name: "Emerald",
    light: "#059669",
    dark: "#34D399",
    rgbLight: "5, 150, 105",
    rgbDark: "52, 211, 153",
  },
  {
    name: "Rose",
    light: "#E11D48",
    dark: "#FB7185",
    rgbLight: "225, 29, 72",
    rgbDark: "251, 113, 133",
  },
  {
    name: "Amber",
    light: "#D97706",
    dark: "#FBBF24",
    rgbLight: "217, 119, 6",
    rgbDark: "251, 191, 36",
  },
];

// ── Transition style options ────────────────────────────────────────────────
const TRANSITIONS = ["Fade", "Slide", "Zoom"];

// ── Helpers ─────────────────────────────────────────────────────────────────
const isDarkMode = () =>
  document.documentElement.classList.contains("dark");

const applyAccentColor = (colorObj) => {
  const dark = isDarkMode();
  const color = dark ? colorObj.dark : colorObj.light;
  const rgb = dark ? colorObj.rgbDark : colorObj.rgbLight;
  document.documentElement.style.setProperty("--color-primary", color);
  document.documentElement.style.setProperty("--color-primary-rgb", rgb);
};

// ── Component ───────────────────────────────────────────────────────────────
const SettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("Indigo");
  const [selectedTransition, setSelectedTransition] = useState("Fade");
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  // ── Initialise from localStorage on mount ───────────────────────────────
  useEffect(() => {
    const savedColor = localStorage.getItem("accent-color") || "Indigo";
    const savedTransition = localStorage.getItem("page-transition") || "Fade";
    setSelectedColor(savedColor);
    setSelectedTransition(savedTransition);

    const colorObj = ACCENT_COLORS.find((c) => c.name === savedColor) || ACCENT_COLORS[0];
    applyAccentColor(colorObj);
  }, []);

  // ── Watch for dark/light theme changes via MutationObserver ─────────────
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const colorObj =
        ACCENT_COLORS.find((c) => c.name === selectedColor) || ACCENT_COLORS[0];
      applyAccentColor(colorObj);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [selectedColor]);

  // ── Close on outside click ──────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleColorChange = useCallback((colorObj) => {
    setSelectedColor(colorObj.name);
    localStorage.setItem("accent-color", colorObj.name);
    applyAccentColor(colorObj);
  }, []);

  const handleTransitionChange = useCallback((transition) => {
    setSelectedTransition(transition);
    localStorage.setItem("page-transition", transition);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Floating trigger button ──────────────────────────────────── */}
      <motion.button
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="
          fixed bottom-6 right-6 z-50
          w-10 h-10 rounded-full
          flex items-center justify-center
          bg-[var(--color-primary)] text-white
          shadow-lg shadow-[rgba(var(--color-primary-rgb),0.4)]
          transition-shadow duration-300
        "
        aria-label="Customize appearance"
      >
        <Palette size={18} />

        {/* Pulse ring when idle (hidden while panel is open) */}
        {!isOpen && (
          <span
            className="
              absolute inset-0 rounded-full
              bg-[var(--color-primary)] opacity-40
              animate-ping
            "
            style={{ animationDuration: "2s" }}
          />
        )}
      </motion.button>

      {/* ── Settings panel ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="
              fixed bottom-20 right-6 z-50
              w-[280px] rounded-2xl p-5
              glass-card backdrop-blur-2xl
            "
          >
            {/* ── Accent Color Picker ─────────────────────────────────── */}
            <div className="mb-5">
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--color-text-muted)" }}
              >
                Accent Color
              </p>

              <div className="flex items-center gap-2.5">
                {ACCENT_COLORS.map((colorObj) => {
                  const isSelected = selectedColor === colorObj.name;
                  const swatch = isDarkMode() ? colorObj.dark : colorObj.light;

                  return (
                    <button
                      key={colorObj.name}
                      onClick={() => handleColorChange(colorObj)}
                      aria-label={`Select ${colorObj.name} accent color`}
                      className="
                        relative w-7 h-7 rounded-full
                        flex items-center justify-center
                        transition-transform duration-200
                        hover:scale-110 focus:outline-none
                      "
                      style={{
                        backgroundColor: swatch,
                        boxShadow: isSelected
                          ? `0 0 0 2px var(--color-bg, #fff), 0 0 0 4px ${swatch}`
                          : "none",
                      }}
                    >
                      {isSelected && (
                        <Check
                          size={14}
                          strokeWidth={3}
                          className="text-white drop-shadow-sm"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Transition Style ────────────────────────────────────── */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--color-text-muted)" }}
              >
                Transitions
              </p>

              <div className="flex items-center gap-2">
                {TRANSITIONS.map((t) => {
                  const isActive = selectedTransition === t;
                  return (
                    <button
                      key={t}
                      onClick={() => handleTransitionChange(t)}
                      className="
                        flex-1 py-1.5 rounded-lg text-xs font-medium
                        transition-colors duration-200
                        focus:outline-none
                      "
                      style={{
                        backgroundColor: isActive
                          ? "var(--color-primary)"
                          : "var(--color-surface2)",
                        color: isActive ? "#fff" : "var(--color-text-muted)",
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsPanel;
