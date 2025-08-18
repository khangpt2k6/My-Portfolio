"use client";

import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { FaGithub, FaLinkedin, FaFilePdf } from "react-icons/fa";
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
      backgroundColor: "rgba(255, 255, 255, 0)",
      height: "80px",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
    },
    solid: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
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
      color: "#16A34A",
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

  return (
    <motion.nav
      initial="transparent"
      animate={scrolled ? "solid" : "transparent"}
      variants={navbarVariants}
      transition={{ duration: 0.3 }}
      className="fixed w-full z-50 backdrop-blur-sm"
    >
      {/* Clean white background with subtle border */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-0" />
      
      <div className="container mx-auto px-4 md:px-6 h-full relative z-10">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
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
              <div className="relative flex items-center space-x-2">
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
                    transition-all duration-300 relative z-10 text-gray-700
                    ${
                      activeSection === link.to
                        ? "text-green-600 font-semibold"
                        : "hover:text-green-600"
                    }
                  `}
                >
                  {/* Show icon on smaller screens */}
                  <span className="mr-1 lg:mr-2">{link.icon}</span>
                  <span className="hidden sm:inline-block">{link.name}</span>

                  {/* Active indicator */}
                  {activeSection === link.to && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
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
                  className="absolute inset-0 rounded-md -z-10 bg-gray-50"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            ))}

            {/* Social Links with clean hover effects */}
            <div className="flex items-center space-x-2 ml-4">
              <motion.a
                href="https://github.com/khangpt2k6"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full text-gray-600 hover:text-green-600 hover:bg-gray-50 transition-colors duration-300"
              >
                <FaGithub size={20} />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/tuankhangphan"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full text-gray-600 hover:text-green-600 hover:bg-gray-50 transition-colors duration-300"
              >
                <FaLinkedin size={20} />
              </motion.a>

              {/* Resume button with clean design */}
              <motion.a
                href="https://drive.google.com/file/d/1MHXQAMywqMBuJxNzHK5LSmtFZjVww536/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center space-x-1 px-4 py-1.5 rounded-full font-medium text-sm
                   bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FaFilePdf className="mr-1" />
                <span>Resume</span>
              </motion.a>
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none p-2"
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
              className="md:hidden mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden absolute left-4 right-4 z-50 border border-gray-200"
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
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-300
                          ${
                            activeSection === link.to
                              ? "text-green-600 font-medium bg-green-50"
                              : "text-gray-700"
                          }
                        `}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-lg">{link.icon}</span>
                        <span>{link.name}</span>

                        {/* Active indicator */}
                        {activeSection === link.to && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-green-600 rounded-r-full"
                            layoutId="mobileActiveSection"
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="flex items-center justify-between mt-5 pt-5 border-t border-gray-200"
                  variants={mobileLinkVariants}
                >
                  <div className="flex space-x-4">
                    <motion.a
                      href="https://github.com/khangpt2k6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-50 p-3 rounded-full text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaGithub size={18} />
                    </motion.a>
                    <motion.a
                      href="https://linkedin.com/in/tuankhangphan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-50 p-3 rounded-full text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors duration-300"
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
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm border border-green-600 hover:bg-green-700"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaFilePdf className="text-white" />
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