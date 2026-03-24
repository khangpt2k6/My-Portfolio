/**
 * Skills Data
 * -------------------------------------------------------
 * Each category creates one section in the App Store.
 * icon = skillicons.dev key  →  https://skillicons.dev
 */

const skillCategories = [
  {
    title: "Languages",
    icon: "Code",
    skills: [
      { name: "Python", icon: "python", subtitle: "General Purpose" },
      { name: "TypeScript", icon: "ts", subtitle: "Typed JavaScript" },
      { name: "Rust", icon: "rust", subtitle: "Systems Programming" },
      { name: "Go", icon: "go", subtitle: "Cloud Native" },
      { name: "JavaScript", icon: "js", subtitle: "Web Development" },
      { name: "Java", icon: "java", subtitle: "Enterprise Apps" },
      { name: "C++", icon: "cpp", subtitle: "Performance Critical" },
    ],
  },
  {
    title: "Frameworks & Libraries",
    icon: "Wrench",
    skills: [
      { name: "React", icon: "react", subtitle: "UI Library" },
      { name: "Next.js", icon: "nextjs", subtitle: "React Framework" },
      { name: "Node.js", icon: "nodejs", subtitle: "JS Runtime" },
      { name: "FastAPI", icon: "fastapi", subtitle: "Python API" },
      { name: "Django", icon: "django", subtitle: "Python Web" },
      { name: "GraphQL", icon: "graphql", subtitle: "Query Language" },
      { name: "Tailwind CSS", icon: "tailwind", subtitle: "Utility CSS" },
    ],
  },
  {
    title: "Cloud & Infrastructure",
    icon: "Cloud",
    skills: [
      { name: "AWS", icon: "aws", subtitle: "Cloud Platform" },
      { name: "Docker", icon: "docker", subtitle: "Containers" },
      { name: "Kubernetes", icon: "kubernetes", subtitle: "Orchestration" },
      { name: "Terraform", icon: "terraform", subtitle: "Infrastructure as Code" },
      { name: "Git", icon: "git", subtitle: "Version Control" },
      { name: "GitHub Actions", icon: "githubactions", subtitle: "CI/CD Pipelines" },
      { name: "Kafka", icon: "kafka", subtitle: "Event Streaming" },
    ],
  },
  {
    title: "Data & AI",
    icon: "Sparkles",
    skills: [
      { name: "PostgreSQL", icon: "postgresql", subtitle: "Relational Database" },
      { name: "MongoDB", icon: "mongodb", subtitle: "Document Database" },
      { name: "Redis", icon: "redis", subtitle: "Cache & Store" },
      { name: "PyTorch", icon: "pytorch", subtitle: "Deep Learning" },
      { name: "TensorFlow", icon: "tensorflow", subtitle: "ML Framework" },
      { name: "LangChain", icon: "langchain", subtitle: "LLM Framework" },
      { name: "OpenCV", icon: "opencv", subtitle: "Computer Vision" },
    ],
  },
];

export default skillCategories;
