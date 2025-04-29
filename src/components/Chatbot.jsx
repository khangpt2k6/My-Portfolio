import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ChevronDown, ChevronUp, Square } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi, I'm Kugo! How can I help you?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [fullResponse, setFullResponse] = useState('');
  const [typingSpeed, setTypingSpeed] = useState(30); // ms per character
  const [isTyping, setIsTyping] = useState(false);
  const [shouldStopGenerating, setShouldStopGenerating] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Controls for Gemini API
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  let controller = null; // For abort controller
  
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

    projects: [
        {
          id: 1,
          title: "Hospify",
          role: "Hospital Services Website",
          technologies:
            "MongoDB, Material UI, React.js, Node.js, Express.js, Cloudinary, Gemini API, Google Maps API, GPT 3.5 Turbo API, Stripe, RazorPay",
          description: [
            "Built a full-stack hospital services platform using the MERN stack, streamlining appointment booking, diagnosis assistance, and facility navigation.",
            "Developed a responsive admin dashboard to manage appointments, doctors, patient records, and service schedules efficiently.",
            "Integrated GPT-3.5 Turbo and Gemini API (Model 2-0 Flash) to power AI-driven symptom checking and personalized health recommendations, enhancing user self-assessment experiences.",
            "Created a real-time medical facility locator using the Google Maps API, allowing patients to quickly find nearby hospitals and clinics with live availability updates.",
            "Integrated secure payment gateways with Stripe and RazorPay, ensuring smooth transactions and transparent billing processes.",
            "Implemented Cloudinary for optimized storage and management of medical reports, prescriptions, and facility images.",
            "Developed a web scraping system to collect and update medical facility data and pharmacy product listings automatically.",
            "Built a fully functional e-commerce platform for the pharmacy section, enabling users to order medicines and health products online with doorstep delivery options.",
            "Ensured HIPAA compliance and implemented strong encryption protocols to protect patient data and payment information.",
            "Designed a mobile-responsive UI/UX for seamless usage across devices, focusing on accessibility and intuitive navigation.",
          ],
          image: "/HOSPIFY.jpg",
          github: "https://github.com/khangpt2k6/Deploy_Hospify",
          demo: "https://github.com/khangpt2k6/Deploy_Hospify",

        },
        {
          id: 2,
          title: "SkinIntel — AI-powered Healthcare Platform",
          role: "Hackathon",
          period: "April 2025 – Present",
          technologies:
            "React, Tailwind CSS, FastAPI, PyTorch, TensorFlow, OpenCV, Google Maps API",
          description: [
            "Architected and developed a comprehensive healthcare platform that utilizes Convolutional Neural Networks (CNN) including ResNet-50 and Inception-v3 architectures for accurate skin lesion classification",
            "Implemented U-Net segmentation models for precise lesion boundary detection, trained on multiple medical imaging datasets including HAM10000, ISIC, and NIH collections",
            "Engineered a responsive and accessible user interface using Vite, React, and Tailwind CSS, focusing on intuitive user experience for both patients and healthcare providers",
            "Built a high-performance FastAPI backend system that efficiently handles data processing pipelines and machine learning model inference",
            "Integrated Google Maps API with custom implementation of Dijkstra's algorithm to connect users with the nearest qualified healthcare providers based on specialized needs",
            "Established HIPAA-compliant data handling protocols to ensure patient information security and privacy throughout the application",
            "Implemented comprehensive testing procedures including unit tests and end-to-end testing to ensure platform reliability",
          ],
          image: "/Skin.png",
          github: "https://github.com/XuanGiaHanNguyen/HackUSF",
          demo: "https://github.com/XuanGiaHanNguyen/HackUSF",

        },
        {
          id: 3,
          title: "Finova - Bank Management System",
          role: "Backend Developer",
          technologies: "Java, MySQL, Spring Boot, Hibernate",
          description: [
            "Developed a Java-based Bank Management System with full CRUD operations for customers and accounts, integrating MySQL for secure data storage and retrieval.",
            "Implemented transaction management features including deposits, withdrawals, transfers, and account statements with date range filtering.",
            "Designed and optimized relational database schemas to support multiple account types (Savings, Checking, Fixed Deposit) and transaction histories.",
          ],
          image: "/Tracklify.png",
          github: "https://github.com/khangpt2k6/BankManagementSystem",
          demo: "https://github.com/khangpt2k6/BankManagementSystem",

        },
        {
          id: 4,
          title: "GreenCart",
          role: "Full-Stack Developer",
          technologies:
            "React.js, TailwindCSS, Next.js, MongoDB, Flask, Python, Google Gemini API, Chrome Extensions API",
          description: [
            "Developed an AI-powered sustainability platform offering real-time product analysis, eco-friendly alternatives, and a dedicated marketplace to promote conscious consumerism.",
            "Built a browser extension integrating with major e-commerce sites (Amazon, eBay) to display instant sustainability scores and recommend greener product choices.",
            "Implemented a full-stack solution for intelligent product analysis and user-friendly UI/UX with 200+ active users.",
          ],
          image: "/GREENCART.png",
          github: "https://devpost.com/software/hackabullhkkt",
          demo: "https://devpost.com/software/hackabullhkkt",

        },
        {
          id: 5,
          title: "GeoVista — Interactive Geographic Information System",
          role: "Full-Stack Developer",
          technologies: "Python, Django, Supabase, Boostrap, RESTs API, TypeScript",
          description: [
            "Developed a sophisticated web-based interactive map application that integrates real-time location data to provide users with an efficient navigation tool",
            "Optimized map rendering and search functionality, reducing query response times by 0.482 seconds and creating a more responsive user experience",
            "Designed and implemented a custom API system to fetch and process complex geospatial data, improving location-based feature accuracy by 23.2%",
            "Created an intuitive user interface with responsive design principles to ensure functionality across desktop and mobile devices",
            "Implemented efficient data caching strategies to reduce server load and improve application performance",
            "Integrated third-party mapping services with custom overlay features to enhance user navigation experience",
          ],
          image: "/Map.jpg",
          github: "https://github.com/khangpt2k6/GeoVista",
          demo: "https://github.com/khangpt2k6/GeoVista",

        },
        {
          id: 6,
          title: "PathFinder X — Autonomous Navigation Robot",
          role: "Embedded Systems Engineer",
          technologies:
            "Arduino, C++, Ultrasonic Sensors, IR Sensors, L298N H-Bridge",
          description: [
            "Led a team of 5 engineers in the development of an Arduino-based autonomous robot designed for obstacle detection and avoidance in dynamic environments",
            "Programmed embedded C++ software for seamless sensor integration and precise motor control using L298N H-Bridge components",
            "Implemented PID (Proportional-Integral-Derivative) control algorithms to enhance maneuverability and increase motion smoothness by 40%",
            "Designed and assembled the robot's physical structure, incorporating optimal sensor placement for maximum environmental awareness",
            "Created comprehensive documentation including circuit diagrams, code documentation, and operating procedures",
            "Conducted extensive testing in varied environments to validate the robot's performance and reliability",
          ],
          image: "/Arduino.jpg",
          github: "https://github.com/khangpt2k6/Arduino-based-Robot",
          demo: "https://github.com/khangpt2k6/Arduino-based-Robot",

        },
      ],
    // Contact information
    contact: {
      email: "khang18@usf.edu",
      gmail: "2006tuankhang@gmail.com",
      github: "github.com/khangpt2k6"
    }
  };

  // Conversation context
  const [conversationContext, setConversationContext] = useState({
    topic: null,
    lastQuery: null,
    lastEntityDiscussed: null,
    queryCount: 0,
    topicHistory: []
  });
  
  // Auto-scroll to bottom of message container
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Typing animation effect
  useEffect(() => {
    if (!isTyping || !fullResponse) return;
    
    let currentIndex = 0;
    const maxIndex = fullResponse.length;
    
    const typingInterval = setInterval(() => {
      if (shouldStopGenerating) {
        // If we should stop generating, add whatever we have so far and finish
        clearInterval(typingInterval);
        setTypingText('');
        setIsTyping(false);
        
        // Add the partial response to messages
        const partialResponse = fullResponse.substring(0, currentIndex);
        if (partialResponse.trim().length > 0) {
          setMessages(prev => [...prev, { text: partialResponse, sender: 'bot' }]);
        }
        
        setFullResponse('');
        setShouldStopGenerating(false);
        setIsLoading(false);
        return;
      }
      
      if (currentIndex < maxIndex) {
        setTypingText(fullResponse.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTypingText('');
        setIsTyping(false);
        
        // Add the full response to messages
        setMessages(prev => [...prev, { text: fullResponse, sender: 'bot' }]);
        setFullResponse('');
        setIsLoading(false);
      }
    }, typingSpeed);
    
    return () => clearInterval(typingInterval);
  }, [fullResponse, isTyping, shouldStopGenerating, typingSpeed]);

  // Function to stop the generation process
  const handleStopGeneration = () => {
    if (controller) {
      controller.abort();
      controller = null;
    }
    setShouldStopGenerating(true);
  };
  
  // Function to handle sending messages
  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;
    
    // Add user message to chat
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Clear input and show loading state
    setInputValue('');
    setIsLoading(true);
    setShouldStopGenerating(false);
    
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
      
      // Start typing animation
      setFullResponse(response);
      setIsTyping(true);
    } catch (error) {
      console.error("Error getting response from Gemini:", error);
      
      if (error.name === 'AbortError') {
        console.log("Request was aborted");
      } else {
        setMessages(prevMessages => [
          ...prevMessages, 
          { text: "Sorry, I encountered an error. Please try again later.", sender: 'bot' }
        ]);
        setIsLoading(false);
      }
    }
  };
  
  // Function to get response from Gemini API with streaming support
  const getGeminiResponse = async (userInput, context) => {
    try {
      // Create a new AbortController for this request
      controller = new AbortController();
      const signal = controller.signal;
      
      // Create a model instance
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Prepare the prompt with context about Khang
      const prompt = `
        Your name is Kugo (Khang has set for you that name). You are a virtual assistant. Respond to the user's query: "${userInput}"
        
        Here's information about Khang:
        ${JSON.stringify(khangInfo, null, 2)}
        
        Current conversation context:
        ${JSON.stringify(context, null, 2)}
        
        Provide a helpful, friendly response as a chatbot assistant.
        Format your response using markdown for better readability.
        Use bullet points, bold, italics, code blocks, and other markdown features when appropriate.
        Keep responses focused on answering the user's question.
      `;
      
      // Generate content
      const result = await model.generateContent(prompt, { signal });
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Detailed Gemini API error:", error);
      
      if (error.name === 'AbortError') {
        throw error; // Re-throw abort errors to handle them separately
      }
      
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

  // Test Gemini API connection on component mount
  useEffect(() => {
    async function testGeminiAPI() {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-96 sm:w-80 md:w-96 overflow-hidden border border-gray-200">
          {/* Chat header */}
          <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <h3 className="font-medium">Kugo Bot</h3>
            </div>
            <div className="flex space-x-2">
              {!isMinimized ? (
                <button 
                  onClick={() => setIsMinimized(true)} 
                  className="hover:bg-emerald-700 rounded-full p-1 transition-colors"
                  aria-label="Minimize chat"
                >
                  <ChevronDown size={18} />
                </button>
              ) : (
                <button 
                  onClick={() => setIsMinimized(false)} 
                  className="hover:bg-emerald-700 rounded-full p-1 transition-colors"
                  aria-label="Expand chat"
                >
                  <ChevronUp size={18} />
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-emerald-700 rounded-full p-1 transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {!isMinimized && (
            <>
              {/* Chat messages area */}
              <div className="h-96 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50" id="chat-messages">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`max-w-[85%] ${
                      message.sender === 'user' 
                        ? 'ml-auto bg-emerald-500 text-white rounded-lg rounded-tr-none' 
                        : 'mr-auto bg-white text-gray-800 rounded-lg rounded-tl-none border-l-4 border-emerald-400'
                    } p-3 shadow-sm`}
                  >
                    {message.sender === 'bot' ? (
                      <div className="prose prose-sm max-w-none break-words">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="break-words">{message.text}</span>
                    )}
                  </div>
                ))}
                
                {/* Typing indicator */}
                {typingText && (
                  <div className="mr-auto bg-white text-gray-800 rounded-lg rounded-tl-none border-l-4 border-emerald-400 p-3 shadow-sm max-w-[85%]">
                    <div className="prose prose-sm max-w-none break-words">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                      >
                        {typingText}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
                
                {/* Loading indicator (dots) */}
                {isLoading && !isTyping && (
                  <div className="mr-auto bg-white text-gray-800 rounded-lg rounded-tl-none border-l-4 border-emerald-400 p-3 shadow-sm">
                    <div className="flex space-x-2 items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                )}
                
                {/* Reference for auto-scrolling */}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input area */}
              <div className="border-t border-gray-200 bg-white">
                {/* Stop generation button (only visible when typing) */}
                {isTyping && (
                  <div className="flex justify-center py-2">
                    <button
                      onClick={handleStopGeneration}
                      className="flex items-center space-x-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md transition-colors"
                    >
                      <Square size={14} />
                      <span className="text-sm font-medium">Stop generating</span>
                    </button>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="p-4 flex">
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
                    disabled={isLoading && !isTyping} // Allow stopping generation while typing
                    className="bg-emerald-600 text-white rounded-r-lg px-4 py-2 hover:bg-emerald-700 transition-colors flex items-center justify-center disabled:bg-emerald-400"
                  >
                    {isLoading && !isTyping ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}