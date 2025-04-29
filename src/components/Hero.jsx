"use client";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaCode } from "react-icons/fa";
import { useEffect, useState } from "react";

const Hero = () => {
  // For circuit text effect
  const [textEffect, setTextEffect] = useState(0);

  // Change text effect periodically
  useEffect(() => {
    const effectInterval = setInterval(() => {
      setTextEffect((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(effectInterval);
  }, []);

  return (
    <section
      id="hero"
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-700 z-0"></div>

      {/* Ocean Waves Animation */}

      {/* Circuit animations */}
      <CircuitAnimations />

      {/* Arduino-like PCB traces */}
      <PCBTraces />

      {/* Glass card container - without elliptical boundary */}
      <div className="container relative z-20 max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-8 md:p-12"
        >
          <div className="text-center">
            {/* Name with circuit effect */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative inline-block">
                <CircuitText
                  text="Tuan Khang Phan"
                  effectMode={textEffect}
                  className="text-5xl md:text-7xl font-bold mb-4 text-white"
                />
              </div>

              {/* Circuit underline */}
              <div className="relative h-2 w-32 md:w-48 mx-auto mt-2 overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-300 to-teal-200"></div>
                <div className="absolute inset-0 flex items-center">
                  <CircuitLine />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="h-16 md:h-24 mt-6"
            >
              <TypeAnimation
                sequence={[
                  "Full-Stack Developer",
                  1000,
                  "AI Engineer",
                  1000,
                  "Web Developer",
                  1000,
                  "Tech Enthusiast",
                  1000,
                ]}
                wrapper="h2"
                speed={50}
                className="text-2xl md:text-4xl font-light text-white"
                repeat={Infinity}
              />
            </motion.div>

            {/* Buttons with glass effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-10"
            >
              <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                <motion.a
                  href="mailto:khang18@usf.edu"
                  className="backdrop-blur-md bg-white/20 border border-white/30 text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-all duration-300 flex items-center justify-center group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FaEnvelope className="mr-2 group-hover:animate-pulse" />
                  Contact Me
                  <span className="absolute -inset-0.5 opacity-0 group-hover:opacity-20 rounded-full bg-emerald-400 blur-sm transition-all duration-300"></span>
                </motion.a>
                <motion.a
                  href="https://github.com/khangpt2k6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="backdrop-blur-md bg-emerald-600/40 border border-emerald-400/30 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-600/60 transition-all duration-300 flex items-center justify-center group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FaGithub className="mr-2 group-hover" />
                  View Projects
                  <span className="absolute -inset-0.5 opacity-0 group-hover:opacity-20 rounded-full bg-emerald-400 blur-sm transition-all duration-300"></span>
                </motion.a>
              </div>

              {/* Social links with glass effect */}
              <motion.div
                className="mt-8 flex justify-center space-x-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <SocialButton
                  href="https://linkedin.com/in/tuankhangphan"
                  icon={<FaLinkedin size={22} />}
                />
                <SocialButton
                  href="https://leetcode.com/u/KHcqTUn9ld/"
                  icon={<FaCode size={22} />}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Gradient orbs */}
      <GradientOrbs />
    </section>
  );
};



// Circuit text component with several effect modes
const CircuitText = ({ text, className, effectMode }) => {
  // Split text into individual characters for animation
  const characters = text.split("");

  // Different effect styles
  const effectStyles = [
    {
      // Effect 0: Subtle pulse with circuit dots
      container: "relative inline-block",
      char: "relative inline-block transition-all duration-300",
      animation: (index) => ({
        y: [0, index % 2 === 0 ? -2 : 2, 0],
        transition: { duration: 2, repeat: Infinity, delay: index * 0.1 },
      }),
      decoration: (index) =>
        index % 3 === 0 && (
          <motion.span
            className="absolute -bottom-2 h-1 w-1 bg-emerald-400 rounded-full"
            style={{ left: "50%", transform: "translateX(-50%)" }}
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
          />
        ),
    },
    {
      // Effect 1: Subtle electric charge
      container: "relative inline-block",
      char: "relative inline-block transition-all duration-300",
      animation: (index) => ({
        textShadow: [
          "0 0 5px rgba(52, 211, 153, 0)",
          "0 0 10px rgba(52, 211, 153, 0.8)",
          "0 0 5px rgba(52, 211, 153, 0)",
        ],
        transition: {
          duration: 2,
          repeat: Infinity,
          delay: index * 0.15,
          ease: "easeInOut",
        },
      }),
      decoration: null,
    },
    {
      // Effect 2: Circuit connection lines between characters
      container: "relative inline-block",
      char: "relative inline-block transition-all duration-300",
      animation: null,
      decoration: (index, length) =>
        index < length - 1 && (
          <motion.span
            className="absolute top-1/2 h-px bg-emerald-400"
            style={{
              left: "100%",
              width: "8px",
              transform: "translateY(-50%)",
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              width: ["2px", "8px", "2px"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ),
    },
  ];

  // Current effect style
  const currentEffect = effectStyles[effectMode];

  return (
    <h1 className={className}>
      <span className={currentEffect.container}>
        {characters.map((char, index) => (
          <motion.span
            key={index}
            className={currentEffect.char}
            animate={currentEffect.animation && currentEffect.animation(index)}
          >
            {char}
            {currentEffect.decoration &&
              currentEffect.decoration(index, characters.length)}
          </motion.span>
        ))}
      </span>
    </h1>
  );
};

// Circuit line for underline effect
const CircuitLine = () => {
  return (
    <svg className="w-full h-full" viewBox="0 0 200 10">
      <motion.path
        d="M0,5 L40,5 L45,2 L55,8 L65,2 L75,8 L85,2 L95,8 L105,2 L115,8 L125,2 L135,8 L145,5 L200,5"
        stroke="rgba(52, 211, 153, 0.6)"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, pathOffset: 0 }}
        animate={{
          pathLength: 1,
          pathOffset: [0, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.circle
        r="2"
        fill="rgba(52, 211, 153, 1)"
        filter="drop-shadow(0 0 2px rgba(52, 211, 153, 0.8))"
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          offsetPath: `path("M0,5 L40,5 L45,2 L55,8 L65,2 L75,8 L85,2 L95,8 L105,2 L115,8 L125,2 L135,8 L145,5 L200,5")`,
        }}
      />
    </svg>
  );
};

// Social button component with glass effect
const SocialButton = ({ href, icon }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
      <span className="absolute inset-0 rounded-full border border-white/30 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500"></span>
    </motion.a>
  );
};

// PCB trace animations (Arduino-like)
const PCBTraces = () => {
  return (
    <div className="absolute inset-0 z-5 overflow-hidden opacity-70">
      <svg width="100%" height="100%" className="opacity-10">
        {/* Horizontal traces */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.path
            key={`h-${i}`}
            d={`M0,${(i + 1) * 100} H${window.innerWidth}`}
            stroke="rgba(52, 211, 153, 0.7)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: i * 0.2 }}
          />
        ))}

        {/* Vertical traces */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.path
            key={`v-${i}`}
            d={`M${(i + 1) * 100},0 V${window.innerHeight}`}
            stroke="rgba(52, 211, 153, 0.7)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: i * 0.15 }}
          />
        ))}

        {/* Connection pads at intersections */}
        {Array.from({ length: 10 }).map((_, y) =>
          Array.from({ length: 15 }).map(
            (_, x) =>
              Math.random() > 0.5 && (
                <motion.circle
                  key={`pad-${x}-${y}`}
                  cx={(x + 1) * 100}
                  cy={(y + 1) * 100}
                  r="3"
                  fill="rgba(52, 211, 153, 0.5)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: x * 0.15 + y * 0.2 + 3,
                  }}
                />
              )
          )
        )}
      </svg>
    </div>
  );
};

// Circuit animations component
const CircuitAnimations = () => {
  // Create circuit paths with different properties
  const circuits = Array.from({ length: 8 }).map((_, index) => {
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;

    // Create a more structured path with right angles for circuit-like appearance
    const segments = [];
    let currentX = startX;
    let currentY = startY;

    for (let i = 0; i < 6; i++) {
      const direction = i % 2; // Alternate between horizontal (0) and vertical (1)
      const distance = Math.random() * 20 + 10;

      if (direction === 0) {
        // Horizontal movement
        const newX = currentX + (Math.random() > 0.5 ? distance : -distance);
        segments.push({ x1: currentX, y1: currentY, x2: newX, y2: currentY });
        currentX = newX;
      } else {
        // Vertical movement
        const newY = currentY + (Math.random() > 0.5 ? distance : -distance);
        segments.push({ x1: currentX, y1: currentY, x2: currentX, y2: newY });
        currentY = newY;
      }
    }

    return {
      id: index,
      segments,
      speed: Math.random() * 15 + 30, // Speed between 30-45s (slower)
      delay: Math.random() * 5,
      opacity: Math.random() * 0.2 + 0.1, // Keep subtle
      color: `rgba(${Math.random() * 100 + 100}, ${
        Math.random() * 150 + 100
      }, ${Math.random() * 50 + 150}, 0.6)`,
    };
  });

  return (
    <div className="absolute inset-0 z-10 overflow-hidden">
      {circuits.map((circuit) => (
        <CircuitPath key={circuit.id} circuit={circuit} />
      ))}
    </div>
  );
};

// Individual circuit path
const CircuitPath = ({ circuit }) => {
  // Generate SVG path from segments
  const generatePath = () => {
    if (!circuit.segments.length) return "";

    let path = `M ${circuit.segments[0].x1} ${circuit.segments[0].y1}`;

    circuit.segments.forEach((segment) => {
      path += ` L ${segment.x2} ${segment.y2}`;
    });

    return path;
  };

  return (
    <motion.svg
      className="absolute inset-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: circuit.opacity }}
      transition={{ duration: 1, delay: circuit.delay }}
    >
      <motion.path
        d={generatePath()}
        fill="none"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="1"
        strokeDasharray="4,4"
        initial={{ pathLength: 0, pathOffset: 0 }}
        animate={{
          pathLength: 1,
          pathOffset: [0, 1],
        }}
        transition={{
          duration: circuit.speed,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.circle
        r="3"
        fill={circuit.color}
        filter="blur(1px) drop-shadow(0 0 2px rgba(134, 239, 172, 0.6))"
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{
          duration: circuit.speed,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ offsetPath: `path("${generatePath()}")` }}
      />

      {/* Circuit connection nodes at path joints */}
      {circuit.segments.map((segment, idx) => (
        <circle
          key={idx}
          cx={segment.x2}
          cy={segment.y2}
          r="2"
          fill="rgba(134, 239, 172, 0.4)"
          filter="drop-shadow(0 0 1px rgba(134, 239, 172, 0.6))"
        />
      ))}
    </motion.svg>
  );
};

// Gradient orbs component
const GradientOrbs = () => {
  return (
    <>
      <motion.div
        className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-300/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-teal-400/20 to-cyan-300/20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.07, 0.12, 0.07],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/6 w-32 h-32 rounded-full bg-gradient-to-r from-blue-400/10 to-emerald-300/10 blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.05, 0.1, 0.05],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 23,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
    </>
  );
};

export default Hero;
