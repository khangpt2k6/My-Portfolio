import { useState } from "react";
import { Code, Database, Wrench, Laptop, Cloud, Award, Sparkles, ChevronRight } from "lucide-react";

const Skills = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const skillCategories = [
    {
      title: "Languages",
      icon: <Code className="w-5 h-5" />,
      description: "Core programming languages for building robust applications",
      skills: [
        { name: "JavaScript", icon: "js" },
        { name: "TypeScript", icon: "ts" },
        { name: "Python", icon: "python" },
        { name: "Java", icon: "java" },
        { name: "C++", icon: "cpp" },
        { name: "Go", icon: "go" },
        { name: "C", icon: "c" },
        { name: "HTML", icon: "html" },
        { name: "CSS", icon: "css" },
      ],
    },
    {
      title: "Frameworks",
      icon: <Wrench className="w-5 h-5" />,
      description: "Modern frameworks and tools for building applications",
      skills: [
        { name: "React", icon: "react" },
        { name: "Next.js", icon: "nextjs" },
        { name: "Redux", icon: "redux" },
        { name: "Tailwind CSS", icon: "tailwind" },
        { name: "Vite", icon: "vite" },
        { name: "Node.js", icon: "nodejs" },
        { name: "Express", icon: "express" },
        { name: "Django", icon: "django" },
        { name: "FastAPI", icon: "fastapi" },
        { name: "Flask", icon: "flask" },
        { name: "Spring", icon: "spring" },
        { name: ".NET", icon: "dotnet" },
      ],
    },
    {
      title: "Databases",
      icon: <Database className="w-5 h-5" />,
      description: "Data storage and management solutions",
      skills: [
        { name: "MongoDB", icon: "mongodb" },
        { name: "PostgreSQL", icon: "postgresql" },
        { name: "Redis", icon: "redis" },
        { name: "Firebase", icon: "firebase" },
        { name: "Supabase", icon: "supabase" },
      ],
    },
    {
      title: "Cloud & DevOps",
      icon: <Cloud className="w-5 h-5" />,
      description: "Cloud platforms and deployment tools",
      skills: [
        { name: "AWS", icon: "aws" },
        { name: "Google Cloud", icon: "gcp" },
        { name: "Docker", icon: "docker" },
        { name: "Kubernetes", icon: "kubernetes" },
        { name: "GitHub Actions", icon: "githubactions" },
      ],
    },
  ];

  const currentCategory = skillCategories[selectedCategory];

  return (
    <section id="skills" className="py-24 bg-white relative overflow-hidden">
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgb(22 163 74) 1px, transparent 0)`,
        backgroundSize: '48px 48px'
      }}></div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-neutral-900">
            Technical Skills
          </h2>
          
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {skillCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(index)}
              className={`group px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                selectedCategory === index
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/30 scale-105"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:scale-105"
              }`}
            >
              <span>{category.title}</span>
            </button>
          ))}
        </div>

        {/* Skills Display */}
        <div className="max-w-6xl mx-auto">
          
          {/* Category Header */}
          <div className="mb-12 text-center">
            <h3 className="text-4xl font-bold text-neutral-900 mb-2">
              {currentCategory.title}
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto rounded-full"></div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {currentCategory.skills.map((skill, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredSkill(index)}
                onMouseLeave={() => setHoveredSkill(null)}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`
                }}
              >
                <div className={`relative flex flex-col items-center justify-center p-8 rounded-3xl transition-all duration-500 cursor-pointer ${
                  hoveredSkill === index
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl shadow-green-500/40 -translate-y-3 scale-110"
                    : "bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl"
                }`}>
                  
                  {/* Animated background glow */}
                  {hoveredSkill === index && (
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 blur-xl opacity-60 animate-pulse"></div>
                  )}

                  {/* Skill Icon */}
                  <div className={`relative mb-4 transform transition-all duration-500 ${
                    hoveredSkill === index ? "scale-125 rotate-6" : "scale-100"
                  }`}>
                    <img 
                      src={`https://skillicons.dev/icons?i=${skill.icon}&theme=light`}
                      alt={skill.name}
                      className="w-16 h-16 drop-shadow-lg"
                    />
                  </div>

                  {/* Skill Name */}
                  <span className={`relative font-bold text-center transition-all duration-300 text-sm ${
                    hoveredSkill === index ? "text-white scale-110" : "text-neutral-800"
                  }`}>
                    {skill.name}
                  </span>

                  {/* Particle effect on hover */}
                  {hoveredSkill === index && (
                    <>
                      <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-ping"></div>
                      <div className="absolute bottom-2 left-2 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: "0.3s" }}></div>
                    </>
                  )}
                </div>

                {/* Floating animation keyframes injected via style tag */}
                <style>{`
                  @keyframes fadeInUp {
                    from {
                      opacity: 0;
                      transform: translateY(30px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                `}</style>
              </div>
            ))}
          </div>
        </div>

       

        
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-40 -right-40 w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
    </section>
  );
};

export default Skills;