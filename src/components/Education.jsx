"use client";
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useTransform, animate } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Award, MapPin, GraduationCap } from "lucide-react";
import education from "../data/education";
import FadeInView from "./FadeInView";

const isTouchDevice =
  typeof window !== "undefined" && "ontouchstart" in window;

/* ---------- Animated GPA counter ---------- */
function AnimatedGPA({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => v.toFixed(1));

  useEffect(() => {
    if (isInView) {
      animate(motionVal, value, { duration: 1.4, ease: "easeOut" });
    }
  }, [isInView, motionVal, value]);

  /* Subscribe to the motion value and update the DOM node directly so we
     avoid pulling in <motion.span> just for a text node. */
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const unsubscribe = display.on("change", (v) => {
      node.textContent = v;
    });
    return unsubscribe;
  }, [display]);

  return <span ref={ref}>0.0</span>;
}

/* ---------- Education section ---------- */
const Education = () => {
  const gpaNumeric = parseFloat(education.gpa); // 4.0

  return (
    <section id="education" className="py-28 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* ---- Section header ---- */}
        <FadeInView direction="up" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-text)]">
            Education
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-cyan-600 mx-auto rounded-full mt-4" />
        </FadeInView>

        {/* ---- Card ---- */}
        <FadeInView direction="up" delay={0.15} className="flex justify-center">
          <Tilt
            tiltMaxAngleX={isTouchDevice ? 0 : 4}
            tiltMaxAngleY={isTouchDevice ? 0 : 4}
            glareEnable={!isTouchDevice}
            glareMaxOpacity={0.05}
            className="max-w-2xl w-full"
          >
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-card p-8">
              {/* -- Header row: logo + university info -- */}
              <div className="flex items-start gap-4 mb-8">
                <img
                  src={education.logo}
                  alt={education.university}
                  className="w-12 h-12 rounded-lg object-contain flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-[var(--color-text)]">
                    {education.university}
                  </h3>
                  <p className="text-[var(--color-primary)] font-semibold">
                    {education.degree}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-[var(--color-text-muted)]">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={14} />
                      {education.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GraduationCap size={14} />
                      Undergraduate
                    </span>
                  </div>
                </div>
              </div>

              {/* -- GPA display -- */}
              <div className="mb-8 text-center">
                <p className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                  Cumulative GPA
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-[var(--color-primary)]">
                    <AnimatedGPA value={gpaNumeric} />
                  </span>
                  <span className="text-xl text-[var(--color-text-muted)] ml-1">
                    /4.0
                  </span>
                </div>
              </div>

              {/* -- Awards -- */}
              <div>
                <h4 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
                  Awards &amp; Honors
                </h4>
                <ul className="space-y-3">
                  {education.awards.map((award, i) => (
                    <li
                      key={i}
                      className="border-l-2 border-[var(--color-primary)] pl-4 flex items-start gap-2"
                    >
                      <Award
                        size={16}
                        className="text-[var(--color-primary)] mt-0.5 flex-shrink-0"
                      />
                      <span className="text-[var(--color-text)] text-sm">
                        {award}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Tilt>
        </FadeInView>
      </div>
    </section>
  );
};

export default Education;
