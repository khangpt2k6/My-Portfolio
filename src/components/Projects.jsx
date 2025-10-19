import { useState, useEffect, useRef } from "react";
import { Github, ExternalLink, Code, Sparkles, Zap, X, ChevronRight } from "lucide-react";

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeProject]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setActiveProject(null);
    }
  };

  const projects = [
    {
      id: 1,
      title: "NaviCV",
      technologies: "Python, FastAPI, Vector Search, Transformers, Docker, Firebase, GitHub Actions",
      description: [
        "AI-powered resume optimization platform using vector search and NLP to match candidates with relevant job opportunities.",
        "Implements advanced transformer models for intelligent content analysis and recommendation scoring.",
        "Features automated deployment pipeline with Docker containerization and CI/CD integration."
      ],
      image: "/Navicv.png",
      github: "https://github.com/khangpt2k6/NaviCV",
      category: "AI/ML",
      color: "from-emerald-500 to-green-600"
    },
    {
      id: 2,
      title: "Zelo",
      technologies: "TypeScript, Next.js, RabbitMQ, Cloudinary, Socket.IO, MongoDB, Docker, AWS",
      description: [
        "Real-time social campus chat application built with microservice architecture for scalability.",
        "Implements message queuing with RabbitMQ and WebSocket connections for instant communication.",
        "Features media sharing via Cloudinary integration and cloud deployment on AWS infrastructure."
      ],
      image: "/zelo.png",
      github: "https://github.com/khangpt2k6/Zelo",
      category: "Full-Stack",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 3,
      title: "Algovis",
      technologies: "Java, JavaFX",
      description: [
        "Interactive algorithm visualization tool with dynamic animations for sorting algorithms.",
        "Real-time performance analysis and comparison between different sorting techniques.",
        "Educational interface designed to enhance understanding of algorithm complexity and behavior."
      ],
      image: "/Algovis.png",
      github: "https://github.com/khangpt2k6/Algovis",
      category: "Education",
      color: "from-purple-500 to-pink-600"
    },
  ];

  return (
    <section id="projects" className="relative py-24 bg-white overflow-hidden">
      
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgb(22 163 74) 1px, transparent 0)`,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="container relative mx-auto px-4 md:px-6 z-10 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-50 rounded-full">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600 tracking-wider uppercase">Portfolio</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-neutral-900">
            Featured Projects
          </h2>
          
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Innovative solutions spanning AI, web development, and system architecture
          </p>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-green-600"></div>
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-green-600"></div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group relative"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`relative h-full bg-white rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                hoveredCard === index 
                  ? 'border-green-500 shadow-2xl shadow-green-500/20 -translate-y-2' 
                  : 'border-neutral-200 shadow-lg'
              }`}>
                
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden bg-neutral-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredCard === index ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ${
                    hoveredCard === index ? 'opacity-100' : 'opacity-40'
                  }`}></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-neutral-800 border border-neutral-200">
                      <Zap className="w-3 h-3 text-green-600" />
                      {project.category}
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className={`absolute bottom-4 right-4 flex gap-2 transition-all duration-300 ${
                    hoveredCard === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full text-neutral-700 hover:text-white hover:bg-green-600 transition-all duration-300 shadow-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full text-neutral-700 hover:text-white hover:bg-green-600 transition-all duration-300 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-green-600 transition-colors">
                    {project.title}
                  </h3>

                  {/* Tech Stack Preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.split(", ").slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 font-medium border border-neutral-200"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.split(", ").length > 3 && (
                      <span className="text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-700 font-semibold">
                        +{project.technologies.split(", ").length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Description Preview */}
                  <p className="text-neutral-600 mb-6 line-clamp-2 leading-relaxed">
                    {project.description[0]}
                  </p>

                  {/* Explore Button */}
                  <button
                    onClick={() => setActiveProject(project)}
                    className="group/btn flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none rounded-2xl`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Detail Modal */}
        {activeProject && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={handleClickOutside}
          >
            <div
              ref={modalRef}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
            >
              {/* Modal Header with Image */}
              <div className="relative">
                <div className="h-72 overflow-hidden bg-neutral-100">
                  <img
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${activeProject.color} opacity-20`}></div>
                </div>

                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveProject(null);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/95 backdrop-blur-sm rounded-full text-neutral-700 hover:text-white hover:bg-red-500 transition-all duration-300 shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Category Badge */}
                <div className="absolute bottom-4 left-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full font-semibold text-neutral-800 shadow-lg border border-neutral-200">
                    <Zap className="w-4 h-4 text-green-600" />
                    {activeProject.category}
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <h3 className="text-4xl font-bold text-neutral-900 mb-6">
                  {activeProject.title}
                </h3>

                {/* Technologies */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-green-600" />
                    <h4 className="text-xl font-bold text-neutral-900">Tech Stack</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.technologies.split(", ").map((tech, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-lg bg-neutral-100 text-neutral-700 font-medium border border-neutral-200 hover:border-green-500 hover:bg-green-50 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <h4 className="text-xl font-bold text-neutral-900">Project Overview</h4>
                  </div>
                  <div className="space-y-4">
                    {activeProject.description.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                          <div className="w-2 h-2 rounded-full bg-green-600"></div>
                        </div>
                        <p className="text-neutral-700 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Github className="w-5 h-5" />
                    View Code
                  </a>
                  {activeProject.demo && (
                    <a
                      href={activeProject.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 shadow-lg"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -right-40 w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Projects;