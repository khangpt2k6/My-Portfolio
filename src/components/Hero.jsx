"use client";
import { useEffect, useState, useRef } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { HiOutlineArrowNarrowDown } from "react-icons/hi";
import { SiLeetcode } from "react-icons/si";

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const titles = ["Full-Stack Developer", "UI/UX Designer", "Software Engineer", "AI Engineer"];
  const backgroundCanvasRef = useRef(null);
  
  // For text typing effect
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  
  // For parallax effect
  const [scrollY, setScrollY] = useState(0);
  
  // For mouse glow effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Handle mouse movement for glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseEnter = () => {
      setIsMouseInside(true);
    };
    
    const handleMouseLeave = () => {
      setIsMouseInside(false);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  
  // Typing animation effect
  useEffect(() => {
    const currentTitle = titles[textIndex];
    const shouldDelete = isDeleting && displayText.length > 0;
    const shouldType = !isDeleting && displayText.length < currentTitle.length;
    
    if (shouldDelete) {
      // Deleting text
      const timeout = setTimeout(() => {
        setDisplayText(currentTitle.substring(0, displayText.length - 1));
      }, typingSpeed / 2);
      return () => clearTimeout(timeout);
    } else if (shouldType) {
      // Typing text
      const timeout = setTimeout(() => {
        setDisplayText(currentTitle.substring(0, displayText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText.length === 0) {
      // Move to next text
      setIsDeleting(false);
      setTextIndex((textIndex + 1) % titles.length);
      setTypingSpeed(100);
    } else if (!isDeleting && displayText.length === currentTitle.length) {
      // Start deleting after pause
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [displayText, isDeleting, textIndex, titles, typingSpeed]);

  // Animation on mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Minimalist tech-themed background animation
  useEffect(() => {
    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Pure white background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFFFFF'); // Pure white
    gradient.addColorStop(1, '#FFFFFF'); // Pure white
    
    // Minimal circuit node points
    const circuitPoints = [];
    const nodeCount = Math.min(15, Math.floor(canvas.width / 120));
    
    // Create minimal circuit nodes
    for (let i = 0; i < nodeCount; i++) {
      circuitPoints.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        connections: [],
        pulseRadius: 0,
        pulseOpacity: 0,
        nextPulseTime: Math.random() * 8000 + 4000,
        lastPulseTime: 0
      });
    }
    
    // Create minimal connections between nodes
    circuitPoints.forEach((point, i) => {
      // Connect to 1-2 nearest points only
      const connectionsCount = Math.floor(Math.random() * 2) + 1;
      
      // Find distances to all other points
      const distances = circuitPoints.map((otherPoint, j) => {
        if (i === j) return { index: j, distance: Infinity };
        const dx = point.x - otherPoint.x;
        const dy = point.y - otherPoint.y;
        return {
          index: j,
          distance: Math.sqrt(dx * dx + dy * dy)
        };
      });
      
      // Sort by distance and take closest ones
      const sortedDistances = distances.sort((a, b) => a.distance - b.distance);
      
      // Connect to closest points
      for (let c = 0; c < connectionsCount && c < sortedDistances.length; c++) {
        if (sortedDistances[c].distance < Math.min(canvas.width, canvas.height) * 0.3) {
          point.connections.push(sortedDistances[c].index);
        }
      }
    });
    
    // Minimal floating particles
    const particles = [];
    const particleCount = Math.min(25, Math.floor(canvas.width / 60));
    
    // Create subtle floating particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.2 + 0.05,
        direction: Math.random() * Math.PI * 2,
        type: 'circle',
        glowing: Math.random() > 0.9
      });
    }
    
    // Animation timing variables
    let lastTime = 0;
    
    function draw(currentTime) {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Fill background with pure white
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw very subtle grid (barely visible)
      ctx.strokeStyle = 'rgba(22, 163, 74, 0.03)';
      ctx.lineWidth = 0.3;
      const gridSize = 80;
      
      // Vertical grid lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw minimal circuit connections
      ctx.lineWidth = 0.5;
      circuitPoints.forEach((point, i) => {
        point.connections.forEach(connectionIndex => {
          const connectedPoint = circuitPoints[connectionIndex];
          
          // Draw connection line
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(connectedPoint.x, connectedPoint.y);
          
          // Calculate if any pulse is traveling this connection
          const pulsing = point.pulseOpacity > 0 || connectedPoint.pulseOpacity > 0;
          
          // Minimal line gradient
          const gradient = ctx.createLinearGradient(
            point.x, point.y, connectedPoint.x, connectedPoint.y
          );
          
          if (pulsing) {
            gradient.addColorStop(0, `rgba(22, 163, 74, ${0.15 + point.pulseOpacity * 0.3})`);
            gradient.addColorStop(1, `rgba(22, 163, 74, ${0.15 + connectedPoint.pulseOpacity * 0.3})`);
          } else {
            gradient.addColorStop(0, 'rgba(22, 163, 74, 0.08)');
            gradient.addColorStop(1, 'rgba(22, 163, 74, 0.08)');
          }
          
          ctx.strokeStyle = gradient;
          ctx.stroke();
        });
      });
      
      // Update and draw minimal circuit nodes
      circuitPoints.forEach(point => {
        // Occasionally start a new pulse (less frequent)
        if (deltaTime && currentTime - point.lastPulseTime > point.nextPulseTime) {
          point.pulseRadius = 0;
          point.pulseOpacity = 0.4;
          point.lastPulseTime = currentTime;
          point.nextPulseTime = Math.random() * 8000 + 6000;
        }
        
        // Update pulse
        if (point.pulseOpacity > 0) {
          point.pulseRadius += deltaTime * 0.03;
          point.pulseOpacity -= deltaTime * 0.0003;
          
          if (point.pulseOpacity <= 0) {
            point.pulseOpacity = 0;
          }
          
          // Draw subtle pulse
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.pulseRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(22, 163, 74, ${point.pulseOpacity * 0.1})`;
          ctx.fill();
        }
        
        // Draw minimal node
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(22, 163, 74, 0.2)';
        ctx.fill();
      });
      
      // Update and draw minimal particles
      particles.forEach(particle => {
        // Update position with gentle movement
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;
        
        // Wrap around edges
        if (particle.x < -20) particle.x = canvas.width + 20;
        if (particle.x > canvas.width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = canvas.height + 20;
        if (particle.y > canvas.height + 20) particle.y = -20;
        
        // Draw subtle particle
        ctx.fillStyle = particle.glowing 
          ? `rgba(22, 163, 74, ${0.15 + Math.sin(currentTime * 0.001) * 0.1})`
          : `rgba(22, 163, 74, ${particle.opacity})`;
          
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(draw);
    }
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    requestAnimationFrame(draw);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate styles based on scroll
  const contentScale = Math.max(0.95, 1 - (scrollY * 0.0005));
  const contentY = scrollY * -0.2;
  
  return (
    <section
      id="hero"
      className="h-screen flex items-center justify-center relative overflow-hidden bg-white"
    >
      {/* Mouse glow effect */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: isMouseInside
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(22, 163, 74, 0.08), rgba(22, 163, 74, 0.03) 40%, transparent 70%)`
            : 'transparent',
          transition: 'background 0.3s ease-out',
        }}
      />
      
      {/* Minimalist animated background */}
      <canvas 
        ref={backgroundCanvasRef} 
        className="absolute inset-0 z-0"
      />

      {/* Subtle overlay gradient - now pure white */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-white/50 z-0"></div>
      
      {/* Main content with parallax effect */}
      <div
        style={{ 
          transform: `scale(${contentScale}) translateY(${contentY}px)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="container relative z-20 max-w-4xl mx-auto px-4"
      >
        <div
          className={`rounded-3xl border border-gray-200 shadow-xl p-8 md:p-12 relative overflow-hidden bg-white/80 backdrop-blur-sm ${
            mounted ? 'animate-fadeIn' : 'opacity-0'
          }`}
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(22, 163, 74, 0.05)'
          }}
        >
          {/* Minimal decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            {/* Top-left minimal decoration */}
            <div className="absolute top-0 left-0 w-12 h-12 opacity-20">
              <div className="absolute top-4 left-0 w-8 h-0.5 bg-green-600"></div>
              <div className="absolute top-0 left-4 w-0.5 h-8 bg-green-600"></div>
              <div className="absolute top-6 left-4 w-0.5 h-0.5 rounded-full bg-green-600"></div>
            </div>
            
            {/* Bottom-right minimal decoration */}
            <div className="absolute bottom-0 right-0 w-16 h-16 opacity-20">
              <div className="absolute bottom-6 right-0 w-12 h-0.5 bg-green-600"></div>
              <div className="absolute bottom-0 right-6 w-0.5 h-12 bg-green-600"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border border-green-600/40 rounded-sm"></div>
            </div>
          </div>
          
          {/* Subtle accent light */}
          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-green-600/5 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-green-600/5 blur-3xl"></div>
          
          <div className="text-center relative z-10">
            {/* Name with modern styling */}
            <div className="relative">
              <div
                className={`relative inline-block ${
                  mounted ? 'animate-scaleIn' : 'opacity-0 scale-90'
                }`}
                style={{ animationDelay: '200ms' }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-800">
                  Tuan Khang Phan
                </h1>
              </div>

              {/* Clean, minimal underline */}
              <div className="max-w-xs mx-auto mt-2">
                <div
                  className={`h-0.5 w-full bg-gradient-to-r from-green-600/30 via-green-600/80 to-green-600/30 ${
                    mounted ? 'animate-widthExpand' : 'w-0 opacity-0'
                  }`}
                  style={{ animationDelay: '600ms' }}
                />
              </div>
            </div>

            {/* Role title with typing effect */}
            <div className="h-16 mt-8 flex items-center justify-center">
              <h2 className="text-xl md:text-3xl font-light text-gray-700">
                <span className="opacity-60">{`< `}</span>
                {displayText}
                <span className="animate-blink text-green-600">|</span>
                <span className="opacity-60">{` />`}</span>
              </h2>
            </div>

            {/* Clean, modern action buttons */}
            <div className="mt-12">
              <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                <ActionButton 
                  href="mailto:khang18@usf.edu"
                  icon={<FaEnvelope className="mr-2" />}
                  text="Contact Me"
                  variant="primary"
                />
                
                <ActionButton 
                  href="https://github.com/khangpt2k6"
                  icon={<FaGithub className="mr-2" />}
                  text="View Projects"
                  variant="secondary"
                />
              </div>

              {/* Social links with clean design */}
              <div 
                className={`mt-10 flex justify-center space-x-6 ${
                  mounted ? 'animate-fadeInUp' : 'opacity-0 translate-y-5'
                }`}
                style={{ animationDelay: '1000ms' }}
              >
                <SocialButton
                  href="https://linkedin.com/in/tuankhangphan"
                  icon={<FaLinkedin size={20} />}
                  label="LinkedIn"
                />
                <SocialButton
                  href="https://leetcode.com/u/KHcqTUn9ld/"
                  icon={<SiLeetcode size={20} />}
                  label="LeetCode"
                />
                <SocialButton
                  href="https://github.com/khangpt2k6"
                  icon={<FaGithub size={20} />}
                  label="GitHub"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 ${
          mounted ? 'animate-fadeIn' : 'opacity-0'
        }`}
        style={{ animationDelay: '1500ms' }}
      >
        <div className="text-gray-600 flex flex-col items-center animate-bounce">
          <span className="text-sm font-light mb-2 text-gray-500">Scroll Down</span>
          <HiOutlineArrowNarrowDown size={18} />
        </div>
      </div>
    </section>
  );
};

// Clean, modern action button component
const ActionButton = ({ href, icon, text, variant }) => {
  const baseClasses = "group px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden";
  
  const variantClasses = {
    primary: "bg-green-600 text-white hover:bg-green-700 hover:shadow-green-600/30",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-green-600/50 hover:shadow-green-600/10"
  };
  
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {icon}
      <span>{text}</span>
    </a>
  );
};

// Clean social button component
const SocialButton = ({ href, icon, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-green-600 hover:bg-green-50 hover:border-green-600/30 transition-all duration-300 hover:scale-110 active:scale-90"
    >
      {icon}
    </a>
  );
};

export default Hero;