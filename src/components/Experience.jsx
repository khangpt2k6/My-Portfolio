"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt, FaCode, FaLaptopCode, FaUserTie, FaHandsHelping } from "react-icons/fa"
import { HiChevronRight } from "react-icons/hi"

const Experience = () => {
  const [activeTab, setActiveTab] = useState("professional")
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById("experience")
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  const experiences = {
    professional: [
      {
        title: "Technical Lead",
        company: "Association for Computing Machinery (ACM) at USF",
        location: "Tampa, FL",
        period: "April 2025 – Present",
        image: "/ACM.jpg",
        icon: <FaCode />,
        description: [
          "Implemented interactive learning modules that simplified complex programming concepts for beginners",
          "Conducted omprehensive workshops for USF students on programming fundamentals, increasing their self-reported confidence in computing skills.",
        ],
        tags: ["Python", "JavaScript", "Education", "Leadership", "Mentoring"]
      },
      {
        title: "Undergraduate Research Assistant",
        company: "RARE (Reality, Autonomy, and Robot Experience) Lab",
        location: "Tampa, FL",
        period: "February 2025 – Present",
        image: "/RL.jpg",
        icon: <FaLaptopCode />,
        description: [
          "Engineered advanced robot control models using ROS (Robot Operating System), C++, and Python for autonomous navigation applications",
          "Integrated Virtual Machine environments with Docker containers and Ubuntu OS to optimize Fetch robot performance, resulting in a 28.73% efficiency increase in search and rescue simulations",
          "Enhanced fog projection technology by integrating laser detection systems, collaborating with a cross-functional team to improve detection accuracy by 23.47% across 12 distinct construction site environments",
          "Designed and implemented Human-Robot Interaction (HRI) models focused on intuitive interfaces and natural communication patterns",
          "Conducted rigorous experimental testing procedures to validate robot performance in diverse environments",
          "Participated in weekly lab meetings to present findings and collaborate on innovative approaches to robotics challenges",
        ],
        tags: ["ROS", "C++", "Python", "Docker", "Ubuntu", "Research", "Robotics", "LaTeX"]
      },
      {
        title: "Treasurer & Event Chair",
        company: "VPEC - Vietnam PsychEdu Camp",
        location: "Da Nang, Vietnam",
        period: "August 2022 – March 2024",
        image: "/vpec.jpg",
        icon: <FaUserTie />,
        description: [
          "Led the comprehensive planning, coordination, and management of summer camps serving high school students focused on psychological education and personal development",
          "Secured approximately $2,000 in school funding through effective proposal writing and stakeholder presentations",
          "Designed and implemented programs addressing key psychological issues and life challenges relevant to adolescents",
          "Developed and maintained detailed budget tracking systems using Excel, producing comprehensive financial reports with Microsoft Word",
          "Coordinated all logistics aspects including venue selection, transportation, scheduling, and resource allocation",
        ],
        tags: ["Event Management", "Leadership", "Budgeting", "Technical Support", "Logistics"]
      },
    ],
    partTime: [
      {
        title: "Event Crew, Set up/Event Staff and Coordinator",
        company: "University of South Florida Marshall Student Center",
        location: "Tampa, FL",
        period: "January 2025 - Present",
        image: "/MSC.jpg",
        icon: <FaBriefcase />,
        description: [
          "Managed logistics for over 100 campus events each month at the USF Marshall Student Building.",
          "Enhanced event efficiency through optimized workflows and streamlined processes, reducing setup times and improving overall operations. This contributed to a more efficient use of resources and a seamless event experience.",
          "Provided direct support to guests during events, ensuring their needs were met promptly and professionally. Offered assistance with directions, event information, and resolving any issues, contributing to a positive atmosphere for all attendees.",
        ],
        tags: ["Event Planning", "Logistics", "Customer Service"]
      },
    ],
    volunteering: [
      {
        title: "Build Event Volunteer",
        company: "Bulls Science Olympiad, University of South Florida",
        location: "Tampa, FL",
        period: "January 2025",
        image: "/BSO.png",
        icon: <FaHandsHelping />,
        description: [
          "Mentored 50+ K-12 students in STEM competitions, fostering early interest in engineering and robotics",
          "Assisted in building prototypes and preparing competition projects",
        ],
        tags: ["Mentoring", "STEM Education", "Robotics"]
      },
      {
        title: "Volunteer",
        company: "BlissKidz",
        location: "Da Nang, Vietnam",
        period: "November 2022 - August 2023",
        image: "/blisskidz.jpg",
        icon: <FaHandsHelping />,
        description: [
          "Spearheaded large-scale charity initiatives benefiting underprivileged children in Da Nang, including organizing projects at the SOS Children's Center, Da Nang Maternity Hospital, and remote mountainous areas",
          "Successfully raised over $3,000 through a combination of online and offline fundraising strategies, while also coordinating the collection of in-kind donations such as clothes, toys, and essential supplies",
        ],
        tags: ["Fundraising", "Charity", "Event Planning"]
      },
      {
        title: "Volunteer",
        company: "Canary",
        location: "Da Nang, Vietnam",
        period: "May 2023 - August 2023",
        image: "/canary.jpg",
        icon: <FaHandsHelping />,
        description: [
          "Led activities for orphaned children and raised $2,000 through a successful merchandise sales campaign",
          "Partnered with local businesses to increase fundraising efforts and support children in slums",
        ],
        tags: ["Fundraising", "Community Service", "Event Planning"]
      },
    ],
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  }

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const underlineVariants = {
    hidden: { width: "0%" },
    visible: { 
      width: "100%",
      transition: { duration: 1.2, ease: "easeInOut", delay: 0.2 }
    }
  }

  const techBgEffect = () => (
    <>
      {/* Background tech decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Circuit lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M0,100 Q150,200 300,100 T600,100 T900,100 T1200,100 T1500,100 T1800,100"
            fill="none"
            stroke="rgba(16, 185, 129, 0.05)"
            strokeWidth="6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,400 Q150,500 300,400 T600,400 T900,400 T1200,400 T1500,400 T1800,400"
            fill="none"
            stroke="rgba(16, 185, 129, 0.05)"
            strokeWidth="4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
          />
        </svg>

        {/* Tech particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-emerald-400/30"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              opacity: 0.2 
            }}
            animate={{ 
              y: ["-20%", "120%"],
              opacity: [0.2, 0.6, 0.2],
              transition: { 
                repeat: Infinity, 
                duration: 8 + Math.random() * 12,
                ease: "linear",
                delay: Math.random() * 5
              }
            }}
          />
        ))}

        {/* Gradient orbs */}
        <motion.div 
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-emerald-300/20 to-cyan-300/10 rounded-full blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 2 }}
        />
        
        <motion.div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-full blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
      </div>
    </>
  )

  // Hex grid background
  const hexGridPattern = () => (
    <div className="absolute inset-0 opacity-5 pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
          <motion.path
            d="M25 0 L50 14.4 L50 43.4 L25 57.8 L0 43.4 L0 14.4 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            initial={{ strokeDasharray: 228, strokeDashoffset: 228 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#hexagons)" className="text-emerald-600" />
      </svg>
    </div>
  )

  const renderExperienceCard = (exp, index) => (
    <motion.div
      key={index}
      variants={cardVariants}
      whileHover="hover"
      className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-emerald-100 mb-8 relative overflow-hidden"
    >
      {/* Accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
      
      <div className="flex flex-col md:flex-row md:items-start">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          {exp.image ? (
            <motion.div 
              className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-300 shadow-md relative"
              initial={{ scale: 0.8, opacity: 1 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <img
                src={exp.image}
                alt={exp.company}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r"></div>
            </motion.div>
          ) : (
            <motion.div 
              className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-full flex items-center justify-center shadow-md"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-emerald-600 text-2xl">
                {exp.icon || <FaBriefcase />}
              </div>
            </motion.div>
          )}
        </div>
        <div className="flex-grow">
          <motion.h3 
            className="text-xl font-bold text-gray-800 flex items-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
            viewport={{ once: true }}
          >
            {exp.title}
            <motion.span 
              className="ml-2 text-emerald-500 opacity-0"
              animate={{ 
                opacity: [0, 1, 0],
                x: [0, 4, 0], 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <HiChevronRight />
            </motion.span>
          </motion.h3>
          <motion.h4 
            className="text-lg text-emerald-600 mb-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
            viewport={{ once: true }}
          >
            {exp.company}
          </motion.h4>

          <motion.div 
            className="flex flex-wrap text-gray-600 mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mr-6 mb-2">
              <FaMapMarkerAlt className="mr-1 text-emerald-500" />
              <span>{exp.location}</span>
            </div>
            <div className="flex items-center mb-2">
              <FaCalendarAlt className="mr-1 text-emerald-500" />
              <span>{exp.period}</span>
            </div>
          </motion.div>

          {/* Tags */}
          {exp.tags && (
            <motion.div 
              className="flex flex-wrap gap-2 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
              viewport={{ once: true }}
            >
              {exp.tags.map((tag, i) => (
                <motion.span 
                  key={i}
                  className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-emerald-50 to-cyan-50 text-emerald-700 border border-emerald-200"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * i + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          )}

          <motion.ul 
            className="space-y-2 ml-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {exp.description.map((item, i) => (
              <motion.li 
                key={i}
                className="flex items-start text-gray-700"
                variants={listItemVariants}
                custom={i}
              >
                <span className="text-emerald-500 mr-2 mt-1 flex-shrink-0">•</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </motion.div>
  )

  return (
    <section id="experience" className="py-20 bg-emerald-50 relative overflow-hidden">
      {techBgEffect()}
      {hexGridPattern()}
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent"
            variants={titleVariants}
          >
            Experience
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
            className="text-gray-600 mt-4 max-w-2xl mx-auto"
          >
            My commitment and journey
          </motion.p>
        </motion.div>

        <motion.div 
          className="mb-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="p-1 bg-emerald-100/90 backdrop-blur-sm rounded-full flex border border-emerald-200 shadow-lg">
            {[
              { id: "professional", label: "Professional", icon: <FaBriefcase className="mr-2" /> },
              { id: "partTime", label: "Part-Time", icon: <FaUserTie className="mr-2" /> },
              { id: "volunteering", label: "Volunteering", icon: <FaHandsHelping className="mr-2" /> }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-full font-medium flex items-center justify-center min-w-32 transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md" 
                    : "bg-transparent text-emerald-700 hover:bg-emerald-200/70"
                }`}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {experiences[activeTab].map((exp, index) => renderExperienceCard(exp, index))}
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

export default Experience