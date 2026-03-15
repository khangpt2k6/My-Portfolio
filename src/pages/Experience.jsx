"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Calendar, MapPin, Briefcase, ChevronRight } from "lucide-react";
import experiences from "../data/experiences";
import AnimatedHeading from "../components/ui/AnimatedHeading";

/* ── helpers ── */
const isTouchDevice =
  typeof window !== "undefined" && "ontouchstart" in window;

/* ── Blob border-radius keyframes for smooth organic morphing ── */
const blobRadii = [
  "50%",                                    // circle
  "60% 40% 55% 45% / 45% 60% 40% 55%",    // blob 1
  "40% 60% 45% 55% / 55% 40% 60% 45%",    // blob 2
  "55% 45% 60% 40% / 40% 55% 45% 60%",    // blob 3
  "50%",                                    // back to circle
];

/* ── Glowing timeline node with smooth blob morph ── */
const TimelineNode = ({ index, image }) => (
  <motion.div
    className="absolute left-1/2 -translate-x-1/2 z-20 hidden md:flex"
    style={{ top: "2.5rem" }}
    initial={{ scale: 0, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: index * 0.12,
    }}
  >
    <div className="relative w-12 h-12">
      {/* Outer glow pulse — morphs with the blob */}
      <motion.div
        className="absolute -inset-1 pointer-events-none"
        style={{
          background: "rgba(var(--color-primary-rgb), 0.25)",
          filter: "blur(10px)",
        }}
        animate={{
          borderRadius: blobRadii,
          scale: [1, 1.4, 1.2, 1.3, 1],
          opacity: [0.5, 0.2, 0.4, 0.2, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.8,
        }}
      />

      {/* Main node — morphing blob border */}
      <motion.div
        className="relative w-12 h-12 border-[3px] border-[var(--color-primary)]
                   bg-[var(--color-bg)] dark:bg-[#0a0a1a] flex items-center justify-center
                   overflow-hidden"
        style={{
          boxShadow: "0 0 20px rgba(var(--color-primary-rgb), 0.4)",
        }}
        animate={{
          borderRadius: blobRadii,
          rotate: [0, 5, -3, 4, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.8,
        }}
      >
        {image ? (
          <img src={image} alt="" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <Briefcase className="w-5 h-5 text-[var(--color-primary)]" />
        )}
      </motion.div>
    </div>
  </motion.div>
);

/* ── Mobile timeline node (left-aligned) with blob morph ── */
const MobileTimelineNode = ({ index, image }) => (
  <motion.div
    className="absolute left-0 -translate-x-1/2 z-20 md:hidden"
    style={{ top: "1.5rem" }}
    initial={{ scale: 0, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: index * 0.12,
    }}
  >
    <motion.div
      className="relative w-10 h-10 border-2 border-[var(--color-primary)]
                 bg-[var(--color-bg)] dark:bg-[#0a0a1a] flex items-center justify-center
                 overflow-hidden"
      style={{
        boxShadow: "0 0 16px rgba(var(--color-primary-rgb), 0.35)",
      }}
      animate={{
        borderRadius: blobRadii,
        rotate: [0, 4, -2, 3, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.8,
      }}
    >
      {image ? (
        <img src={image} alt="" className="w-6 h-6 rounded-full object-cover" />
      ) : (
        <Briefcase className="w-4 h-4 text-[var(--color-primary)]" />
      )}
    </motion.div>
  </motion.div>
);

/* ── Year label on the timeline ── */
const YearLabel = ({ year, index, isLeft }) => (
  <motion.div
    className={`absolute top-[2.75rem] hidden md:block z-20 ${
      isLeft ? "left-[calc(50%+2.5rem)]" : "right-[calc(50%+2.5rem)]"
    }`}
    initial={{ opacity: 0, x: isLeft ? -10 : 10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay: index * 0.12 + 0.2 }}
  >
    <span
      className="text-xs font-bold tracking-wider text-[var(--color-primary)]
                 bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-full"
    >
      {year}
    </span>
  </motion.div>
);

/* ── Connector line from node to card ── */
const ConnectorLine = ({ index, isLeft }) => (
  <motion.div
    className={`absolute top-[3.25rem] hidden md:block h-[2px] w-8 z-10
                ${isLeft ? "right-[calc(50%+1.5rem)]" : "left-[calc(50%+1.5rem)]"}`}
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true, margin: "-60px" }}
    style={{ transformOrigin: isLeft ? "right" : "left" }}
    transition={{ duration: 0.4, delay: index * 0.12 + 0.15 }}
  >
    <div
      className="w-full h-full rounded-full"
      style={{
        background:
          "linear-gradient(90deg, rgba(var(--color-primary-rgb),0.6), rgba(var(--color-secondary-rgb),0.6))",
      }}
    />
  </motion.div>
);

/* ── Experience card ── */
const ExperienceCard = ({ exp, index, isLeft }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty("--glow-x", `${x}%`);
    cardRef.current.style.setProperty("--glow-y", `${y}%`);
  };

  return (
    <motion.div
      className={`md:w-[calc(50%-3.5rem)] ${
        isLeft ? "md:mr-auto" : "md:ml-auto"
      }`}
      initial={{
        opacity: 0,
        x: isLeft ? -60 : 60,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="group glass-card glow-border glow-on-hover shimmer-hover animated-border
                   rounded-2xl backdrop-blur-xl p-6 md:p-7 cursor-default
                   transition-all duration-500 hover:-translate-y-1.5"
        whileHover={{
          boxShadow:
            "0 12px 40px rgba(var(--color-primary-rgb),0.2), 0 0 60px rgba(var(--color-primary-rgb),0.08)",
        }}
      >
        {/* Header: Logo + Title + Company */}
        <div className="flex items-start gap-4 mb-4">
          {exp.image && (
            <motion.div
              className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-[var(--glass-border)]
                         bg-white/10 dark:bg-white/5 flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <img
                src={exp.image}
                alt={exp.company}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
          <div className="min-w-0 flex-1">
            <h3
              className="text-lg md:text-xl font-bold text-[var(--color-text)] leading-tight
                         group-hover:text-[var(--color-primary)] transition-colors duration-300"
            >
              {exp.title}
            </h3>
            <p className="text-[var(--color-text-muted)] text-sm mt-0.5 font-medium">
              {exp.company}
            </p>
          </div>
        </div>

        {/* Meta row: Date + Location */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{exp.period}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{exp.location}</span>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-5 opacity-30"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-primary), var(--color-secondary), transparent)",
          }}
        />

        {/* Description bullets */}
        {exp.description?.length > 0 && (
          <ul className="space-y-3">
            {exp.description.map((item, i) => (
              <motion.li
                key={i}
                className="flex gap-3 items-start"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.12 + i * 0.06 + 0.3,
                }}
              >
                <ChevronRight className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0 opacity-70" />
                <span className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  );
};

/* ── Scroll progress line (glowing center spine) ── */
const ScrollProgressLine = ({ containerRef }) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
  });
  const scaleY = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 hidden md:block">
      {/* Background track */}
      <div
        className="absolute inset-0 w-[2px] -translate-x-1/2 rounded-full"
        style={{
          background: "rgba(var(--color-primary-rgb), 0.1)",
        }}
      />

      {/* Animated fill */}
      <motion.div
        className="absolute top-0 w-[2px] -translate-x-1/2 rounded-full"
        style={{
          scaleY,
          transformOrigin: "top",
          height: "100%",
          background:
            "linear-gradient(180deg, var(--color-primary), var(--color-secondary), var(--color-primary))",
          boxShadow:
            "0 0 12px rgba(var(--color-primary-rgb),0.5), 0 0 30px rgba(var(--color-primary-rgb),0.2)",
        }}
      />

      {/* Glow head at progress tip */}
      <motion.div
        className="absolute w-4 h-4 -translate-x-[calc(50%+1px)] rounded-full pointer-events-none"
        style={{
          top: useTransform(smoothProgress, (v) => `${v * 100}%`),
          background:
            "radial-gradient(circle, rgba(var(--color-primary-rgb),0.8) 0%, transparent 70%)",
          filter: "blur(4px)",
        }}
      />
    </div>
  );
};

/* ── Mobile scroll line ── */
const MobileScrollLine = ({ containerRef }) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
  });
  const scaleY = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <div className="absolute left-0 -translate-x-1/2 top-0 bottom-0 md:hidden">
      <div
        className="absolute inset-0 w-[2px] -translate-x-1/2 rounded-full"
        style={{ background: "rgba(var(--color-primary-rgb), 0.1)" }}
      />
      <motion.div
        className="absolute top-0 w-[2px] -translate-x-1/2 rounded-full"
        style={{
          scaleY,
          transformOrigin: "top",
          height: "100%",
          background:
            "linear-gradient(180deg, var(--color-primary), var(--color-secondary))",
          boxShadow: "0 0 10px rgba(var(--color-primary-rgb),0.4)",
        }}
      />
    </div>
  );
};

/* ── Main Experience Component ── */
const Experience = () => {
  const [activeTab, setActiveTab] = useState("professional");
  const timelineRef = useRef(null);
  const showTabs =
    experiences.professional.length > 0 && experiences.volunteering.length > 0;
  const currentExperiences = experiences[activeTab];

  return (
    <section
      id="experience"
      className="relative min-h-screen bg-[var(--color-surface)] dark:bg-transparent pt-24 pb-16 md:pb-28 px-4 noise-overlay"
    >
      {/* Decorative floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-20 h-20 rounded-2xl border border-[var(--color-primary)]/10 rotate-12"
          style={{ top: "8%", right: "8%" }}
          animate={{ rotate: [12, 20, 12], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-32 h-32 rounded-full"
          style={{ bottom: "12%", left: "4%", background: "radial-gradient(circle, rgba(var(--color-primary-rgb), 0.04), transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-[var(--color-secondary)]/20"
          style={{ top: "25%", left: "12%" }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-[var(--color-primary)]/15"
          style={{ top: "60%", right: "15%" }}
          animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-6">
          <AnimatedHeading>Experience</AnimatedHeading>
        </div>


        {/* Tab switcher */}
        {showTabs && (
          <div className="flex justify-center mb-14">
            <div
              className="inline-flex gap-1 p-1 bg-[var(--color-surface2)] dark:bg-white/[0.05]
                         dark:backdrop-blur-xl rounded-full border border-[var(--glass-border)]"
            >
              {["professional", "volunteering"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-semibold capitalize
                             transition-all duration-300 ${
                               activeTab === tab
                                 ? "text-[var(--color-text)]"
                                 : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                             }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[var(--color-surface)] dark:bg-white/[0.08]
                                 rounded-full shadow-md"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Timeline ── */}
        <div ref={timelineRef} className="relative pl-8 md:pl-0">
          {/* Center scroll-progress line (desktop) */}
          <ScrollProgressLine containerRef={timelineRef} />
          {/* Mobile scroll line */}
          <MobileScrollLine containerRef={timelineRef} />

          <div className="space-y-12 md:space-y-16">
            {currentExperiences.map((exp, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div key={`${activeTab}-${index}`} className="relative">
                  {/* Desktop elements */}
                  <TimelineNode
                    index={index}
                    image={exp.image}
                    isLeft={isLeft}
                  />
                  <YearLabel
                    year={exp.year}
                    index={index}
                    isLeft={isLeft}
                  />
                  <ConnectorLine index={index} isLeft={isLeft} />

                  {/* Mobile node */}
                  <MobileTimelineNode index={index} image={exp.image} />

                  {/* Card */}
                  <ExperienceCard
                    exp={exp}
                    index={index}
                    isLeft={isLeft}
                  />
                </div>
              );
            })}
          </div>

          {/* Timeline end cap */}
          <motion.div
            className="hidden md:flex absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8
                       w-4 h-4 rounded-full items-center justify-center"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.5 }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                boxShadow:
                  "0 0 12px rgba(var(--color-primary-rgb),0.5)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
