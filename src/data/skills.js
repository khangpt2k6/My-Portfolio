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
      { name: "TypeScript", icon: "ts" },
      { name: "Go", icon: "go" },
      { name: "JavaScript", icon: "js" },
      { name: "Java", icon: "java" },
      { name: "C++", icon: "cpp" },
    ],
  },
  {
    title: "Frameworks & Libraries",
    icon: "Wrench",
    skills: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Node.js", icon: "nodejs" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "Django", icon: "django" },
      { name: "Tailwind CSS", icon: "tailwind" },
    ],
  },
  {
    title: "Cloud & Infrastructure",
    icon: "Cloud",
    skills: [
      { name: "AWS", icon: "aws" },
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "Git", icon: "git" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "Vercel", icon: "vercel" },
    ],
  },
  {
    title: "Data & AI",
    icon: "Sparkles",
    skills: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Redis", icon: "redis" },
      { name: "PyTorch", icon: "pytorch" },
      { name: "TensorFlow", icon: "tensorflow" },
      { name: "LangChain", icon: "langchain" },
    ],
  },
];

export default skillCategories;
