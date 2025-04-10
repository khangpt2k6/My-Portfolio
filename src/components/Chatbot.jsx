import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronDown, ChevronUp } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm Khang's virtual assistant. What you want to know about Khang?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    topic: null,
    lastQuery: null,
    lastEntityDiscussed: null,
    queryCount: 0,
    topicHistory: []
  });
  
  // Define Khang's data for comprehensive responses
  const khangData = {
    // Contact information
    contact: {
      email: "khang18@usf.edu",
      phone: "813-570-4370",
      github: "https://github.com/khangpt2k6",
      linkedin: "https://linkedin.com/in/tuankhangphan",
      leetcode: "https://leetcode.com/u/KHcqTUn9ld/"
    },
    
    // Education details
    education: {
      university: {
        name: "University of South Florida - Judy Genshaft Honor College",
        degree: "Bachelor of Science in Computer Science",
        location: "Tampa, FL",
        period: "August 2024 - May 2028",
        gpa: "4.0/4.0",
        awards: [
          "Green and Gold Presidential Award (Merit-based full scholarship)",
          "Dean's List (Fall 2024)",
          "Member of the prestigious Judy Genshaft Honor College"
        ]
      },
      highSchool: {
        name: "Le Quy Don High School for the Gifted",
        specialization: "IT Specialized Class",
        location: "Da Nang, Vietnam",
        period: "September 2021 - June 2024",
        gpa: "4.0/4.0 (Ranked #1 in class)",
        awards: [
          "Bronze Medal – Central Regional Informatics Olympic",
          "2nd Place – City Informatics Competition & Youth Informatics Championship",
          "Le Quy Don High School Scholarship for Honor Student"
        ]
      }
    },
    
    // Professional experience
    experience: [
      {
        title: "Technical Lead",
        organization: "Association for Computing Machinery (ACM) at USF",
        location: "Tampa, FL",
        period: "March 2025 – Present",
        responsibilities: [
          "Spearheaded the development of 5 game-based educational projects utilizing Python and JavaScript",
          "Implemented interactive learning modules for beginners",
          "Conducted 3 comprehensive workshops for 68 freshman students on programming fundamentals",
          "Mentored junior members in software development best practices",
          "Organized weekly code review sessions"
        ]
      },
      {
        title: "Undergraduate Research Assistant",
        organization: "RARE (Reality, Autonomy, and Robot Experience) Lab",
        location: "Tampa, FL",
        period: "February 2025 – Present",
        responsibilities: [
          "Engineered advanced robot control models using ROS, C++, and Python",
          "Integrated Virtual Machine environments with Docker containers and Ubuntu OS",
          "Enhanced fog projection technology by integrating laser detection systems",
          "Designed and implemented Human-Robot Interaction (HRI) models",
          "Conducted rigorous experimental testing procedures",
          "Co-authored 2 research papers using LaTeX for submission to top-tier robotics journals",
          "Participated in weekly lab meetings"
        ]
      },
      {
        title: "Vice President - Head of Technical and Event Organization",
        organization: "VPEC - Vietnam PsychEdu Camp",
        location: "Da Nang, Vietnam",
        period: "August 2022 – March 2024",
        responsibilities: [
          "Led planning and coordination of summer camps serving 483 high school students",
          "Secured approximately $2,000 in school funding",
          "Designed and implemented programs addressing psychological issues for adolescents",
          "Managed the Sound & Light technical team",
          "Developed and maintained detailed budget tracking systems",
          "Implemented an efficient task assignment system for 15+ organizational members",
          "Facilitated regular strategy meetings",
          "Coordinated all logistics aspects including venue, transportation, scheduling, and resources"
        ]
      },
      {
        title: "Event Crew",
        organization: "University of South Florida Marshall Student Center",
        location: "Tampa, FL",
        period: "January 2025 - Present",
        responsibilities: [
          "Managed logistics for 100+ small-to-large-scale campus events monthly",
          "Enhanced event efficiency by 75% through optimized workflows",
          "Earned $13/hour for event setup and coordination"
        ]
      }
    ],
    
    // Technical projects
    projects: [
      {
        name: "SkinIntel",
        type: "AI-powered Healthcare Platform",
        role: "Full-Stack Developer",
        period: "April 2025 – Present",
        technologies: ["React", "Tailwind CSS", "FastAPI", "PyTorch", "TensorFlow", "OpenCV", "Google Maps API"],
        description: [
          "Architected a healthcare platform using CNN (ResNet-50, Inception-v3) for skin lesion classification",
          "Implemented U-Net segmentation models for lesion boundary detection",
          "Engineered responsive UI using Vite, React, and Tailwind CSS",
          "Built FastAPI backend for data processing and ML model inference",
          "Integrated Google Maps API with Dijkstra's algorithm to connect users with healthcare providers",
          "Established HIPAA-compliant data handling protocols",
          "Implemented comprehensive testing procedures"
        ]
      },
      {
        name: "Trackify",
        type: "Intelligent Expense Management System",
        role: "Lead Developer",
        period: "March 2025 – Present",
        technologies: ["Next.js", "React.js", "TypeScript", "MongoDB"],
        description: [
          "Designed AI-powered expense tracking system serving 512 active users",
          "Created intuitive receipt scanning with OpenAI API integration",
          "Developed responsive UI using Tailwind CSS and Framer Motion",
          "Engineered MongoDB backend for efficient data storage",
          "Deployed on AWS infrastructure with monitoring solutions",
          "Implemented secure authentication and data encryption",
          "Designed analytical dashboards for spending insights"
        ]
      },
      {
        name: "Toralk",
        type: "AI Assistant Platform",
        role: "Full-Stack Developer",
        period: "January 2025 - March 2025",
        technologies: ["AWS", "MongoDB", "Express.js", "React.js", "Node.js", "Clerk", "JavaScript", "Vite", "Google Gemini API"],
        description: [
          "Designed AI assistant with real-time multilingual capabilities",
          "Optimized system for 99.98% uptime and 50,000+ concurrent requests",
          "Implemented secure authentication using Clerk",
          "Onboarded 100+ users within two weeks"
        ]
      },
      {
        name: "GeoVista",
        type: "Interactive Geographic Information System",
        role: "Full-Stack Developer",
        period: "November 2024 – December 2024",
        technologies: ["TypeScript", "JavaScript", "Next.js", "React.js", "Leaflet.js", "Supabase", "TailwindCSS", "REST API"],
        description: [
          "Developed web-based interactive map application with real-time location data",
          "Optimized map rendering and search functionality",
          "Designed custom API for geospatial data processing",
          "Created responsive UI for desktop and mobile",
          "Implemented efficient data caching strategies",
          "Integrated third-party mapping services with custom overlays"
        ]
      },
      {
        name: "PathFinder X",
        type: "Autonomous Navigation Robot",
        role: "Embedded Systems Engineer",
        period: "September 2024 – December 2024",
        technologies: ["Arduino", "C++", "Ultrasonic Sensors", "IR Sensors", "L298N H-Bridge"],
        description: [
          "Led a team of 5 engineers developing an autonomous robot",
          "Programmed embedded C++ for sensor integration and motor control",
          "Implemented PID control algorithms for improved maneuverability",
          "Designed and assembled physical structure and sensor placement",
          "Created comprehensive documentation and circuit diagrams",
          "Conducted extensive testing in varied environments"
        ]
      }
    ],
    
    // Technical skills categorized
    skills: {
      languages: {
        advanced: ["Python", "C/C++", "JavaScript", "TypeScript", "Arduino"],
        intermediate: ["LaTeX", "HTML/CSS"]
      },
      frontend: ["React.js", "Next.js", "Tailwind CSS", "Framer Motion", "HTML", "CSS", "JavaScript", "TypeScript", "Vite"],
      backend: ["FastAPI", "Node.js", "Express.js", "REST API"],
      ml: ["PyTorch", "TensorFlow", "OpenCV", "Google Gemini API"],
      databases: ["MongoDB", "Supabase", "PostgreSQL"],
      devOps: ["Git", "GitHub", "Docker", "AWS", "npm", "yarn"],
      robotics: ["ROS (Robot Operating System)", "Arduino", "Embedded Systems", "PID Control", "Sensor Integration"],
      tools: ["Microsoft Office Suite", "Markdown", "LaTeX", "Trello", "Asana"]
    },
    
    // Volunteer experience
    volunteering: [
      {
        title: "Build Event Volunteer",
        organization: "Bulls Science Olympiad, University of South Florida",
        location: "Tampa, FL",
        period: "January 2025",
        description: [
          "Mentored 50+ K-12 students in STEM competitions",
          "Assisted in building prototypes and preparing competition projects"
        ]
      },
      {
        title: "Volunteer",
        organization: "BlissKidz",
        location: "Da Nang, Vietnam",
        period: "November 2022 - August 2023",
        description: [
          "Spearheaded charity initiatives for underprivileged children",
          "Organized projects at SOS Children's Center and Da Nang Maternity Hospital",
          "Raised over $3,000 through online and offline fundraising",
          "Coordinated collection of clothes, toys, and essential supplies"
        ]
      },
      {
        title: "Volunteer",
        organization: "Canary",
        location: "Da Nang, Vietnam",
        period: "May 2023 - August 2023",
        description: [
          "Led activities for orphaned children",
          "Raised $2,000 through merchandise sales campaign",
          "Partnered with local businesses to support children in slums"
        ]
      }
    ],
    
    // Certifications
    certifications: [
      "The Fundamentals of Digital Marketing (Google)",
      "Microsoft Office Specialist: PowerPoint 2016 (Microsoft)",
      "Microsoft Office Specialist: Word 2016 (Microsoft)",
      "Technical Writing: Quick Start Guides (LinkedIn)",
      "Electronics Foundations: Fundamentals (LinkedIn)",
      "Introduction to Data Analytics (Meta)"
    ],
    
    // Awards and recognition
    awards: [
      "Green and Gold Presidential Award (Merit-based full scholarship)",
      "Dean's List (Fall 2024)",
      "Member of the prestigious Judy Genshaft Honor College",
      "Bronze Medal – Central Regional Informatics Olympic",
      "2nd Place – City Informatics Competition & Youth Informatics Championship",
      "Le Quy Don High School Scholarship for Honor Student",
      "Featured in National Newspaper (https://svvn.tienphong.vn/phan-tuan-khang-nam-sinh-chuyen-tin-tai-nang-am-loat-hoc-bong-danh-gia-o-tuoi-18-post1635689.tpo)"
    ],
    
    // Personal interests and hobbies
    personal: {
      interests: ["Coding", "Hackathons", "Robotics", "Food exploration", "Hanging out with friends"],
      achievements: ["Solved over 200 LeetCode problems", "Developed 5+ full-stack applications", "Published research papers in robotics"]
    }
  };

  const detectIntent = (message) => {
    // Convert to lowercase and remove punctuation
    const cleanMessage = message.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    
    // Define intent patterns with weighted keywords and phrases
    const intents = {
      contactRequest: {
        patterns: ['contact', 'email', 'phone', 'github', 'linkedin', 'reach'],
        threshold: 0.6
      },
      educationQuery: {
        patterns: ['education', 'study', 'university', 'college', 'school', 'degree', 'major', 'gpa'],
        threshold: 0.5
      },
      // Add more intent categories with relevant patterns
    };
    
    // Calculate match scores for each intent
    const scores = {};
    for (const [intent, config] of Object.entries(intents)) {
      const matchCount = config.patterns.filter(pattern => cleanMessage.includes(pattern)).length;
      scores[intent] = matchCount / config.patterns.length;
    }
    
    // Find the highest scoring intent above threshold
    let bestIntent = null;
    let bestScore = 0;
    
    for (const [intent, score] of Object.entries(scores)) {
      if (score > bestScore && score >= intents[intent].threshold) {
        bestIntent = intent;
        bestScore = score;
      }
    }
    
    return { intent: bestIntent, confidence: bestScore };
  };

  const updateContext = (userMessage, detectedIntent) => {
    // Extract entities (names, topics, etc.)
    const entities = extractEntities(userMessage);
    
    // Update conversation context with new information
    setConversationContext(prev => ({
      ...prev,
      topic: detectedIntent || prev.topic,
      lastQuery: userMessage,
      lastEntityDiscussed: entities.length > 0 ? entities[0] : prev.lastEntityDiscussed,
      queryCount: (prev.queryCount || 0) + 1,
      topicHistory: [...(prev.topicHistory || []), detectedIntent].filter(Boolean).slice(-5)
    }));
    
    return entities;
  };
  
  // Simple entity extraction function
  const extractEntities = (message) => {
    const entities = [];
    
    // Check for project names
    khangData.projects.forEach(project => {
      if (message.toLowerCase().includes(project.name.toLowerCase())) {
        entities.push({type: 'project', value: project.name});
      }
    });
    
    // Check for skill categories
    const skillCategories = ['language', 'frontend', 'backend', 'ml', 'database', 'devops', 'robotics'];
    skillCategories.forEach(category => {
      if (message.toLowerCase().includes(category.toLowerCase())) {
        entities.push({type: 'skill_category', value: category});
      }
    });
    
    return entities;
  };

  const generateFollowUp = (context) => {
    if (!context.topic) return null;
    
    const followUps = {
      contactRequest: [
        "Would you like to know more about Khang's experience?",
        "I can also tell you about Khang's projects if you're interested."
      ],
      educationQuery: [
        "Khang has received several awards during his education. Would you like to hear about them?",
        "Would you like to know about Khang's research experience at USF?"
      ],
      projectQuery: [
        "I can explain the technologies used in this project in more detail if you'd like.",
        "Would you like to know about Khang's other projects?"
      ]
    };
    
    // Get follow-ups for the current topic
    const relevantFollowUps = followUps[context.topic] || [];
    
    // Return a random follow-up if available
    return relevantFollowUps.length > 0 
      ? relevantFollowUps[Math.floor(Math.random() * relevantFollowUps.length)]
      : null;
  };
  
  // Add follow-up to bot response
  const addBotMessageWithFollowUp = (text, context) => {
    const followUp = generateFollowUp(context);
    const fullMessage = followUp ? `${text}\n\n${followUp}` : text;
    setMessages(prev => [...prev, { text: fullMessage, sender: 'bot' }]);
  };

  const analyzeSentiment = (message) => {
    const positiveWords = ['great', 'awesome', 'excellent', 'good', 'impressive', 'amazing', 'thank', 'thanks', 'helpful'];
    const negativeWords = ['bad', 'terrible', 'useless', 'not helpful', 'don\'t understand', 'confused', 'wrong'];
    
    const words = message.toLowerCase().split(/\s+/);
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveScore++;
      if (negativeWords.some(nw => word.includes(nw))) negativeScore++;
    });
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  };
  
  // Response based on sentiment
  const respondToSentiment = (sentiment) => {
    if (sentiment === 'positive') {
      const responses = [
        "I'm glad I could help! What else would you like to know about Khang?",
        "Happy to be of assistance! Feel free to ask more questions."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (sentiment === 'negative') {
      const responses = [
        "I'm sorry I couldn't provide the information you were looking for. Could you rephrase your question?",
        "Let me try to help better. What specific information about Khang are you interested in?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    return null;
  };

  const trackQuerySuccess = (userMessage, hadResponse) => {
    // If we didn't have a good response, store the query for later improvement
    if (!hadResponse) {
      const unhandledQueries = JSON.parse(localStorage.getItem('unhandledQueries') || '[]');
      unhandledQueries.push({
        query: userMessage,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('unhandledQueries', JSON.stringify(unhandledQueries.slice(-50)));
    }
    
    // Track successful query patterns
    if (hadResponse) {
      const successfulPatterns = JSON.parse(localStorage.getItem('successfulPatterns') || '{}');
      
      // Extract key words and add to patterns
      const words = userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      words.forEach(word => {
        successfulPatterns[word] = (successfulPatterns[word] || 0) + 1;
      });
      
      localStorage.setItem('successfulPatterns', JSON.stringify(successfulPatterns));
    }
  };

  const addDataRelationships = () => {
    // Map projects to relevant skills
    khangData.projects.forEach(project => {
      project.relatedSkills = [];
      
      // Connect technologies to skill categories
      project.technologies.forEach(tech => {
        for (const [category, skills] of Object.entries(khangData.skills)) {
          if (Array.isArray(skills)) {
            if (skills.includes(tech)) {
              project.relatedSkills.push({category, skill: tech});
            }
          } else if (typeof skills === 'object') {
            for (const [level, levelSkills] of Object.entries(skills)) {
              if (levelSkills.includes(tech)) {
                project.relatedSkills.push({category, level, skill: tech});
              }
            }
          }
        }
      });
      
      // Add experience relationships
      project.relatedExperience = khangData.experience.filter(exp => 
        exp.responsibilities.some(resp => 
          resp.toLowerCase().includes(project.name.toLowerCase())
        )
      ).map(exp => exp.organization);
    });
  };

  const fuzzyMatch = (input, target, threshold = 0.8) => {
    input = input.toLowerCase();
    target = target.toLowerCase();
    
    if (input === target) return 1.0;
    if (input.includes(target) || target.includes(input)) return 0.9;
    
    // Simple Levenshtein distance calculation
    const matrix = [];
    
    for (let i = 0; i <= target.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= input.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= target.length; i++) {
      for (let j = 1; j <= input.length; j++) {
        const cost = target.charAt(i - 1) === input.charAt(j - 1) ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i-1][j] + 1,     // deletion
          matrix[i][j-1] + 1,     // insertion
          matrix[i-1][j-1] + cost // substitution
        );
      }
    }
    
    const distance = matrix[target.length][input.length];
    const maxLength = Math.max(input.length, target.length);
    const similarity = 1 - (distance / maxLength);
    
    return similarity >= threshold ? similarity : 0;
  };
  
  // Check for misspelled projects, skills, etc.
  const findBestMatch = (input, possibilities) => {
    let bestMatch = null;
    let bestScore = 0;
    
    possibilities.forEach(item => {
      const score = fuzzyMatch(input, item);
      if (score > bestScore) {
        bestMatch = item;
        bestScore = score;
      }
    });
    
    return bestScore > 0.7 ? bestMatch : null;
  };

  // Enhanced comprehensive auto response function
  const botCommands = {
    'turn off': () => {
      addBotMessage("Closing the chatbot. Click the chat icon to start again!");
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    },
    'minimize': () => {
      setIsMinimized(true);
      addBotMessage("Minimizing the chat window. Click the chevron icon to expand.");
    },
    'maximize': () => {
      setIsMinimized(false);
      addBotMessage("Expanding the chat window.");
    },
    'clear': () => {
      setMessages([{ 
        text: "Chat history cleared. How else can I help you with information about Khang?", 
        sender: 'bot' 
      }]);
      setConversationContext({
        topic: null,
        lastQuery: null,
        lastEntityDiscussed: null
      });
    },
    'help': () => {
      const helpText = `
Here are some commands you can use:
• "turn off" - close the chatbot
• "minimize" - minimize the chat window
• "maximize" - expand the chat window
• "clear" - clear chat history

You can ask about:
• contact info (email, phone, GitHub, LinkedIn)
• education (university, high school, GPA)
• experience (work, research, leadership)
• projects (SkinIntel, Trackify, etc.)
• skills (languages, frontend, backend, etc.)
• awards and achievements
• volunteering experience
• personal interests

Try asking something like "Tell me about Khang's projects" or "What skills does Khang have?"
      `;
      addBotMessage(helpText);
    }
  };

  // Helper function to add bot messages
  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { text, sender: 'bot' }]);
  };

  // Process NLP intent from user message
  const processUserIntent = (userMessage) => {
    // Convert to lowercase for easier matching
    const message = userMessage.toLowerCase();
    
    // Check for commands first
    for (const [command, handler] of Object.entries(botCommands)) {
      if (message.includes(command)) {
        handler();
        return true; // Command processed
      }
    }

    // Process NLP intents
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.match(/^(hi|hello|hey)$/)) {
      const greetings = [
        "Hello! How can I help you learn about Khang today?",
        "Hi there! What would you like to know about Khang?",
        "Hey! I'm here to provide information about Khang. What are you interested in learning?"
      ];
      addBotMessage(greetings[Math.floor(Math.random() * greetings.length)]);
      return true;
    }
    
    // Check for thank you messages
    if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) {
      const responses = [
        "You're welcome! Is there anything else you'd like to know about Khang?",
        "Happy to help! Feel free to ask if you have any other questions.",
        "My pleasure! I'm here to provide information about Khang whenever you need it."
      ];
      addBotMessage(responses[Math.floor(Math.random() * responses.length)]);
      return true;
    }
    
    // Check for goodbye messages
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you') || message.includes('talk later')) {
      const farewells = [
        "Goodbye! Feel free to come back if you have more questions about Khang.",
        "See you later! Click the chat icon anytime you need information about Khang.",
        "Take care! I'll be here if you need more details about Khang."
      ];
      addBotMessage(farewells[Math.floor(Math.random() * farewells.length)]);
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
      return true;
    }
    
    return false; // No simple intent matched
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
  
    // Add user message
    const userMessage = inputValue.trim();
    setMessages([...messages, { text: userMessage, sender: 'user' }]);
    setInputValue('');
    
    // Check for basic intents and commands
    if (processUserIntent(userMessage)) {
      return; // If a basic intent was processed, exit early
    }
    
    // More sophisticated processing
    setTimeout(() => {
      // Detect intent and sentiment
      const { intent, confidence } = detectIntent(userMessage);
      const sentiment = analyzeSentiment(userMessage);
      
      // Update conversation context
      const entities = updateContext(userMessage, intent);
      
      // Process the query
      let response = processQuery(userMessage, intent, entities);
      let hadResponse = response !== null;
      
      // If no specific response was generated
      if (!hadResponse) {
        // Try fuzzy matching for projects, skills, etc.
        const projectNames = khangData.projects.map(p => p.name);
        const bestProjectMatch = findBestMatch(userMessage, projectNames);
        
        if (bestProjectMatch) {
          const project = khangData.projects.find(p => p.name === bestProjectMatch);
          response = `I think you might be asking about **${project.name}** (${project.type}):\n\nRole: ${project.role}\nPeriod: ${project.period}\nTechnologies: ${project.technologies.join(', ')}\n\nDescription:\n• ${project.description.join('\n• ')}`;
          hadResponse = true;
        } else {
          // Default response if nothing matched
          response = "Thanks for your message! I'm not sure I understood that. Type 'help' to see what I can assist with.";
          
          // Add sentiment response if applicable
          const sentimentResponse = respondToSentiment(sentiment);
          if (sentimentResponse) {
            response = sentimentResponse;
          }
        }
      }
      
      // Track this interaction for learning
      trackQuerySuccess(userMessage, hadResponse);
      
      // Add the response with possible follow-up
      addBotMessageWithFollowUp(response, conversationContext);
    }, 1000);
  };

  // Track chatbot usage analytics
  const trackAnalytics = (userMessage, botResponse, intent) => {
    try {
      const analytics = JSON.parse(localStorage.getItem('chatbotAnalytics') || '{}');
      
      // Update query count
      analytics.totalQueries = (analytics.totalQueries || 0) + 1;
      
      // Track intents
      analytics.intents = analytics.intents || {};
      if (intent) {
        analytics.intents[intent] = (analytics.intents[intent] || 0) + 1;
      }
      
      // Track session data
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      analytics.dailyUsage = analytics.dailyUsage || {};
      analytics.dailyUsage[today] = (analytics.dailyUsage[today] || 0) + 1;
      
      // Save analytics
      localStorage.setItem('chatbotAnalytics', JSON.stringify(analytics));
    } catch (e) {
      console.error('Error tracking analytics:', e);
    }
  };
  
  // Function to improve responses based on user feedback
  const improveFromFeedback = (feedback) => {
    if (feedback.helpful) {
      // Store successful patterns
      const successPatterns = JSON.parse(localStorage.getItem('successPatterns') || '[]');
      successPatterns.push({
        query: feedback.query,
        response: feedback.response,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('successPatterns', JSON.stringify(successPatterns.slice(-50)));
    } else {
      // Store unsuccessful interactions for improvement
      const improvementNeeded = JSON.parse(localStorage.getItem('improvementNeeded') || '[]');
      improvementNeeded.push({
        query: feedback.query,
        response: feedback.response,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('improvementNeeded', JSON.stringify(improvementNeeded.slice(-50)));
    }
  };

  // Handle multi-turn conversations
  const handleFollowUp = (userMessage) => {
    const context = conversationContext;
    
    // Check if this is a follow-up to a previous question
    if (context.lastQuery && context.topic) {
      // Handle references like "Tell me more about that" or "Why?"
      const followUpIndicators = [
        'tell me more', 'more about that', 'why', 'how', 'when', 'explain',
        'elaborate', 'details', 'what about', 'and'
      ];
      
      const isGenericFollowUp = followUpIndicators.some(indicator => 
        userMessage.toLowerCase().includes(indicator)
      );
      
      if (isGenericFollowUp && context.lastEntityDiscussed) {
        // Get more information about the last discussed entity
        const entityType = context.lastEntityDiscussed.type;
        const entityValue = context.lastEntityDiscussed.value;
        
        if (entityType === 'project') {
          const project = khangData.projects.find(p => p.name === entityValue);
          return `Let me tell you more about ${project.name}:\n\n` +
            `This ${project.type} project used ${project.technologies.join(', ')}. ` +
            `The most interesting aspects are:\n\n• ${project.description.join('\n• ')}\n\n` +
            `Khang worked on this during ${project.period} as the ${project.role}.`;
        }
        
        // Handle other entity types similarly...
      }
    }
    
    return null; // Not identified as a follow-up
  };
  
  const processQuery = (userMessage, intent, entities) => {
    const message = userMessage.toLowerCase();
    let response = null;
    
    // Use detected intent for primary categorization
    if (intent === 'contactRequest') {
      if (entities.length > 0) {
        const contactType = entities[0].value;
        return `Khang's ${contactType} is ${khangData.contact[contactType]}`;
      } else {
        return `You can reach Khang through:\n\n• Email: ${khangData.contact.email}\n• Phone: ${khangData.contact.phone}\n• GitHub: ${khangData.contact.github}\n• LinkedIn: ${khangData.contact.linkedin}`;
      }
    }
    
    // ======= CONTACT INFORMATION RESPONSES =======
    if (message.includes('contact') || message.includes('contact info') || message.includes('contact details')) {
      response = `You can reach Khang through:\n\n
      • Email: ${khangData.contact.email}\n
      • Phone: ${khangData.contact.phone}\n
      • GitHub: ${khangData.contact.github}\n
      • LinkedIn: ${khangData.contact.linkedin}\n
      • LeetCode: ${khangData.contact.leetcode}\n`;
    }
    else if (message.includes('email')) {
      response = `Khang's email address is ${khangData.contact.email}`;
    }
    else if (message.includes('phone') || message.includes('call') || message.includes('number')) {
      response = `Khang's phone number is ${khangData.contact.phone}`;
    }
    else if (message.includes('github')) {
      response = `Khang's GitHub profile can be found at: ${khangData.contact.github}`;
    }
    else if (message.includes('linkedin')) {
      response = `You can view Khang's professional profile on LinkedIn at: ${khangData.contact.linkedin}`;
    }
    else if (message.includes('leetcode') || message.includes('coding profile') || message.includes('competitive coding')) {
      response = `Khang has solved over 200 problems on LeetCode. You can view his profile at: ${khangData.contact.leetcode}`;
    }
    
    // ======= EDUCATION RESPONSES =======
    else if (message.includes('education') && message.includes('all')) {
      const uniInfo = khangData.education.university;
      const hsInfo = khangData.education.highSchool;
      response = `🎓 **Education**\n\n**${uniInfo.name}**\n${uniInfo.degree} | ${uniInfo.location}\n${uniInfo.period}\nGPA: ${uniInfo.gpa}\n\nAwards & Honors:\n• ${uniInfo.awards.join('\n• ')}\n\n**${hsInfo.name}**\n${hsInfo.specialization} | ${hsInfo.location}\n${hsInfo.period}\nGPA: ${hsInfo.gpa}\n\nAwards:\n• ${hsInfo.awards.join('\n• ')}`;
    }
    else if ((message.includes('about khang') || message.includes('education') || message.includes('study') || message.includes('major') || message.includes('degree')) && !message.includes('high school')) {
      const uniInfo = khangData.education.university;
      response = `Khang is currently a Freshman majoring in Computer Science at the University of South Florida (USF), where he's part of the prestigious Judy Genshaft Honor College. He maintains a ${uniInfo.gpa} GPA and is a recipient of the Green and Gold Presidential Award (full scholarship). His expected graduation is May 2028.`;
    }
    else if (message.includes('university') || message.includes('college') || message.includes('usf')) {
      const uniInfo = khangData.education.university;
      response = `Khang attends ${uniInfo.name}, pursuing a ${uniInfo.degree} (${uniInfo.period}). He maintains a perfect ${uniInfo.gpa} GPA and has received several honors including ${uniInfo.awards.join(', ')}.`;
    }
    else if (message.includes('high school') || message.includes('le quy don')) {
      const hsInfo = khangData.education.highSchool;
      response = `Before university, Khang graduated from ${hsInfo.name} in ${hsInfo.location}, where he was in the ${hsInfo.specialization}. He ranked #1 in his class with a perfect ${hsInfo.gpa} GPA and received awards including ${hsInfo.awards.join(', ')}.`;
    }
    else if (message.includes('gpa')) {
      response = `Khang maintains a perfect 4.0/4.0 GPA at the University of South Florida. In high school, he also had a 4.0/4.0 GPA and ranked #1 in his IT specialized class.`;
    }
    
    // ======= EXPERIENCE RESPONSES =======
    else if (message.includes('experience') && !message.includes('project') && !message.includes('volunteer')) {
      let experienceText = "Khang's professional experience includes:\n\n";
      khangData.experience.forEach(exp => {
        experienceText += `**${exp.title} at ${exp.organization}** (${exp.period})\n• ${exp.responsibilities.slice(0, 3).join('\n• ')}\n\n`;
      });
      response = experienceText;
    }
    else if (message.includes('acm') || message.includes('association for computing machinery')) {
      const acmExp = khangData.experience.find(exp => exp.organization.includes('ACM'));
      response = `At ${acmExp.organization}, Khang serves as a ${acmExp.title} (${acmExp.period}). His responsibilities include:\n\n• ${acmExp.responsibilities.join('\n• ')}`;
    }
    else if (message.includes('rare') || message.includes('lab') || message.includes('research') || message.includes('robot')) {
      const rareExp = khangData.experience.find(exp => exp.organization.includes('RARE'));
      response = `At the ${rareExp.organization}, Khang works as an ${rareExp.title} (${rareExp.period}). He:\n\n• ${rareExp.responsibilities.join('\n• ')}`;
    }
    else if (message.includes('vpec') || message.includes('psychedu') || message.includes('vice president')) {
      const vpecExp = khangData.experience.find(exp => exp.organization.includes('VPEC'));
      response = `At ${vpecExp.organization}, Khang served as ${vpecExp.title} (${vpecExp.period}). His key responsibilities included:\n\n• ${vpecExp.responsibilities.join('\n• ')}`;
    }
    else if (message.includes('marshall') || message.includes('student center') || message.includes('part-time') || message.includes('event crew')) {
      const ptExp = khangData.experience.find(exp => exp.organization.includes('Marshall'));
      response = `Khang works part-time as an ${ptExp.title} at the ${ptExp.organization} (${ptExp.period}), earning $13/hour. His responsibilities include:\n\n• ${ptExp.responsibilities.join('\n• ')}`;
    }
    else if (message.includes('job') || message.includes('work') || message.includes('career')) {
      response = `Khang has diverse work experience including:\n\n• ${khangData.experience.map(exp => `${exp.title} at ${exp.organization} (${exp.period})`).join('\n• ')}`;
    }
    
    // ======= PROJECT RESPONSES =======
    else if (message.includes('project') && message.includes('all')) {
      let projectsText = "Khang has worked on several impressive projects:\n\n";
      khangData.projects.forEach(proj => {
        projectsText += `**${proj.name}**: ${proj.type} (${proj.role}, ${proj.period})\nTechnologies: ${proj.technologies.join(', ')}\nHighlights: ${proj.description.slice(0, 2).join(', ')}\n\n`;
      });
      response = projectsText;
    }
    else if (message.includes('project') && !message.includes('specific')) {
      response = `Khang has worked on several technical projects including:\n\n• ${khangData.projects.map(proj => proj.name + ': ' + proj.type).join('\n• ')}`;
    }
    else if (message.includes('skinintel') || (message.includes('healthcare') && message.includes('ai'))) {
      const project = khangData.projects.find(p => p.name === "SkinIntel");
      response = `**${project.name}** (${project.type}):\n\nRole: ${project.role}\nPeriod: ${project.period}\nTechnologies: ${project.technologies.join(', ')}\n\nDescription:\n• ${project.description.join('\n• ')}`;
    }
    else if (message.includes('trackify') || message.includes('expense')) {
      const project = khangData.projects.find(p => p.name === "Trackify");
      response = `**${project.name}** (${project.type}):\n\nRole: ${project.role}\nPeriod: ${project.period}\nTechnologies: ${project.technologies.join(', ')}\n\nDescription:\n• ${project.description.join('\n• ')}`;
    }
    else if (message.includes('toralk') || message.includes('assistant') || message.includes('multilingual')) {
      const project = khangData.projects.find(p => p.name === "Toralk");
      response = `**${project.name}** (${project.type}):\n\nRole: ${project.role}\nPeriod: ${project.period}\nTechnologies: ${project.technologies.join(', ')}\n\nDescription:\n• ${project.description.join('\n• ')}`;
    }
    else if (message.includes('geovista') || message.includes('map') || message.includes('geographic')) {
      const project = khangData.projects.find(p => p.name === "GeoVista");
      response = `**${project.name}** (${project.type}):\n\nRole: ${project.role}\nPeriod: ${project.period}\nTechnologies: ${project.technologies.join(', ')}\n\nDescription:\n• ${project.description.join('\n• ')}`;
    }
    else if (message.includes('pathfinder') || message.includes('robot') || message.includes('autonomous')) {
      const project = khangData.projects.find(p => p.name === "PathFinder X");
      response = `**${project.name}** (${project.type}):\n\nRole: ${project.role}\nPeriod: ${project.period}\nTechnologies: ${project.technologies.join(', ')}\n\nDescription:\n• ${project.description.join('\n• ')}`;
    }
    
    // ======= SKILLS RESPONSES =======
    else if (message.includes('skill') && message.includes('all')) {
      const skills = khangData.skills;
      response = `**Khang's Technical Skills**\n\n**Programming Languages:**\n• Advanced: ${skills.languages.advanced.join(', ')}\n• Intermediate: ${skills.languages.intermediate.join(', ')}\n\n**Frontend:** ${skills.frontend.join(', ')}\n\n**Backend:** ${skills.backend.join(', ')}\n\n**Machine Learning:** ${skills.ml.join(', ')}\n\n**Databases:** ${skills.databases.join(', ')}\n\n**DevOps:** ${skills.devOps.join(', ')}\n\n**Robotics:** ${skills.robotics.join(', ')}\n\n**Tools:** ${skills.tools.join(', ')}`;
    }
    else if (message.includes('skill') && !message.includes('specific')) {
      response = `Khang is skilled in multiple areas including programming languages (${khangData.skills.languages.advanced.join(', ')}), frontend development (${khangData.skills.frontend.slice(0, 4).join(', ')}), backend systems (${khangData.skills.backend.join(', ')}), machine learning (${khangData.skills.ml.join(', ')}), and robotics (${khangData.skills.robotics.slice(0, 3).join(', ')}).`;
    }
    else if (message.includes('language') || message.includes('programming language')) {
      response = `Khang is proficient in these programming languages:\n\n**Advanced:** ${khangData.skills.languages.advanced.join(', ')}\n**Intermediate:** ${khangData.skills.languages.intermediate.join(', ')}`;
    }
    else if (message.includes('frontend') || message.includes('front-end') || message.includes('ui') || message.includes('user interface')) {
      response = `Khang's frontend development skills include: ${khangData.skills.frontend.join(', ')}. He has applied these in projects like SkinIntel, Trackify, and Toralk.`;
    }
    else if (message.includes('backend') || message.includes('back-end') || message.includes('server')) {
      response = `Khang's backend development skills include: ${khangData.skills.backend.join(', ')}. He has used these technologies in projects like Trackify (MongoDB) and Toralk (Express.js).`;
    }
    else if (message.includes('machine learning') || message.includes('ml') || message.includes('ai') || message.includes('artificial intelligence')) {
      response = `For machine learning and AI, Khang is skilled in: ${khangData.skills.ml.join(', ')}. He's used these technologies in projects like SkinIntel for medical image analysis.`;
    }
    else if (message.includes('database') || message.includes('data storage')) {
      response = `Khang has experience with these database technologies: ${khangData.skills.databases.join(', ')}. He's implemented MongoDB in Trackify and used Supabase in GeoVista.`;
    }
    else if (message.includes('devops') || message.includes('deployment') || message.includes('cloud')) {
      response = `Khang's DevOps and deployment skills include: ${khangData.skills.devOps.join(', ')}. He's deployed applications on AWS and used Docker for containerization.`;
    }
    else if (message.includes('robotics') || message.includes('embedded') || message.includes('hardware')) {
      response = `In robotics and embedded systems, Khang has experience with: ${khangData.skills.robotics.join(', ')}. His PathFinder X project showcases these skills.`;
    }
    
    // ======= VOLUNTEERING RESPONSES =======
    else if (message.includes('volunteer') || message.includes('philanthropy') || message.includes('charity')) {
      let volunteerText = "Khang has been active in volunteer work:\n\n";
      khangData.volunteering.forEach(vol => {
        volunteerText += `**${vol.organization}** (${vol.period})\nRole: ${vol.title}\n• ${vol.description.join('\n• ')}\n\n`;
      });
      response = volunteerText;
    }
    else if (message.includes('bulls') || message.includes('science olympiad')) {
      const volExp = khangData.volunteering.find(vol => vol.organization.includes('Bulls'));
      response = `At ${volExp.organization}, Khang served as a ${volExp.title} (${volExp.period}). He ${volExp.description.join(' and ')}.`;
    }
    else if (message.includes('blisskidz')) {
      const volExp = khangData.volunteering.find(vol => vol.organization.includes('BlissKidz'));
      response = `At ${volExp.organization}, Khang volunteered from ${volExp.period}. His contributions included: ${volExp.description.join(', ')}.`;
    }
    else if (message.includes('canary')) {
      const volExp = khangData.volunteering.find(vol => vol.organization.includes('Canary'));
      response = `With ${volExp.organization}, Khang volunteered from ${volExp.period}. He ${volExp.description.join(', ')}.`;
    }
    
    // ======= CERTIFICATIONS RESPONSES =======
    else if (message.includes('certification') || message.includes('certificate') || message.includes('credential')) {
      response = `Khang has earned several certifications:\n\n• ${khangData.certifications.join('\n• ')}`;
    }
    
    // ======= AWARDS RESPONSES =======
    else if (message.includes('award') || message.includes('honor') || message.includes('recognition') || message.includes('achievement')) {
      response = `Khang has received numerous awards and recognition:\n\n• ${khangData.awards.join('\n• ')}`;
    }
    else if (message.includes('scholarship') || message.includes('green and gold')) {
      response = `Khang is a recipient of the Green and Gold Presidential Award, which is a merit-based full scholarship at the University of South Florida. This prestigious award recognizes his academic excellence.`;
    }
    else if (message.includes('newspaper') || message.includes('featured') || message.includes('publication')) {
      response = `Khang has been featured in a National Newspaper for his academic achievements. You can read the article here: https://svvn.tienphong.vn/phan-tuan-khang-nam-sinh-chuyen-tin-tai-nang-am-loat-hoc-bong-danh-gia-o-tuoi-18-post1635689.tpo`;
    }
    
    // ======= PERSONAL RESPONSES =======
    else if (message.includes('hobby') || message.includes('interest') || message.includes('free time') || message.includes('personal')) {
      response = `When not coding, Khang enjoys ${khangData.personal.interests.join(', ')}. He's particularly passionate about hackathons and robotics.`;
    }
    else if (message.includes('hackathon') || message.includes('competitive coding') || message.includes('competition')) {
      response = `Khang is passionate about hackathons and competitive programming. He's solved over 200 problems on LeetCode (${khangData.contact.leetcode}). He's also won awards in competitions including a Bronze Medal in the Central Regional Informatics Olympic.`;
    }
    
    // ======= SPECIFIC LINKS RESPONSES =======
    else if (message.includes('leetcode link')) {
      response = `You can find Khang's LeetCode profile at: ${khangData.contact.leetcode}`;
    }
    else if (message.includes('github link')) {
      response = `Khang's GitHub profile: ${khangData.contact.github}`;
    }
    else if (message.includes('linkedin link')) {
      response = `Khang's LinkedIn profile: ${khangData.contact.linkedin}`;
    }
    else if (message.includes('email address')) {
      response = `Khang's email address: ${khangData.contact.email}`;
    }
    
    return response;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    // Scroll to bottom of chat when messages change
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chatbot button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-700 text-white shadow-lg hover:bg-emerald-800 transition-all"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chatbot window */}
      {isOpen && (
        <div className="flex flex-col bg-white rounded-lg shadow-xl w-72 sm:w-80 md:w-96 overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-700 px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center">
              <div className="font-bold">Tary</div>
            </div>
            <div className="flex items-center space-x-2">
              {!isMinimized ? (
                <button onClick={() => setIsMinimized(true)} className="hover:bg-emerald-600 p-1 rounded">
                  <ChevronDown size={18} />
                </button>
              ) : (
                <button onClick={() => setIsMinimized(false)} className="hover:bg-emerald-600 p-1 rounded">
                  <ChevronUp size={18} />
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-600 p-1 rounded">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat messages */}
          {!isMinimized && (
            <>
              <div 
                id="chat-messages" 
                className="flex-1 overflow-y-auto p-4 h-64 flex flex-col space-y-3"
              >
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3/4 px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-emerald-700 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input area */}
              <div className="border-t border-gray-200 p-3 flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-emerald-700 text-white px-3 py-2 rounded-r-lg hover:bg-emerald-800"
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}