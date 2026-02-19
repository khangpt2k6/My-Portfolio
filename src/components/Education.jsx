"use client"
import { motion } from "framer-motion"
import { FaMedal, FaCode } from "react-icons/fa"
import { useState } from "react"
import education from "../data/education"

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
      boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.2), 0 10px 10px -5px rgba(99, 102, 241, 0.1)",
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
    <section id="education" className="py-20 bg-white dark:bg-[#0A0E1A]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text"
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
            className="h-1 mx-auto bg-gradient-to-r from-indigo-600 to-cyan-600"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-10 max-w-2xl mx-auto text-neutral-800 dark:text-[#F9FAFB]"
          >
            Building a foundation of knowledge and expertise
          </motion.p>
        </motion.div>

        <motion.div
          className="flex justify-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* USF Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white dark:bg-[#111827] rounded-xl p-8 shadow-lg border border-indigo-200 dark:border-indigo-800 max-w-2xl w-full"
            onClick={() => setActiveCard(activeCard === "usf" ? null : "usf")}
          >
            <motion.div
              className="flex items-center mb-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center mr-4 overflow-hidden border-2 border-indigo-600 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30"
                variants={iconVariants}
              >
                <img
                  src={education.logo}
                  alt={education.university}
                  className="w-14 h-14 object-cover"
                />
              </motion.div>
              <div>
                <motion.h3
                  className="text-xl font-bold text-neutral-800 dark:text-[#F9FAFB]"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  {education.university}
                </motion.h3>
                <motion.p
                  className="text-indigo-600 dark:text-indigo-400"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {education.degree}
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              className="mb-4"
              variants={listItemVariants}
            >
              <div className="flex items-center">
                <FaCode className="mr-2 text-indigo-600 dark:text-indigo-400" />
                <p className="font-medium text-neutral-800 dark:text-[#F9FAFB]">{education.degree}</p>
              </div>
              <p className="ml-6 text-neutral-800 dark:text-[#F9FAFB]">{education.location}</p>
            </motion.div>

            <motion.div
              className="mb-6"
              variants={listItemVariants}
            >
              <div className="w-full h-2 rounded-full overflow-hidden bg-neutral-100 dark:bg-[#1F2937]">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-600 to-cyan-600"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  viewport={{ once: true }}
                ></motion.div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-neutral-800 dark:text-[#F9FAFB]">GPA</span>
                <span className="font-medium text-neutral-800 dark:text-[#F9FAFB]">{education.gpa}</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-3 flex items-center text-neutral-800 dark:text-[#F9FAFB]">
                <FaMedal className="mr-2 text-indigo-600 dark:text-indigo-400" />
                <span>Awards &amp; Honors</span>
              </h4>
              <motion.ul
                className="space-y-2 ml-2"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {education.awards.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start text-neutral-800 dark:text-[#F9FAFB]"
                    variants={listItemVariants}
                    custom={index}
                  >
                    <span className="mr-2 mt-1 text-indigo-600 dark:text-indigo-400">•</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Education
