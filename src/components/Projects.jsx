"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaCode, FaTools } from "react-icons/fa";
import Tilt from "react-parallax-tilt";
import { HiX } from "react-icons/hi";
import { IoRocketSharp } from "react-icons/io5";
import { RiAiGenerate } from "react-icons/ri";
import { BsCodeSlash } from "react-icons/bs";

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeProject]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setActiveProject(null);
    }
  };

  const titleAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const projects = [
    {
      id: 1,
      title: "NaviCV",
      technologies: "Python, FastAPI, Vector Search, Transformers, Docker, Firebase, GitHub Actions",
      description: [
        "AI-powered resume optimization platform using vector search and NLP to match candidates with relevant job opportunities.",
        "Implements advanced transformer models for intelligent content analysis and recommendation scoring.",
        "Features automated deployment pipeline with Docker containerization and CI/CD integration."
      ],
      image: "/Navicv.png",
      github: "https://github.com/khangpt2k6/NaviCV",
      color: "#16A34A",
      icon: <RiAiGenerate size={24} />,
    },
    {
      id: 2,
      title: "Zelo",
      technologies: "TypeScript, Next.js, RabbitMQ, Cloudinary, Socket.IO, MongoDB, Docker, AWS",
      description: [
        "Real-time social campus chat application built with microservice architecture for scalability.",
        "Implements message queuing with RabbitMQ and WebSocket connections for instant communication.",
        "Features media sharing via Cloudinary integration and cloud deployment on AWS infrastructure."
      ],
      image: "/zelo.png",
      github: "https://github.com/khangpt2k6/Zelo",
      color: "#16A34A",
      icon: <IoRocketSharp size={24} />,
    },
    {
      id: 3,
      title: "Algovis",
      technologies: "Java, JavaFX",
      description: [
        "Interactive algorithm visualization tool with dynamic animations for sorting algorithms.",
        "Real-time performance analysis and comparison between different sorting techniques.",
        "Educational interface designed to enhance understanding of algorithm complexity and behavior."
      ],
      image: "/Algovis.png",
      github: "https://github.com/khangpt2k6/Algovis",
      color: "#16A34A",
      icon: <BsCodeSlash size={24} />,
    },
    {
      id: 4,
      title: "Clario",
      technologies: "Go, Supabase, PostgreSQL, Docker, Render, React, Vite, Tailwind CSS",
      description: [
        "Full-stack task management application with comprehensive CRUD operations and REST API.",
        "Backend built with Go for high performance and PostgreSQL for robust data persistence.",
        "Modern React frontend with responsive design and seamless user experience."
      ],
      image: "/clario.png",
      github: "https://github.com/khangpt2k6/Clario",
      color: "#16A34A",
      icon: <BsCodeSlash size={24} />,
    },
    {
      id: 5,
      title: "SkinIntel",
      technologies: "React, Tailwind CSS, FastAPI, PyTorch, TensorFlow, OpenCV, Google Maps API",
      description: [
        "Healthcare platform utilizing CNN architectures for accurate skin lesion classification.",
        "Advanced U-Net segmentation models for precise boundary detection and analysis.",
        "Integrated location services for healthcare provider recommendations and appointment scheduling."
      ],
      image: "/intel.jpg",
      github: "https://github.com/XuanGiaHanNguyen/HackUSF",
      color: "#16A34A",
      icon: <RiAiGenerate size={24} />,
    },
    {
      id: 6,
      title: "GreenCart",
      technologies: "React.js, Next.js, Flask, Python, Google Gemini API, Chrome Extensions API",
      description: [
        "AI-powered sustainability platform with browser extension for real-time product analysis.",
        "Provides eco-friendly alternatives and sustainability scoring using Google Gemini API.",
        "Seamless integration with e-commerce sites for informed purchasing decisions."
      ],
      image: "/green.jpg",
      github: "https://devpost.com/software/hackabullhkkt",
      demo: "https://devpost.com/software/hackabullhkkt",
      color: "#16A34A",
      icon: <RiAiGenerate size={24} />,
    },
  ];

  const tiltOptions = {
    max: 5,
    scale: 1.02,
    speed: 1000,
    glareEnable: true,
    glareMaxOpacity: 0.05,
    glareColor: "#16A34A",
    glarePosition: "all",
    glareBorderRadius: "12px",
  };

  return (
    <section
      id="projects"
      className="relative py-24 bg-white overflow-hidden"
    >
      {/* Floating Bubbles Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-green-100 to-green-200 opacity-30"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animation: `float ${10 + Math.random() * 10}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="container relative mx-auto px-4 md:px-6 z-10">
        {/* Section title */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ color: "#16A34A" }}
            variants={titleAnimation}
          >
            Projects
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            variants={titleAnimation}
          >
            Innovative solutions spanning AI, web development, and system architecture
          </motion.p>
        </motion.div>

        {/* Project cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Tilt options={tiltOptions} className="h-full">
                <div className="relative h-full bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                  {/* Project image */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                    {/* Role badge */}
                    {project.role && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200 flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
                        <span className="text-xs font-medium text-gray-700">
                          {project.role}
                        </span>
                      </div>
                    )}

                    {/* Quick action buttons */}
                    <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/90 text-gray-700 p-2 rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-sm"
                        aria-label="GitHub"
                      >
                        <FaGithub size={18} />
                      </a>
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/90 text-gray-700 p-2 rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-sm"
                          aria-label="Live Demo"
                        >
                          <FaExternalLinkAlt size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Project content */}
                  <div className="p-6 relative z-10">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {project.title}
                    </h3>

                    {/* Tech tags */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.technologies
                        .split(", ")
                        .slice(0, 3)
                        .map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600"
                          >
                            {tech}
                          </span>
                        ))}
                      {project.technologies.split(", ").length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                          +{project.technologies.split(", ").length - 3}
                        </span>
                      )}
                    </div>

                    {/* Description preview */}
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {project.description[0]}
                    </p>

                    {/* Explore button */}
                    <button
                      onClick={() => setActiveProject(project)}
                      className="group flex items-center text-green-600 hover:text-green-700 transition-colors duration-300 font-medium"
                    >
                      <span className="text-sm">Explore Project</span>
                      <svg
                        className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {activeProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
              onClick={handleClickOutside}
            >
              <motion.div
                ref={modalRef}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200"
              >
                {/* Modal header with image */}
                <div className="relative">
                  <div className="h-64 overflow-hidden bg-gray-100">
                    <img
                      src={activeProject.image || "/placeholder.svg"}
                      alt={activeProject.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20"></div>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProject(null);
                    }}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-white transition-all duration-300 shadow-sm"
                    aria-label="Close modal"
                  >
                    <HiX size={20} />
                  </button>

                  {/* Role badge */}
                  {activeProject.role && (
                    <div className="absolute bottom-4 left-4">
                      <div className="px-4 py-2 rounded-full text-sm font-medium bg-green-500 text-white shadow-sm">
                        {activeProject.role}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal content */}
                <div className="p-8 pt-4">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    {activeProject.title}
                  </h3>

                  {/* Technologies section */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <FaTools className="text-green-500 mr-2" /> Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.technologies.split(", ").map((tech, i) => (
                        <span
                          key={i}
                          className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description section */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <FaCode className="text-green-500 mr-2" /> Project Overview
                    </h4>
                    <div className="space-y-4">
                      {activeProject.description.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                          className="flex items-start"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 mr-3 bg-green-100">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          </div>
                          <p className="text-gray-600">{item}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={activeProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 border border-gray-200"
                    >
                      <FaGithub size={20} /> View Code
                    </a>
                    {activeProject.demo && (
                      <a
                        href={activeProject.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-sm"
                      >
                        <FaExternalLinkAlt size={18} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
          100% {
            transform: translateY(0px) rotate(360deg);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Projects;
