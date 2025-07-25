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
  FaChevronRight,
  FaExpand
} from "react-icons/fa"
import { SiTypescript, SiMongodb, SiSupabase } from "react-icons/si"
import { FaGolang } from "react-icons/fa6"

const Skills = () => {
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [selectedCertificate, setSelectedCertificate] = useState(null)

  const getSkillIcon = (skillName) => {
    const iconMap = {
      "Python": <FaPython />,
      "C/C++": <FaCode />,
      "JavaScript": <FaJs />,
      "TypeScript": <SiTypescript />,
      "Arduino": <FaArduino />,
      "Golang": <FaGolang />,
      "LaTeX": <FaLatex />,
      "HTML/CSS": <FaHtml5 />,
      "React.js": <FaReact />,
      "Next.js": <FaReact />,
      "Tailwind CSS": <FaTailwind />,
      "Framer Motion": <FaFramer />,
      "FastAPI": <FaFastAPI />,
      "Node.js": <FaNodeJs />,
      "Express.js": <FaNodeJs />,
      "PyTorch": <FaPyTorch />,
      "TensorFlow": <FaTensorFlow />,
      "OpenCV": <FaOpenCV />,
      "Leaflet.js": <FaLeaflet />,
      "ROS": <FaROS />,
      "Git": <FaGit />,
      "GitHub": <FaGithub />,
      "Docker": <FaDocker />,
      "Ubuntu": <FaUbuntu />,
      "Windows": <FaWindows />,
      "Vite": <FaVite />,
      "npm": <FaNpm />,
      "yarn": <FaYarn />,
      "MongoDB": <SiMongodb />,
      "AWS": <FaAws />,
      "Supabase": <SiSupabase />,
      "PostgreSQL": <FaPostgres />,
      "Microsoft Office Suite": <FaMicrosoft />,
      "Markdown": <FaMarkdown />,
      "Trello": <FaTrello />,
      "Asana": <FaAsana />,
    };
    
    return iconMap[skillName] || <FaCode />;
  };

  const skillCategories = [
    {
      title: "Programming Languages",
      icon: <FaCode />,
      color: "#16A34A",
      skills: [
        { name: "Python" },
        { name: "C/C++" },
        { name: "JavaScript" },
        { name: "TypeScript" },
        { name: "Golang" },
        { name: "Arduino" },
        { name: "LaTeX" },
        { name: "HTML/CSS" },
      ],
    },
    {
      title: "Frameworks & Libraries",
      icon: <FaLaptopCode />,
      color: "#16A34A",
      skills: [
        { name: "React.js" },
        { name: "Next.js" },
        { name: "Tailwind CSS" },
        { name: "Framer Motion" },
        { name: "FastAPI" },
        { name: "Node.js" },
        { name: "Express.js" },
        { name: "PyTorch" },
        { name: "TensorFlow" },
        { name: "OpenCV" },
        { name: "Leaflet.js" },
        { name: "ROS" },
      ],
    },
    {
      title: "Development Tools",
      icon: <FaTools />,
      color: "#16A34A",
      skills: [
        { name: "Git" },
        { name: "GitHub" },
        { name: "Docker" },
        { name: "Ubuntu" },
        { name: "Windows" },
        { name: "Vite" },
      ],
    },
    {
      title: "Database Management",
      icon: <FaDatabase />,
      color: "#16A34A",
      skills: [
        { name: "MongoDB" },
        { name: "AWS" },
        { name: "Supabase" },
        { name: "PostgreSQL" },
      ],
    },
    {
      title: "Productivity Tools",
      icon: <FaDesktop />,
      color: "#16A34A",
      skills: [
        { name: "Microsoft Office Suite" },
        { name: "Markdown" },
        { name: "LaTeX" },
        { name: "Trello" },
        { name: "Asana" },
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
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{certificate.title}</h3>
                    <div className="flex items-center mt-2 text-gray-200">
                      <FaCertificate className="mr-2" />
                      <span>{certificate.provider}</span>
                      <span className="mx-2">•</span>
                      <span>{certificate.date}</span>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="text-white hover:text-gray-300 transition-colors p-2"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/2 bg-gray-50 p-6 rounded-xl flex items-center justify-center">
                    <motion.img 
                      src={certificate.image} 
                      alt={certificate.title}
                      className="max-h-80 object-contain"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  </div>
                  
                  <div className="lg:w-1/2">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Description</h4>
                    <p className="text-gray-600 mb-6 leading-relaxed">{certificate.description}</p>
                    
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Skills Acquired</h4>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {certificate.skills.map((skill, index) => (
                        <span key={index} className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl transition-colors font-medium">
                        <FaDownload /> Download
                      </button>
                      <button className="flex items-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 px-6 rounded-xl transition-colors font-medium">
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

  // Background Animation Components
  const FloatingElement = ({ children, delay = 0, duration = 20, initialX = 0, initialY = 0 }) => (
    <motion.div
      className="absolute opacity-20 text-gray-400"
      initial={{ x: initialX, y: initialY, rotate: 0 }}
      animate={{ 
        x: [initialX, initialX + 100, initialX - 50, initialX],
        y: [initialY, initialY - 80, initialY + 120, initialY],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {children}
    </motion.div>
  );

  return (
    <section id="skills" className="py-20 bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingElement delay={0} duration={25} initialX={100} initialY={200}>
          <FaCode size={60} />
        </FloatingElement>
        <FloatingElement delay={3} duration={30} initialX={300} initialY={100}>
          <FaReact size={40} />
        </FloatingElement>
        <FloatingElement delay={6} duration={35} initialX={500} initialY={300}>
          <FaDatabase size={50} />
        </FloatingElement>
        <FloatingElement delay={9} duration={28} initialX={700} initialY={150}>
          <FaTools size={45} />
        </FloatingElement>
        <FloatingElement delay={12} duration={32} initialX={900} initialY={250}>
          <FaLaptopCode size={55} />
        </FloatingElement>
        <FloatingElement delay={15} duration={26} initialX={1100} initialY={180}>
          <FaGit size={35} />
        </FloatingElement>
        <FloatingElement delay={18} duration={29} initialX={200} initialY={400}>
          <FaPython size={48} />
        </FloatingElement>
        <FloatingElement delay={21} duration={33} initialX={400} initialY={450}>
          <FaNodeJs size={42} />
        </FloatingElement>
        
        {/* Additional floating elements for more density */}
        <FloatingElement delay={2} duration={24} initialX={150} initialY={50}>
          <FaJs size={38} />
        </FloatingElement>
        <FloatingElement delay={5} duration={27} initialX={350} initialY={350}>
          <FaDocker size={44} />
        </FloatingElement>
        <FloatingElement delay={8} duration={31} initialX={550} initialY={80}>
          <FaGithub size={36} />
        </FloatingElement>
        <FloatingElement delay={11} duration={34} initialX={750} initialY={400}>
          <FaAws size={52} />
        </FloatingElement>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: '#16A34A' }}
          >
            Technical Skills
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-1 bg-green-600 mx-auto mb-6"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed"
          >
            A comprehensive overview of my technical expertise across various domains of software development and technology.
          </motion.p>
        </div>

        {/* Skills Categories Navigation */}
        <div className="mb-16">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {skillCategories.map((category, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedCategory(index)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === index
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.icon}
                <span>{category.title}</span>
              </motion.button>
            ))}
          </div>

          {/* Skills Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: '#16A34A' }}>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                  {skillCategories[selectedCategory].icon}
                </div>
                {skillCategories[selectedCategory].title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {skillCategories[selectedCategory].skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 text-green-600 flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">
                          {getSkillIcon(skill.name)}
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                          {skill.name}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3" style={{ color: '#16A34A' }}>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                <FaCertificate />
              </div>
              Professional Certifications
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Industry-recognized certifications that validate my expertise and commitment to continuous learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => setSelectedCertificate(cert)}
              >
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative overflow-hidden bg-gray-50">
                    <img 
                      src={cert.image} 
                      alt={cert.title}
                      className="w-full h-48 object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium shadow-lg flex items-center gap-2"
                      >
                        <FaExpand size={14} />
                        View Certificate
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="font-bold text-gray-900 mb-2 text-lg leading-tight">
                      {cert.title}
                    </h4>
                    <p className="text-green-600 font-medium mb-3 flex items-center gap-2">
                      <FaCertificate size={14} />
                      {cert.provider} • {cert.date}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {cert.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                      {cert.skills.length > 3 && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          +{cert.skills.length - 3} more
                        </span>
                      )}
                    </div>
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