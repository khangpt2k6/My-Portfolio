import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi, I'm Kugo! How can I help you?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    topic: null,
    lastQuery: null,
    lastEntityDiscussed: null,
    queryCount: 0,
    topicHistory: []
  });
  
  // Initialize the Gemini API
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  
  // Define Khang's data for comprehensive responses
  const khangInfo = {
    // Personal Information
    name: "Khang",
    education: {
      university: "University of South Florida, Tampa campus",
      degree: "Computer Science",
      gpa: "4.0/4.0",
      achievements: ["USF Gold & Presidential Award", "Dean's List"]
    },
    occupation: "Computer Science Student",
    
    // Skills organized by category
    skills: {
      programmingLanguages: [
        "Python", "C/C++", "JavaScript", "TypeScript", "Arduino", 
        "Golang", "LaTeX", "HTML/CSS"
      ],
      frameworksLibraries: [
        "React.js", "Next.js", "Tailwind CSS", "Framer Motion", 
        "FastAPI", "Node.js", "Express.js", "PyTorch", "TensorFlow", 
        "OpenCV", "Leaflet.js", "ROS"
      ],
      developmentTools: [
        "Git", "GitHub", "Docker", "Ubuntu", "Windows", "Vite", 
        "npm", "yarn"
      ],
      databaseSystems: [
        "MongoDB", "AWS", "Supabase", "PostgreSQL"
      ],
      officeProductivity: [
        "Microsoft Office Suite", "Markdown", "Trello", "Asana"
      ]
    },
    
    // Areas of interest
    interests: ["Web Development", "UI/UX Design", "Mobile Apps", "AI Integration"],
    
    // Portfolio projects
    projects: [
      {
        id: 1,
        title: "SkinIntel — AI-powered Healthcare Platform",
        role: "Hackathon",
        period: "April 2025 – Present",
        technologies: "React, Tailwind CSS, FastAPI, PyTorch, TensorFlow, OpenCV, Google Maps API",
        description: [
          "Architected and developed a comprehensive healthcare platform that utilizes Convolutional Neural Networks (CNN) including ResNet-50 and Inception-v3 architectures for accurate skin lesion classification",
          "Implemented U-Net segmentation models for precise lesion boundary detection, trained on multiple medical imaging datasets",
          "Engineered a responsive and accessible user interface using Vite, React, and Tailwind CSS",
          "Built a high-performance FastAPI backend system for efficient data processing and ML model inference",
          "Integrated Google Maps API with Dijkstra's algorithm to connect users with nearest healthcare providers",
          "Established HIPAA-compliant data handling protocols for patient information security",
          "Implemented comprehensive testing procedures including unit tests and end-to-end testing"
        ],
        github: "https://github.com/XuanGiaHanNguyen/HackUSF",
        demo: "https://github.com/XuanGiaHanNguyen/HackUSF"
      },
      {
        id: 2,
        title: "Trackify – Intelligent Expense Management System",
        role: "Full-Stack Developer",
        period: "March 2025 – Present",
        technologies: "Next.js, React.js, TypeScript, MongoDB",
        description: [
          "Designed and built an AI-powered expense tracking system serving 512 active users, reducing manual data entry time by 47.3% through OpenAI API integration",
          "Created an intuitive receipt scanning feature that automatically extracts and categorizes expense information",
          "Developed a responsive UI using Tailwind CSS and Framer Motion animations, increasing user session duration by 39.15%",
          "Engineered a robust MongoDB backend for efficient storage and retrieval of 248+ expense records",
          "Deployed on AWS infrastructure with comprehensive monitoring solutions, achieving 88.9% uptime",
          "Implemented secure authentication mechanisms and data encryption protocols",
          "Designed analytical dashboards that provide users with spending insights and budget recommendations"
        ],
        github: "https://github.com/khangpt2k6/Trackify",
        demo: "https://github.com/khangpt2k6/Trackify"
      },
      {
        id: 3,
        title: "Toralk",
        role: "Full-Stack Developer",
        period: "January 2025 - March 2025",
        technologies: "AWS, MongoDB, Express.js, React.js, Node.js, Clerk, JavaScript, HTML, CSS, Vite, Google Gemini API",
        description: [
          "Designed and developed an AI-powered assistant capable of real-time multilingual responses, text generation, and image creation, enhancing user engagement by 35%",
          "Optimized system performance to achieve 99.98% uptime, efficiently handling 50,000+ concurrent requests",
          "Implemented secure authentication using Clerk, reducing unauthorized access incidents by 70%",
          "Successfully onboarded 100+ users within two weeks, improving workflow efficiency by 40%"
        ],
        github: "https://github.com/khangpt2k6/TORALK",
        demo: "https://github.com/khangpt2k6/TORALK"
      },
      {
        id: 4,
        title: "GeoVista — Interactive Geographic Information System",
        role: "Full-Stack Developer",
        period: "November 2024 – December 2024",
        technologies: "TypeScript, JavaScript, Next.js, React.js, Leaflet.js, Supabase, TailwindCSS, REST API",
        description: [
          "Developed a sophisticated web-based interactive map application integrating real-time location data",
          "Optimized map rendering and search functionality, reducing query response times by 0.482 seconds",
          "Designed custom API system to fetch and process complex geospatial data, improving location-based feature accuracy by 23.2%",
          "Created an intuitive responsive UI ensuring functionality across desktop and mobile devices",
          "Implemented efficient data caching strategies to reduce server load and improve performance",
          "Integrated third-party mapping services with custom overlay features to enhance navigation experience"
        ],
        github: "https://github.com/khangpt2k6/GeoVista",
        demo: "https://github.com/khangpt2k6/GeoVista"
      },
      {
        id: 5,
        title: "PathFinder X — Autonomous Navigation Robot",
        role: "Embedded Systems Engineer",
        period: "September 2024 – December 2024",
        technologies: "Arduino, C++, Ultrasonic Sensors, IR Sensors, L298N H-Bridge",
        description: [
          "Led a team of 5 engineers developing an Arduino-based autonomous robot for obstacle detection and avoidance",
          "Programmed embedded C++ software for sensor integration and precise motor control using L298N H-Bridge",
          "Implemented PID control algorithms to enhance maneuverability and increase motion smoothness by 40%",
          "Designed and assembled the robot's physical structure with optimal sensor placement",
          "Created comprehensive documentation including circuit diagrams, code documentation, and operating procedures",
          "Conducted extensive testing in varied environments to validate performance and reliability"
        ],
        github: "https://github.com/khangpt2k6/Arduino-based-Robot",
        demo: "https://github.com/khangpt2k6/Arduino-based-Robot"
      }
    ],
    
    // Professional experience
    experience: {
      professional: [
        {
          title: "Technical Lead",
          company: "Association for Computing Machinery (ACM) at USF",
          location: "Tampa, FL",
          period: "April 2025 – Present",
          description: [
            "Implemented interactive learning modules that simplified complex programming concepts for beginners",
            "Conducted comprehensive workshops for USF students on programming fundamentals, increasing their self-reported confidence in computing skills"
          ],
          tags: ["Python", "JavaScript", "Education", "Leadership", "Mentoring"]
        },
        {
          title: "Undergraduate Research Assistant",
          company: "RARE (Reality, Autonomy, and Robot Experience) Lab",
          location: "Tampa, FL",
          period: "February 2025 – Present",
          description: [
            "Engineered advanced robot control models using ROS, C++, and Python for autonomous navigation",
            "Integrated Virtual Machine environments with Docker containers and Ubuntu OS to optimize Fetch robot performance, resulting in 28.73% efficiency increase",
            "Enhanced fog projection technology by integrating laser detection systems, improving detection accuracy by 23.47%",
            "Designed and implemented Human-Robot Interaction (HRI) models focused on intuitive interfaces",
            "Conducted rigorous experimental testing to validate robot performance in diverse environments",
            "Participated in weekly lab meetings to present findings and collaborate on innovative approaches"
          ],
          tags: ["ROS", "C++", "Python", "Docker", "Ubuntu", "Research", "Robotics", "LaTeX"]
        },
        {
          title: "Treasurer & Event Chair",
          company: "VPEC - Vietnam PsychEdu Camp",
          location: "Da Nang, Vietnam",
          period: "August 2022 – March 2024",
          description: [
            "Led planning, coordination, and management of summer camps for high school students focused on psychological education",
            "Secured approximately $2,000 in school funding through effective proposal writing",
            "Designed and implemented programs addressing key psychological issues for adolescents",
            "Developed detailed budget tracking systems using Excel and produced comprehensive financial reports",
            "Coordinated all logistics including venue selection, transportation, scheduling, and resource allocation"
          ],
          tags: ["Event Management", "Leadership", "Budgeting", "Technical Support", "Logistics"]
        }
      ],
      partTime: [
        {
          title: "Event Crew, Set up/Event Staff and Coordinator",
          company: "University of South Florida Marshall Student Center",
          location: "Tampa, FL",
          period: "January 2025 - Present",
          description: [
            "Managed logistics for over 100 campus events each month at the USF Marshall Student Building",
            "Enhanced event efficiency through optimized workflows, reducing setup times and improving operations",
            "Provided direct support to guests, ensuring their needs were met promptly and professionally"
          ],
          tags: ["Event Planning", "Logistics", "Customer Service"]
        }
      ],
      volunteering: [
        {
          title: "Build Event Volunteer",
          company: "Bulls Science Olympiad, University of South Florida",
          location: "Tampa, FL",
          period: "January 2025",
          description: [
            "Mentored 50+ K-12 students in STEM competitions, fostering early interest in engineering and robotics",
            "Assisted in building prototypes and preparing competition projects"
          ],
          tags: ["Mentoring", "STEM Education", "Robotics"]
        },
        {
          title: "Volunteer",
          company: "BlissKidz",
          location: "Da Nang, Vietnam",
          period: "November 2022 - August 2023",
          description: [
            "Spearheaded large-scale charity initiatives benefiting underprivileged children in Da Nang",
            "Successfully raised over $3,000 through online and offline fundraising strategies",
            "Coordinated collection of in-kind donations including clothes, toys, and essential supplies"
          ],
          tags: ["Fundraising", "Charity", "Event Planning"]
        },
        {
          title: "Volunteer",
          company: "Canary",
          location: "Da Nang, Vietnam",
          period: "May 2023 - August 2023",
          description: [
            "Led activities for orphaned children and raised $2,000 through merchandise sales campaign",
            "Partnered with local businesses to increase fundraising efforts and support children in slums"
          ],
          tags: ["Fundraising", "Community Service", "Event Planning"]
        }
      ]
    },
    
    // Contact information
    contact: {
      email: "khang18@usf.edu",
      gmail: "2006tuankhang@gmail.com",
      github: "github.com/khangpt2k6"
    }
  };
  
  // Function to handle sending messages
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Clear input and show loading state
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Update conversation context
      const updatedContext = {
        ...conversationContext,
        lastQuery: inputValue,
        queryCount: conversationContext.queryCount + 1
      };
      setConversationContext(updatedContext);
      
      // Get response from Gemini
      const response = await getGeminiResponse(inputValue, updatedContext);
      
      // Add bot response to chat
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: response, sender: 'bot' }
      ]);
    } catch (error) {
      console.error("Error getting response from Gemini:", error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { text: "Sorry, I encountered an error. Please try again later.", sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add a delay function for rate limiting
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Function to get response from Gemini API
  const getGeminiResponse = async (userInput, context) => {
    try {
      // Add a short delay to avoid hitting rate limits
      await delay(1000);
      
      // Create a model instance
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Prepare the prompt with context about Khang
      const prompt = `
        You are a virtual assistant. Respond to the user's query: "${userInput}"
        
        Here's information about Khang:
        ${JSON.stringify(khangInfo, null, 2)}
        
        Current conversation context:
        ${JSON.stringify(context, null, 2)}
        
        Provide a helpful, friendly response as a chatbot assistant.
        Keep responses concise and focused on answering the user's question.
      `;
      
      // Generate content
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Detailed Gemini API error:", error);
      
      // Check if it's a rate limit error
      if (error.toString().includes("429") || error.toString().includes("quota")) {
        return "I'm processing too many requests right now. Please wait a moment and try again.";
      }
      
      // Return a fallback response
      return "I'm currently having trouble connecting to my knowledge base. Please try again in a moment.";
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  useEffect(() => {
    async function testGeminiAPI() {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using flash here too for consistency
        const result = await model.generateContent("Hello, can you respond with a simple 'Hello world'?");
        console.log("Gemini API test successful:", result.response.text());
      } catch (error) {
        console.error("Gemini API test failed:", error);
      }
    }
    
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      testGeminiAPI();
    } else {
      console.error("API key is missing or undefined");
    }
  }, []);
  
  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)} 
          className="bg-emerald-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-700 transition-colors"
        >
          <MessageCircle size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 overflow-hidden border border-gray-200">
          {/* Chat header */}
          <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-medium">Kugo Bot</h3>
            <div className="flex space-x-2">
              {!isMinimized ? (
                <button onClick={() => setIsMinimized(true)} className="hover:bg-emerald-700 rounded-full p-1">
                  <ChevronDown size={18} />
                </button>
              ) : (
                <button onClick={() => setIsMinimized(false)} className="hover:bg-emerald-700 rounded-full p-1">
                  <ChevronUp size={18} />
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-700 rounded-full p-1">
                <X size={18} />
              </button>
            </div>
          </div>
          
          {!isMinimized && (
            <>
              {/* Chat messages area */}
              <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3" id="chat-messages">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`max-w-3/4 ${
                      message.sender === 'user' 
                        ? 'ml-auto bg-emerald-500 text-white rounded-lg rounded-tr-none' 
                        : 'mr-auto bg-gray-100 text-gray-800 rounded-lg rounded-tl-none border-l-4 border-emerald-400'
                    } p-3 shadow-sm`}
                  >
                    {message.text}
                  </div>
                ))}
                {isLoading && (
                  <div className="mr-auto bg-gray-100 text-gray-800 rounded-lg rounded-tl-none border-l-4 border-emerald-400 p-3 shadow-sm">
                    <div className="flex space-x-2 items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Input area */}
              <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 text-white rounded-r-lg px-4 py-2 hover:bg-emerald-700 transition-colors flex items-center justify-center disabled:bg-emerald-400"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}