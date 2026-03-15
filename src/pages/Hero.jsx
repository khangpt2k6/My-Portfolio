import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Terminal } from "lucide-react";
import hero from "../data/hero";

const buildSequence = (titles) => titles.flatMap((t) => [t, 2200]);

/* ── Floating Gradient Orb ── */
const FloatingOrb = ({ size, color, left, top, delay = 0, duration = 20 }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color}, transparent 70%)`,
      left,
      top,
      filter: "blur(60px)",
    }}
    animate={{
      x: [0, 50, -30, 25, 0],
      y: [0, -40, 35, -20, 0],
      scale: [1, 1.2, 0.85, 1.1, 1],
    }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

/* ── Floating particle dots ── */
const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 15 + 15,
  delay: Math.random() * 5,
}));

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {particles.map((p) => (
      <motion.div
        key={p.id}
        className="absolute rounded-full"
        style={{
          width: p.size,
          height: p.size,
          left: `${p.x}%`,
          top: `${p.y}%`,
          background: `rgba(var(--color-primary-rgb), ${0.15 + Math.random() * 0.2})`,
        }}
        animate={{
          y: [0, -40, 10, -20, 0],
          x: [0, 15, -10, 5, 0],
          opacity: [0.2, 0.6, 0.3, 0.5, 0.2],
        }}
        transition={{
          duration: p.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: p.delay,
        }}
      />
    ))}
  </div>
);

/* ── Subtle grid background ── */
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.04]">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(var(--color-primary-rgb), 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(var(--color-primary-rgb), 0.3) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
    {/* Radial fade so grid only shows near center */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at center, transparent 30%, var(--color-bg) 70%)",
      }}
    />
  </div>
);

/* ── Gradient Name Line — clip-path wipe reveal ── */
const GradientName = ({ text, gradient, delay = 0 }) => (
  <motion.h1
    initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.5 }}
    animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
    transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase leading-[1.1] tracking-[0.04em] ${gradient}`}
    style={{
      fontFamily: "var(--font-display)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}
  >
    {text}
  </motion.h1>
);

/* ── Hero Component ── */
const Hero = () => {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  /* Scroll-based parallax depth */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const nameScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  /* Parallax for outline layers */
  const bg1X = useTransform(smoothX, [-0.5, 0.5], [-25, 25]);
  const bg1Y = useTransform(smoothY, [-0.5, 0.5], [-15, 15]);
  const bg2X = useTransform(smoothX, [-0.5, 0.5], [12, -12]);
  const bg2Y = useTransform(smoothY, [-0.5, 0.5], [8, -8]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
    >
      {/* ── Background layers ── */}
      <GridBackground />
      <FloatingParticles />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb
          size="350px"
          color="rgba(var(--color-primary-rgb), 0.10)"
          left="5%"
          top="15%"
          delay={0}
          duration={26}
        />
        <FloatingOrb
          size="280px"
          color="rgba(var(--color-secondary-rgb), 0.08)"
          left="65%"
          top="55%"
          delay={3}
          duration={21}
        />
        <FloatingOrb
          size="220px"
          color="rgba(147, 51, 234, 0.06)"
          left="78%"
          top="8%"
          delay={5}
          duration={19}
        />
        <FloatingOrb
          size="260px"
          color="rgba(236, 72, 153, 0.05)"
          left="25%"
          top="68%"
          delay={7}
          duration={23}
        />
      </div>

      {/* ── Main Content ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl mx-auto"
        style={{ y: nameY, scale: nameScale, opacity: nameOpacity }}
      >
        {/* Greeting badge */}
        <motion.div
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="h-px w-8 bg-[var(--color-primary)]/50" />
          <span
            className="text-xs tracking-[0.35em] uppercase font-semibold text-[var(--color-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {hero.greeting}
          </span>
          <div className="h-px w-8 bg-[var(--color-primary)]/50" />
        </motion.div>

        {/* ── Layered Name ── */}
        <div className="relative mb-6">
          {/* Ghost outline layer 1 — parallax */}
          <motion.div
            style={{ x: bg1X, y: bg1Y }}
            className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none"
          >
            {[hero.firstName, hero.lastName].map((name, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0 + i * 0.2, duration: 1.5 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase leading-[1.1] tracking-[0.04em] opacity-[0.03] dark:opacity-[0.05]"
                style={{
                  fontFamily: "var(--font-display)",
                  WebkitTextStroke:
                    "1.5px rgba(var(--color-primary-rgb), 0.5)",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {name}
              </motion.span>
            ))}
          </motion.div>

          {/* Ghost outline layer 2 — opposite parallax */}
          <motion.div
            style={{ x: bg2X, y: bg2Y }}
            className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none"
          >
            {[hero.firstName, hero.lastName].map((name, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4 + i * 0.2, duration: 1.5 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase leading-[1.1] tracking-[0.04em] opacity-[0.02] dark:opacity-[0.04]"
                style={{
                  fontFamily: "var(--font-display)",
                  WebkitTextStroke:
                    "1px rgba(var(--color-secondary-rgb), 0.4)",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {name}
              </motion.span>
            ))}
          </motion.div>

          {/* ── Main Name ── */}
          <div className="relative">
            {/* Light streak across name */}
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <motion.div
                className="absolute inset-y-0 w-32"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                }}
                initial={{ x: "-100%" }}
                animate={{ x: "600%" }}
                transition={{ delay: 1.6, duration: 1.0, ease: "easeOut" }}
              />
            </motion.div>

            <GradientName
              text={hero.firstName}
              gradient="bg-gradient-to-r from-indigo-600 via-indigo-400 to-cyan-400"
              delay={0.3}
            />
            <GradientName
              text={hero.lastName}
              gradient="bg-gradient-to-r from-cyan-400 via-indigo-400 to-indigo-600"
              delay={0.6}
            />
          </div>
        </div>

        {/* ── Animated underline glow ── */}
        <motion.div
          className="relative w-24 h-[2px] mb-7 origin-center"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            delay: 1.2,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--color-primary), var(--color-secondary), transparent)",
            }}
          />
          {/* Glow underneath */}
          <motion.div
            className="absolute -inset-1 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb),0.5), transparent)",
              filter: "blur(6px)",
            }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* ── Typing Effect ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="h-10 flex items-center justify-center mb-6"
        >
          <span className="text-[var(--color-text-muted)] opacity-40 mr-3">
            —
          </span>
          <TypeAnimation
            sequence={buildSequence(hero.titles)}
            wrapper="span"
            speed={45}
            repeat={Infinity}
            className="text-lg md:text-xl text-[var(--color-text-muted)] font-medium"
            style={{ fontFamily: "var(--font-display)" }}
          />
          <span className="text-[var(--color-text-muted)] opacity-40 ml-3">
            —
          </span>
        </motion.div>

        {/* ── Tagline badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mb-5"
        >
          <span
            className="group/tag relative inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl text-sm font-bold
                       bg-[var(--color-surface)]/80 backdrop-blur-xl text-[var(--color-text)]
                       border border-[var(--color-border)] shadow-lg
                       hover:border-[var(--color-primary)]/40 hover:shadow-[0_0_24px_rgba(99,102,241,0.15)]
                       transition-all duration-500 cursor-default overflow-hidden"
          >
            {/* Animated gradient bg on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/5 via-transparent to-[var(--color-primary)]/5 opacity-0 group-hover/tag:opacity-100 transition-opacity duration-500" />

            {/* Terminal icon */}
            <Terminal className="relative w-4 h-4 text-[var(--color-primary)]" />

            {/* Text */}
            <span className="relative tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
              {hero.tagline}
            </span>

            {/* Blinking cursor */}
            <span className="relative w-[2px] h-4 bg-[var(--color-primary)] rounded-full animate-pulse" />
          </span>
        </motion.div>


        {/* ── Scroll indicator — line traces mouse, morphs to arrow ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="mt-14 flex flex-col items-center"
        >
          <motion.button
            type="button"
            onClick={() =>
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label="Scroll to content"
            className="cursor-pointer"
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.65, 1],
            }}
          >
            <svg
              width="30"
              height="46"
              viewBox="0 0 30 46"
              fill="none"
              className="overflow-visible"
            >
              <defs>
                <filter id="scrollGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Faint static mouse outline (always visible) */}
              <motion.path
                d="M15 1 C22 1 28 7 28 14 C28 21 28 28 28 30 C28 37 22 43 15 43 C8 43 2 37 2 30 C2 28 2 21 2 14 C2 7 8 1 15 1 Z"
                stroke="var(--color-text-muted)"
                strokeWidth="1.5"
                strokeOpacity="0.15"
                fill="none"
                animate={{
                  opacity: [0.6, 0.6, 0, 0, 0.6],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.3, 0.45, 0.85, 1],
                }}
              />

              {/* Animated path: traces mouse → morphs to arrow → morphs back */}
              <motion.path
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter="url(#scrollGlow)"
                animate={{
                  d: [
                    // Mouse shape (trace in)
                    "M15 1 C22 1 28 7 28 14 C28 21 28 28 28 30 C28 37 22 43 15 43 C8 43 2 37 2 30 C2 28 2 21 2 14 C2 7 8 1 15 1 Z",
                    // Hold mouse
                    "M15 1 C22 1 28 7 28 14 C28 21 28 28 28 30 C28 37 22 43 15 43 C8 43 2 37 2 30 C2 28 2 21 2 14 C2 7 8 1 15 1 Z",
                    // Morph to down arrow (flat top, sharp point at bottom)
                    "M15 5 C21 5 27 5 28 5 C28 6 24 16 21 22 C18 28 16 36 15 41 C14 36 12 28 9 22 C6 16 2 6 2 5 C3 5 9 5 15 5 Z",
                    // Hold arrow
                    "M15 5 C21 5 27 5 28 5 C28 6 24 16 21 22 C18 28 16 36 15 41 C14 36 12 28 9 22 C6 16 2 6 2 5 C3 5 9 5 15 5 Z",
                    // Morph back to mouse
                    "M15 1 C22 1 28 7 28 14 C28 21 28 28 28 30 C28 37 22 43 15 43 C8 43 2 37 2 30 C2 28 2 21 2 14 C2 7 8 1 15 1 Z",
                  ],
                  pathLength: [0, 1, 1, 1, 0],
                  opacity: [0.5, 1, 1, 1, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.25, 0.45, 0.65, 1],
                }}
              />

              {/* Scroll wheel — visible during mouse phase, fades during arrow */}
              <motion.circle
                cx="15"
                r="1.5"
                fill="var(--color-primary)"
                filter="url(#scrollGlow)"
                animate={{
                  cy: [11, 17, 11, 11, 11],
                  opacity: [1, 1, 0, 0, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.25, 0.4, 0.85, 1],
                }}
              />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
