import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scaleX = useTransform(smoothProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.01], [0, 1]);

  return (
    <>
      {/* Main progress bar */}
      <motion.div
        style={{
          scaleX,
          opacity,
          transformOrigin: "0%",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          zIndex: 60,
          background:
            "linear-gradient(90deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)), rgb(var(--color-primary-rgb)))",
          backgroundSize: "200% 100%",
        }}
      />
      {/* Glow layer underneath */}
      <motion.div
        style={{
          scaleX,
          opacity,
          transformOrigin: "0%",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          zIndex: 59,
          background:
            "linear-gradient(90deg, rgba(var(--color-primary-rgb),0.5), rgba(var(--color-secondary-rgb),0.4), rgba(var(--color-primary-rgb),0.5))",
          filter: "blur(6px)",
        }}
      />
      {/* Leading dot at the tip */}
      <motion.div
        style={{
          left: useTransform(smoothProgress, (v) => `${v * 100}%`),
          opacity,
          position: "fixed",
          top: "-2px",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          zIndex: 61,
          background: "rgb(var(--color-secondary-rgb))",
          boxShadow: "0 0 12px rgba(var(--color-secondary-rgb),0.6), 0 0 24px rgba(var(--color-secondary-rgb),0.3)",
          transform: "translateX(-50%)",
        }}
      />
    </>
  );
};

export default ScrollProgress;
