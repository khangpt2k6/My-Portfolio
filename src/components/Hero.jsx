import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from "react-icons/fa";
import hero from "../data/hero";

const iconMap = { Mail: FaEnvelope, Github: FaGithub, Linkedin: FaLinkedin, FileText: FaFileAlt };

/* ── Framer-motion orchestration ── */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

/* ── Build the TypeAnimation sequence from hero.titles ── */
const buildSequence = (titles) =>
  titles.flatMap((title) => [title, 2000]);

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-4 overflow-hidden"
    >
      {/* ── Animated gradient background (light mode) ── */}
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
        {/* 1 · Overline greeting */}
        <motion.p
          variants={fadeUp}
          className="text-xs tracking-[0.3em] uppercase font-semibold text-[var(--color-primary)] mb-4"
        >
          {hero.greeting || "HELLO, I'M"}
        </motion.p>

        {/* 2 · Name — visual centerpiece with text-shadow-glow in dark mode */}
        <motion.div variants={fadeUp} className="mb-6">
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[1.05] bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text dark:text-shadow-glow"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {hero.firstName}
          </h1>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[1.05] bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text dark:text-shadow-glow"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {hero.lastName}
          </h1>
        </motion.div>

        {/* 3 · Typing effect */}
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

        {/* 4 · Bio */}
        <motion.p
          variants={fadeUp}
          className="max-w-2xl mx-auto text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed mb-10"
        >
          {hero.bio}
        </motion.p>

        {/* 5 · Social links — glassmorphism pill buttons with brand colors */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {hero.socialLinks.map((link, index) => {
            const IconComponent = iconMap[link.type];
            const isGithub = link.type === "Github";
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
                className="group glass-card rounded-full px-4 py-2.5 flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--btn-brand)/0.3] hover:border-[var(--btn-brand)]"
                style={{
                  "--btn-brand": link.brandColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = link.brandColor;
                  e.currentTarget.style.borderColor = link.brandColor;
                  e.currentTarget.style.boxShadow = `0 0 20px ${link.brandColor}44, 0 0 40px ${link.brandColor}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                {IconComponent && (
                  <IconComponent
                    className="w-5 h-5 transition-colors duration-300 group-hover:text-white"
                    style={{
                      color: isGithub ? undefined : link.brandColor,
                    }}
                    {...(isGithub && {
                      className:
                        "w-5 h-5 transition-colors duration-300 text-[#333] dark:text-white group-hover:text-white",
                    })}
                  />
                )}
                <span className="text-sm font-medium text-[var(--color-text)] transition-colors duration-300 group-hover:text-white">
                  {link.text}
                </span>
              </a>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
