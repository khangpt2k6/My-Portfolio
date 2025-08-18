import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaCode, FaLaptopCode, FaRobot } from "react-icons/fa";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const bioText =
    "I'm Khang, a Computer Science student at the University of South Florida with a strong passion for coding, web development, and artificial intelligence. I enjoy building full-stack applications, conducting research, and continuously expanding my technical knowledge. Programming are one of my favorite experiences, as they challenge me to think creatively, work collaboratively, and deliver impactful solutions in fast-paced environments. I'm always eager to take on innovative challenges that not only enhance my skills but also allow me to contribute meaningfully to the tech community.";
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const typingSpeed = 15;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (currentIndex < bioText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + bioText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex, bioText]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 15
      },
    },
  };

  const lightningVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.5 }
      }
    }
  };

  return (
    <section
      id="about"
      className="py-20 relative overflow-hidden bg-white"
    >


      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-6 relative inline-block"
            style={{
              background: `linear-gradient(45deg, #16A34A, #22C55E, #16A34A)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% 200%",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            About Me
          </motion.h2>
          <motion.div
            className="w-32 h-1 mx-auto rounded-full"
            style={{
              background: `linear-gradient(to right, #16A34A, #22C55E, #16A34A)`,
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 128, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Avatar Section with Lightning Effects */}
          <motion.div
            initial={{ opacity: 0, x: -80, rotateY: 90 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              duration: 1.5,
            }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="w-96 h-96 relative">
              {/* Outer Glow Ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, #16A34A, #22C55E, #15803D, #16A34A)",
                  padding: "4px",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full rounded-full bg-white" />
              </motion.div>

              {/* Lightning SVG Animation */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 400"
                style={{ filter: "drop-shadow(0 0 10px #16A34A)" }}
              >
                <motion.path
                  d="M200,50 L220,80 L210,90 L240,120 L220,130 L250,160 L230,170 L260,200 L240,210 L270,240 L250,250 L280,280 L260,290 L290,320 L270,330 L300,350"
                  stroke="#16A34A"
                  strokeWidth="3"
                  fill="none"
                  variants={lightningVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ filter: "drop-shadow(0 0 5px #16A34A)" }}
                />
                <motion.path
                  d="M200,350 L180,320 L190,310 L160,280 L180,270 L150,240 L170,230 L140,200 L160,190 L130,160 L150,150 L120,120 L140,110 L110,80 L130,70 L100,50"
                  stroke="#22C55E"
                  strokeWidth="3"
                  fill="none"
                  variants={lightningVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 1 }}
                  style={{ filter: "drop-shadow(0 0 5px #22C55E)" }}
                />
              </svg>

              {/* Floating Energy Orbs */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: i % 2 === 0 ? "#16A34A" : "#22C55E",
                    left: "50%",
                    top: "50%",
                    boxShadow: `0 0 15px ${i % 2 === 0 ? "#16A34A" : "#22C55E"}`,
                  }}
                  animate={{
                    x: [0, Math.cos((i * Math.PI) / 4) * 180],
                    y: [0, Math.sin((i * Math.PI) / 4) * 180],
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 4 + (i * 0.2),
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Avatar Image */}
              <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl z-10">
                <motion.div
                  className="w-full h-full relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src="/anh.jpg?height=1000&width=800"
                    alt="Tuan Khang Phan"
                    className="w-full h-full object-cover"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "linear-gradient(45deg, transparent, rgba(22, 163, 74, 0.1), transparent)",
                    }}
                    animate={{
                      background: [
                        "linear-gradient(0deg, transparent, rgba(22, 163, 74, 0.1), transparent)",
                        "linear-gradient(90deg, transparent, rgba(22, 163, 74, 0.1), transparent)",
                        "linear-gradient(180deg, transparent, rgba(22, 163, 74, 0.1), transparent)",
                        "linear-gradient(270deg, transparent, rgba(22, 163, 74, 0.1), transparent)",
                        "linear-gradient(360deg, transparent, rgba(22, 163, 74, 0.1), transparent)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <motion.h3
                className="text-3xl font-bold mb-6 inline-block relative"
                style={{ color: "#1F2937" }}
              >
                BIOGRAPHY
                <motion.span
                  className="absolute -bottom-2 left-0 h-1 rounded-full"
                  style={{ backgroundColor: "#16A34A" }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 1 }}
                  viewport={{ once: true }}
                />
              </motion.h3>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative group"
            >
              <motion.div
                className="absolute -inset-4 rounded-2xl opacity-20"
                style={{
                  background: "linear-gradient(45deg, #16A34A, #22C55E)",
                  filter: "blur(20px)",
                }}
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div
                className="relative p-6 rounded-2xl border backdrop-blur-sm leading-relaxed text-lg"
                style={{
                  color: "#1F2937",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderColor: "rgba(22, 163, 74, 0.3)",
                  boxShadow: "0 20px 40px -10px rgba(22, 163, 74, 0.1)",
                }}
              >
                {displayedText}
                {!isTypingComplete && (
                  <motion.span
                    className="ml-1 inline-block w-0.5 h-6"
                    style={{ backgroundColor: "#16A34A" }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { icon: FaCode, text: "Full-Stack Dev", color: "#16A34A" },
                { icon: FaRobot, text: "AI Engineer", color: "#22C55E" },
                { icon: FaLaptopCode, text: "Web Developer", color: "#15803D" },
                { icon: FaUser, text: "Software Engineer", color: "#16A34A" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.08,
                    y: -5,
                    rotateY: 5,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative p-6 rounded-xl border cursor-pointer overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #ffffff, #f8fafc)",
                    borderColor: "rgba(22, 163, 74, 0.2)",
                    boxShadow: "0 10px 30px -5px rgba(22, 163, 74, 0.1)",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}10, ${item.color}20)`,
                    }}
                    initial={{ scale: 0, rotate: 180 }}
                    whileHover={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                  />
                  
                  <motion.div
                    className="relative z-10 flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className="p-3 rounded-xl mr-4 relative"
                      style={{ backgroundColor: `${item.color}15` }}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon 
                        className="text-2xl" 
                        style={{ color: item.color }} 
                      />
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: `linear-gradient(45deg, transparent, ${item.color}30, transparent)`,
                        }}
                        animate={{
                          background: [
                            `linear-gradient(0deg, transparent, ${item.color}30, transparent)`,
                            `linear-gradient(90deg, transparent, ${item.color}30, transparent)`,
                            `linear-gradient(180deg, transparent, ${item.color}30, transparent)`,
                            `linear-gradient(270deg, transparent, ${item.color}30, transparent)`,
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                    <span
                      className="font-semibold text-lg"
                      style={{ color: "#1F2937" }}
                    >
                      {item.text}
                    </span>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;