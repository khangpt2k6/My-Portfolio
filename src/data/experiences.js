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
        "Fine-tuned REMEDIS and custom vision transformer models on oncology imaging datasets, improving diagnostic classification accuracy for tumor detection pipelines",
        "Built an LLM-powered clinical assistant using LangChain and RAG over internal medical literature, enabling researchers to query patient cohort data through natural language",
        "Developed interactive cancer genomics visualizations and a Django dashboard consolidating multi-modal clinical data into actionable insights for research teams",
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
        "Scaled a grocery products scraper from a single running browser to 19 concurrent headless browsers using a thread pool, Selenium, and BeautifulSoup, cutting processing time by 95% for 130+ common products",
        "Eliminated $500+/month in Google Maps API costs by storing 33K+ US ZIP code coordinates in Redis and using the Haversine formula to compute and cache nearest-store distances offline",
        "Designed a per-user scraping pipeline across 9 retailers with thread-safe shared state, cooperative cancellation across concurrent workers, and async I/O for parallel API and browser-based retailer calls",
        "Containerized 7 services with Docker Compose on AWS EC2, profiled and tuned per-container CPU/memory limits, and set up CI/CD via GitHub Actions with linting, security scanning, and build validation",
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
        "Built a payment notification system using WebSocket and Stripe Webhooks, synchronizing daily transactions into Redux to eliminate polling and keep UI instantly accurate across all client sessions",
        "Optimized Firestore real-time listeners across the admin dashboard by identifying unnecessary re-renders and applying useMemo with component-level caching, cutting page load time from 6s to under 2s",
        "Created 50+ unit tests in Jest and React Testing Library covering race conditions, duplicate transactions, and error state rendering to catch critical payment bugs before production",
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
        "Built ETL pipelines in Python processing 15GB+ of IMU/GPS telemetry from 40+ robot experiments, parallelizing transformations with multiprocessing to reduce processing time by 60%",
        "Engineered an LLM-powered research assistant using LangChain + GPT-4o with RAG over experiment logs, enabling natural language querying of sensor datasets and cutting manual analysis time by 40%",
        "Fine-tuned transformer anomaly detection models (PyTorch) on robot telemetry, achieving 91% precision flagging navigation failures; visualized findings via Pandas/Matplotlib dashboards",
      ],
    },
  ],

  volunteering: [],
};

export default experiences;
