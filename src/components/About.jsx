import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaCode, FaLaptopCode, FaRobot } from "react-icons/fa";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const bioText =
    "I'm Khang, a Computer Science student at the University of South Florida with a strong passion for coding, web development, and artificial intelligence. I enjoy building full-stack applications, conducting research, and continuously expanding my technical knowledge. Programming are one of my favorite experiences, as they challenge me to think creatively, work collaboratively, and deliver impactful solutions in fast-paced environments. I'm always eager to take on innovative challenges that not only enhance my skills but also allow me to contribute meaningfully to the tech community."
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const typingSpeed = 0.0001;

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
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <section
      id="about"
      className="py-20 relative overflow-hidden bg-white"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{
              background: `linear-gradient(to right, #16A34A, #16A34A)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            About Me
          </h2>
          <motion.div
            className="w-24 h-1 mx-auto"
            style={{
              background: `linear-gradient(to right, #16A34A, #16A34A)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          ></motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="w-80 h-80 relative">
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: "#16A34A" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.span
                  className="absolute -top-2 -left-2 w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#16A34A" }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.span
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#16A34A" }}
                  animate={{
                    rotate: [0, -360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.span
                  className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#16A34A" }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                />
                <motion.span
                  className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#16A34A" }}
                  animate={{
                    rotate: [0, -360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </motion.div>

              <div className="w-full h-full rounded-full overflow-hidden shadow-lg relative">
                <img
                  src="/anh.jpg?height=1000&width=800"
                  alt="Tuan Khang Phan"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h3
              variants={itemVariants}
              className="text-2xl font-bold mb-4 inline-block relative"
              style={{ color: "#1F2937" }}
            >
              BIOGRAPHY
              <motion.span
                className="absolute -bottom-1 left-0 h-1"
                style={{ backgroundColor: "#16A34A" }}
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                viewport={{ once: true }}
              />
            </motion.h3>
            <motion.div
              variants={itemVariants}
              className="mb-6 leading-relaxed backdrop-blur-sm p-4 rounded-lg border"
              style={{
                color: "#1F2937",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderColor: "rgba(22, 163, 74, 0.2)",
              }}
            >
              {displayedText}
              {!isTypingComplete && (
                <motion.span
                  className="ml-1 inline-block w-2 h-4"
                  style={{ backgroundColor: "#16A34A" }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: FaCode, text: "Full-Stack Dev" },
                { icon: FaRobot, text: "AI Engineer" },
                { icon: FaLaptopCode, text: "Web Developer" },
                { icon: FaUser, text: "Software Engineer" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(22, 163, 74, 0.2)",
                  }}
                  className="p-4 rounded-lg flex items-center border relative overflow-hidden group"
                  style={{
                    background: "linear-gradient(135deg, #F3F4F6, #ffffff)",
                    borderColor: "rgba(22, 163, 74, 0.2)",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{ backgroundColor: "rgba(22, 163, 74, 0.1)" }}
                    initial={{ scale: 0, x: "100%", y: "100%" }}
                    whileHover={{ scale: 1, x: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                  />
                  <div
                    className="p-2 rounded-full mr-3 relative z-10"
                    style={{ backgroundColor: "rgba(22, 163, 74, 0.1)" }}
                  >
                    <item.icon className="text-xl" style={{ color: "#16A34A" }} />
                  </div>
                  <span
                    className="font-medium relative z-10"
                    style={{ color: "#1F2937" }}
                  >
                    {item.text}
                  </span>
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
