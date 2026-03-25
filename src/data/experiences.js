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
        "Fine-tuned vision transformer models to support tumor detection from oncology imaging data.",
        "Built an LLM-powered clinical assistant with LangChain and RAG, and developed Django-based genomics dashboards for research teams.",
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
        "Built and maintained a distributed scraping pipeline with Playwright, Selenium, and BeautifulSoup, then integrated data into Supabase for product search.",
        "Improved reliability by migrating to Celery workers, adding Redis-based caching for geospatial lookups, and enforcing CI/CD checks before deployment.",
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
        "Built a real-time payment synchronization pipeline with WebSockets and Stripe Webhooks to keep checkout state accurate and consistent.",
        "Improved dashboard performance by removing redundant Firebase subscriptions and restructuring React components, then added integration tests for race conditions and webhook edge cases.",
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
        "Built ETL pipelines with Pandas, NumPy, and PySpark to clean and process robot telemetry from IMU and GPS experiments.",
        "Developed a RAG-based search workflow and trained transformer models for anomaly detection, supported by monitoring dashboards in Streamlit and Plotly.",
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
        "Led technical initiatives and hands-on workshops across Docker, Kafka, Terraform, and Kubernetes while helping organize chapter events and sponsorship efforts.",
        "Designed a BERT-based semantic matching tool with FAISS to connect student resume skills with standardized role taxonomies.",
      ],
    },
  ],

  volunteering: [],
};

export default experiences;
