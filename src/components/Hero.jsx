import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from "react-icons/fa";
import hero from "../data/hero";

const iconMap = { Mail: FaEnvelope, Github: FaGithub, Linkedin: FaLinkedin, FileText: FaFileAlt };
const buildSequence = (titles) => titles.flatMap((t) => [t, 2200]);

/* ── Magnetic Button — follows cursor with spring physics ── */
const MagneticButton = ({ children, className = "", style, onMouseEnter, onMouseLeave: onLeaveProp, ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouse = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  }, [x, y]);

  const handleLeave = useCallback((e) => {
    x.set(0); y.set(0);
    // Reset inline styles on leave
    e.currentTarget.style.backgroundColor = "";
    e.currentTarget.style.borderColor = "";
    e.currentTarget.style.boxShadow = "";
    onLeaveProp?.(e);
  }, [x, y, onLeaveProp]);

  const handleEnter = useCallback((e) => { onMouseEnter?.(e); }, [onMouseEnter]);

  return (
    <motion.a
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY, ...style }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      {...props}
    >
      {children}
    </motion.a>
  );
};

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

/* ── Gradient Name Line — clip-path wipe reveal ── */
const GradientName = ({ text, gradient, delay = 0 }) => (
  <motion.h1
    initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.5 }}
    animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
    transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase leading-[1.1] tracking-[0.04em] ${gradient} dark:text-shadow-glow`}
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

/* ── Hero Component ────────────────────────────────────── */
const Hero = () => {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  /* Scroll-based parallax depth */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
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
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* ── Floating Gradient Orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb size="350px" color="rgba(var(--color-primary-rgb), 0.10)" left="5%" top="15%" delay={0} duration={26} />
        <FloatingOrb size="280px" color="rgba(var(--color-secondary-rgb), 0.08)" left="65%" top="55%" delay={3} duration={21} />
        <FloatingOrb size="220px" color="rgba(147, 51, 234, 0.06)" left="78%" top="8%" delay={5} duration={19} />
        <FloatingOrb size="260px" color="rgba(236, 72, 153, 0.05)" left="25%" top="68%" delay={7} duration={23} />
      </div>

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl mx-auto"
        style={{ y: nameY, scale: nameScale, opacity: nameOpacity }}
      >
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-xs tracking-[0.35em] uppercase font-semibold text-[var(--color-primary)] mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {hero.greeting}
        </motion.p>

        {/* ── Layered Name ── */}
        <div className="relative mb-6">
          {/* Outline Layer 1 — subtle parallax ghost */}
          <motion.div
            style={{ x: bg1X, y: bg1Y }}
            className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 1.5 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase leading-[1.1] tracking-[0.04em] opacity-[0.03] dark:opacity-[0.05]"
              style={{
                fontFamily: "var(--font-display)",
                WebkitTextStroke: "1.5px rgba(var(--color-primary-rgb), 0.5)",
                WebkitTextFillColor: "transparent",
              }}
            >
              {hero.firstName}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1.5 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase leading-[1.1] tracking-[0.04em] opacity-[0.03] dark:opacity-[0.05]"
              style={{
                fontFamily: "var(--font-display)",
                WebkitTextStroke: "1.5px rgba(var(--color-primary-rgb), 0.5)",
                WebkitTextFillColor: "transparent",
              }}
            >
              {hero.lastName}
            </motion.span>
          </motion.div>

          {/* Outline Layer 2 — opposite parallax */}
          <motion.div
            style={{ x: bg2X, y: bg2Y }}
            className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4, duration: 1.5 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase leading-[1.1] tracking-[0.04em] opacity-[0.02] dark:opacity-[0.04]"
              style={{
                fontFamily: "var(--font-display)",
                WebkitTextStroke: "1px rgba(var(--color-secondary-rgb), 0.4)",
                WebkitTextFillColor: "transparent",
              }}
            >
              {hero.firstName}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6, duration: 1.5 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase leading-[1.1] tracking-[0.04em] opacity-[0.02] dark:opacity-[0.04]"
              style={{
                fontFamily: "var(--font-display)",
                WebkitTextStroke: "1px rgba(var(--color-secondary-rgb), 0.4)",
                WebkitTextFillColor: "transparent",
              }}
            >
              {hero.lastName}
            </motion.span>
          </motion.div>

          {/* ── Main Name — clip-path wipe reveal ── */}
          <div className="relative">
            {/* Light streak */}
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <motion.div
                className="absolute inset-y-0 w-32"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
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

        {/* ── Decorative line ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-20 h-[2px] mb-6 origin-center"
          style={{ background: "linear-gradient(90deg, transparent, rgb(var(--color-primary-rgb)), transparent)" }}
        />

        {/* ── Typing Effect ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="h-10 flex items-center justify-center mb-6"
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

        {/* ── Tagline ── */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-sm tracking-widest uppercase font-medium text-[var(--color-primary)] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {hero.tagline}
        </motion.p>

        {/* ── Bio ── */}
        <motion.p
          initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 1.6 }}
          className="max-w-xl mx-auto text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed mb-10"
        >
          {hero.bio}
        </motion.p>

        {/* ── Social Links ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {hero.socialLinks.map((link, index) => {
            const IconComponent = iconMap[link.type];
            const isGithub = link.type === "Github";
            return (
              <MagneticButton
                key={index}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={link.text}
                className="group glass-card shimmer-hover rounded-full px-5 py-2.5 flex items-center gap-2.5 transition-all duration-300"
                style={{ "--btn-brand": link.brandColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = link.brandColor;
                  e.currentTarget.style.borderColor = link.brandColor;
                  e.currentTarget.style.boxShadow = `0 0 30px ${link.brandColor}40, 0 8px 32px ${link.brandColor}20`;
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
              </MagneticButton>
            );
          })}
        </motion.div>
      </motion.div>

    </section>
  );
};

export default Hero;
