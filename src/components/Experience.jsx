"use client"

import { useState, useEffect } from "react"
import { Briefcase, Calendar, MapPin, Code, Laptop, User, Heart } from "lucide-react"

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
        icon: <Code className="w-5 h-5" />,
        description: [
          "Collaborated with senior engineers to architect scalable HTTP-based services using Java & Spring Boot, enabling real-time data tracking for 2,000+ active users with latency under 200ms.",
          "Contributed to developing dynamic dashboards using Redux for state management, improving data visibility and supporting faster decision-making for business stakeholders.",
          "Assisted in performance optimization of SQL queries and APIs, contributing to the system handling up to 1,000 concurrent requests during peak load, resulting in 40% improved response times.",
          "Participated in code reviews and agile development processes, gaining experience with enterprise-level software development practices and deployment pipelines."
        ],
        tags: ["Java", "Spring Boot", "Redux", "SQL", "REST API", "Performance Optimization"]
      },
      {
        title: "Technical Lead",
        company: "Association for Computing Machinery (ACM) at USF",
        location: "Tampa, FL",
        period: "April 2025 – Present",
        image: "/ACM.jpg",
        icon: <Code className="w-5 h-5" />,
        description: [
          "Organized 2 comprehensive DevOps workshops attracting 200+ participants, featuring hands-on coding exercises with Docker, CI/CD pipelines, and cloud deployment strategies.",
          "Provided technical mentorship to 15+ student developers, offering guidance on full-stack development, debugging techniques, and software engineering best practices.",
          "Led collaborative project initiatives, facilitating knowledge sharing sessions and troubleshooting live coding challenges in real-time development environments.",
          "Coordinated with university faculty and industry professionals to design curriculum that bridges academic learning with industry requirements."
        ],
        tags: ["Python", "JavaScript", "DevOps", "Docker", "CI/CD", "Mentorship", "Leadership"]
      },
      {
        title: "Student Software Researcher",
        company: "RARE (Reality, Autonomy, and Robot Experience) Lab",
        location: "Tampa, FL",
        period: "February 2025 – Present",
        image: "/RL.jpg",
        icon: <Laptop className="w-5 h-5" />,
        description: [
          "Collaborated with 4 student researchers to develop C++ algorithms using OpenCV and Eigen for robotic data processing and path optimization, achieving 2x improvement in simulation throughput.",
          "Automated development workflows and executed commands in Linux environments using Bash scripting, reducing manual setup time by 50% and improving team productivity.",
          "Implemented computer vision algorithms for object detection and tracking in robotic applications, contributing to research publications and conference presentations.",
          "Utilized GitHub for version control and collaborative development, maintaining code quality through peer reviews and continuous integration practices."
        ],
        tags: ["ROS", "C++", "Python", "OpenCV", "Computer Vision", "Linux", "Gazebo", "Research"]
      },
    ],
    partTime: [
      {
        title: "Event Crew Member",
        company: "University of South Florida Marshall Student Center",
        location: "Tampa, FL",
        period: "January 2025 - Present",
        image: "/MSC.jpg",
        icon: <Briefcase className="w-5 h-5" />,
        description: [
          "Managed logistics for over 100 campus events monthly at the USF Marshall Student Center, coordinating setup, operations, and breakdown procedures with attention to detail and safety protocols.",
          "Enhanced event efficiency through optimized workflows and streamlined processes, reducing setup times by 30% and improving overall operational effectiveness for seamless event experiences.",
          "Provided exceptional customer service to 500+ event guests, offering prompt assistance with directions, event information, and issue resolution while maintaining a professional demeanor.",
          "Collaborated with diverse teams including catering, security, and technical staff to ensure successful event execution and positive attendee experiences."
        ],
        tags: ["Event Management", "Customer Service", "Team Collaboration", "Operations"]
      },
    ],
    volunteering: [
      {
        title: "Technical Volunteer",
        company: "USF Engineering Expo",
        location: "Tampa, FL",
        period: "February 2025",
        image: "/expo.png",
        icon: <Heart className="w-5 h-5" />,
        description: [
          "Assisted 200+ prospective engineering students during the annual expo, providing technical demonstrations and comprehensive guidance on academic programs and career opportunities in engineering fields.",
          "Coordinated interactive exhibits showcasing cutting-edge engineering projects including robotics, AI applications, and sustainable technology solutions, contributing to a 15% increase in student engagement.",
          "Facilitated hands-on demonstrations of engineering software tools and hardware projects, inspiring high school students to pursue STEM education and careers.",
          "Collaborated with faculty and industry representatives to present real-world applications of engineering principles and emerging technologies."
        ],
        tags: ["STEM Education", "Public Speaking", "Event Support", "Student Mentoring"]
      },
      {
        title: "Software Development Volunteer",
        company: "Bulls Science Olympiad",
        location: "Tampa, FL",
        period: "January 2025",
        image: "/BSO.png",
        icon: <Heart className="w-5 h-5" />,
        description: [
          "Mentored 50+ K-12 students in STEM competitions, fostering early interest in engineering and robotics through engaging hands-on programming workshops and project-based learning.",
          "Assisted teams in building competition prototypes using Python and Arduino, providing technical guidance that helped multiple teams achieve top 3 placements in regional competitions.",
          "Developed age-appropriate curriculum materials for programming concepts, making complex topics accessible to young learners and encouraging continued STEM exploration.",
          "Organized coding bootcamps and hackathon-style events, creating collaborative learning environments that promoted teamwork and creative problem-solving skills."
        ],
        tags: ["Youth Mentoring", "STEM Education", "Python", "Arduino", "Robotics", "Curriculum Development"]
      }
    ],
  }

  const renderExperienceCard = (exp, index) => (
    <div
      key={index}
      className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-200 mb-8 relative overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl"
    >
      {/* Accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 to-green-500"></div>
      
      <div className="flex flex-col md:flex-row md:items-start">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          {exp.image ? (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-600 shadow-md relative">
              <img
                src={exp.image}
                alt={exp.company}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-600 shadow-md hidden items-center justify-center">
                <div className="text-green-600 text-2xl">
                  {exp.icon || <Briefcase className="w-6 h-6" />}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-600 shadow-md flex items-center justify-center">
              <div className="text-green-600 text-2xl">
                {exp.icon || <Briefcase className="w-6 h-6" />}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-bold text-gray-800 mr-2">
              {exp.title}
            </h3>
            <div className="text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-green-600 mb-3">
            {exp.company}
          </h4>

          <div className="flex flex-wrap gap-4 mb-4 text-gray-700">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-sm">{exp.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-sm">{exp.period}</span>
            </div>
          </div>

          {/* Tags */}
          {exp.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {exp.tags.map((tag, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <ul className="space-y-3 ml-2">
            {exp.description.map((item, i) => (
              <li 
                key={i}
                className="flex items-start text-gray-700 leading-relaxed"
              >
                <span className="mr-3 mt-1 flex-shrink-0 text-green-600 font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>') }}></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )

  return (
    <section id="experience" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            Experience
          </h2>
          <div className="h-1 mx-auto w-48 bg-gradient-to-r from-green-600 to-green-500 rounded-full"></div>
          <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
            My professional journey through internships, leadership roles, and community involvement
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="p-1 bg-green-50 backdrop-blur-sm rounded-full flex border border-green-200 shadow-lg">
            {[
              { id: "professional", label: "Professional", icon: <Briefcase className="w-4 h-4 mr-2" /> },
              { id: "partTime", label: "Part-Time", icon: <User className="w-4 h-4 mr-2" /> },
              { id: "volunteering", label: "Volunteering", icon: <Heart className="w-4 h-4 mr-2" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-medium flex items-center justify-center min-w-32 transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.id 
                    ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md" 
                    : "text-green-600 bg-transparent hover:bg-green-100"
                }`}
              >
                {tab.icon}
                <span className="font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {experiences[activeTab].map((exp, index) => renderExperienceCard(exp, index))}
        </div>
      </div>
    </section>
  )
}
