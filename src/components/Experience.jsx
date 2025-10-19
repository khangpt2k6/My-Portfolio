"use client";

import { useState } from "react";
import { Briefcase, Code, Laptop, Users, Award, ChevronRight, MapPin, Calendar } from "lucide-react";

const Experience = () => {
  const [activeTab, setActiveTab] = useState("professional");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const experiences = {
    professional: [
      {
        title: "Software Engineer",
        company: "HighEndFree",
        location: "Remote",
        period: "Incoming Oct 2025",
        year: "2025",
        image: "/highendfree.jpg",
        icon: <Code className="w-6 h-6" />,
        description: [
          "Integrated an LLM-based AI assistant with LangChain, optimized PostgreSQL queries, and built a responsive Vue.js/TailwindCSS UI, improving performance and user engagement."
        ]
      },
      {
        title: "Student Software Engineer",
        company: "Moffitt Cancer Center",
        location: "Tampa, FL",
        period: "Aug 2025 - Present",
        year: "2025",
        image: "/moffitt.jpg",
        icon: <Code className="w-6 h-6" />,
        description: [
          "Developed cancer genomics visualizations and a Django dashboard for clinical insights, and trained a U-NET model for lung cancer analysis."
        ]
      },
      {
        title: "Software Engineer Intern",
        company: "VNPT IT",
        location: "Da Nang City, Viet Nam",
        period: "Jun 2025 - Aug 2025",
        year: "2025",
        image: "/vnpt.png",
        icon: <Code className="w-6 h-6" />,
        description: [
          "Developed RESTful APIs with Gin/GORM, refactored endpoints, added unit tests, and automated CI/CD, enhancing system performance and stability."
        ]
      },
      {
        title: "Student Software Researcher",
        company: "RARE (Reality, Autonomy, and Robot Experience) Lab",
        location: "Tampa, FL",
        period: "Feb 2025 – May 2025",
        year: "2025",
        image: "/RL.jpg",
        icon: <Laptop className="w-6 h-6" />,
        description: [
          "Boosted robotics software performance and team efficiency through optimized C++ ROS nodes, automated workflows, and Docker-based setups."
        ]
      }
    ],
    volunteering: [
      {
        title: "Technical Lead",
        company: "Association for Computing Machinery (ACM) at USF",
        location: "Tampa, FL",
        period: "Apr 2025 – Present",
        year: "2025",
        image: "/ACM.jpg",
        icon: <Users className="w-6 h-6" />,
        description: [
          "Organized Docker and CI/CD workshops, led project hubs, and guided hackathon projects, helping students deploy applications and gain hands-on experience with GitHub Actions and AI tools."
        ]
      },
      {
        title: "Technical Volunteer",
        company: "USF Engineering Expo",
        location: "Tampa, FL",
        period: "Feb 2025",
        year: "2025",
        image: "/expo.png",
        icon: <Award className="w-6 h-6" />,
        description: []
      },
      {
        title: "Software Volunteer",
        company: "Bulls Science Olympiad",
        location: "Tampa, FL",
        period: "Jan 2025",
        year: "2025",
        image: "/BSO.png",
        icon: <Award className="w-6 h-6" />,
        description: []
      }
    ]
  };

  const currentExperiences = experiences[activeTab];

  return (
    <section id="experience" className="min-h-screen bg-white py-20 px-4 relative overflow-hidden">
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(22 163 74) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-50 rounded-full">
            <Briefcase className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600 tracking-wider uppercase">My Journey</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-neutral-900">
            Experience
          </h1>
          
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            A timeline of my professional growth and contributions to the tech community
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex gap-2 p-2 bg-neutral-100 rounded-full">
            <button
              onClick={() => setActiveTab("professional")}
              className={`px-8 py-3 rounded-full transition-all duration-300 font-semibold ${
                activeTab === "professional"
                  ? "bg-white text-green-600 shadow-lg"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Professional
            </button>
            <button
              onClick={() => setActiveTab("volunteering")}
              className={`px-8 py-3 rounded-full transition-all duration-300 font-semibold ${
                activeTab === "volunteering"
                  ? "bg-white text-green-600 shadow-lg"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Volunteering
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Vertical Timeline Line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-green-200 to-transparent"></div>

          {/* Experience Cards */}
          <div className="space-y-12">
            {currentExperiences.map((exp, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-20">
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      hoveredIndex === index
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl shadow-green-500/50 scale-110'
                        : 'bg-gradient-to-br from-green-600 to-emerald-700 shadow-lg shadow-green-600/30'
                    }`}>
                      <div className="text-white">
                        {exp.icon}
                      </div>
                    </div>
                    {hoveredIndex === index && (
                      <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
                    )}
                  </div>
                </div>

                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'} pl-20 md:pl-0`}>
                  <div className={`group relative bg-white rounded-2xl border-2 transition-all duration-500 ${
                    hoveredIndex === index
                      ? 'border-green-500 shadow-2xl shadow-green-500/20 -translate-y-2'
                      : 'border-neutral-200 shadow-lg hover:shadow-xl'
                  }`}>
                    
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl opacity-0 transition-opacity duration-500 ${
                      hoveredIndex === index ? 'opacity-100' : ''
                    }`}></div>

                    <div className="relative p-8">
                      
                      {/* Company Logo & Title */}
                      <div className="flex items-start gap-4 mb-4">
                        {exp.image && (
                          <div className="relative">
                            <div className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                              hoveredIndex === index ? 'border-green-500 shadow-lg' : 'border-neutral-200'
                            }`}>
                              <img 
                                src={exp.image} 
                                alt={exp.company}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-neutral-900 mb-1 group-hover:text-green-600 transition-colors">
                            {exp.title}
                          </h3>
                          <p className="text-lg font-semibold text-neutral-700">
                            {exp.company}
                          </p>
                        </div>

                        {/* Year Badge */}
                        <div className="hidden md:block">
                          <span className="inline-flex px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                            {exp.year}
                          </span>
                        </div>
                      </div>

                      {/* Location & Period */}
                      <div className="flex flex-wrap gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2 text-neutral-600">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span>{exp.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span>{exp.period}</span>
                        </div>
                      </div>

                      {/* Description */}
                      {exp.description && exp.description.length > 0 && (
                        <div className="space-y-3">
                          {exp.description.map((item, i) => (
                            <div key={i} className="flex gap-3 items-start group/item">
                              <ChevronRight className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0 group-hover/item:translate-x-1 transition-transform" />
                              <p className="text-neutral-700 leading-relaxed">
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Mobile Year Badge */}
                      <div className="md:hidden mt-4">
                        <span className="inline-flex px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                          {exp.year}
                        </span>
                      </div>
                    </div>

                    {/* Decorative corner accent */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 transition-opacity duration-500 ${
                      hoveredIndex === index ? 'opacity-10' : ''
                    }`} style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}></div>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <span>Want to work together?</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-40 -right-40 w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
    </section>
  );
};

export default Experience;