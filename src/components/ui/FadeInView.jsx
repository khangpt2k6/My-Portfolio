import { motion } from "framer-motion";

const directionOffset = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: -40 },
  right: { x: 40 },
  none: {},
};

const FadeInView = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
}) => {
  const offset = directionOffset[direction] || directionOffset.up;

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // ease-out-expo
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeInView;
