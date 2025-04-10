import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaCode, FaLaptopCode, FaRobot } from "react-icons/fa";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const bioText = 
  "Welcome to my portfolio! I'm Khang, a Computer Science student at the University of South Florida, " + 
  "To be honest, I'm passionate about coding, developing websites, and exploring robotics. I love taking part in hackathons where I " + 
  "get to collaborate in fast-paced environments that push my skills and creativity. " + 
  "I’m always looking for innovative challenges that fuel my knowledge, " + 
  "and allow me to make meaningful contributions to the tech community.";
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  // Fast typing speed - 20ms per character
  const typingSpeed = 0.0001;
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  useEffect(() => {
    if (currentIndex < bioText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + bioText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
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
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-emerald-50 relative overflow-hidden">
      {/* Tech background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-emerald-500 blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-emerald-700 blur-xl"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-emerald-400 h-px"
            style={{
              width: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">About Me</h2>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto"
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
              damping: 20
            }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="w-full h-120 rounded-4xl overflow-hidden shadow-lg relative">
              <motion.div 
                className="absolute inset-0 border-2 border-emerald-500 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.span 
                  className="absolute top-0 left-0 w-4 h-4 bg-emerald-500"
                  animate={{ x: [0, 100, 0], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.span 
                  className="absolute top-0 right-0 w-4 h-4 bg-emerald-500"
                  animate={{ y: [0, 100, 0], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.span 
                  className="absolute bottom-0 left-0 w-4 h-4 bg-emerald-500"
                  animate={{ y: [0, -100, 0], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                />
                <motion.span 
                  className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500"
                  animate={{ x: [0, -100, 0], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </motion.div>
              <img
                src="/avatar.jpg?height=600&width=400"
                alt="Tuan Khang Phan"
                className="w-full h-full object-cover rounded-4xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent"></div>
            </div>
            <motion.div 
              className="absolute -bottom-6 -right-6 w-48 h-48 bg-emerald-500 rounded-lg -z-10"
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1, 1.03, 1]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute -top-4 -left-4 w-24 h-24 border-2 border-emerald-400 rounded-lg -z-10"
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h3 
              variants={itemVariants}
              className="text-2xl font-bold mb-4 text-emerald-700 inline-block relative"
            >
              BIOGRAPHY
              <motion.span 
                className="absolute -bottom-1 left-0 h-1 bg-emerald-500" 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                viewport={{ once: true }}
              />
            </motion.h3>
            <motion.div 
              variants={itemVariants}
              className="text-gray-700 mb-6 leading-relaxed backdrop-blur-sm bg-white/50 p-4 rounded-lg border border-emerald-100"
            >
              {displayedText}
              {!isTypingComplete && (
                <motion.span 
                  className="ml-1 inline-block w-2 h-4 bg-emerald-500"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ 
                    duration: 0.8, 
                    repeat: Infinity,
                    ease: "linear"
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
                { icon: FaUser, text: "Tech Enthusiast" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.2)"
                  }}
                  className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-lg flex items-center border border-emerald-100 relative overflow-hidden group"
                >
                  <motion.div 
                    className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0, x: "100%", y: "100%" }}
                    whileHover={{ scale: 1, x: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                  />
                  <div className="bg-emerald-100 p-2 rounded-full mr-3 relative z-10">
                    <item.icon className="text-emerald-600 text-xl" />
                  </div>
                  <span className="text-gray-700 font-medium relative z-10">{item.text}</span>
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