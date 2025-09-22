"use client";

import { useState, useEffect } from "react";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCode,
  FaLaptopCode,
  FaUserTie,
  FaHandsHelping,
} from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";

const Experience = () => {
  const [activeTab, setActiveTab] = useState("professional");
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("experience");
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const experiences = {
     professional: [
      {
        title: "Software Engineer",
        company: "HighEndFree",
        location: "Remote",
        period: "Incoming Oct 2025",
        image: "/highendfree.jpg",
        icon: <FaCode />,
        description: [
          "Upcoming role focusing on full-stack development and software engineering solutions"
        ]
      },
      {
        title: "Student Software Engineer",
        company: "Moffitt Cancer Center",
        location: "Tampa, FL",
        period: "Aug 2025 - Present",
        image: "/moffitt.jpg",
        icon: <FaCode />,
        description: [
          "Created interactive **cancer genomics visualizations** (mutation plots, heatmaps, Kaplan–Meier curves) across **38 patient samples** and **33,000 mutations**, enabling doctors to identify actionable insights using **React** and **Plotly/D3**",
          "Developed a **Django dashboard** integrating Galaxy VCFs with **ClinVar** and **CIViC** to highlight pathogenic variants, providing doctors at Moffitt with actionable clinical insights"
        ]
      },
      {
        title: "Software Engineer Intern",
        company: "VNPT IT",
        location: "Da Nang City, Viet Nam",
        period: "Jun 2025 - Aug 2025",
        image: "/vnpt.png",
        icon: <FaCode />,
        description: [
          "Implemented and tested **HTTP-based services in Go**, handling **500+ daily requests** and ensuring reliable data exchange between internal systems",
          "Debugged and maintained services, resolving nearly **10 runtime issues** and collaborating with a team of **5 engineers** to improve system reliability",
          "Optimized API performance by refactoring Go code, achieving a **65% reduction** in average response time"
        ]
      },
      {
        title: "Technical Lead",
        company: "Association for Computing Machinery (ACM) at USF",
        location: "Tampa, FL",
        period: "Apr 2025 – Present",
        image: "/ACM.jpg",
        icon: <FaCode />,
        description: [
          "Organized **Docker workshops** that attracted **100+ students**, empowering participants to containerize, deploy, and manage real-world applications efficiently, and received **89% positive feedback** overall"
        ]
      },
      {
        title: "Student Software Researcher",
        company: "RARE (Reality, Autonomy, and Robot Experience) Lab",
        location: "Tampa, FL",
        period: "Feb 2025 – May 2025",
        image: "/RL.jpg",
        icon: <FaLaptopCode />,
        description: [
          "Worked with **4 student researchers** to develop **C++ algorithms** for robotic sensor data processing, building **ROS packages** with CMake and validating them over **30+ iterations** for stability",
          "Automated **Linux workflows** for builds and simulations, streamlining GitHub collaboration and reducing manual setup time by **50-60%** for a team of 5"
        ]
      },
    ],
    partTime: [
      {
        title: "Event Crew",
        company: "University of South Florida Marshall Student Center",
        location: "Tampa, FL",
        period: "Jan 2025 - Present",
        image: "/MSC.jpg",
        icon: <FaBriefcase />,
      },
    ],
    volunteering: [
      {
        title: "Technical Volunteer",
        company: "USF Engineering Expo",
        location: "Tampa, FL",
        period: "Feb 2025",
        image: "/expo.png",
        icon: <FaHandsHelping />,
      },
      {
        title: "Software Volunteer",
        company: "Bulls Science Olympiad",
        location: "Tampa, FL",
        period: "Jan 2025",
        image: "/BSO.png",
        icon: <FaHandsHelping />,
      },
    ],
  };

  // Animation variants (simplified for compatibility)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      scale: 1.02,
      boxShadow:
        "0 20px 25px -5px rgba(22, 163, 74, 0.2), 0 10px 10px -5px rgba(22, 163, 74, 0.1)",
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const renderExperienceCard = (exp, index) => (
    <div
      key={index}
      className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border mb-8 relative overflow-hidden hover:scale-105 transition-all duration-300"
      style={{ borderColor: "rgba(22, 163, 74, 0.2)" }}
    >
      {/* Accent line */}
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ background: "linear-gradient(to right, #16A34A, #16A34A)" }}
      ></div>

      <div className="flex flex-col md:flex-row md:items-start">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          {exp.image ? (
            <div
              className="w-16 h-16 rounded-full overflow-hidden border-2 shadow-md relative"
              style={{ borderColor: "#16A34A" }}
            >
              <img
                src={exp.image}
                alt={exp.company}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r"></div>
            </div>
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-md"
              style={{
                background:
                  "linear-gradient(to right, rgba(22, 163, 74, 0.1), rgba(22, 163, 74, 0.1))",
              }}
            >
              <div className="text-2xl" style={{ color: "#16A34A" }}>
                {exp.icon || <FaBriefcase />}
              </div>
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h3
            className="text-xl font-bold flex items-center"
            style={{ color: "#1F2937" }}
          >
            {exp.title}
            <span className="ml-2" style={{ color: "#16A34A" }}>
              <HiChevronRight />
            </span>
          </h3>
          <h4 className="text-lg mb-2" style={{ color: "#16A34A" }}>
            {exp.company}
          </h4>

          <div className="flex flex-wrap mb-4" style={{ color: "#1F2937" }}>
            <div className="flex items-center mr-6 mb-2">
              <FaMapMarkerAlt className="mr-1" style={{ color: "#16A34A" }} />
              <span>{exp.location}</span>
            </div>
            <div className="flex items-center mb-2">
              <FaCalendarAlt className="mr-1" style={{ color: "#16A34A" }} />
              <span>{exp.period}</span>
            </div>
          </div>

          {/* Tags */}
          {exp.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {exp.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs rounded-full border"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(22, 163, 74, 0.05), rgba(22, 163, 74, 0.05))",
                    color: "#16A34A",
                    borderColor: "rgba(22, 163, 74, 0.2)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <ul className="space-y-2 ml-2">
            {exp.description &&
              exp.description.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start"
                  style={{ color: "#1F2937" }}
                >
                  <span
                    className="mr-2 mt-1 flex-shrink-0"
                    style={{ color: "#16A34A" }}
                  >
                    •
                  </span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item.replace(
                        /\*\*(.*?)\*\*/g,
                        "<strong>$1</strong>"
                      ),
                    }}
                  ></span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="experience"
      className="py-20"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{
              background: `linear-gradient(to right, #16A34A, #16A34A)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Experience
          </h2>
          <div
            className="h-1 mx-auto w-48"
            style={{
              background: "linear-gradient(to right, #16A34A, #16A34A)",
            }}
          ></div>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "#1F2937" }}>
            My commitment and journey
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <div
            className="p-1 backdrop-blur-sm rounded-full flex border shadow-lg"
            style={{
              backgroundColor: "rgba(22, 163, 74, 0.1)",
              borderColor: "rgba(22, 163, 74, 0.2)",
            }}
          >
            {[
              {
                id: "professional",
                label: "Professional",
                icon: <FaBriefcase className="mr-2" />,
              },
              {
                id: "partTime",
                label: "Part-Time",
                icon: <FaUserTie className="mr-2" />,
              },
              {
                id: "volunteering",
                label: "Volunteering",
                icon: <FaHandsHelping className="mr-2" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-full font-medium flex items-center justify-center min-w-32 transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.id
                    ? "text-white shadow-md"
                    : "bg-transparent hover:bg-opacity-70"
                }`}
                style={
                  activeTab === tab.id
                    ? {
                        background:
                          "linear-gradient(to right, #16A34A, #16A34A)",
                      }
                    : { color: "#16A34A", backgroundColor: "transparent" }
                }
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          {experiences[activeTab].map((exp, index) =>
            renderExperienceCard(exp, index)
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;
