/**
 * Skills Data
 * -------------------------------------------------------
 * Edit this file to add/remove/update skills.
 * Each category has:
 *   title       - Category heading
 *   icon        - Lucide icon name: "Code" | "Wrench" | "Database" | "Cloud"
 *   description - Short category description
 *   skills      - Array of { name, icon } where icon is the skillicons.dev key
 *
 * Browse available icons at: https://skillicons.dev
 */

const skillCategories = [
  {
    title: "Languages",
    icon: "Code",
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
    icon: "Wrench",
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
    icon: "Database",
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
    icon: "Cloud",
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

export default skillCategories;
