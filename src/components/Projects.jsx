"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaGithub, FaExternalLinkAlt, FaCode, FaTools } from "react-icons/fa"
import Tilt from "react-parallax-tilt"
import { HiX } from "react-icons/hi"
import { IoRocketSharp } from "react-icons/io5"
import { RiAiGenerate } from "react-icons/ri"
import { BsCodeSlash } from "react-icons/bs"

const Projects = () => {
  // State to track which project is currently selected for modal view
  const [activeProject, setActiveProject] = useState(null)
  const modalRef = useRef(null)
  
  // Disable scrolling when modal is open
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [activeProject])

  // Handle clicking outside the modal to close it
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setActiveProject(null)
    }
  }

  // Animation variants for the title animations
  const titleAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  // Project data array
  const projects = [
    {
      id: 1,
      title: "SkinIntel — AI-powered Healthcare Platform",
      role: "Hackathon",
      period: "April 2025 – Present",
      technologies: "React, Tailwind CSS, FastAPI, PyTorch, TensorFlow, OpenCV, Google Maps API",
      description: [
        "Architected and developed a comprehensive healthcare platform that utilizes Convolutional Neural Networks (CNN) including ResNet-50 and Inception-v3 architectures for accurate skin lesion classification",
        "Implemented U-Net segmentation models for precise lesion boundary detection, trained on multiple medical imaging datasets including HAM10000, ISIC, and NIH collections",
        "Engineered a responsive and accessible user interface using Vite, React, and Tailwind CSS, focusing on intuitive user experience for both patients and healthcare providers",
        "Built a high-performance FastAPI backend system that efficiently handles data processing pipelines and machine learning model inference",
        "Integrated Google Maps API with custom implementation of Dijkstra's algorithm to connect users with the nearest qualified healthcare providers based on specialized needs",
        "Established HIPAA-compliant data handling protocols to ensure patient information security and privacy throughout the application",
        "Implemented comprehensive testing procedures including unit tests and end-to-end testing to ensure platform reliability",
      ],
      image: "/Skin.png?height=600&width=800",
      github: "https://github.com/XuanGiaHanNguyen/HackUSF",
      demo: "https://github.com/XuanGiaHanNguyen/HackUSF",
      color: "#4ade80",
      icon: <RiAiGenerate size={24} />,
    },
    {
      id: 2,
      title: "Trackify – Intelligent Expense Management System",
      role: "Full - Stack Developer",
      period: "March 2025 – Present",
      technologies: "Next.js, React.js, TypeScript, MongoDB",
      description: [
        "Designed and built an AI-powered expense tracking system serving 512 active users, reducing manual data entry time by 47.3% through OpenAI API integration",
        "Created an intuitive receipt scanning feature that automatically extracts and categorizes expense information",
        "Developed a responsive and engaging user interface using Tailwind CSS and Framer Motion animations, increasing average user session duration by 39.15%",
        "Engineered a robust backend system utilizing MongoDB for efficient data storage and retrieval of 248+ expense records",
        "Deployed the application on AWS infrastructure with comprehensive monitoring solutions, achieving 88.9% uptime performance",
        "Implemented secure authentication mechanisms and data encryption protocols to protect sensitive financial information",
        "Designed analytical dashboards that provide users with spending insights and budget recommendations",
      ],
      image: "/Tracklify.png?height=600&width=800",
      github: "https://github.com/khangpt2k6/Trackify",
      demo: "https://github.com/khangpt2k6/Trackify",
      color: "#f97316",
      icon: <IoRocketSharp size={24} />,
    },
    {
      id: 3,
      title: "Toralk",
      role: "Full-Stack Developer",
      period: "January 2025 - March 2025",
      technologies:
        "AWS, MongoDB, Express.js, React.js, Node.js, Clerk, JavaScript, HTML, CSS, Vite, Google Gemini API",
      description: [
        "Designed and developed an AI-powered assistant capable of real-time multilingual responses, text generation, and image creation, enhancing user engagement by 35%",
        "Optimized system performance to achieve 99.98% uptime, efficiently handling 50,000+ concurrent requests, and implemented secure authentication using Clerk, reducing unauthorized access incidents by 70%",
        "Successfully onboarded 100+ users within two weeks, improving workflow efficiency by 40%",
      ],
      image: "/Bull.jpg?height=600&width=800",
      github: "https://github.com/khangpt2k6/TORALK",
      demo: "https://github.com/khangpt2k6/TORALK",
      color: "#06b6d4",
      icon: <RiAiGenerate size={24} />,
    },
    {
      id: 4,
      title: "GeoVista — Interactive Geographic Information System",
      role: "Full-Stack Developer",
      period: "November 2024 – December 2024",
      technologies: "TypeScript, JavaScript, Next.js, React.js, Leaflet.js, Supabase, TailwindCSS, REST API",
      description: [
        "Developed a sophisticated web-based interactive map application that integrates real-time location data to provide users with an efficient navigation tool",
        "Optimized map rendering and search functionality, reducing query response times by 0.482 seconds and creating a more responsive user experience",
        "Designed and implemented a custom API system to fetch and process complex geospatial data, improving location-based feature accuracy by 23.2%",
        "Created an intuitive user interface with responsive design principles to ensure functionality across desktop and mobile devices",
        "Implemented efficient data caching strategies to reduce server load and improve application performance",
        "Integrated third-party mapping services with custom overlay features to enhance user navigation experience",
      ],
      image: "/Map.jpg?height=600&width=800",
      github: "https://github.com/khangpt2k6/GeoVista",
      demo: "https://github.com/khangpt2k6/GeoVista",
      color: "#3b82f6",
      icon: <BsCodeSlash size={24} />,
    },
    {
      id: 5,
      title: "PathFinder X — Autonomous Navigation Robot",
      role: "Embedded Systems Engineer",
      period: "September 2024 – December 2024",
      technologies: "Arduino, C++, Ultrasonic Sensors, IR Sensors, L298N H-Bridge",
      description: [
        "Led a team of 5 engineers in the development of an Arduino-based autonomous robot designed for obstacle detection and avoidance in dynamic environments",
        "Programmed embedded C++ software for seamless sensor integration and precise motor control using L298N H-Bridge components",
        "Implemented PID (Proportional-Integral-Derivative) control algorithms to enhance maneuverability and increase motion smoothness by 40%",
        "Designed and assembled the robot's physical structure, incorporating optimal sensor placement for maximum environmental awareness",
        "Created comprehensive documentation including circuit diagrams, code documentation, and operating procedures",
        "Conducted extensive testing in varied environments to validate the robot's performance and reliability",
      ],
      image: "/Arduino.jpg?height=600&width=800",
      github: "https://github.com/khangpt2k6/Arduino-based-Robot",
      demo: "https://github.com/khangpt2k6/Arduino-based-Robot",
      color: "#d946ef",
      icon: <FaTools size={24} />,
    },
  ]

  // Tilt settings for card hover effects
  const tiltOptions = {
    max: 5,
    scale: 1.02,
    speed: 1000,
    glareEnable: true,
    glareMaxOpacity: 0.1,
    glareColor: "#ffffff",
    glarePosition: "all",
    glareBorderRadius: "12px"
  }

  return (
    <section id="projects" className="relative py-24 bg-emerald-100/70 backdrop-blur-sm rounded-full flex border border-emerald-200 shadow-lg">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3cba92_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
      
      {/* Background blobs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob"></div>
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-2000"></div>

      <div className="container relative mx-auto px-4 md:px-6 z-10">
        {/* Section title */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent"
            variants={titleAnimation}
          >
            Project Showcase
          </motion.h2>
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
                <div className="relative h-full bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
                  {/* Color accent background */}
                  <div
                    className="absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${project.color}, transparent 70%)`,
                    }}
                  ></div>

                  {/* Project image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                    
                    {/* Role badge */}
                    <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700 flex items-center">
                      <div
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: project.color }}
                      ></div>
                      <span className="text-xs font-medium text-white">{project.role}</span>
                    </div>

                    {/* Quick action buttons */}
                    <div className="absolute bottom-4 right-4 flex space-x-2">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 bg-opacity-90 text-white p-2 rounded-full hover:bg-emerald-600 transition-all duration-300 transform hover:scale-110"
                        aria-label="GitHub"
                      >
                        <FaGithub size={18} />
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 bg-opacity-90 text-white p-2 rounded-full hover:bg-emerald-600 transition-all duration-300 transform hover:scale-110"
                        aria-label="Live Demo"
                      >
                        <FaExternalLinkAlt size={16} />
                      </a>
                    </div>
                  </div>

                  {/* Project content */}
                  <div className="p-6 relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{project.title}</h3>
                    <p className="text-emerald-400 mb-3 text-sm font-medium">{project.period}</p>

                    {/* Tech tags */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.technologies.split(", ").slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full bg-gray-700 bg-opacity-60 text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.split(", ").length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700 bg-opacity-60 text-gray-300">
                          +{project.technologies.split(", ").length - 3}
                        </span>
                      )}
                    </div>

                    {/* Description preview */}
                    <p className="text-gray-300 mb-4 line-clamp-3 text-sm">{project.description[0]}</p>

                    {/* Explore button */}
                    <button
                      onClick={() => setActiveProject(project)}
                      className="group flex items-center text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
                    >
                      <span className="font-medium text-sm">Explore Project</span>
                      <svg
                        className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
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
              className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
              onClick={handleClickOutside}
            >
              <motion.div
                ref={modalRef}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
              >
                {/* Modal header with image */}
                <div className="relative">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={activeProject.image || "/placeholder.svg"}
                      alt={activeProject.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900"></div>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProject(null);
                    }}
                    className="absolute top-4 right-4 bg-gray-800 bg-opacity-80 p-2 rounded-full text-gray-400 hover:text-white transition-colors duration-300 hover:bg-gray-700"
                    aria-label="Close modal"
                  >
                    <HiX size={20} />
                  </button>

                  {/* Role badge */}
                  <div className="absolute bottom-4 left-4">
                    <div
                      className="px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2"
                      style={{ 
                        backgroundColor: `${activeProject.color}20`, 
                        color: activeProject.color,
                        borderLeft: `3px solid ${activeProject.color}`
                      }}
                    >
                      <span>{activeProject.role}</span>
                    </div>
                  </div>
                </div>

                {/* Modal content */}
                <div className="p-8 pt-4">
                  <h3 className="text-3xl font-bold text-white mb-2">{activeProject.title}</h3>
                  <p className="text-emerald-400 font-medium mb-6">{activeProject.period}</p>

                  {/* Technologies section */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <FaTools className="text-emerald-500 mr-2" /> Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.technologies.split(", ").map((tech, i) => (
                        <span
                          key={i}
                          className="text-sm px-3 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Accomplishments section */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <FaCode className="text-emerald-500 mr-2" /> Key Accomplishments
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
                          <div 
                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 mr-3" 
                            style={{ backgroundColor: `${activeProject.color}20` }}
                          >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: activeProject.color }}></div>
                          </div>
                          <p className="text-gray-300">{item}</p>
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
                      className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 border border-gray-700"
                    >
                      <FaGithub size={20} /> View Code
                    </a>
                    <a
                      href={activeProject.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-md"
                    >
                      <FaExternalLinkAlt size={18} /> Live Demo
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 20s infinite alternate;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  )
}

export default Projects