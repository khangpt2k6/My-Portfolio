/**
 * Skills Data
 * -------------------------------------------------------
 * Each category creates one marquee row.
 * icon = skillicons.dev key  →  https://skillicons.dev
 */

const skillCategories = [
  {
    title: "Languages",
    icon: "Code",
    skills: [
      { name: "Python", icon: "python" },
      { name: "Go", icon: "go" },
      { name: "Java", icon: "java" },
      { name: "JavaScript", icon: "js" },
      { name: "TypeScript", icon: "ts" },
      { name: "C++", icon: "cpp" },
      { name: "C", icon: "c" },
      { name: "SQL", icon: "postgresql" },
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
    ],
  },
  {
    title: "Frameworks & Libraries",
    icon: "Wrench",
    skills: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Vue.js", icon: "vue" },
      { name: "Django", icon: "django" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "Node.js", icon: "nodejs" },
      { name: "Spring Boot", icon: "spring" },
      { name: "Redux", icon: "redux" },
      { name: "Jest", icon: "jest" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Bootstrap", icon: "bootstrap" },
      { name: "Vite", icon: "vite" },
    ],
  },
  {
    title: "Databases",
    icon: "Database",
    skills: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Supabase", icon: "supabase" },
      { name: "Firebase", icon: "firebase" },
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: "Cloud",
    skills: [
      { name: "AWS", icon: "aws" },
      { name: "Git", icon: "git" },
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "Redis", icon: "redis" },
      { name: "RabbitMQ", icon: "rabbitmq" },
      { name: "Kafka", icon: "kafka" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "Vercel", icon: "vercel" },
      { name: "Nginx", icon: "nginx" },
      { name: "Linux", icon: "linux" },
      { name: "Postman", icon: "postman" },
    ],
  },
  {
    title: "AI & Machine Learning",
    icon: "Sparkles",
    skills: [
      { name: "TensorFlow", icon: "tensorflow" },
      { name: "PyTorch", icon: "pytorch" },
      { name: "OpenCV", icon: "opencv" },
      { name: "Sklearn", icon: "sklearn" },
      { name: "LangChain", icon: "langchain" },
      { name: "LangGraph", icon: "langgraph" },
    ],
  },
  {
    title: "Design",
    icon: "Palette",
    skills: [
      { name: "Figma", icon: "figma" },
      { name: "Canva", icon: "canva" },
      { name: "Photoshop", icon: "ps" },
      { name: "Illustrator", icon: "ai" },
    ],
  },
];

export default skillCategories;
