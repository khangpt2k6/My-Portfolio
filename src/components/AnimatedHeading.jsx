import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: (custom) => ({
    transition: {
      staggerChildren: 0.03,
      delayChildren: custom ?? 0,
    },
  }),
};

const charVariant = {
  hidden: { opacity: 0, y: 40, rotateX: -90, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const AnimatedHeading = ({
  children,
  className = "text-4xl md:text-5xl font-bold text-[var(--color-text)]",
  delay = 0,
}) => {
  const text = typeof children === "string" ? children : String(children);

  return (
    <motion.h2
      className={`${className} overflow-hidden`}
      style={{ perspective: 600 }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={delay}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={charVariant}
          className="inline-block"
          style={{
            transformOrigin: "bottom center",
            whiteSpace: char === " " ? "pre" : undefined,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h2>
  );
};

export default AnimatedHeading;
