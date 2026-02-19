/**
 * Projects Data
 * -------------------------------------------------------
 * Edit this file to add/remove/update project entries.
 * Each entry has:
 *   id           - Unique number
 *   title        - Project name
 *   technologies - Comma-separated tech string
 *   description  - Array of description paragraphs
 *   image        - Path to screenshot in /public
 *   github       - GitHub repo URL
 *   demo         - (optional) Live demo URL
 *   livePreview  - (optional) "merge-sort" | "chat" | "job-search"
 *   category     - Category badge label
 *   color        - Tailwind gradient classes for accent
 */

const projects = [
  {
    id: 1,
    title: "NaviCV",
    livePreview: "job-search",
    technologies: "Python, FastAPI, Vector Search, Transformers, Docker, Firebase, GitHub Actions",
    description: [
      "All-in-one AI-powered career assistant with advanced resume analysis, ATS optimization, and smart job matching from multiple sources.",
      "Leverages machine learning, semantic search, and vector embeddings to deliver highly relevant career opportunities.",
      "Features automated deployment pipeline with Docker containerization and CI/CD integration.",
    ],
    image: "/navicv.png",
    github: "https://github.com/khangpt2k6/NaviCV",
    demo: "https://navicv.vps.phuchoang.sbs/",
    category: "AI/ML",
    color: "from-indigo-500 to-cyan-600",
  },
  {
    id: 2,
    title: "Zelo",
    livePreview: "chat",
    technologies: "TypeScript, Next.js, RabbitMQ, Cloudinary, Socket.IO, MongoDB, Docker, AWS",
    description: [
      "Real-time social campus chat application built with microservice architecture for scalability.",
      "Implements message queuing with RabbitMQ and WebSocket connections for instant communication.",
      "Features media sharing via Cloudinary integration and cloud deployment on AWS infrastructure.",
    ],
    image: "/zelo.png",
    github: "https://github.com/khangpt2k6/Zelo",
    category: "Full-Stack",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: 3,
    title: "Algovis",
    livePreview: "merge-sort",
    technologies: "Java, JavaFX",
    description: [
      "Interactive algorithm visualization tool with dynamic animations for sorting algorithms.",
      "Real-time performance analysis and comparison between different sorting techniques.",
      "Educational interface designed to enhance understanding of algorithm complexity and behavior.",
    ],
    image: "/algovis.png",
    github: "https://github.com/khangpt2k6/Algovis",
    category: "Education",
    color: "from-purple-500 to-pink-600",
  },
];

export default projects;
