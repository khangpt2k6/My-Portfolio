import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import experiences from "../data/experiences";

const MS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
const DS = ["S","M","T","W","T","F","S"];

const ACCENTS = ["#FF2D55","#007AFF","#34C759","#AF52DE"];
const pages = experiences.professional.map((exp, i) => ({ ...exp, color: ACCENTS[i % ACCENTS.length] }));

function parsePeriod(period) {
  const str = period.split(/\s*[–-]\s*/)[0].trim();
  const [m, y] = str.split(/\s+/);
  const mi = MS.indexOf(m.substring(0, 3));
  return { month: mi >= 0 ? mi : 0, year: parseInt(y) || 2025 };
}

/* ── Mini calendar grid ── */
function MiniCal({ month, year, color, isDark }) {
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
    <div>
      <div className="grid grid-cols-7 mb-0.5">
        {DS.map((d, i) => (
          <div key={i} className="text-center text-[7px] font-bold text-white/40">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center" style={{ height: 13 }}>
            {d != null && (
              <span className="flex items-center justify-center text-[7px] leading-none rounded-full"
                style={{
                  color: d === todayD ? color : "rgba(255,255,255,0.5)",
                  background: d === todayD ? "#fff" : "transparent",
                  width: d === todayD ? 13 : "auto",
                  height: d === todayD ? 13 : "auto",
                  fontWeight: d === todayD ? 800 : 500,
                }}>
                {d}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Calendar page peel animation ── */
/* Peels from bottom-right corner upward, like flipping a wall calendar */

export default function ExperienceApp() {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const exp = pages[page];
  const { month, year } = parsePeriod(exp.period);

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const go = useCallback((i) => {
    if (i === page || i < 0 || i >= pages.length) return;
    setDir(i > page ? 1 : -1);
    setPage(i);
  }, [page]);

  return (
    <div className="h-full flex flex-col overflow-hidden select-none"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", sans-serif', background: isDark ? "#1c1c1e" : "#f2f2f7" }}>

      {/* ── Spiral binding ── */}
      <div className="flex justify-center gap-[10px] py-[3px] shrink-0 relative z-20"
        style={{ background: isDark ? "linear-gradient(180deg, #3a3a3c, #2c2c2e)" : "linear-gradient(180deg, #e8e8e8, #d8d8d8)" }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="w-[4px] h-[8px] rounded-full"
            style={{
              background: isDark ? "linear-gradient(180deg, #666, #444, #555)" : "linear-gradient(180deg, #bbb, #888, #aaa)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)",
            }} />
        ))}
      </div>

      {/* ── Page ── */}
      <div className="flex-1 min-h-0 relative" style={{ perspective: 1200 }}>
        <AnimatePresence mode="popLayout" custom={dir}>
          <motion.div key={page} custom={dir}
            initial={{ rotateX: dir > 0 ? 90 : -60, opacity: 0, scale: 0.95 }}
            animate={{ rotateX: 0, opacity: 1, scale: 1 }}
            exit={{
              rotateX: dir > 0 ? -120 : 60,
              opacity: 0,
              scale: 0.92,
              filter: "brightness(0.85)",
            }}
            transition={{
              duration: 0.6,
              ease: [0.32, 0.72, 0, 1],
              opacity: { duration: 0.35 },
            }}
            className="absolute inset-0 flex flex-col"
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              transformOrigin: "top center",
            }}>

            {/* Paper curl shadow — visible during animation */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 pointer-events-none z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.6 }}
              style={{
                height: "40%",
                background: "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)",
                borderRadius: "0 0 0 60%",
              }}
            />

            {/* ════ TOP — Colored header with company photo area ════ */}
            <div className="relative shrink-0 overflow-hidden" style={{ height: "38%", background: exp.color }}>
              {/* Company logo large */}
              {exp.image && (
                <div className="absolute inset-0 flex items-center justify-center opacity-15">
                  <img src={exp.image} alt="" className="w-32 h-32 object-cover rounded-full blur-sm" />
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col px-4 py-3">
                {/* Nav arrows */}
                <button onClick={() => go(page - 1)} disabled={page === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 disabled:opacity-0 cursor-pointer transition">
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button onClick={() => go(page + 1)} disabled={page === pages.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 disabled:opacity-0 cursor-pointer transition">
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>

                {/* Company info — centered */}
                <div className="flex items-center justify-center gap-2.5 shrink-0">
                  {exp.image && (
                    <img src={exp.image} alt="" className="w-9 h-9 rounded-xl object-cover border-2 border-white/30" />
                  )}
                  <div>
                    <div className="text-[14px] font-bold text-white leading-tight">{exp.title}</div>
                    <div className="text-[11px] text-white/70 font-medium">{exp.company}</div>
                  </div>
                </div>

                {/* Mini calendar + year */}
                <div className="flex-1 flex items-end justify-between mt-2">
                  <div className="w-[120px]">
                    <MiniCal month={month} year={year} color={exp.color} isDark={isDark} />
                  </div>
                  <div className="text-right">
                    <div className="text-[36px] font-black text-white/80 leading-none">{year}</div>
                  </div>
                </div>
              </div>

              {/* ── Curved bottom cutout ── */}
              <svg className="absolute bottom-0 left-0 w-full" height="32" preserveAspectRatio="none" viewBox="0 0 500 32">
                <path d="M0,32 L0,20 Q60,0 150,12 Q250,28 350,8 Q440,0 500,16 L500,32 Z" fill={isDark ? "#2c2c2e" : "#fff"} />
              </svg>

              {/* Month ribbon — bottom left */}
              <div className="absolute -bottom-0 left-0 z-10">
                <svg width="130" height="30" viewBox="0 0 130 30">
                  <path d="M0,0 L115,0 L105,15 L115,30 L0,30 Z" fill={exp.color} />
                </svg>
                <span className="absolute inset-0 flex items-center pl-3 text-[11px] font-black text-white tracking-widest">
                  {MONTHS[month]}
                </span>
              </div>
            </div>

            {/* ════ BOTTOM — Details ════ */}
            <div className="flex-1 flex flex-col min-h-0 px-5 pt-2 pb-2 overflow-auto"
              style={{ background: isDark ? "#2c2c2e" : "#fff" }}>
              {/* Location + Period — pill badges */}
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: `${exp.color}10`, border: `1px solid ${exp.color}25` }}>
                  <MapPin className="w-3.5 h-3.5" style={{ color: exp.color }} />
                  <span className="text-[11px] font-semibold" style={{ color: exp.color }}>{exp.location}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: `${exp.color}10`, border: `1px solid ${exp.color}25` }}>
                  <Calendar className="w-3.5 h-3.5" style={{ color: exp.color }} />
                  <span className="text-[11px] font-semibold" style={{ color: exp.color }}>{exp.period}</span>
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-3.5 flex-1">
                {exp.description.map((item, i) => (
                  <motion.div key={i}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5"
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
                    style={{ background: isDark ? "#3a3a3c" : "#f8f8fa" }}>
                    <div className="w-2 h-2 rounded-full shrink-0 mt-[7px]"
                      style={{ background: exp.color }} />
                    <p className="text-[13.5px] leading-[1.75] font-[420]"
                      style={{ color: isDark ? "#e5e5e7" : "#1f2937" }}>{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Page dots ── */}
      <div className="flex items-center justify-center gap-1.5 py-2 shrink-0"
        style={{ background: isDark ? "#2c2c2e" : "#fff", borderTop: isDark ? "0.5px solid #3a3a3c" : "0.5px solid #e5e5e5" }}>
        {pages.map((p, i) => (
          <button key={i} onClick={() => go(i)}
            className="rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: i === page ? 18 : 6, height: 6,
              background: i === page ? p.color : isDark ? "#555" : "#ddd",
            }} />
        ))}
      </div>
    </div>
  );
}
