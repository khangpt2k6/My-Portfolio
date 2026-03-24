import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaGraduationCap } from "react-icons/fa";
import about from "../data/about";
import { useWindows } from "../os/WindowContext";

/* ── Tab definitions ──────────────────────────────────────────────────── */
const TABS = ["Overview", "Education", "Skills", "Links"];

/* ── Overview tab (matches macOS About This Mac layout) ───────────────── */
function OverviewTab() {
  const { openApp } = useWindows();

  return (
    <div className="flex flex-col items-center pt-6 pb-4 px-6 h-full">
      {/* Profile image in macOS-style circle */}
      <div className="relative w-[120px] h-[120px] mb-5 flex-shrink-0">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(180deg, #d1d1d6 0%, #a1a1a6 100%)",
            padding: "3px",
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-[#2c2c2e]">
            <img
              src={about.image}
              alt="Khang Phan"
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* OS Name — large title */}
      <h1
        className="text-[28px] font-light tracking-tight mb-0.5"
        style={{ color: "var(--atm-text)" }}
      >
        KhangOS
      </h1>

      {/* Version */}
      <p
        className="text-[11px] mb-5"
        style={{ color: "var(--atm-text-secondary)" }}
      >
        Version 2.0.26
      </p>

      {/* Spec rows */}
      <div className="w-full max-w-[300px] space-y-[6px] mb-5">
        <SpecRow label="Model" value="Khang Phan — Developer" />
        <SpecRow label="School" value="University of South Florida" />
        <SpecRow label="Major" value="Computer Science" />
        <SpecRow label="Focus" value="Full-Stack Dev & AI/ML" />
        <SpecRow label="Location" value="Tampa, FL" />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-4">
        <MacButton label="View Resume…" onClick={() => openApp("resume")} />
        <MacButton label="Contact Me…" onClick={() => openApp("contact")} />
      </div>

      {/* Copyright footer */}
      <p
        className="text-[10px] mt-auto"
        style={{ color: "var(--atm-text-tertiary)" }}
      >
        Built with React + Vite — © {new Date().getFullYear()} Khang Phan
      </p>
    </div>
  );
}

/* ── Education tab ────────────────────────────────────────────────────── */
function EducationTab() {
  return (
    <div className="p-6 space-y-4">
      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--atm-card)",
          border: "1px solid var(--atm-border)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--atm-accent-bg)" }}
          >
            <FaGraduationCap className="w-5 h-5" style={{ color: "var(--atm-text-secondary)" }} />
          </div>
          <div className="min-w-0">
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--atm-text)" }}
            >
              University of South Florida
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--atm-text-secondary)" }}
            >
              B.S. Computer Science
            </p>
            <p
              className="text-[11px] mt-0.5"
              style={{ color: "var(--atm-text-tertiary)" }}
            >
              Expected May 2027 · Tampa, FL
            </p>
          </div>
        </div>

        <div
          className="h-px my-3"
          style={{ background: "var(--atm-border)" }}
        />

        <div className="space-y-1.5">
          <SpecRow label="Focus" value="Full-Stack Development & AI/ML" />
          <SpecRow label="Courses" value="Data Structures, Algorithms, OS, AI" />
        </div>
      </div>
    </div>
  );
}

/* ── Skills tab ───────────────────────────────────────────────────────── */
function SkillsTab() {
  const categories = [
    {
      title: "Languages",
      items: ["JavaScript", "TypeScript", "Python", "Java", "C++"],
    },
    {
      title: "Frontend",
      items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
    },
    {
      title: "Backend",
      items: ["Node.js", "Express", "PostgreSQL", "MongoDB"],
    },
    {
      title: "Tools",
      items: ["Git", "Docker", "AWS", "Figma"],
    },
  ];

  return (
    <div className="p-6 space-y-3">
      {categories.map((cat) => (
        <div key={cat.title}>
          <p
            className="text-[11px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: "var(--atm-text-tertiary)" }}
          >
            {cat.title}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {cat.items.map((item) => (
              <span
                key={item}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium"
                style={{
                  background: "var(--atm-card)",
                  border: "1px solid var(--atm-border)",
                  color: "var(--atm-text)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Links tab ────────────────────────────────────────────────────────── */
function LinksTab() {
  const links = [
    {
      icon: FaGithub,
      color: "#6e5494",
      label: "GitHub",
      value: "github.com/khangpt2k6",
      href: "https://github.com/khangpt2k6",
    },
    {
      icon: FaLinkedin,
      color: "#0A66C2",
      label: "LinkedIn",
      value: "linkedin.com/in/kvphan27",
      href: "https://linkedin.com/in/kvphan27",
    },
    {
      icon: FaEnvelope,
      color: "#EA4335",
      label: "Email",
      value: "khang18@usf.edu",
      href: "mailto:khang18@usf.edu",
    },
  ];

  return (
    <div className="p-6 space-y-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
          rel={
            link.href.startsWith("mailto:")
              ? undefined
              : "noopener noreferrer"
          }
          className="flex items-center gap-3 p-3 rounded-lg transition-colors"
          style={{
            background: "var(--atm-card)",
            border: "1px solid var(--atm-border)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--atm-card-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--atm-card)")
          }
        >
          <link.icon className="w-5 h-5 flex-shrink-0" style={{ color: link.color }} />
          <div className="min-w-0 flex-1">
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--atm-text)" }}
            >
              {link.label}
            </p>
            <p
              className="text-[11px] truncate"
              style={{ color: "var(--atm-text-secondary)" }}
            >
              {link.value}
            </p>
          </div>
          <span
            className="text-[10px]"
            style={{ color: "var(--atm-text-tertiary)" }}
          >
            ↗
          </span>
        </a>
      ))}
    </div>
  );
}

/* ── Spec row — label : value pair ────────────────────────────────────── */
function SpecRow({ label, value }) {
  return (
    <div className="flex">
      <span
        className="text-[11px] w-[72px] text-right pr-3 flex-shrink-0 font-medium"
        style={{ color: "var(--atm-text-secondary)" }}
      >
        {label}
      </span>
      <span
        className="text-[11px] font-medium"
        style={{ color: "var(--atm-text)" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ── macOS-style button ───────────────────────────────────────────────── */
function MacButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer active:scale-95"
      style={{
        background: "var(--atm-btn-bg)",
        border: "1px solid var(--atm-btn-border)",
        color: "var(--atm-text)",
        boxShadow: "0 0.5px 1px rgba(0,0,0,0.1)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--atm-btn-hover)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "var(--atm-btn-bg)")
      }
    >
      {label}
    </button>
  );
}

/* ── Main component ───────────────────────────────────────────────────── */
const TAB_CONTENT = {
  Overview: OverviewTab,
  Education: EducationTab,
  Skills: SkillsTab,
  Links: LinksTab,
};

export default function AboutApp() {
  const [activeTab, setActiveTab] = useState("Overview");
  const Content = TAB_CONTENT[activeTab];

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        "--atm-bg": "var(--about-bg, #f5f5f7)",
        "--atm-tab-bg": "var(--about-tab-bg, #e8e8ed)",
        "--atm-text": "var(--about-text, #1d1d1f)",
        "--atm-text-secondary": "var(--about-text-sec, #6e6e73)",
        "--atm-text-tertiary": "var(--about-text-ter, #aeaeb2)",
        "--atm-border": "var(--about-border, #d2d2d7)",
        "--atm-card": "var(--about-card, rgba(0,0,0,0.03))",
        "--atm-card-hover": "var(--about-card-hover, rgba(0,0,0,0.06))",
        "--atm-accent-bg": "var(--about-accent-bg, rgba(0,122,255,0.08))",
        "--atm-btn-bg": "var(--about-btn-bg, #ffffff)",
        "--atm-btn-border": "var(--about-btn-border, #c7c7cc)",
        "--atm-btn-hover": "var(--about-btn-hover, #f0f0f0)",
        "--atm-tab-active": "var(--about-tab-active, #ffffff)",
        background: "var(--atm-bg)",
      }}
    >
      {/* ── Tab bar ── */}
      <div
        className="flex items-center justify-center gap-0 px-6 pt-2 pb-0 flex-shrink-0"
        style={{
          borderBottom: "1px solid var(--atm-border)",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-4 py-2 text-[12px] font-medium transition-colors cursor-pointer"
              style={{
                color: isActive
                  ? "var(--atm-text)"
                  : "var(--atm-text-secondary)",
              }}
            >
              {tab}
              {isActive && (
                <motion.div
                  layoutId="atm-tab-indicator"
                  className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                  style={{ background: "var(--atm-text)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            <Content />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
