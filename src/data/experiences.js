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
      period: "Nov 2025 – Feb 2026",
      year: "2026",
      image: "/prox-shopping.jpg",
      icon: "Code",
      description: [
        "Built a distributed web scraping pipeline with Playwright, Selenium, and BeautifulSoup to ingest 600K+ daily product records into Supabase for real-time price search.",
        "Redesigned the system from single-threaded workers to Celery concurrency, reducing refresh latency by 95% and saving $31K+/year by replacing Google Maps API calls with Haversine geospatial computation and Redis caching, while enforcing CI/CD quality gates for staged deployments.",
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
        "Resolved payment state inconsistencies across 80K+ concurrent checkout sessions by building a real-time sync pipeline with WebSockets and Stripe Webhooks, achieving 99.9% transaction reliability.",
        "Accelerated admin dashboard load by 70% by removing 200+ redundant Firebase subscriptions and restructuring React components, then prevented production payment failures with 50+ integration tests covering race conditions and webhook edge cases.",
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
        "Built ETL pipelines with Pandas, NumPy, and PySpark to process 15GB+ of IMU and GPS telemetry from 40+ robot experiments, parallelizing transformations to reduce processing time by 60%.",
        "Developed a RAG pipeline with GPT-4.1, LangChain, and Pinecone for natural language log search and fine-tuned transformer models with PyTorch and Hugging Face for anomaly detection (91% precision), supported by Streamlit and Plotly monitoring dashboards.",
      ],
    },
    {
      title: "Technical Lead",
      company: "Association for Computing Machinery (ACM), USF Chapter",
      location: "Tampa, FL",
      period: "May 2025 – Feb 2026",
      year: "2026",
      icon: "Users",
      description: [
        "Led four technical initiatives and a workshop series on Docker, Kafka, Terraform, and Kubernetes, engaging 200+ students while helping organize 40+ events per semester and securing $8,500+ in sponsorship funding.",
        "Designed a BERT-based semantic matching engine using FAISS to map resume skills to 13K+ ESCO taxonomy entries, enabling 500+ students to discover better-fit career opportunities.",
      ],
    },
  ],

  volunteering: [],
};

export default experiences;
