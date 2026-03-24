import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import experiences from "../data/experiences";

const MS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DS = ["S","M","T","W","T","F","S"];
const pages = experiences.professional;

function parsePeriod(period) {
  const str = period.split(/\s*[–-]\s*/)[0].trim();
  const [m, y] = str.split(/\s+/);
  const mi = MS.indexOf(m.substring(0, 3));
  return { month: mi >= 0 ? mi : 0, year: parseInt(y) || 2025 };
}

/* ── Tiny decorative calendar ── */
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
    <div className="w-[72px]">
      <div className="grid grid-cols-7 mb-px">
        {DS.map((d, i) => (
          <div key={i} className="text-center text-[5px] font-bold"
            style={{ color: "var(--color-text-muted)", opacity: 0.25 }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center" style={{ height: 10 }}>
            {d != null && (
              <span className="flex items-center justify-center text-[5px] leading-none rounded-full"
                style={{
                  color: d === todayD ? "#fff" : "var(--color-text-muted)",
                  opacity: d === todayD ? 1 : 0.2,
                  background: d === todayD ? "var(--color-primary)" : "transparent",
                  width: d === todayD ? 10 : "auto",
                  height: d === todayD ? 10 : "auto",
                  fontWeight: d === todayD ? 700 : 400,
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

/* ── Wave SVG shape for cards ── */
function WaveCard({ children, index, total }) {
  // Each card gets a slightly different wave pattern
  const waveY = 6 + (index % 3) * 2;
  const curveDir = index % 2 === 0;
  const progress = ((index + 1) / total) * 100;

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{
      background: "var(--color-surface2)",
      border: "0.5px solid var(--color-border)",
    }}>
      {/* Top wave accent */}
      <svg className="absolute top-0 left-0 w-full" height="28" preserveAspectRatio="none" viewBox="0 0 400 28">
        <defs>
          <linearGradient id={`wg${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.12" />
            <stop offset={`${progress}%`} stopColor="var(--color-primary)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={curveDir
            ? `M0,0 L400,0 L400,${waveY} Q300,${waveY + 12} 200,${waveY} Q100,${waveY - 8} 0,${waveY + 4} Z`
            : `M0,0 L400,0 L400,${waveY + 4} Q300,${waveY - 6} 200,${waveY + 6} Q100,${waveY + 14} 0,${waveY} Z`
          }
          fill={`url(#wg${index})`}
        />
      </svg>

      {/* Left curved accent bar */}
      <svg className="absolute left-0 top-0 h-full" width="4" preserveAspectRatio="none" viewBox="0 0 4 100">
        <path
          d="M2,0 Q4,25 2,50 Q0,75 2,100"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>

      <div className="relative px-4 py-3 pl-5">
        {children}
      </div>
    </div>
  );
}

/* ── Curved connecting path between cards ── */
function CurvePath({ index }) {
  const flip = index % 2 === 0;
  return (
    <div className="flex justify-center h-4 -my-1 relative z-0">
      <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
        <path
          d={flip ? "M20,0 Q30,8 20,16" : "M20,0 Q10,8 20,16"}
          stroke="var(--color-primary)"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.15"
        />
        <circle cx="20" cy="8" r="2" fill="var(--color-primary)" opacity="0.15" />
      </svg>
    </div>
  );
}

const flipV = {
  enter: (d) => ({ x: d > 0 ? "18%" : "-18%", opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d) => ({ x: d > 0 ? "-18%" : "18%", opacity: 0, scale: 0.97 }),
};

/* ══════════════════════════════════════════ */
export default function ExperienceApp() {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const exp = pages[page];
  const { month, year } = parsePeriod(exp.period);

  const go = useCallback((i) => {
    if (i === page || i < 0 || i >= pages.length) return;
    setDir(i > page ? 1 : -1);
    setPage(i);
  }, [page]);

  return (
    <div className="h-full flex flex-col overflow-hidden select-none"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI", sans-serif',
        background: "var(--window-bg)",
      }}>

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
            className="absolute inset-0 flex flex-col overflow-auto"
          >
            {/* ════ HEADER with curved bottom ════ */}
            <div className="shrink-0 relative">
              <div className="px-4 pt-3 pb-5 flex items-center gap-3">
                {exp.image && (
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0"
                    style={{ border: "0.5px solid var(--color-border)" }}>
                    <img src={exp.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-[14px] font-semibold leading-tight truncate"
                    style={{ color: "var(--color-text)" }}>
                    {exp.title}
                  </h2>
                  <p className="text-[11px] font-medium truncate mt-0.5"
                    style={{ color: "var(--color-text-muted)" }}>
                    {exp.company}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px]"
                      style={{ color: "var(--color-text-muted)", opacity: 0.6 }}>
                      <MapPin className="w-3 h-3" />{exp.location}
                    </span>
                    <span className="flex items-center gap-1 text-[10px]"
                      style={{ color: "var(--color-text-muted)", opacity: 0.6 }}>
                      <Calendar className="w-3 h-3" />{exp.period}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <MiniCal month={month} year={year} />
                </div>
              </div>

              {/* Curved divider */}
              <svg className="absolute bottom-0 left-0 w-full" height="12" preserveAspectRatio="none" viewBox="0 0 500 12">
                <path
                  d="M0,0 Q125,12 250,6 Q375,0 500,8 L500,12 L0,12 Z"
                  fill="var(--color-border)"
                  opacity="0.4"
                />
              </svg>
            </div>

            {/* ════ ACHIEVEMENTS ════ */}
            <div className="flex-1 px-4 py-3">
              <div className="flex flex-col gap-0">
                {exp.description.map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.06 + i * 0.08,
                      duration: 0.4,
                      ease: [0.2, 0.8, 0.2, 1],
                    }}>
                    {/* Curved connector between cards */}
                    {i > 0 && <CurvePath index={i} />}

                    <WaveCard index={i} total={exp.description.length}>
                      <p className="text-[11px] leading-[1.7]"
                        style={{ color: "var(--color-text)", opacity: 0.85 }}>
                        {item}
                      </p>
                    </WaveCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <div className="shrink-0 relative">
        {/* Top wave border */}
        <svg className="absolute -top-[6px] left-0 w-full" height="6" preserveAspectRatio="none" viewBox="0 0 500 6">
          <path d="M0,6 Q125,0 250,3 Q375,6 500,1 L500,6 Z"
            fill="var(--color-border)" opacity="0.3" />
        </svg>

        <div className="flex items-center justify-center gap-3 py-2.5">
          <button onClick={() => go(page - 1)} disabled={page === 0}
            className="w-6 h-6 rounded-full flex items-center justify-center transition-opacity disabled:opacity-15 cursor-pointer"
            style={{ border: "0.5px solid var(--color-border)", color: "var(--color-text-muted)" }}>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex gap-1.5">
            {pages.map((_, i) => (
              <button key={i} onClick={() => go(i)}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: i === page ? 20 : 6,
                  height: 6,
                  background: i === page ? "var(--color-primary)" : "var(--color-border)",
                }} />
            ))}
          </div>

          <button onClick={() => go(page + 1)} disabled={page === pages.length - 1}
            className="w-6 h-6 rounded-full flex items-center justify-center transition-opacity disabled:opacity-15 cursor-pointer"
            style={{ border: "0.5px solid var(--color-border)", color: "var(--color-text-muted)" }}>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
