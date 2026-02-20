"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import Tilt from "react-parallax-tilt";
import about from "../data/about";

/* ── Social icon config with brand colors ── */
const socialConfig = {
  Github: {
    Icon: FaGithub,
    color: "#6e5494",
    gradient: "from-[#6e5494] to-[#4078c0]",
    label: "GitHub",
  },
  Linkedin: {
    Icon: FaLinkedin,
    color: "#0A66C2",
    gradient: "from-[#0A66C2] to-[#0077B5]",
    label: "LinkedIn",
  },
  Mail: {
    Icon: FaEnvelope,
    color: "#EA4335",
    gradient: "from-[#EA4335] to-[#FBBC04]",
    label: "Email",
  },
};

/* ── Parse <hl> tags into gradient-highlighted spans ── */
const parseHighlights = (text) => {
  const parts = text.split(/(<hl>.*?<\/hl>)/g);
  return parts.map((part, i) => {
    const match = part.match(/^<hl>(.*?)<\/hl>$/);
    if (match) {
      return (
        <span
          key={i}
          className="font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]
                     bg-clip-text text-transparent"
        >
          {match[1]}
        </span>
      );
    }
    return part;
  });
};

/* ── Decorative sparkle SVG with pulsing animation ── */
const Sparkle = ({ size = 24, className = "", delay = 0 }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`absolute pointer-events-none z-10 ${className}`}
    initial={{ opacity: 0, scale: 0, rotate: -45 }}
    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay, type: "spring", stiffness: 180 }}
  >
    <motion.path
      d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
      fill="url(#sparkGrad)"
      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 3, repeat: Infinity, delay }}
    />
    <defs>
      <linearGradient id="sparkGrad" x1="0" y1="0" x2="24" y2="24">
        <stop offset="0%" stopColor="var(--color-primary)" />
        <stop offset="100%" stopColor="var(--color-secondary)" />
      </linearGradient>
    </defs>
  </motion.svg>
);

/* ── 3D Profile Image with tilt, light streak, and glow ── */
const ProfileImage = () => {
  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const smoothY = useSpring(y, { stiffness: 60, damping: 20 });

  return (
    <motion.div
      ref={imgRef}
      className="relative w-full max-w-md mx-auto lg:mx-0"
      initial={{ opacity: 0, x: -80, rotateY: 15 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 800 }}
    >
      {/* Sparkle decorations */}
      <Sparkle size={32} className="-top-5 -left-5" delay={0.4} />
      <Sparkle size={22} className="-bottom-3 -right-3" delay={0.7} />
      <Sparkle size={18} className="top-1/3 -right-6" delay={1.0} />

      {/* Ambient glow behind image */}
      <motion.div
        className="absolute -inset-6 rounded-3xl pointer-events-none"
        style={{
          background:
            "conic-gradient(from 180deg, rgba(var(--color-primary-rgb),0.25), rgba(var(--color-secondary-rgb),0.15), rgba(var(--color-primary-rgb),0.25))",
          filter: "blur(40px)",
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          rotate: [0, 360],
        }}
        transition={{
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* 3D Tilt wrapper */}
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        glareEnable={true}
        glareMaxOpacity={0.15}
        glareColor="rgba(var(--color-primary-rgb), 0.5)"
        glarePosition="all"
        glareBorderRadius="1rem"
        perspective={1000}
        transitionSpeed={1500}
        scale={1.02}
      >
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          style={{ y: smoothY }}
        >
          {/* Spinning conic border */}
          <div
            className="absolute -inset-[2px] rounded-2xl z-0 animated-border-spin"
            style={{
              background:
                "conic-gradient(from var(--border-angle, 0deg), var(--color-primary), var(--color-secondary), transparent, var(--color-primary))",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              padding: "2px",
            }}
          />

          {/* Image bottom vignette */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)",
            }}
          />

          {/* Animated light streak across the image */}
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="absolute inset-y-0 w-40"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
              }}
              animate={{ x: ["-100%", "500%"] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: 6,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          <img
            src={about.image}
            alt="Khang Phan"
            className="relative z-[1] w-full aspect-[3/4] object-cover rounded-2xl"
          />
        </motion.div>
      </Tilt>
    </motion.div>
  );
};


/* ── Colorful social icon button with brand gradient glow ── */
const SocialButton = ({ type, href, index }) => {
  const config = socialConfig[type];
  if (!config) return null;
  const { Icon, color, gradient, label } = config;

  return (
    <motion.a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      aria-label={label}
      className="group relative"
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5 + index * 0.12,
      }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.92 }}
    >
      {/* Glow behind on hover */}
      <div
        className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-60 blur-md
                   transition-opacity duration-500"
        style={{ background: color }}
      />

      <div
        className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl
                    border border-[var(--glass-border)] backdrop-blur-xl
                    bg-[var(--glass-bg)]
                    transition-all duration-500
                    group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:${gradient}
                    group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]`}
        style={{
          "--social-color": color,
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${color}20, ${color}10)`,
          }}
        >
          <Icon
            className="w-4 h-4 transition-all duration-500 group-hover:text-white group-hover:scale-110"
            style={{ color }}
          />
        </div>
        <span
          className="text-sm font-semibold transition-colors duration-500 group-hover:text-white"
          style={{ color }}
        >
          {label}
        </span>
      </div>
    </motion.a>
  );
};

/* ── Main About Component ── */
const About = () => {
  return (
    <section
      id="about"
      className="bg-[var(--color-surface)] dark:bg-transparent pb-16 md:pb-28 px-4 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — 3D Profile image */}
          <ProfileImage />

          {/* Right — Content */}
          <div>
            {/* Paragraphs */}
            <div className="space-y-5 mb-8">
              {about.paragraphs.map((para, i) => (
                <motion.p
                  key={i}
                  className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {parseHighlights(para)}
                </motion.p>
              ))}
            </div>

            {/* Social links — colorful with brand gradients */}
            <div className="flex flex-wrap items-center gap-3">
              {about.socialLinks.map((link, i) => (
                <SocialButton
                  key={i}
                  type={link.type}
                  href={link.href}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
