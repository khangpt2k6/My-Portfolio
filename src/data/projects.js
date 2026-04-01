/**
 * Projects Data
 * -------------------------------------------------------
 * Each entry has:
 *   id           - Unique number
 *   title        - Project name
 *   technologies - Comma-separated tech string
 *   description  - Array of description paragraphs
 *   image        - Path to screenshot in /public (fallback)
 *   video        - (Optional) Path to demo video in /public
 *   github       - GitHub repo URL
 *   demo         - (Optional) Live demo URL
 *   livePreview  - "chat" | "job-search" | "room-booking" | "finance"
 *   color        - Tailwind gradient classes for accent
 */

const projects = [
  {
    id: 0,
    title: "NaviCV",
    livePreview: "job-search",
    technologies: "Python, FastAPI, Vector Search, Transformers, Docker, Firebase, GitHub Actions",
    description: [
      "All-in-one AI-powered career assistant with advanced resume analysis, ATS optimization, and smart job matching from multiple sources.",
      "Leverages machine learning, semantic search, and vector embeddings to deliver highly relevant career opportunities.",
      "Features automated deployment pipeline with Docker containerization and CI/CD integration.",
    ],
    image: "/navi-cv.png",
    github: "https://github.com/khangpt2k6/NaviCV",
    color: "from-indigo-500 to-cyan-600",
  },
  {
    id: 1,
    title: "BullSpace",
    livePreview: "room-booking",
    technologies: "React Native, Node.js, Express, MongoDB, Redis, RabbitMQ, Socket.IO",
    description: [
      "A mobile room booking app built to solve the frustration of finding and reserving available rooms on campus.",
      "Students can browse, book, and get real-time availability updates instead of walking floor to floor checking doors.",
      "Uses microservice architecture with message queuing for reliable booking and real-time sync across all clients.",
    ],
    image: "/bull_space.jpg",
    github: "https://github.com/khangpt2k6/BullSpace",
    color: "from-emerald-500 to-green-600",
  },
  {
    id: 2,
    title: "CampusConnect",
    livePreview: "chat",
    technologies: "TypeScript, Next.js, RabbitMQ, Cloudinary, Socket.IO, MongoDB, Docker, AWS",
    description: [
      "Real-time social campus chat application built with microservice architecture for scalability.",
      "Implements message queuing with RabbitMQ and WebSocket connections for instant communication.",
      "Features media sharing via Cloudinary integration and cloud deployment on AWS infrastructure.",
    ],
    image: "/campusconnect.jpg",
    github: "https://github.com/khangpt2k6/CampusConnect",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: 3,
    title: "Sentinel",
    technologies: "Python, FastAPI, React, Three.js, WebSocket, Google ADK, Google Gemini API",
    description: [
      "A real-time 3D space dashboard that tracks orbital objects and uses AI agents to predict collisions and recommend avoidance maneuvers.",
    ],
    image: "/Sentinel.mp4",
    video: "/Sentinel.mp4",
    github: "https://github.com/DinhPhucLe/sentinel",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: 4,
    title: "VaultX",
    livePreview: "finance",
    technologies: "Java, Spring Boot, PostgreSQL, H2 Database, Maven, React, Bootstrap",
    description: [
      "Comprehensive financial management platform combining traditional banking with advanced trading capabilities.",
      "Built with Spring Boot backend and React frontend for managing customers, accounts, transactions, and trading portfolios.",
      "Provides a secure, scalable solution with real-time portfolio tracking and transaction management.",
    ],
    image: "/vaultX.png",
    github: "https://github.com/khangpt2k6/VaultX",
    color: "from-blue-500 to-amber-500",
  },
];

export default projects;
