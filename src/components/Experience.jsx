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
        title: "Software Engineer Intern",
        company: "VNPT IT",
        location: "Da Nang City, Viet Nam",
        period: "May 2025 - July 2025",
        image: "/vnpt.png",
        icon: <FaCode />,
        description: [
          "Developed **secure user authentication flows** with token-based access and seamless frontend-backend integration, improving login reliability for **5,000+ daily users**.",
          "Collaborated on **RESTful API designs** and optimized **SQL queries**, reducing API latency from **500ms to 350ms** under high-load scenarios.",
          "Engineered **responsive web interfaces** using React, boosting usability and accessibility scores by **25%**."
        ],
        tags: ["React", "Node.js", "SQL", "REST API", "Authentication"]
      },
      {
        title: "Technical Lead",
        company: "Association for Computing Machinery (ACM) at USF",
        location: "Tampa, FL",
        period: "April 2025 – Present",
        image: "/ACM.jpg",
        icon: <FaCode />,
        description: [
          "Organized **2 technical workshops** on Docker and AI/ML, attracting **50+ student participants** and delivering hands-on demonstrations with real-world applications.",
          "Maintained and scaled a **collaborative project hub**, providing technical guidance to **15 active members** and resolving live coding issues during events."
        ],
        tags: ["Python", "JavaScript", "Full-Stack", "Docker", "AI/ML", "Leadership"]
      },
      {
        title: "Undergraduate Research Assistant",
        company: "RARE (Reality, Autonomy, and Robot Experience) Lab",
        location: "Tampa, FL",
        period: "February 2025 – Present",
        image: "/RL.jpg",
        icon: <FaLaptopCode />,
        description: [
          "Developed **C++ algorithms** for autonomous robot navigation, improving simulation speed by **40%**, enabling faster experimental iterations.",
          "Authored **technical reports and research papers** in LaTeX, contributing to successful grant proposals and publications.",
          "Deployed **ROS environments** via Docker, reducing setup time for robot testing by **50%**."
        ],
        tags: ["ROS", "C++", "Python", "Docker", "Ubuntu", "Research", "Robotics", "LaTeX"]
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
          "Managed logistics for **over 100 campus events** each month at the USF Marshall Student Building, coordinating setup, operations, and breakdown procedures.",
          "Enhanced event efficiency through **optimized workflows** and streamlined processes, reducing setup times by **30%** and improving overall operations for seamless event experiences.",
          "Provided direct support to **500+ guests** during events, ensuring prompt and professional assistance with directions, event information, and issue resolution."
        ],
        tags: ["Event Planning", "Logistics", "Customer Service", "Team Coordination"]
      },
    ],
    volunteering: [
      {
        title: "Technical Volunteer",
        company: "USF Engineering Expo",
        location: "Tampa, FL",
        period: "February 2025",
        image: "/expo.png",
        icon: <FaHandsHelping />,
        description: [
          "Assisted **200+ prospective engineering students** during the annual expo, providing technical demonstrations and guidance on academic programs and career opportunities.",
          "Coordinated interactive exhibits showcasing cutting-edge engineering projects, contributing to a **15% increase** in student engagement and program interest."
        ],
        tags: ["Mentoring", "STEM Education", "Public Speaking", "Event Support"]
      },
      {
        title: "Software Volunteer",
        company: "Bulls Science Olympiad",
        location: "Tampa, FL",
        period: "January 2025",
        image: "/BSO.png",
        icon: <FaHandsHelping />,
        description: [
          "Mentored **50+ K-12 students** in STEM competitions, fostering early interest in engineering and robotics through hands-on programming workshops.",
          "Assisted in building prototypes and preparing competition projects using **Python and Arduino**, helping teams achieve top 3 placements in regional competitions."
        ],
        tags: ["Mentoring", "STEM Education", "Python", "Arduino", "Robotics"]
      },
      {
        title: "Volunteer",
        company: "BlissKidz",
        location: "Da Nang, Vietnam",
        period: "November 2022 - August 2023",
        image: "/blisskidz.jpg",
        icon: <FaHandsHelping />,
        description: [
          "Spearheaded **large-scale charity initiatives** benefiting **300+ underprivileged children** in Da Nang, including organizing projects at the SOS Children's Center, Da Nang Maternity Hospital, and remote mountainous areas.",
          "Successfully raised **over $3,000** through comprehensive online and offline fundraising strategies, while coordinating collection of essential supplies including clothes, toys, and educational materials."
        ],
        tags: ["Fundraising", "Charity", "Event Planning", "Community Outreach"]
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
      boxShadow: "0 20px 25px -5px rgba(22, 163, 74, 0.2), 0 10px 10px -5px rgba(22, 163, 74, 0.1)",
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

  const renderExperienceCard = (exp, index) => (
    <motion.div
      key={index}
      variants={cardVariants}
      whileHover="hover"
      className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border mb-8 relative overflow-hidden"
      style={{ borderColor: 'rgba(22, 163, 74, 0.2)' }}
    >
      {/* Accent line */}
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(to right, #16A34A, #16A34A)' }}></div>
      
      <div className="flex flex-col md:flex-row md:items-start">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          {exp.image ? (
            <motion.div 
              className="w-16 h-16 rounded-full overflow-hidden border-2 shadow-md relative"
              style={{ borderColor: '#16A34A' }}
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
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(to right, rgba(22, 163, 74, 0.1), rgba(22, 163, 74, 0.1))' }}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl" style={{ color: '#16A34A' }}>
                {exp.icon || <FaBriefcase />}
              </div>
            </motion.div>
          )}
        </div>
        <div className="flex-grow">
          <motion.h3 
            className="text-xl font-bold flex items-center"
            style={{ color: '#1F2937' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
            viewport={{ once: true }}
          >
            {exp.title}
            <motion.span 
              className="ml-2 opacity-0"
              style={{ color: '#16A34A' }}
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
            className="text-lg mb-2"
            style={{ color: '#16A34A' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
            viewport={{ once: true }}
          >
            {exp.company}
          </motion.h4>

          <motion.div 
            className="flex flex-wrap mb-4"
            style={{ color: '#1F2937' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mr-6 mb-2">
              <FaMapMarkerAlt className="mr-1" style={{ color: '#16A34A' }} />
              <span>{exp.location}</span>
            </div>
            <div className="flex items-center mb-2">
              <FaCalendarAlt className="mr-1" style={{ color: '#16A34A' }} />
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
                  className="px-2 py-1 text-xs rounded-full border"
                  style={{ 
                    background: 'linear-gradient(to right, rgba(22, 163, 74, 0.05), rgba(22, 163, 74, 0.05))',
                    color: '#16A34A',
                    borderColor: 'rgba(22, 163, 74, 0.2)'
                  }}
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
                className="flex items-start"
                style={{ color: '#1F2937' }}
                variants={listItemVariants}
                custom={i}
              >
                <span className="mr-2 mt-1 flex-shrink-0" style={{ color: '#16A34A' }}>•</span>
                <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </motion.div>
  )

  return (
    <section id="experience" className="py-20" style={{ backgroundColor: '#ffffff' }}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
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
            Experience
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
            className="mt-4 max-w-2xl mx-auto"
            style={{ color: '#1F2937' }}
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
          <div className="p-1 backdrop-blur-sm rounded-full flex border shadow-lg" style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)', borderColor: 'rgba(22, 163, 74, 0.2)' }}>
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
                    ? "text-white shadow-md" 
                    : "bg-transparent hover:bg-opacity-70"
                }`}
                style={activeTab === tab.id 
                  ? { background: 'linear-gradient(to right, #16A34A, #16A34A)' }
                  : { color: '#16A34A', backgroundColor: 'transparent' }
                }
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
    </section>
  )
}

export default Experience