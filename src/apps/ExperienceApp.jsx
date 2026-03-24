import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Briefcase } from "lucide-react";
import experiences from "../data/experiences";

/* ── Constants ── */
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

const THEMES = [
  { main: "#E74C3C", dark: "#C0392B", light: "#FDEDEB", gradient: "linear-gradient(135deg, #E74C3C 0%, #C0392B 60%, #922B21 100%)" },
  { main: "#2980B9", dark: "#1A5276", light: "#EBF5FB", gradient: "linear-gradient(135deg, #2980B9 0%, #1A5276 60%, #154360 100%)" },
  { main: "#27AE60", dark: "#1E8449", light: "#EAFAF1", gradient: "linear-gradient(135deg, #27AE60 0%, #1E8449 60%, #196F3D 100%)" },
  { main: "#8E44AD", dark: "#6C3483", light: "#F4ECF7", gradient: "linear-gradient(135deg, #8E44AD 0%, #6C3483 60%, #512E5F 100%)" },
];

const pages = experiences.professional.map((exp, i) => ({
  ...exp,
  theme: THEMES[i % THEMES.length],
}));

/* ── Parse period string to get month/year ── */
function parsePeriod(period) {
  const str = period.split(/\s*[–-]\s*/)[0].trim();
  const parts = str.split(/\s+/);
  const m = parts[0];
  const y = parseInt(parts[1]);
  const mi = MS.indexOf(m.substring(0, 3));
  return { month: mi >= 0 ? mi : 0, year: isNaN(y) ? 2025 : y, monthName: MONTHS[mi] || m };
}

/* ── Generate calendar grid ── */
function useCalendarGrid(month, year) {
  return useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    const todayDate = isCurrentMonth ? today.getDate() : -1;

    const cells = [];
    // Previous month trailing days
    const prevDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: prevDays - i, current: false });
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, current: true, isToday: d === todayDate });
    }
    // Next month leading days
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, current: false });
    }

    return cells;
  }, [month, year]);
}

/* ── Page-flip animation ── */
const flipV = {
  enter: (d) => ({
    rotateX: d > 0 ? -15 : 15,
    y: d > 0 ? -30 : 30,
    opacity: 0,
    scale: 0.95,
  }),
  center: { rotateX: 0, y: 0, opacity: 1, scale: 1 },
  exit: (d) => ({
    rotateX: d > 0 ? 15 : -15,
    y: d > 0 ? 30 : -30,
    opacity: 0,
    scale: 0.95,
  }),
};

/* ══════════════════════════════════════════════
   Main Calendar App
   ══════════════════════════════════════════════ */
export default function ExperienceApp() {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const exp = pages[page];
  const { month, year, monthName } = parsePeriod(exp.period);
  const cells = useCalendarGrid(month, year);

  const go = useCallback(
    (i) => {
      if (i === page || i < 0 || i >= pages.length) return;
      setDir(i > page ? 1 : -1);
      setPage(i);
    },
    [page],
  );

  // Pick some "event" days to mark on calendar (based on description count)
  const eventDays = useMemo(() => {
    const days = [];
    const count = exp.description.length;
    const step = Math.floor(28 / (count + 1));
    for (let i = 0; i < count; i++) {
      days.push(step * (i + 1));
    }
    return days;
  }, [exp]);

  return (
    <div
      className="h-full flex flex-col overflow-hidden select-none"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI", sans-serif',
        background: "#f0f0f0",
      }}
    >
      {/* ── Spiral binding ── */}
      <div
        className="flex justify-center gap-[14px] py-[4px] shrink-0 relative z-20"
        style={{ background: "linear-gradient(180deg, #e0e0e0, #d0d0d0)" }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="w-[5px] h-[10px] rounded-full"
            style={{
              background: "linear-gradient(180deg, #c8c8c8, #999, #b0b0b0)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>

      {/* ── Calendar page ── */}
      <div className="flex-1 flex flex-col min-h-0 relative" style={{ perspective: 1200 }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={page}
            custom={dir}
            variants={flipV}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 flex flex-col"
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          >
            {/* ════ TOP HALF — Photo Header ════ */}
            <div
              className="relative shrink-0 overflow-hidden"
              style={{
                height: "42%",
                background: exp.theme.gradient,
              }}
            >
              {/* Decorative wave divider at bottom */}
              <svg
                className="absolute bottom-0 left-0 right-0 w-full"
                viewBox="0 0 1440 60"
                preserveAspectRatio="none"
                style={{ height: 30 }}
              >
                <path
                  d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z"
                  fill="white"
                />
              </svg>

              {/* Decorative circles */}
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full"
                style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="absolute -left-8 -bottom-12 w-32 h-32 rounded-full"
                style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="absolute right-16 top-4 w-20 h-20 rounded-full"
                style={{ background: "rgba(255,255,255,0.03)" }} />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col px-5 py-3">
                {/* Top bar: navigation + period */}
                <div className="flex items-center justify-between mb-2 shrink-0">
                  <button
                    onClick={() => go(page - 1)}
                    disabled={page === 0}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all
                               bg-white/15 hover:bg-white/25 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-white" />
                  </button>

                  <div className="text-center">
                    <div className="text-[28px] font-light text-white leading-none tracking-tight">
                      {monthName} <span className="font-bold">{year}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => go(page + 1)}
                    disabled={page === pages.length - 1}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all
                               bg-white/15 hover:bg-white/25 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>

                {/* Company info card */}
                <div className="flex-1 flex items-center gap-3 min-h-0">
                  {exp.image && (
                    <div
                      className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white/20 backdrop-blur-sm"
                      style={{
                        border: "2px solid rgba(255,255,255,0.3)",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                      }}
                    >
                      <img src={exp.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[14px] font-bold text-white leading-tight truncate">
                      {exp.title}
                    </h2>
                    <p className="text-[11px] text-white/80 font-medium truncate">
                      {exp.company}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-white/50" />
                      <span className="text-[9px] text-white/50">{exp.location}</span>
                    </div>
                  </div>
                  <div
                    className="text-[9px] font-bold text-white/70 px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
                  >
                    {exp.period}
                  </div>
                </div>
              </div>
            </div>

            {/* ════ BOTTOM HALF — Calendar Grid ════ */}
            <div className="flex-1 bg-white flex flex-col min-h-0 px-3 pb-2">
              {/* Day headers */}
              <div className="grid grid-cols-7 shrink-0 pt-2 pb-1">
                {DAYS.map((d, i) => (
                  <div
                    key={d}
                    className="text-center text-[9px] font-bold tracking-wider"
                    style={{
                      color: i === 0 ? exp.theme.main : "#999",
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Separator */}
              <div className="h-px shrink-0 mx-1" style={{ background: "#e5e5e5" }} />

              {/* Day grid */}
              <div className="grid grid-cols-7 flex-1 min-h-0">
                {cells.map((cell, i) => {
                  const isSunday = i % 7 === 0;
                  const hasEvent = cell.current && eventDays.includes(cell.day);
                  const eventIdx = eventDays.indexOf(cell.day);

                  return (
                    <div
                      key={i}
                      className="relative flex flex-col items-center py-[2px] border-b"
                      style={{ borderColor: "#f5f5f5" }}
                    >
                      {/* Day number */}
                      <span
                        className="text-[10px] font-medium leading-tight"
                        style={{
                          color: !cell.current
                            ? "#d0d0d0"
                            : cell.isToday
                            ? "#fff"
                            : isSunday
                            ? exp.theme.main
                            : "#333",
                          background: cell.isToday ? exp.theme.main : "transparent",
                          borderRadius: cell.isToday ? "50%" : 0,
                          width: cell.isToday ? 18 : "auto",
                          height: cell.isToday ? 18 : "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {cell.day}
                      </span>

                      {/* Event dot */}
                      {hasEvent && (
                        <div
                          className="w-1 h-1 rounded-full mt-[1px]"
                          style={{ background: exp.theme.main }}
                          title={exp.description[eventIdx]}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ── Experience highlights as events ── */}
              <div className="shrink-0 pt-1.5 pb-1 space-y-1 max-h-[35%] overflow-auto">
                {exp.description.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-2 px-1"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                  >
                    <div
                      className="w-[3px] h-[3px] rounded-full shrink-0 mt-[5px]"
                      style={{ background: exp.theme.main }}
                    />
                    <p className="text-[9px] leading-snug text-gray-600 line-clamp-2">
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Shadow edges for depth */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px]"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Page indicator ── */}
      <div
        className="flex items-center justify-center gap-1.5 py-2 shrink-0"
        style={{ background: "#f0f0f0" }}
      >
        {pages.map((p, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="transition-all duration-300 cursor-pointer"
            style={{
              width: i === page ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: i === page ? p.theme.main : "#ccc",
            }}
          />
        ))}
      </div>
    </div>
  );
}
