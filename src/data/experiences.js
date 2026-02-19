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
      title: "Software Engineer",
      company: "HighEndFree",
      location: "Remote",
      period: "Incoming Oct 2025",
      year: "2025",
      image: "/highendfree.jpg",
      icon: "Code",
      description: [
        "Integrated an LLM-based AI assistant with LangChain, optimized PostgreSQL queries, and built a responsive Vue.js/TailwindCSS UI, improving performance and user engagement.",
      ],
    },
    {
      title: "Student Software Engineer",
      company: "Moffitt Cancer Center",
      location: "Tampa, FL",
      period: "Aug 2025 - Present",
      year: "2025",
      image: "/moffitt.jpg",
      icon: "Code",
      description: [
        "Developed cancer genomics visualizations and a Django dashboard for clinical insights, and trained a U-NET model for lung cancer analysis.",
      ],
    },
    {
      title: "Software Engineer Intern",
      company: "VNPT IT",
      location: "Da Nang City, Viet Nam",
      period: "Jun 2025 - Aug 2025",
      year: "2025",
      image: "/vnpt.png",
      icon: "Code",
      description: [
        "Developed RESTful APIs with Gin/GORM, refactored endpoints, added unit tests, and automated CI/CD, enhancing system performance and stability.",
      ],
    },
    {
      title: "Student Software Researcher",
      company: "RARE (Reality, Autonomy, and Robot Experience) Lab",
      location: "Tampa, FL",
      period: "Feb 2025 – May 2025",
      year: "2025",
      image: "/RL.jpg",
      icon: "Laptop",
      description: [
        "Boosted robotics software performance and team efficiency through optimized C++ ROS nodes, automated workflows, and Docker-based setups.",
      ],
    },
  ],

  volunteering: [
    {
      title: "Technical Lead",
      company: "Association for Computing Machinery (ACM) at USF",
      location: "Tampa, FL",
      period: "Apr 2025 – Present",
      year: "2025",
      image: "/ACM.jpg",
      icon: "Users",
      description: [
        "Organized Docker and CI/CD workshops, led project hubs, and guided hackathon projects, helping students deploy applications and gain hands-on experience with GitHub Actions and AI tools.",
      ],
    },
    {
      title: "Technical Volunteer",
      company: "USF Engineering Expo",
      location: "Tampa, FL",
      period: "Feb 2025",
      year: "2025",
      image: "/expo.png",
      icon: "Award",
      description: [],
    },
    {
      title: "Software Volunteer",
      company: "Bulls Science Olympiad",
      location: "Tampa, FL",
      period: "Jan 2025",
      year: "2025",
      image: "/BSO.png",
      icon: "Award",
      description: [],
    },
  ],
};

export default experiences;
