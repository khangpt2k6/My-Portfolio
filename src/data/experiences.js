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
        "Built an interactive gene network dashboard in R Shiny to visualize molecular interactions and surface Bayesian model predictions guiding clinical trials.",
        "Fine-tuned a medical vision-language model on clinical images and engineered data augmentation pipelines to train effectively on limited datasets.",
      ],
    },
    {
      title: "Software Engineer Intern",
      company: "Prox Shopping",
      location: "Santa Monica, CA",
      period: "Nov 2025 – Feb 2026",
      year: "2026",
      image: "/prox-shopping.jpg",
      icon: "Code",
      description: [
        "Built a distributed web scraping pipeline with headless browser automation to collect product data and power real-time price search.",
        "Rearchitected the geospatial pipeline to concurrent workers with Redis caching, and containerized services on AWS with CI/CD and monitoring.",
      ],
    },
    {
      title: "Software Engineer Intern",
      company: "VNPT IT",
      location: "Da Nang City, Vietnam",
      period: "May 2025 – Aug 2025",
      year: "2025",
      image: "/vnpt.png",
      icon: "Code",
      description: [
        "Built an AI recruitment agent with Claude function calling and tool integrations to automate candidate sourcing, verification, and outreach.",
        "Developed a real-time interview platform with live speech-to-text and implemented semantic candidate search using embeddings and vector similarity.",
      ],
    },
    {
      title: "Research Assistant",
      company: "USF Reality, Autonomy, and Robot Experience Lab",
      location: "Tampa, FL",
      period: "Feb 2025 – Oct 2025",
      year: "2025",
      image: "/rare-lab.jpg",
      icon: "Laptop",
      description: [
        "Built data workflows to clean and organize robot experiment information so researchers could analyze results faster.",
        "Created tools that made experiment logs easier to search and helped identify unusual robot behavior with monitoring dashboards.",
      ],
    },
    {
      title: "Software Lead",
      company: "Association for Computing Machinery (ACM), USF Chapter",
      location: "Tampa, FL",
      period: "May 2025 – Dec 2025",
      year: "2025",
      image: "/acm.jpg",
      icon: "Users",
      description: [
        "Led technical initiatives and a workshop series on Docker and Kubernetes, and helped organize events and secure sponsor funding.",
        "Designed a semantic matching engine linking resume skills to taxonomy entries, helping students discover better-fit roles.",
      ],
    },
  ],

  volunteering: [],
};

export default experiences;
