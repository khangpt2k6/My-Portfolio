import { motion } from "framer-motion";

const AnimatedHeading = ({
  children,
  className = "text-4xl md:text-5xl font-bold text-[var(--color-text)]",
}) => {
  const words = children.split(" ");

  return (
    <h2 className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            delay: i * 0.08,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
};

export default AnimatedHeading;
