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
        "Helped improve how medical teams review cancer images and spot important patterns more quickly.",
        "Built internal tools that made research knowledge easier to search and helped teams track findings in a clear dashboard.",
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
        "Built and maintained a system that collects product and price information from many stores to support fast search.",
        "Improved speed, reliability, and deployment quality so data updates stayed consistent and users could trust the results.",
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
        "Built a real-time payment sync flow so checkout status stayed accurate for customers and support teams.",
        "Improved dashboard responsiveness and added stronger testing to catch edge cases before release.",
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
      title: "Technical Lead",
      company: "Association for Computing Machinery (ACM), USF Chapter",
      location: "Tampa, FL",
      period: "May 2025 – Feb 2026",
      year: "2026",
      image: "/acm.jpg",
      icon: "Users",
      description: [
        "Led student initiatives and workshops while helping organize events and support partnerships for the chapter.",
        "Built a matching tool that helped students better connect their resume strengths with relevant career opportunities.",
      ],
    },
  ],

  volunteering: [],
};

export default experiences;
