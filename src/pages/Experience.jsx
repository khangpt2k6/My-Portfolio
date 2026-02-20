"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Laptop, MapPin } from "lucide-react";
import Tilt from "react-parallax-tilt";
import experiences from "../data/experiences";
import FadeInView from "../components/ui/FadeInView";
import AnimatedHeading from "../components/ui/AnimatedHeading";

const iconMap = { Code, Laptop };
const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

const TimelineDot = ({ index }) => (
  <motion.div
    className="absolute left-0 md:left-8 z-10 -translate-x-1/2"
    style={{ top: "2rem" }}
    initial={{ scale: 0.8 }}
    whileInView={{ scale: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.4, delay: index * 0.15 }}
  >
    <motion.div
      className="w-3 h-3 rounded-full border-2 border-[var(--color-primary)]"
      initial={{ backgroundColor: "var(--color-surface)" }}
      whileInView={{ backgroundColor: "var(--color-primary)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
    />
  </motion.div>
);

const ExperienceCard = ({ exp, index }) => (
  <FadeInView direction="left" delay={index * 0.15}>
    <div
      className="group glass-card glow-border rounded-2xl backdrop-blur-xl p-6 md:p-8
                 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      {/* Top row: logo + title/company + period badge */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {exp.image && (
            <img
              src={exp.image}
              alt={exp.company}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-[var(--color-text)] leading-tight">
              {exp.title}
            </h3>
            <p className="text-[var(--color-text-muted)] mt-0.5">
              {exp.company}
            </p>
          </div>
        </div>

        {/* Period badge */}
        <span className="inline-flex self-start whitespace-nowrap bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold px-3 py-1 rounded-full">
          {exp.period}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] mb-5">
        <MapPin className="w-3.5 h-3.5" />
        <span>{exp.location}</span>
      </div>

      {/* Description bullets */}
      {exp.description && exp.description.length > 0 && (
        <ul className="space-y-3">
          {exp.description.map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
              <span className="text-[var(--color-text-muted)] leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </FadeInView>
);

const Experience = () => {
  const [activeTab, setActiveTab] = useState("professional");
  const showTabs =
    experiences.professional.length > 0 && experiences.volunteering.length > 0;
  const currentExperiences = experiences[activeTab];

  return (
    <section
      id="experience"
      className="min-h-screen bg-[var(--color-surface)] dark:bg-transparent pt-24 pb-16 md:pb-28 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <AnimatedHeading>Experience</AnimatedHeading>
        </div>

        {/* Tab switcher -- only rendered when both categories have entries */}
        {showTabs && (
          <div className="flex justify-center mb-14">
            <div className="inline-flex gap-1 p-1 bg-[var(--color-surface2)] dark:bg-white/[0.05] dark:backdrop-blur-xl rounded-full">
              {["professional", "volunteering"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold capitalize transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-md"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative pl-6 md:pl-16">
          {/* Vertical gradient line */}
          <div
            className="absolute left-0 md:left-8 top-0 bottom-0 w-0.5 -translate-x-1/2"
            style={{
              background:
                "linear-gradient(to bottom, #4F46E5, #06B6D4)",
            }}
          />

          <div className="space-y-10">
            {currentExperiences.map((exp, index) => (
              <div key={index} className="relative">
                <TimelineDot index={index} />
                <ExperienceCard exp={exp} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
