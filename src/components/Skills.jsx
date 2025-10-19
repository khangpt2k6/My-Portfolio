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
      title: "Frontend",
      icon: <Laptop className="w-5 h-5" />,
      description: "Modern frameworks and tools for beautiful user interfaces",
      skills: [
        { name: "React", icon: "react" },
        { name: "Next.js", icon: "nextjs" },
        { name: "Redux", icon: "redux" },
        { name: "Tailwind CSS", icon: "tailwind" },
        { name: "Vite", icon: "vite" },
      ],
    },
    {
      title: "Backend",
      icon: <Database className="w-5 h-5" />,
      description: "Server-side technologies for scalable applications",
      skills: [
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
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-50 rounded-full">
            <Award className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600 tracking-wider uppercase">Expertise</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-neutral-900">
            Technical Skills
          </h2>
          
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            A comprehensive overview of my technical expertise across various domains of software development
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-green-600"></div>
            <Sparkles className="w-4 h-4 text-green-600" />
            <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-green-600"></div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {skillCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(index)}
              className={`group flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                selectedCategory === index
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/30 scale-105"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:scale-105"
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${
                selectedCategory === index ? "bg-white/20" : "bg-white"
              }`}>
                <div className={selectedCategory === index ? "text-white" : "text-green-600"}>
                  {category.icon}
                </div>
              </div>
              <span>{category.title}</span>
            </button>
          ))}
        </div>

        {/* Skills Display */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-10 border-2 border-neutral-200 shadow-xl">
            
            {/* Category Header */}
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl text-white shadow-lg">
                  {currentCategory.icon}
                </div>
                <h3 className="text-3xl font-bold text-neutral-900">
                  {currentCategory.title}
                </h3>
              </div>
              <p className="text-neutral-600 max-w-xl mx-auto">
                {currentCategory.description}
              </p>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {currentCategory.skills.map((skill, index) => (
                <div
                  key={index}
                  className="group relative"
                  onMouseEnter={() => setHoveredSkill(index)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 ${
                    hoveredSkill === index
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 shadow-lg shadow-green-500/20 -translate-y-2 scale-105"
                      : "bg-neutral-50 border-2 border-neutral-200 hover:border-neutral-300"
                  }`}>
                    
                    {/* Skill Icon */}
                    <div className="mb-3 transform transition-transform duration-300 group-hover:scale-110">
                      <img 
                        src={`https://skillicons.dev/icons?i=${skill.icon}&theme=light`}
                        alt={skill.name}
                        className="w-16 h-16"
                      />
                    </div>

                    {/* Skill Name */}
                    <span className={`font-semibold text-center transition-colors text-sm ${
                      hoveredSkill === index ? "text-green-700" : "text-neutral-800"
                    }`}>
                      {skill.name}
                    </span>

                    {/* Hover indicator arrow */}
                    {hoveredSkill === index && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <ChevronRight className="w-5 h-5 text-green-600 rotate-90 animate-bounce" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            

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