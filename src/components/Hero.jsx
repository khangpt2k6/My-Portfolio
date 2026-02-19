import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from "react-icons/fa";
import hero from "../data/hero";

const iconMap = { Mail: FaEnvelope, Github: FaGithub, Linkedin: FaLinkedin, FileText: FaFileAlt };
const buildSequence = (titles) => titles.flatMap((t) => [t, 2200]);

/* ── Split Text Reveal ─────────────────────────────────────
   Each letter slides up from below with stagger + spring.
   Parent must have overflow-hidden to clip the reveal.
   ────────────────────────────────────────────────────────── */
const SplitReveal = ({ text, delay = 0 }) => (
  <span className="inline-flex overflow-hidden">
    {text.split("").map((char, i) => (
      <motion.span
        key={i}
        initial={{ y: "120%", rotateX: -40 }}
        animate={{ y: "0%", rotateX: 0 }}
        transition={{
          duration: 0.9,
          delay: delay + i * 0.045,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="inline-block will-change-transform"
        style={{ transformOrigin: "bottom center" }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </span>
);

/* ── Floating Gradient Orb ─────────────────────────────── */
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

/* ── Hero Component ────────────────────────────────────── */
const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  /* Parallax intensities for outline layers */
  const bg1X = useTransform(smoothX, [-0.5, 0.5], [-35, 35]);
  const bg1Y = useTransform(smoothY, [-0.5, 0.5], [-22, 22]);
  const bg2X = useTransform(smoothX, [-0.5, 0.5], [18, -18]);
  const bg2Y = useTransform(smoothY, [-0.5, 0.5], [12, -12]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* ── Floating Gradient Orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb size="420px" color="rgba(var(--color-primary-rgb), 0.12)" left="5%" top="12%" delay={0} duration={26} />
        <FloatingOrb size="320px" color="rgba(var(--color-secondary-rgb), 0.10)" left="65%" top="55%" delay={3} duration={21} />
        <FloatingOrb size="260px" color="rgba(147, 51, 234, 0.08)" left="78%" top="8%" delay={5} duration={19} />
        <FloatingOrb size="300px" color="rgba(236, 72, 153, 0.06)" left="25%" top="65%" delay={7} duration={23} />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-7xl mx-auto">
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-xs tracking-[0.35em] uppercase font-semibold text-[var(--color-primary)] mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {hero.greeting}
        </motion.p>

        {/* ── Layered Name ── */}
        <div className="relative mb-8">
          {/* Outline Layer 1 — parallax background */}
          <motion.div
            style={{ x: bg1X, y: bg1Y }}
            className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              transition={{ delay: 1.5, duration: 1.2 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] font-extrabold uppercase leading-none tracking-[0.06em] dark:opacity-[0.07]"
              style={{
                fontFamily: "var(--font-display)",
                WebkitTextStroke: "2px rgba(var(--color-primary-rgb), 0.7)",
                WebkitTextFillColor: "transparent",
              }}
            >
              {hero.firstName}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              transition={{ delay: 1.7, duration: 1.2 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] font-extrabold uppercase leading-none tracking-[0.06em] dark:opacity-[0.07]"
              style={{
                fontFamily: "var(--font-display)",
                WebkitTextStroke: "2px rgba(var(--color-primary-rgb), 0.7)",
                WebkitTextFillColor: "transparent",
              }}
            >
              {hero.lastName}
            </motion.span>
          </motion.div>

          {/* Outline Layer 2 — parallax foreground */}
          <motion.div
            style={{ x: bg2X, y: bg2Y }}
            className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.035 }}
              transition={{ delay: 1.9, duration: 1.2 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] font-extrabold uppercase leading-none tracking-[0.06em] dark:opacity-[0.05]"
              style={{
                fontFamily: "var(--font-display)",
                WebkitTextStroke: "1px rgba(var(--color-secondary-rgb), 0.6)",
                WebkitTextFillColor: "transparent",
              }}
            >
              {hero.firstName}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.035 }}
              transition={{ delay: 2.1, duration: 1.2 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] font-extrabold uppercase leading-none tracking-[0.06em] dark:opacity-[0.05]"
              style={{
                fontFamily: "var(--font-display)",
                WebkitTextStroke: "1px rgba(var(--color-secondary-rgb), 0.6)",
                WebkitTextFillColor: "transparent",
              }}
            >
              {hero.lastName}
            </motion.span>
          </motion.div>

          {/* ── Main Name — letter-by-letter reveal ── */}
          <div className="relative">
            {/* Light streak that sweeps across after reveal */}
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <motion.div
                className="absolute inset-y-0 w-40"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                }}
                initial={{ x: "-200%" }}
                animate={{ x: "800%" }}
                transition={{ delay: 1.4, duration: 1.2, ease: "easeOut" }}
              />
            </motion.div>

            <h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] font-extrabold uppercase leading-none tracking-[0.06em] bg-gradient-to-r from-indigo-600 via-indigo-400 to-cyan-400 dark:text-shadow-glow"
              style={{
                fontFamily: "var(--font-display)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <SplitReveal text={hero.firstName} delay={0.25} />
            </h1>
            <h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] font-extrabold uppercase leading-none tracking-[0.06em] bg-gradient-to-r from-cyan-400 via-indigo-400 to-indigo-600 dark:text-shadow-glow"
              style={{
                fontFamily: "var(--font-display)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <SplitReveal text={hero.lastName} delay={0.55} />
            </h1>
          </div>
        </div>

        {/* ── Decorative line ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-24 h-[2px] mb-6 origin-center"
          style={{ background: "linear-gradient(90deg, transparent, rgb(var(--color-primary-rgb)), transparent)" }}
        />

        {/* ── Typing Effect ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="h-10 flex items-center justify-center mb-8"
        >
          <span className="text-[var(--color-text-muted)] opacity-40 mr-3">—</span>
          <TypeAnimation
            sequence={buildSequence(hero.titles)}
            wrapper="span"
            speed={45}
            repeat={Infinity}
            className="text-lg md:text-xl text-[var(--color-text-muted)] font-medium"
            style={{ fontFamily: "var(--font-display)" }}
          />
          <span className="text-[var(--color-text-muted)] opacity-40 ml-3">—</span>
        </motion.div>

        {/* ── Bio ── */}
        <motion.p
          initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="max-w-2xl mx-auto text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed mb-12"
        >
          {hero.bio}
        </motion.p>

        {/* ── Social Links — glass pill buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {hero.socialLinks.map((link, index) => {
            const IconComponent = iconMap[link.type];
            const isGithub = link.type === "Github";
            return (
              <motion.a
                key={index}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={link.text}
                whileHover={{ scale: 1.06, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="group glass-card shimmer-hover rounded-full px-5 py-2.5 flex items-center gap-2.5 transition-all duration-300"
                style={{ "--btn-brand": link.brandColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = link.brandColor;
                  e.currentTarget.style.borderColor = link.brandColor;
                  e.currentTarget.style.boxShadow = `0 0 30px ${link.brandColor}40, 0 8px 32px ${link.brandColor}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                {IconComponent && (
                  <IconComponent
                    className={`w-[18px] h-[18px] transition-colors duration-300 group-hover:text-white ${
                      isGithub ? "text-[#333] dark:text-white" : ""
                    }`}
                    style={!isGithub ? { color: link.brandColor } : undefined}
                  />
                )}
                <span className="text-sm font-semibold text-[var(--color-text)] transition-colors duration-300 group-hover:text-white">
                  {link.text}
                </span>
              </motion.a>
            );
          })}
        </motion.div>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)]" style={{ fontFamily: "var(--font-display)" }}>
          Scroll
        </span>
        <div className="w-5 h-8 rounded-full border border-[var(--color-border)] flex justify-center pt-2">
          <motion.div
            className="w-1 h-1.5 rounded-full bg-[var(--color-primary)]"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
