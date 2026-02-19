import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Mail, Github, Linkedin, FileText } from "lucide-react";
import hero from "../data/hero";

const iconMap = { Mail, Github, Linkedin, FileText };

/* ── Framer-motion orchestration ── */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ── Build the TypeAnimation sequence from hero.titles ── */
const buildSequence = (titles) =>
  titles.flatMap((title) => [title, 2000]);

/* ── Animated stat number component ── */
const AnimatedStat = ({ value, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="flex flex-col items-center">
      <motion.span
        className="text-2xl font-bold text-[var(--color-primary)]"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {value}
      </motion.span>
      <span className="text-sm text-[var(--color-text-muted)]">{label}</span>
    </div>
  );
};

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-4 overflow-hidden"
    >
      {/* ── Animated gradient background ── */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(79,70,229,0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(8,145,178,0.05) 0%, transparent 50%)
          `,
          backgroundSize: "200% 200%",
          animation: "gradient-shift 15s ease infinite",
        }}
      />
      <div
        className="absolute inset-0 -z-10 hidden dark:block"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(79,70,229,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(8,145,178,0.15) 0%, transparent 50%)
          `,
          backgroundSize: "200% 200%",
          animation: "gradient-shift 15s ease infinite",
        }}
      />

      {/* ── Staggered content ── */}
      <motion.div
        className="flex flex-col items-center text-center w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* 1 · Profile image */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--color-border)] shadow-md">
            <img
              src={hero.profileImage}
              alt={`${hero.firstName} ${hero.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* 2 · Overline greeting */}
        <motion.p
          variants={fadeUp}
          className="text-xs tracking-[0.3em] uppercase font-semibold text-[var(--color-primary)] mb-4"
        >
          HELLO, I'M
        </motion.p>

        {/* 3 · Name — visual centerpiece */}
        <motion.div variants={fadeUp} className="mb-6">
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[1.05] bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text dark:text-shadow-glow"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Khang
          </h1>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[1.05] bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text dark:text-shadow-glow"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Phan
          </h1>
        </motion.div>

        {/* 4 · Typing effect */}
        <motion.div
          variants={fadeUp}
          className="h-10 flex items-center justify-center mb-8"
        >
          <TypeAnimation
            sequence={buildSequence(hero.titles)}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-lg md:text-xl text-[var(--color-text-muted)]"
          />
        </motion.div>

        {/* 5 · Bio */}
        <motion.p
          variants={fadeUp}
          className="max-w-2xl mx-auto text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed mb-10"
        >
          {hero.bio}
        </motion.p>

        {/* 6 · Stats row */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center gap-8 mb-10"
        >
          {hero.stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-8">
              {index > 0 && (
                <div className="w-px h-8 bg-[var(--color-border)]" />
              )}
              <AnimatedStat value={stat.value} label={stat.label} />
            </div>
          ))}
        </motion.div>

        {/* 7 · Social links */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center gap-4"
        >
          {hero.socialLinks.map((link, index) => {
            const IconComponent = iconMap[link.type];
            return (
              <a
                key={index}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                aria-label={link.text}
                className="group w-11 h-11 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center transition-all duration-300 hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)]"
              >
                {IconComponent && (
                  <IconComponent className="w-5 h-5 text-[var(--color-text-muted)] transition-colors duration-300 group-hover:text-white" />
                )}
              </a>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
