"use client"
import { motion } from "framer-motion"
import { FaGraduationCap, FaMedal, FaUniversity, FaTrophy, FaCode } from "react-icons/fa"
import { useState } from "react"

const Education = () => {
  const [activeCard, setActiveCard] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const underlineVariants = {
    hidden: { width: "0%" },
    visible: { 
      width: "100%",
      transition: { duration: 1.2, ease: "easeInOut", delay: 0.2 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  // Floating binary effect component
  const FloatingBinary = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-emerald-600/20 text-xs md:text-sm font-mono"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: -20, 
              opacity: 0.3 
            }}
            animate={{ 
              y: "120%",
              opacity: [0.3, 0.7, 0.3],
              transition: { 
                repeat: Infinity, 
                duration: 10 + Math.random() * 20,
                ease: "linear",
                delay: Math.random() * 5
              }
            }}
          >
            {Math.random() > 0.5 ? "1" : "0"}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section id="education" className="py-20 bg-emerald-50 relative overflow-hidden">
      <FloatingBinary />
      
      {/* Tech-inspired decorative elements */}
      <motion.div 
        className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-300/30 to-cyan-300/10 rounded-full blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      
      <motion.div 
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-400/20 to-transparent rounded-full blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent"
            variants={titleVariants}
          >
            Education
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "12rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-600 mt-10 max-w-2xl mx-auto"
          >
            Building a foundation of knowledge and expertise
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* USF Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white rounded-xl p-8 shadow-lg relative overflow-hidden backdrop-blur-sm border border-emerald-100"
            onClick={() => setActiveCard(activeCard === "usf" ? null : "usf")}
          >
            {/* Tech decoration */}
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-100 rounded-full opacity-30"></div>
            
            <motion.div 
              className="flex items-center mb-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mr-4 overflow-hidden border-2 border-emerald-300"
                variants={iconVariants}
              >
                <img
                  src="/university_of_south_florida_seal.svg"
                  alt="University of South Florida"
                  className="w-14 h-14 object-cover"
                />
              </motion.div>
              <div>
                <motion.h3 
                  className="text-xl font-bold text-gray-800"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  University of South Florida
                </motion.h3>
                <motion.p 
                  className="text-emerald-600"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Judy Genshaft Honor College
                </motion.p>
              </div>
            </motion.div>

            <motion.div 
              className="mb-4"
              variants={listItemVariants}
            >
              <div className="flex items-center">
                <FaCode className="text-emerald-500 mr-2" />
                <p className="text-gray-700 font-medium">Bachelor of Science in Computer Science</p>
              </div>
              <p className="text-gray-600 ml-6">Tampa, FL | August 2024 - May 2028</p>
            </motion.div>

            <motion.div 
              className="mb-6"
              variants={listItemVariants}
            >
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  viewport={{ once: true }}
                ></motion.div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">GPA</span>
                <span className="text-gray-700 font-medium">4.0/4.0</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaMedal className="text-emerald-500 mr-2" /> 
                <span>Awards & Honors</span>
              </h4>
              <motion.ul 
                className="space-y-2 ml-2"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  "Green and Gold Presidential Scholarship Award ($44,000)",
                  "Dean's List (Fall 2024)"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start text-gray-700"
                    variants={listItemVariants}
                    custom={index}
                  >
                    <span className="text-emerald-500 mr-2 mt-1">•</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>

          {/* High School Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-xl p-8 shadow-lg relative overflow-hidden backdrop-blur-sm bg-white/90 border border-emerald-100"
            onClick={() => setActiveCard(activeCard === "highschool" ? null : "highschool")}
          >
            {/* Tech decoration */}
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-emerald-400"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-100 rounded-full opacity-30"></div>
            
            <motion.div 
              className="flex items-center mb-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-cyan-200 rounded-full flex items-center justify-center mr-4 overflow-hidden border-2 border-emerald-300"
                variants={iconVariants}
              >
                <img
                  src="/lqd.jpg"
                  alt="Le Quy Don High School"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div>
                <motion.h3 
                  className="text-xl font-bold text-gray-800"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  Le Quy Don High School for the Gifted
                </motion.h3>
                <motion.p 
                  className="text-emerald-600"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Class of IT Specialized
                </motion.p>
              </div>
            </motion.div>

            <motion.div 
              className="mb-4"
              variants={listItemVariants}
            >
              <div className="flex items-center">
                <FaGraduationCap className="text-emerald-500 mr-2" />
                <p className="text-gray-700 font-medium">High School Diploma</p>
              </div>
              <p className="text-gray-600 ml-6">Da Nang, Vietnam | September 2021 - June 2024</p>
            </motion.div>

            <motion.div 
              className="mb-6"
              variants={listItemVariants}
            >
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  viewport={{ once: true }}
                ></motion.div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">GPA</span>
                <span className="text-gray-700 font-medium">4.0/4.0</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaTrophy className="text-emerald-500 mr-2" /> 
                <span>Awards</span>
              </h4>
              <motion.ul 
                className="space-y-2 ml-2"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  "Bronze Medal – Central Regional Informatics Olympic",
                  "2nd Place – City Informatics Competition",
                  "2nd Prize in Youth Informatics Championship",
                  "Le Quy Don High School Scholarship for Honor Student"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start text-gray-700"
                    variants={listItemVariants}
                    custom={index}
                  >
                    <span className="text-emerald-500 mr-2 mt-1">•</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div 
              className="mt-4 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100"
              variants={listItemVariants}
            >
              <p className="text-gray-700">
                <span className="font-medium">Featured in National Newspaper:</span>{" "}
                <motion.a
                  href="https://svvn.tienphong.vn/phan-tuan-khang-nam-sinh-chuyen-tin-tai-nang-am-loat-hoc-bong-danh-gia-o-tuoi-18-post1635689.tpo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline inline-flex items-center"
                  whileHover={{ scale: 1.03 }}
                >
                  Read Article
                  <motion.span 
                    className="ml-1"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </motion.a>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Animated bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-emerald-400 via-cyan-500 to-emerald-400 w-[200%]"
          animate={{ 
            x: [0, "-50%"],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 8,
            ease: "linear"
          }}
        />
      </div>
    </section>
  )
}

export default Education