/**
 * Experience Data
 * -------------------------------------------------------
 * Edit this file to add/remove/update experience entries.
 * Each entry has:
 *   title       - Job title
 *   company     - Company name
 *   location    - City / Remote
 *   period      - Date range shown on the card
 *   year        - Year badge
 *   image       - Path to company logo in /public
 *   icon        - Lucide icon name: "Code" | "Laptop" | "Users" | "Award"
 *   description - Array of bullet-point strings (can be empty [])
 */

const experiences = {
  professional: [
    {
      title: "Student Software Engineer",
      company: "Moffitt Cancer Center",
      location: "Tampa, FL",
      period: "Oct 2025 – Present",
      year: "2025",
      image: "/moffitt.jpg",
      icon: "Code",
      description: [
        "Fine-tuned vision transformer models on oncology imaging datasets for tumor detection",
        "Built an LLM-powered clinical assistant using LangChain and RAG over medical literature",
        "Developed cancer genomics visualizations and a Django dashboard for research teams",
      ],
    },
    {
      title: "Software Engineer Intern",
      company: "Prox Shopping",
      location: "Santa Monica, CA",
      period: "Nov 2025 – Present",
      year: "2025",
      image: "/prox-shopping.jpg",
      icon: "Code",
      description: [
        "Scaled a grocery scraper to 19 concurrent browsers using thread pools, cutting processing time by 95%",
        "Eliminated $500+/month in API costs by caching 33K+ ZIP code coordinates with Redis and Haversine",
        "Designed a per-user scraping pipeline across 9 retailers with async I/O and cooperative cancellation",
        "Containerized 7 services with Docker Compose on AWS EC2 with full CI/CD via GitHub Actions",
      ],
    },
    {
      title: "Software Engineer Intern",
      company: "VNPT IT",
      location: "Ho Chi Minh City, Vietnam",
      period: "May 2025 – Aug 2025",
      year: "2025",
      image: "/vnpt.png",
      icon: "Code",
      description: [
        "Built a real-time payment notification system using WebSocket and Stripe Webhooks",
        "Optimized Firestore listeners with useMemo caching, cutting page load from 6s to under 2s",
        "Created 50+ unit tests covering race conditions and error states in the payment flow",
      ],
    },
    {
      title: "Research Assistant",
      company: "USF Reality, Autonomy, and Robot Experience Lab",
      location: "Tampa, FL",
      period: "Feb 2025 – Nov 2025",
      year: "2025",
      image: "/rare-lab.jpg",
      icon: "Laptop",
      description: [
        "Built ETL pipelines processing 15GB+ of robot telemetry, reducing processing time by 60%",
        "Engineered an LLM-powered research assistant with RAG for natural language querying of sensor data",
        "Fine-tuned transformer anomaly detection models achieving 91% precision on navigation failures",
      ],
    },
  ],

  volunteering: [],
};

export default experiences;
