"use client";
// test_6  co-authored with Claude

// About page — co-authored with Claude
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import Tilt from "react-parallax-tilt";
import about from "../data/about";
import AnimatedHeading from "../components/ui/AnimatedHeading";

/* ── Social icon config ── */
const socialConfig = {
  Github: { Icon: FaGithub, color: "#6e5494", label: "GitHub" },
  Linkedin: { Icon: FaLinkedin, color: "#0A66C2", label: "LinkedIn" },
  Mail: { Icon: FaEnvelope, color: "#EA4335", label: "Email" },
};

/* ── Section Heading ── */
const SectionHeading = () => (
  <div className="text-center mb-14 relative">
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[120px] pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse, rgba(var(--color-primary-rgb),0.15) 0%, transparent 70%)",
        filter: "blur(30px)",
      }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="relative">
      <AnimatedHeading className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-text)]">
        About Me
      </AnimatedHeading>
    </div>
  </div>
);

/* ── 3D Profile Image ── */
const ProfileImage = () => {
  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const smoothY = useSpring(y, { stiffness: 60, damping: 20 });

  return (
    <motion.div
      ref={imgRef}
      className="relative w-full h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute -inset-4 rounded-2xl pointer-events-none"
        style={{
          background:
            "conic-gradient(from 180deg, rgba(var(--color-primary-rgb),0.15), rgba(var(--color-secondary-rgb),0.08), rgba(var(--color-primary-rgb),0.15))",
          filter: "blur(30px)",
        }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative rounded-2xl overflow-hidden h-full"
        style={{ y: smoothY }}
      >
        {/* Light sweep */}
        <motion.div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute inset-y-0 w-24"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
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
          alt="Kevin Phan"
          className="relative z-[1] w-full h-full object-cover object-top rounded-2xl"
        />
      </motion.div>
    </motion.div>
  );
};

/* ── Detail row ── */
const DetailRow = ({ label, value, index }) => (
  <motion.div
    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3"
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.25 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
  >
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] w-20 flex-shrink-0">
      {label}
    </span>
    <span className="text-sm md:text-[15px] text-[var(--color-text)] font-medium leading-snug">
      {value}
    </span>
  </motion.div>
);

/* ── Social button ── */
const SocialButton = ({ type, href, index }) => {
  const config = socialConfig[type];
  if (!config) return null;
  const { Icon, color, label } = config;

  return (
    <motion.a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      aria-label={label}
      className="group relative"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5 + index * 0.08,
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
    >
      <div
        className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-300"
        style={{ background: color }}
      />
      <div
        className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg
                   border border-[var(--glass-border)] bg-[var(--color-surface)]
                   transition-all duration-300
                   group-hover:border-transparent group-hover:shadow-lg"
        onMouseEnter={(e) => { e.currentTarget.style.background = color; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
      >
        <Icon
          className="w-3.5 h-3.5 transition-all duration-300 group-hover:text-white"
          style={{ color }}
        />
        <span
          className="text-xs font-semibold transition-colors duration-300 group-hover:text-white"
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
      <div className="max-w-5xl mx-auto">
        <SectionHeading />

        {/* macOS Window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Tilt
            tiltMaxAngleX={2}
            tiltMaxAngleY={2}
            glareEnable={true}
            glareMaxOpacity={0.05}
            glareColor="rgba(var(--color-primary-rgb), 0.3)"
            glarePosition="top"
            glareBorderRadius="1rem"
            perspective={1400}
            transitionSpeed={2000}
            scale={1.005}
          >
            <div
              className="rounded-2xl overflow-hidden border border-[var(--glass-border)]
                         shadow-[0_8px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_60px_rgba(0,0,0,0.3)]"
            >
              {/* ── macOS title bar ── */}
              <div
                className="flex items-center gap-2 px-5 py-3 border-b border-[var(--glass-border)]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(var(--color-primary-rgb),0.04), rgba(var(--color-primary-rgb),0.01))",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="text-xs font-medium text-[var(--color-text-muted)]/60 tracking-wide">
                    about-kevin
                  </span>
                </div>
                <div className="w-[52px]" />
              </div>

              {/* ── Window content ── */}
              <div
                className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]"
                style={{ background: "var(--color-surface)" }}
              >
                {/* Left — Image */}
                <div className="p-5 md:p-6 lg:p-8">
                  <ProfileImage />
                </div>

                {/* Right — Content */}
                <div className="p-5 md:p-6 lg:p-8 flex flex-col justify-center md:border-l border-[var(--glass-border)]">
                  {/* Greeting */}
                  <motion.h2
                    className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[var(--color-text)] leading-tight mb-5"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    {about.greeting}
                  </motion.h2>

                  {/* Bio */}
                  <motion.p
                    className="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed mb-7"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  >
                    {about.bio}
                  </motion.p>

                  {/* Divider */}
                  <motion.div
                    className="h-px mb-6"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--color-primary), rgba(var(--color-secondary-rgb),0.3), transparent)",
                    }}
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Details */}
                  <div className="flex flex-col gap-3.5 mb-7">
                    {about.details.map((item, i) => (
                      <DetailRow
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        index={i}
                      />
                    ))}
                  </div>

                  {/* Social links */}
                  <div className="flex flex-wrap items-center gap-2.5">
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
          </Tilt>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
