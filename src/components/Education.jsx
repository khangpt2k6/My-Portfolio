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
      boxShadow: "0 20px 25px -5px rgba(22, 163, 74, 0.2), 0 10px 10px -5px rgba(22, 163, 74, 0.1)",
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

  return (
    <section id="education" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ 
              background: `linear-gradient(to right, #16A34A, #16A34A)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            variants={titleVariants}
          >
            Education
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "12rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-1 mx-auto"
            style={{ background: 'linear-gradient(to right, #16A34A, #16A34A)' }}
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-10 max-w-2xl mx-auto"
            style={{ color: '#1F2937' }}
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
            className="bg-white rounded-xl p-8 shadow-lg border"
            style={{ borderColor: 'rgba(22, 163, 74, 0.2)' }}
            onClick={() => setActiveCard(activeCard === "usf" ? null : "usf")}
          >
            <motion.div 
              className="flex items-center mb-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-16 h-16 rounded-full flex items-center justify-center mr-4 overflow-hidden border-2"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1), rgba(22, 163, 74, 0.2))',
                  borderColor: '#16A34A'
                }}
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
                  className="text-xl font-bold"
                  style={{ color: '#1F2937' }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  University of South Florida
                </motion.h3>
                <motion.p 
                  style={{ color: '#16A34A' }}
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
                <FaCode className="mr-2" style={{ color: '#16A34A' }} />
                <p className="font-medium" style={{ color: '#1F2937' }}>Bachelor of Science in Computer Science</p>
              </div>
              <p className="ml-6" style={{ color: '#1F2937' }}>Tampa, FL | August 2024 - May 2028</p>
            </motion.div>

            <motion.div 
              className="mb-6"
              variants={listItemVariants}
            >
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
                <motion.div 
                  className="h-full"
                  style={{ background: 'linear-gradient(to right, #16A34A, #16A34A)' }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  viewport={{ once: true }}
                ></motion.div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs" style={{ color: '#1F2937' }}>GPA</span>
                <span className="font-medium" style={{ color: '#1F2937' }}>4.0/4.0</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-3 flex items-center" style={{ color: '#1F2937' }}>
                <FaMedal className="mr-2" style={{ color: '#16A34A' }} /> 
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
                  "Dean's List (Fall 2024)",
                  "Dean's List (Spring 2024)"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    style={{ color: '#1F2937' }}
                    variants={listItemVariants}
                    custom={index}
                  >
                    <span className="mr-2 mt-1" style={{ color: '#16A34A' }}>•</span>
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
            className="bg-white rounded-xl p-8 shadow-lg border"
            style={{ borderColor: 'rgba(22, 163, 74, 0.2)' }}
            onClick={() => setActiveCard(activeCard === "highschool" ? null : "highschool")}
          >
            <motion.div 
              className="flex items-center mb-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-16 h-16 rounded-full flex items-center justify-center mr-4 overflow-hidden border-2"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1), rgba(22, 163, 74, 0.2))',
                  borderColor: '#16A34A'
                }}
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
                  className="text-xl font-bold"
                  style={{ color: '#1F2937' }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  Le Quy Don High School for the Gifted
                </motion.h3>
                <motion.p 
                  style={{ color: '#16A34A' }}
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
                <FaGraduationCap className="mr-2" style={{ color: '#16A34A' }} />
                <p className="font-medium" style={{ color: '#1F2937' }}>High School Diploma</p>
              </div>
              <p className="ml-6" style={{ color: '#1F2937' }}>Da Nang, Vietnam | September 2021 - June 2024</p>
            </motion.div>

            <motion.div 
              className="mb-6"
              variants={listItemVariants}
            >
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
                <motion.div 
                  className="h-full"
                  style={{ background: 'linear-gradient(to right, #16A34A, #16A34A)' }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  viewport={{ once: true }}
                ></motion.div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs" style={{ color: '#1F2937' }}>GPA</span>
                <span className="font-medium" style={{ color: '#1F2937' }}>4.0/4.0</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-3 flex items-center" style={{ color: '#1F2937' }}>
                <FaTrophy className="mr-2" style={{ color: '#16A34A' }} /> 
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
                    className="flex items-start"
                    style={{ color: '#1F2937' }}
                    variants={listItemVariants}
                    custom={index}
                  >
                    <span className="mr-2 mt-1" style={{ color: '#16A34A' }}>•</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div 
              className="mt-4 p-3 rounded-lg border"
              style={{ 
                background: 'linear-gradient(to right, rgba(22, 163, 74, 0.05), rgba(22, 163, 74, 0.05))',
                borderColor: 'rgba(22, 163, 74, 0.2)'
              }}
              variants={listItemVariants}
            >
              <p style={{ color: '#1F2937' }}>
                <span className="font-medium">Featured in National Newspaper:</span>{" "}
                <motion.a
                  href="https://svvn.tienphong.vn/phan-tuan-khang-nam-sinh-chuyen-tin-tai-nang-am-loat-hoc-bong-danh-gia-o-tuoi-18-post1635689.tpo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline inline-flex items-center"
                  style={{ color: '#16A34A' }}
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
    </section>
  )
}

export default Education