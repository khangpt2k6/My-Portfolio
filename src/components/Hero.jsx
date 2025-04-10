"use client"
import { TypeAnimation } from "react-type-animation"
import { motion } from "framer-motion"
import { Link } from "react-scroll"
import { FaArrowDown, FaGithub, FaLinkedin, FaEnvelope, FaCode } from "react-icons/fa"

const Hero = () => {
  return (
    <section
      id="hero"
      className="h-screen flex items-center justify-center bg-gradient-to-br from-emerald-800 to-emerald-600 text-white relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
      
      {/* Animated particles/floating elements */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: Math.random() * 60 + 10,
              height: Math.random() * 60 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0],
              scale: [1, Math.random() * 0.5 + 1.5],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        ))}
      </div>

      {/* Enhanced USF image - larger and more prominent */}
      
      {/* Code-like decorative elements */}
      <div className="absolute top-10 left-10 text-white opacity-20 text-sm hidden md:block">
        <pre>
          {`function Developer() {
  const skills = ["JavaScript", "React", "Python"];
  return <Amazing />;
}`}
        </pre>
      </div>
      
      <div className="absolute bottom-10 right-10 text-white opacity-20 text-sm hidden md:block">
        <pre>
          {`const future = async () => {
  await learn("AI");
  return buildAmazing();
}`}
        </pre>
      </div>
      
      {/* Enhanced geometric shapes */}
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute border border-white opacity-10"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderRadius: Math.random() > 0.5 ? "50%" : "0%",
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Digital circuit-like background elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`circuit-${i}`}
            className="absolute bg-white h-px"
            style={{
              width: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 90}deg)`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              width: [0, Math.random() * 200 + 100],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: Math.random() * 2,
            }}
          />
        ))}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`node-${i}`}
            className="absolute bg-white rounded-full"
            style={{
              width: 4,
              height: 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 md:px-6 z-20 relative">
        <div className="text-center">
          {/* Enhanced name animation */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Tech-themed animated name */}
            <div className="relative inline-block">
              {/* Digital glitch effect */}
              <motion.div
                className="absolute inset-0 bg-emerald-400 opacity-0"
                animate={{ 
                  opacity: [0, 0.3, 0],
                  x: [0, -3, 3, -2, 0]
                }}
                transition={{ 
                  duration: 0.2, 
                  repeat: Infinity, 
                  repeatType: "loop",
                  repeatDelay: 5
                }}
              />
              
              {/* Character-by-character animation for name */}
              <h1 className="text-5xl md:text-7xl font-bold mb-4 relative">
                <motion.span className="inline-block relative">
                  {"Tuan Khang Phan".split('').map((char, index) => (
                    <motion.span
                      key={index}
                      className="inline-block"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        delay: 0.05 * index,
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </motion.span>
              </h1>
              
              {/* Digital circuit underline */}
              <motion.div
                className="absolute -bottom-2 left-0 h-1 bg-emerald-300"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1 }}
              />
              
              {/* Digital corner frames */}
              <motion.div
                className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.3 }}
              />
              <motion.div
                className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.3 }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.9, duration: 0.3 }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.1, duration: 0.3 }}
              />
              
              {/* Data nodes */}
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={`node-${i}`}
                  className="absolute w-2 h-2 bg-emerald-300 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${i * 25}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{ 
                    delay: 2.5 + (i * 0.2),
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 5
                  }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="h-16 md:h-24"
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
              className="text-2xl md:text-4xl font-light"
              repeat={Number.POSITIVE_INFINITY}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-12"
          >
            <div className="flex justify-center space-x-6">
              <motion.a
                href="mailto:khang18@usf.edu"
                className="bg-white text-emerald-700 px-6 py-3 rounded-full font-medium hover:bg-emerald-100 transition-colors duration-300 flex items-center"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEnvelope className="mr-2" /> Contact Me
              </motion.a>
              <motion.a
                href="https://github.com/khangpt2k6"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-emerald-700 transition-colors duration-300 flex items-center"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGithub className="mr-2" /> View Projects
              </motion.a>
            </div>
            
            {/* Additional social links */}
            <motion.div 
              className="mt-8 flex justify-center space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <motion.a 
                href="https://linkedin.com/in/tuankhangphan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-emerald-200 transition-colors duration-300"
                whileHover={{ scale: 1.2, rotate: 5, boxShadow: "0 0 10px rgba(255,255,255,0.5)" }}
              >
                <FaLinkedin size={28} />
              </motion.a>
              <motion.a 
                href="https://leetcode.com/u/KHcqTUn9ld/" 
                className="text-white hover:text-emerald-200 transition-colors duration-300"
                whileHover={{ scale: 1.2, rotate: 5, boxShadow: "0 0 10px rgba(255,255,255,0.5)" }}
              >
                <FaCode size={28} />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced animated accent shapes */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-emerald-500 to-green-300 blur-3xl opacity-20"
        animate={{ 
          scale: [1, 1.2, 1], 
          opacity: [0.2, 0.3, 0.2],
          x: [0, -20, 0],  
          y: [0, 20, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 blur-3xl opacity-20"
        animate={{ 
          scale: [1, 1.5, 1], 
          opacity: [0.2, 0.25, 0.2],
          x: [0, 30, 0],  
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      />

      {/* Scroll down indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Link to="about" smooth={true} duration={500} className="cursor-pointer group">
          <div className="flex flex-col items-center">
            <span className="text-white text-sm mb-2 opacity-80">Scroll Down</span>
            <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center pt-2">
              <motion.div 
                className="w-1.5 h-1.5 bg-white rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
              />
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}

export default Hero