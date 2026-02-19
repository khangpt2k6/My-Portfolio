import { motion, useScroll, useTransform } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.01], [0, 1]);

  return (
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
          "linear-gradient(to right, rgb(var(--color-primary-rgb)), #22d3ee)",
        boxShadow: "0 0 8px rgba(var(--color-primary-rgb), 0.4)",
      }}
    />
  );
};

export default ScrollProgress;
