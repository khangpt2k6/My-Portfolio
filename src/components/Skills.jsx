"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaCode, 
  FaDatabase, 
  FaTools, 
  FaLaptopCode, 
  FaServer, 
  FaDesktop,
  FaCertificate,
  FaPython,
  FaJs,
  FaHtml5,
  FaReact,
  FaNodeJs,
  FaAws,
  FaDocker,
  FaGit,
  FaGithub,
  FaUbuntu,
  FaWindows,
  FaNpm,
  FaYarn,
  FaMarkdown,
  FaTrello,
  FaDatabase as FaPostgres,
  FaBookOpen as FaLatex,
  FaRobot as FaArduino,
  FaCogs as FaVite,
  FaLayerGroup as FaTailwind,
  FaDraftingCompass as FaFramer,
  FaBolt as FaFastAPI,
  FaCube as FaPyTorch,
  FaBrain as FaTensorFlow,
  FaCamera as FaOpenCV,
  FaMapMarkedAlt as FaLeaflet,
  FaRobot as FaROS,
  FaMicrosoft,
  FaTasks as FaAsana,
  FaTimes,
  FaDownload,
  FaExternalLinkAlt,
  FaSearch,
} from "react-icons/fa"
import { SiTypescript, SiMongodb, SiSupabase } from "react-icons/si"
import { FaGolang } from "react-icons/fa6"

const Skills = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const getSkillIcon = (skillName) => {
    const iconMap = {
      // Programming Languages
      "Python": <FaPython className="text-emerald-600" />,
      "C/C++": <FaCode className="text-emerald-600" />,
      "JavaScript": <FaJs className="text-emerald-600" />,
      "TypeScript": <SiTypescript className="text-emerald-600" />,
      "Arduino": <FaArduino className="text-emerald-600" />,
      "Golang": <FaGolang className="text-emerald-600" />,
      "LaTeX": <FaLatex className="text-emerald-600" />,
      "HTML/CSS": <FaHtml5 className="text-emerald-600" />,
      
      // Frameworks & Libraries
      "React.js": <FaReact className="text-emerald-600" />,
      "Next.js": <FaReact className="text-emerald-600" />,
      "Tailwind CSS": <FaTailwind className="text-emerald-600" />,
      "Framer Motion": <FaFramer className="text-emerald-600" />,
      "FastAPI": <FaFastAPI className="text-emerald-600" />,
      "Node.js": <FaNodeJs className="text-emerald-600" />,
      "Express.js": <FaNodeJs className="text-emerald-600" />,
      "PyTorch": <FaPyTorch className="text-emerald-600" />,
      "TensorFlow": <FaTensorFlow className="text-emerald-600" />,
      "OpenCV": <FaOpenCV className="text-emerald-600" />,
      "Leaflet.js": <FaLeaflet className="text-emerald-600" />,
      "ROS": <FaROS className="text-emerald-600" />,
      
      // Development Tools
      "Git": <FaGit className="text-emerald-600" />,
      "GitHub": <FaGithub className="text-emerald-600" />,
      "Docker": <FaDocker className="text-emerald-600" />,
      "Ubuntu": <FaUbuntu className="text-emerald-600" />,
      "Windows": <FaWindows className="text-emerald-600" />,
      "Vite": <FaVite className="text-emerald-600" />,
      "npm": <FaNpm className="text-emerald-600" />,
      "yarn": <FaYarn className="text-emerald-600" />,
      
      // Database Management Systems
      "MongoDB": <SiMongodb className="text-emerald-600" />,
      "AWS": <FaAws className="text-emerald-600" />,
      "Supabase": <SiSupabase className="text-emerald-600" />,
      "PostgreSQL": <FaPostgres className="text-emerald-600" />,
      
      // Office & Productivity
      "Microsoft Office Suite": <FaMicrosoft className="text-emerald-600" />,
      "Markdown": <FaMarkdown className="text-emerald-600" />,
      "Trello": <FaTrello className="text-emerald-600" />,
      "Asana": <FaAsana className="text-emerald-600" />,
    };
    
    return iconMap[skillName] || <FaCode className="text-emerald-600" />;
  };

  const skillCategories = [
    {
      title: "Programming Languages",
      icon: <FaCode className="text-white text-2xl" />,
      skills: [
        { name: "Python", level: 90 },
        { name: "C/C++", level: 91 },
        { name: "JavaScript", level: 92 },
        { name: "TypeScript", level: 75 },
        { name: "Golang", level: 72 },
        { name: "Arduino", level: 80 },
        { name: "LaTeX", level: 85 },
        { name: "HTML/CSS", level: 89 },
      ],
    },
    {
      title: "Frameworks & Libraries",
      icon: <FaLaptopCode className="text-white text-2xl" />,
      skills: [
        { name: "React.js", level: 96 },
        { name: "Next.js", level: 83 },
        { name: "Tailwind CSS", level: 94 },
        { name: "Framer Motion", level: 84 },
        { name: "FastAPI", level: 62 },
        { name: "Node.js", level: 77 },
        { name: "Express.js", level: 83 },
        { name: "PyTorch", level: 64 },
        { name: "TensorFlow", level: 60 },
        { name: "OpenCV", level: 56 },
        { name: "Leaflet.js", level: 88 },
        { name: "ROS", level: 79 },
      ],
    },
    {
      title: "Development Tools",
      icon: <FaTools className="text-white text-2xl" />,
      skills: [
        { name: "Git", level: 86 },
        { name: "GitHub", level: 95 },
        { name: "Docker", level: 75 },
        { name: "Ubuntu", level: 82 },
        { name: "Windows", level: 90 },
        { name: "Vite", level: 90 },
      ],
    },
    {
      title: "Database Management Systems",
      icon: <FaDatabase className="text-white text-2xl" />,
      skills: [
        { name: "MongoDB", level: 85 },
        { name: "AWS", level: 70 },
        { name: "Supabase", level: 85 },
        { name: "PostgreSQL", level: 70 },
      ],
    },
    {
      title: "Office & Productivity",
      icon: <FaDesktop className="text-white text-2xl" />,
      skills: [
        { name: "Microsoft Office Suite", level: 95 },
        { name: "Markdown", level: 90 },
        { name: "LaTeX", level: 85 },
        { name: "Trello", level: 59 },
        { name: "Asana", level: 67 },
      ],
    },
  ]

  const certifications = [
    {
      title: "The Fundamentals of Digital Marketing",
      provider: "Google",
      image: "/digitalmarketing.jpeg",
      description: "Comprehensive certification covering digital marketing fundamentals including SEO, social media marketing, and analytics.",
      date: "June 2023",
      skills: ["Digital Marketing", "SEO", "Analytics"]
    },
    {
      title: "Microsoft Office Specialist: PowerPoint 2016",
      provider: "Microsoft",
      image: "/microsoft powerpoint 2016.jpg",
      description: "Official Microsoft certification demonstrating expertise in creating and managing professional PowerPoint presentations.",
      date: "August 2022",
      skills: ["Presentation Design", "Visual Communication", "Microsoft Office"]
    },
    {
      title: "Microsoft Office Specialist: Word 2016",
      provider: "Microsoft",
      image: "/word 2016.jpg",
      description: "Official Microsoft certification validating proficiency in document creation, formatting, and management using Microsoft Word.",
      date: "July 2022",
      skills: ["Document Processing", "Technical Documentation", "Microsoft Office"]
    },
    {
      title: "Technical Writing: Quick Start Guides",
      provider: "LinkedIn",
      image: "/certificateofcompletion_technical writing quick start guides.pdf-1-1.jpeg",
      description: "Specialized training in crafting clear, concise technical documentation and quick start guides for software and hardware products.",
      date: "March 2023",
      skills: ["Technical Writing", "Documentation", "User Guides"]
    },
    {
      title: "Electronics Foundations: Fundamentals",
      provider: "LinkedIn",
      image: "/certificateofcompletion_electronics foundations fundamentals.pdf-1-2.jpeg",
      description: "Foundational training in electronics principles, circuit design, and component functionality for hardware projects.",
      date: "January 2023",
      skills: ["Circuit Design", "Electronics", "Hardware"]
    },
    {
      title: "Introduction to Data Analytics",
      provider: "Meta",
      image: "/data analysis.pdf-1-3.jpeg",
      description: "Meta-certified program covering data analytics principles, tools, and methodologies for extracting insights from data.",
      date: "April 2023",
      skills: ["Data Analysis", "Visualization", "Statistics"]
    }
  ];

  const renderSkillBar = (skill, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, width: 0 }}
      whileInView={{ opacity: 1, width: "100%" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="mb-4"
    >
      <div className="flex justify-between mb-1">
        <div className="flex items-center gap-2">
          {getSkillIcon(skill.name)}
          <span className="text-gray-700 font-medium">{skill.name}</span>
        </div>
        <span className="text-emerald-600 font-medium">{skill.level}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2.5 rounded-full"
        ></motion.div>
      </div>
    </motion.div>
  )

  // Certificate modal
  const CertificateModal = ({ certificate, onClose }) => {
    if (!certificate) return null;
    
    return (
      <AnimatePresence>
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="bg-white rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{certificate.title}</h3>
                    <div className="flex items-center mt-1 text-emerald-100">
                      <FaCertificate className="mr-2" />
                      <span>{certificate.provider}</span>
                      <span className="mx-2">•</span>
                      <span>{certificate.date}</span>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="text-white hover:text-emerald-200 transition-colors p-1"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2 bg-emerald-50 p-4 rounded-lg flex items-center justify-center">
                    <motion.img 
                      src={certificate.image} 
                      alt={certificate.title}
                      className="max-h-80 object-contain"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  </div>
                  
                  <div className="md:w-1/2">
                    <h4 className="text-lg font-medium text-gray-800 mb-3">Description</h4>
                    <p className="text-gray-600 mb-6">{certificate.description}</p>
                    
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Skills Acquired</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {certificate.skills.map((skill, index) => (
                        <span key={index} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                      <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors">
                        <FaDownload /> Download Certificate
                      </button>
                      <button className="flex items-center gap-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-2 px-4 rounded-lg transition-colors">
                        <FaExternalLinkAlt /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-white to-emerald-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600"
          >
            Technical Skills
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "5rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-600 mt-4 max-w-2xl mx-auto"
          >
            A comprehensive overview of my technical expertise and proficiency levels across various domains.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-emerald-100 hover:border-emerald-300"
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-emerald-700">{category.title}</h3>
              </div>

              <div>{category.skills.map((skill, skillIndex) => renderSkillBar(skill, skillIndex))}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-emerald-100"
        >
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-md">
              <FaCertificate className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-700">Certifications</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-md group cursor-pointer overflow-hidden border border-emerald-100"
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 }
                }}
                onClick={() => setSelectedCertificate(cert)}
              >
                {/* Certificate Card Header */}
                <div className="p-3 bg-gradient-to-r from-emerald-600 to-emerald-700">
                  <h4 className="font-semibold text-white truncate">
                    {cert.title}
                  </h4>
                  <p className="text-emerald-100 flex items-center gap-1 text-sm">
                    <FaCertificate />
                    {cert.provider} • {cert.date}
                  </p>
                </div>
                
                {/* Certificate Image */}
                <div className="relative p-4 flex items-center justify-center bg-white">
                  <img 
                    src={cert.image} 
                    alt={cert.title}
                    className="h-40 object-contain"
                  />
                  
                  {/* Overlay with View Details button */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 
                    flex items-center justify-center transition-all duration-300">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-emerald-600 px-4 py-2 rounded-full font-medium 
                      opacity-0 group-hover:opacity-100 shadow-lg flex items-center gap-2"
                    >
                      <FaSearch size={14} />
                      View Details
                    </motion.button>
                  </div>
                </div>
                
                {/* Skills Tags */}
                <div className="p-3 bg-emerald-50 border-t border-emerald-100">
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.slice(0, 2).map((skill, idx) => (
                      <span key={idx} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 2 && (
                      <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-xs">
                        +{cert.skills.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certificate Modal */}
        {selectedCertificate && (
          <CertificateModal 
            certificate={selectedCertificate} 
            onClose={() => setSelectedCertificate(null)} 
          />
        )}
      </div>
    </section>
  )
}

export default Skills