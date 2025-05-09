"use client";

import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { FaGithub, FaLinkedin, FaLaptopCode } from "react-icons/fa";
import { 
  FaHome, 
  FaUser, 
  FaGraduationCap, 
  FaBriefcase, 
  FaCode, 
  FaTools, 
  FaEnvelope 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Update active section based on scroll position
    const handleScrollSpy = () => {
      const sections = [
        "hero",
        "about",
        "education",
        "experience",
        "projects",
        "skills",
        "contact",
      ];

      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleScrollSpy);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScrollSpy);
    };
  }, []);

  const navLinks = [
    { name: "Home", to: "hero", icon: <FaHome /> },
    { name: "About", to: "about", icon: <FaUser /> },
    { name: "Education", to: "education", icon: <FaGraduationCap /> },
    { name: "Experience", to: "experience", icon: <FaBriefcase /> },
    { name: "Projects", to: "projects", icon: <FaCode /> },
    { name: "Skills", to: "skills", icon: <FaTools /> },
    { name: "Contact", to: "contact", icon: <FaEnvelope /> },
  ];

  // Animation variants
  const logoVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, -3, 3, 0],
      transition: {
        duration: 0.5,
      },
    },
  };

  const navbarVariants = {
    transparent: {
      backgroundColor: "rgba(0,0,0,0)",
      height: "80px",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
    },
    solid: {
      backgroundColor: "rgba(255,255,255,0.95)",
      height: "70px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
  };

  const linkVariants = {
    initial: { y: -20, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    active: {
      color: "#059669",
      fontWeight: 600,
      scale: 1.05,
    },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      height: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
    open: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        duration: 0.4,
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  const mobileLinkVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  // Generate a random technical pattern for background
  const generateRandomPattern = () => {
    const patterns = [
      "radial-gradient(circle at 10% 20%, rgba(5, 150, 105, 0.1) 0%, rgba(5, 150, 105, 0) 50%)",
      "linear-gradient(45deg, rgba(5, 150, 105, 0.05) 25%, transparent 25%, transparent 50%, rgba(5, 150, 105, 0.05) 50%, rgba(5, 150, 105, 0.05) 75%, transparent 75%, transparent)",
      "radial-gradient(circle at 90% 10%, rgba(5, 150, 105, 0.1) 0%, rgba(5, 150, 105, 0) 50%)",
    ];
    return patterns.join(", ");
  };

  return (
    <motion.nav
      initial="transparent"
      animate={scrolled ? "solid" : "transparent"}
      variants={navbarVariants}
      transition={{ duration: 0.3 }}
      className="fixed w-full z-50 backdrop-blur-sm"
    >
      {/* Updated to all emerald color theme */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/50 via-emerald-800/50 to-emerald-600/50 z-0" />
      
      <div className="container mx-auto px-4 md:px-6 h-full relative z-10">
        <div className="flex justify-between items-center h-full">
          {/* Logo - adjusted size */}
          <Link
            to="hero"
            smooth={true}
            duration={500}
            className="cursor-pointer"
          >
            <motion.div
              className="relative"
              variants={logoVariants}
              initial="initial"
              whileHover="hover"
            >
              {/* Dynamic logo with glowing effect */}
              
              <div className="relative flex items-center space-x-2">
                {/* Adjusted logo size with height and width classes */}
                <img src="RiK.png" alt="RiK Logo" className="h-10 w-auto max-h-10" />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                custom={i}
                variants={linkVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                className="relative"
              >
                <Link
                  to={link.to}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className={`
                    px-3 py-2 rounded-md flex items-center justify-center 
                    transition-all duration-300 relative z-10 text-white
                    ${
                      activeSection === link.to
                        ? "text-emerald-300 font-semibold"
                        : "hover:text-emerald-200"
                    }
                  `}
                >
                  {/* Show icon on smaller screens */}
                  <span className="mr-1 lg:mr-2">{link.icon}</span>
                  <span className="hidden sm:inline-block">{link.name}</span>

                  {/* Active indicator */}
                  {activeSection === link.to && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-300"
                      layoutId="activeSection"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>

                {/* Hover background effect */}
                <motion.div
                  className="absolute inset-0 rounded-md -z-10 bg-white/10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            ))}

            {/* Social Links with cool hover effects */}
            <div className="flex items-center space-x-2 ml-4">
              <motion.a
                href="https://github.com/khangpt2k6"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full text-white hover:text-emerald-300 hover:bg-white/10 transition-colors duration-300"
              >
                <FaGithub size={20} />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/tuankhangphan"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full text-white hover:text-emerald-300 hover:bg-white/10 transition-colors duration-300"
              >
                <FaLinkedin size={20} />
              </motion.a>

              {/* Resume button with glow effect */}
              <motion.a
                href="https://drive.google.com/file/d/1MHXQAMywqMBuJxNzHK5LSmtFZjVww536/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center space-x-1 px-4 py-1.5 rounded-full font-medium text-sm
                   bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLaptopCode className="mr-1" />
                <span>Resume</span>
              </motion.a>
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none p-2"
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative w-6 h-5">
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden mt-2 bg-gradient-to-br from-green-700/90 via-lime-800/90 to-emerald-800/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden absolute left-4 right-4 z-50 border border-white/10"
              style={{
                backgroundImage: generateRandomPattern(),
                backgroundSize: "cover",
              }}
            >
              <div className="p-4">
                <div className="flex flex-col space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      variants={mobileLinkVariants}
                      custom={i}
                      className="relative"
                    >
                      <Link
                        to={link.to}
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-300
                          ${
                            activeSection === link.to
                              ? "text-emerald-300 font-medium bg-white/5"
                              : "text-white"
                          }
                        `}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-lg">{link.icon}</span>
                        <span>{link.name}</span>

                        {/* Active indicator */}
                        {activeSection === link.to && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-r-full"
                            layoutId="mobileActiveSection"
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="flex items-center justify-between mt-5 pt-5 border-t border-white/10"
                  variants={mobileLinkVariants}
                >
                  <div className="flex space-x-4">
                    <motion.a
                      href="https://github.com/khangpt2k6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 p-3 rounded-full text-white hover:bg-white/20 transition-colors duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaGithub size={18} />
                    </motion.a>
                    <motion.a
                      href="https://linkedin.com/in/tuankhangphan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 p-3 rounded-full text-white hover:bg-white/20 transition-colors duration-300"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaLinkedin size={18} />
                    </motion.a>
                  </div>

                  <motion.a
                    href="https://drive.google.com/file/d/1MHXQAMywqMBuJxNzHK5LSmtFZjVww536/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/20 text-white font-medium text-sm border border-white/20"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 4px 12px rgba(255, 255, 255, 0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaLaptopCode className="text-emerald-200" />
                    <span>Resume</span>
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;