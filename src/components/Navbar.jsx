"use client";

import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [theme, setTheme] = useState("light");

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

  // Theme initialization and persistence
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    if (initial === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // FIXED: Changed "about" to "hero" to match the actual section ID
  const navLinks = [
    { name: "About", to: "hero" },
    { name: "Experience", to: "experience" },
    { name: "Projects", to: "projects" },
    { name: "Skills", to: "skills" },
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
      {/* Clean background with subtle border supporting dark mode */}
      <div className="absolute inset-0 bg-white/90 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 z-0 transition-colors" />
      
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
                    transition-all duration-300 relative z-10 text-neutral-700 dark:text-neutral-200
                    ${
                      activeSection === link.to
                        ? "text-green-600 font-semibold"
                        : "hover:text-green-600"
                    }
                  `}
                >
                  <span>{link.name}</span>

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
                  className="absolute inset-0 rounded-md -z-10 bg-neutral-100 dark:bg-neutral-800"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Theme toggle (desktop) */}
          <div className="hidden md:flex items-center">
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center gap-1">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-700 dark:text-neutral-200 focus:outline-none p-2"
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
              className="md:hidden mt-2 bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden absolute left-4 right-4 z-50 border border-neutral-200 dark:border-neutral-800"
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
                        className={`flex items-center px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300
                          ${
                            activeSection === link.to
                              ? "text-green-600 font-medium bg-green-50 dark:bg-green-900/20"
                              : "text-neutral-700 dark:text-neutral-200"
                          }
                        `}
                        onClick={() => setIsOpen(false)}
                      >
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;