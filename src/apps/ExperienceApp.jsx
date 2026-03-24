import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import experiences from "../data/experiences";

/* ── Constants ── */
const MS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DS = ["S","M","T","W","T","F","S"];

const pages = experiences.professional;

/* ── Parse period ── */
function parsePeriod(period) {
  const str = period.split(/\s*[–-]\s*/)[0].trim();
  const [m, y] = str.split(/\s+/);
  const mi = MS.indexOf(m.substring(0, 3));
  return { month: mi >= 0 ? mi : 0, year: parseInt(y) || 2025 };
}

/* ── Tiny inline calendar ── */
function MiniCal({ month, year }) {
  const { cells, todayD } = useMemo(() => {
    const first = new Date(year, month, 1).getDay();
    const dim = new Date(year, month + 1, 0).getDate();
    const now = new Date();
    const td = now.getMonth() === month && now.getFullYear() === year ? now.getDate() : -1;
    const c = [];
    for (let i = 0; i < first; i++) c.push(null);
    for (let d = 1; d <= dim; d++) c.push(d);
    return { cells: c, todayD: td };
  }, [month, year]);

  return (
    <div className="w-[76px]">
      <div className="text-[7px] font-bold text-center uppercase tracking-wider mb-0.5"
        style={{ color: "var(--color-text-muted)", opacity: 0.5 }}>
        {MS[month]} {year}
      </div>
      <div className="grid grid-cols-7 mb-px">
        {DS.map((d, i) => (
          <div key={i} className="text-center text-[5px] font-bold"
            style={{ color: "var(--color-text-muted)", opacity: 0.3 }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center" style={{ height: 10 }}>
            {d != null && (
              <span
                className="flex items-center justify-center text-[5px] leading-none rounded-full"
                style={{
                  color: d === todayD ? "#fff" : "var(--color-text-muted)",
                  opacity: d === todayD ? 1 : 0.25,
                  background: d === todayD ? "var(--color-primary)" : "transparent",
                  width: d === todayD ? 10 : "auto",
                  height: d === todayD ? 10 : "auto",
                  fontWeight: d === todayD ? 700 : 400,
                }}
              >
                {d}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page animation ── */
const flipV = {
  enter: (d) => ({ x: d > 0 ? "20%" : "-20%", opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d) => ({ x: d > 0 ? "-20%" : "20%", opacity: 0, scale: 0.97 }),
};

/* ══════════════════════════════════════════
   Experience App
   ══════════════════════════════════════════ */
export default function ExperienceApp() {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const exp = pages[page];
  const { month, year } = parsePeriod(exp.period);

  const go = useCallback(
    (i) => {
      if (i === page || i < 0 || i >= pages.length) return;
      setDir(i > page ? 1 : -1);
      setPage(i);
    },
    [page],
  );

  return (
    <div
      className="h-full flex flex-col overflow-hidden select-none"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI", sans-serif',
        background: "var(--window-bg)",
      }}
    >
      {/* ── Content ── */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={page}
            custom={dir}
            variants={flipV}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 flex flex-col"
          >
            {/* ════ HEADER ════ */}
            <div
              className="shrink-0 px-4 py-3 flex items-center gap-3"
              style={{ borderBottom: "0.5px solid var(--color-border)" }}
            >
              {/* Logo */}
              {exp.image && (
                <div
                  className="w-11 h-11 rounded-[12px] overflow-hidden shrink-0"
                  style={{
                    border: "0.5px solid var(--color-border)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <img src={exp.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2
                  className="text-[14px] font-semibold leading-tight truncate"
                  style={{ color: "var(--color-text)" }}
                >
                  {exp.title}
                </h2>
                <p
                  className="text-[11px] font-medium truncate mt-px"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {exp.company}
                </p>
                <div className="flex items-center gap-2.5 mt-1">
                  <span
                    className="flex items-center gap-1 text-[10px]"
                    style={{ color: "var(--color-text-muted)", opacity: 0.7 }}
                  >
                    <MapPin className="w-3 h-3" />
                    {exp.location}
                  </span>
                  <span
                    className="flex items-center gap-1 text-[10px]"
                    style={{ color: "var(--color-text-muted)", opacity: 0.7 }}
                  >
                    <Calendar className="w-3 h-3" />
                    {exp.period}
                  </span>
                </div>
              </div>

              {/* Mini calendar */}
              <div className="shrink-0 hidden sm:block">
                <MiniCal month={month} year={year} />
              </div>
            </div>

            {/* ════ ACHIEVEMENTS ════ */}
            <div className="flex-1 overflow-auto px-4 py-3">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.1em]"
                  style={{ color: "var(--color-text-muted)", opacity: 0.5 }}
                >
                  Highlights
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
                <span
                  className="text-[10px] font-medium tabular-nums"
                  style={{ color: "var(--color-text-muted)", opacity: 0.4 }}
                >
                  {exp.description.length}
                </span>
              </div>

              <div className="space-y-2">
                {exp.description.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-3 rounded-xl p-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.06 + i * 0.07,
                      duration: 0.35,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    style={{
                      background: "var(--color-surface2)",
                      border: "0.5px solid var(--color-border)",
                    }}
                  >
                    {/* Number */}
                    <span
                      className="text-[18px] font-bold leading-none shrink-0 w-7 text-center tabular-nums pt-0.5"
                      style={{ color: "var(--color-primary)", opacity: 0.35 }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Separator */}
                    <div
                      className="w-px self-stretch shrink-0 rounded-full"
                      style={{ background: "var(--color-primary)", opacity: 0.15 }}
                    />

                    {/* Text */}
                    <p
                      className="text-[11px] leading-[1.65] flex-1"
                      style={{ color: "var(--color-text)", opacity: 0.8 }}
                    >
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <div
        className="flex items-center justify-center gap-3 py-2.5 shrink-0"
        style={{ borderTop: "0.5px solid var(--color-border)" }}
      >
        <button
          onClick={() => go(page - 1)}
          disabled={page === 0}
          className="w-6 h-6 rounded-full flex items-center justify-center transition-opacity
                     disabled:opacity-15 cursor-pointer"
          style={{
            border: "0.5px solid var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex gap-1.5">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: i === page ? 18 : 6,
                height: 6,
                background:
                  i === page ? "var(--color-primary)" : "var(--color-border)",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(page + 1)}
          disabled={page === pages.length - 1}
          className="w-6 h-6 rounded-full flex items-center justify-center transition-opacity
                     disabled:opacity-15 cursor-pointer"
          style={{
            border: "0.5px solid var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
