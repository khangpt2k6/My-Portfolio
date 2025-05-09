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
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
  
  // Tech-themed background animation with circuits and particles
  useEffect(() => {
    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Dark tech gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(6, 78, 59, 1)'); // Dark emerald
    gradient.addColorStop(1, 'rgba(5, 46, 22, 1)'); // Dark green
    
    // Circuit node points for tech patterns
    const circuitPoints = [];
    const nodeCount = Math.min(25, Math.floor(canvas.width / 80));
    
    // Create circuit nodes
    for (let i = 0; i < nodeCount; i++) {
      circuitPoints.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 2,
        connections: [],
        pulseRadius: 0,
        pulseOpacity: 0,
        nextPulseTime: Math.random() * 5000 + 2000,
        lastPulseTime: 0
      });
    }
    
    // Create connections between nodes
    circuitPoints.forEach((point, i) => {
      // Connect to 1-3 nearest points
      const connectionsCount = Math.floor(Math.random() * 3) + 1;
      
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
        if (sortedDistances[c].distance < Math.min(canvas.width, canvas.height) * 0.25) {
          point.connections.push(sortedDistances[c].index);
        }
      }
    });
    
    // Particles
    const particles = [];
    const particleCount = Math.min(40, Math.floor(canvas.width / 40));
    
    // Create tech-themed particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.4 + 0.1,
        direction: Math.random() * Math.PI * 2,
        type: Math.random() > 0.7 ? 'circle' : 'square',
        pulse: false,
        glowing: Math.random() > 0.8
      });
    }
    
    // Animation timing variables
    let lastTime = 0;
    
    function draw(currentTime) {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Fill background with gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw subtle grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.07)';
      ctx.lineWidth = 0.5;
      const gridSize = 50;
      
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
      
      // Draw circuit connections
      ctx.lineWidth = 0.8;
      circuitPoints.forEach((point, i) => {
        point.connections.forEach(connectionIndex => {
          const connectedPoint = circuitPoints[connectionIndex];
          
          // Draw connection line
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(connectedPoint.x, connectedPoint.y);
          
          // Calculate if any pulse is traveling this connection
          const pulsing = point.pulseOpacity > 0 || connectedPoint.pulseOpacity > 0;
          
          // Line gradient
          const gradient = ctx.createLinearGradient(
            point.x, point.y, connectedPoint.x, connectedPoint.y
          );
          
          if (pulsing) {
            gradient.addColorStop(0, `rgba(16, 185, 129, ${0.2 + point.pulseOpacity * 0.6})`);
            gradient.addColorStop(1, `rgba(16, 185, 129, ${0.2 + connectedPoint.pulseOpacity * 0.6})`);
          } else {
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0.2)');
          }
          
          ctx.strokeStyle = gradient;
          ctx.stroke();
          
          // Add circuit "breaks" (small perpendicular line segments)
          const dx = connectedPoint.x - point.x;
          const dy = connectedPoint.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Normalize direction vector
          const nx = dx / distance;
          const ny = dy / distance;
          
          // Perpendicular vector
          const px = -ny;
          const py = nx;
          
          // Draw circuit breaks (small perpendicular lines)
          const breakCount = Math.floor(distance / 40);
          
          for (let b = 1; b < breakCount; b++) {
            const breakPos = b / breakCount;
            const breakX = point.x + dx * breakPos;
            const breakY = point.y + dy * breakPos;
            
            const breakLength = 4;
            
            ctx.beginPath();
            ctx.moveTo(breakX - px * breakLength, breakY - py * breakLength);
            ctx.lineTo(breakX + px * breakLength, breakY + py * breakLength);
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        });
      });
      
      // Update and draw circuit nodes
      circuitPoints.forEach(point => {
        // Occasionally start a new pulse
        if (deltaTime && currentTime - point.lastPulseTime > point.nextPulseTime) {
          point.pulseRadius = 0;
          point.pulseOpacity = 0.8;
          point.lastPulseTime = currentTime;
          point.nextPulseTime = Math.random() * 5000 + 3000;
        }
        
        // Update pulse
        if (point.pulseOpacity > 0) {
          point.pulseRadius += deltaTime * 0.05;
          point.pulseOpacity -= deltaTime * 0.0005;
          
          if (point.pulseOpacity <= 0) {
            point.pulseOpacity = 0;
          }
          
          // Draw pulse
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.pulseRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(16, 185, 129, ${point.pulseOpacity * 0.2})`;
          ctx.fill();
        }
        
        // Draw node
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.fill();
        
        // Draw node glow
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size + 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${0.1 + point.pulseOpacity * 0.3})`;
        ctx.fill();
      });
      
      // Update and draw particles
      particles.forEach(particle => {
        // Update position with slight movement
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;
        
        // Wrap around edges
        if (particle.x < -20) particle.x = canvas.width + 20;
        if (particle.x > canvas.width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = canvas.height + 20;
        if (particle.y > canvas.height + 20) particle.y = -20;
        
        // Draw particle
        ctx.fillStyle = particle.glowing 
          ? `rgba(16, 185, 129, ${0.3 + Math.sin(currentTime * 0.001) * 0.2})`
          : `rgba(16, 185, 129, ${particle.opacity})`;
          
        if (particle.type === 'circle') {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Rotating square for more tech feel
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(currentTime * 0.001);
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
          ctx.restore();
        }
      });
      
      // Add a few random small tech symbols and dots
      // (microchip patterns, etc.)
      const techPatternCount = 12;
      
      for (let t = 0; t < techPatternCount; t++) {
        const x = (t / techPatternCount) * canvas.width;
        const y = (Math.sin(x * 0.01 + currentTime * 0.0005) * 0.3 + 0.5) * canvas.height;
        
        // Tech pattern type
        const patternType = t % 3;
        
        if (patternType === 0) {
          // Circuit corner pattern
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 15, y);
          ctx.lineTo(x + 15, y + 15);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        } else if (patternType === 1) {
          // Dot matrix pattern
          for (let dx = 0; dx < 3; dx++) {
            for (let dy = 0; dy < 3; dy++) {
              if ((dx + dy) % 2 === 0) {
                ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
                ctx.fillRect(x + dx * 5, y + dy * 5, 1.5, 1.5);
              }
            }
          }
        } else {
          // Microchip-like line
          ctx.beginPath();
          ctx.moveTo(x - 10, y);
          ctx.lineTo(x + 10, y);
          
          // Add small perpendicular ticks
          for (let tick = -8; tick <= 8; tick += 4) {
            ctx.moveTo(x + tick, y);
            ctx.lineTo(x + tick, y + (tick % 8 === 0 ? 6 : 3));
          }
          
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
      
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
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Tech-themed animated background */}
      <canvas 
        ref={backgroundCanvasRef} 
        className="absolute inset-0 z-0"
      />

      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 to-emerald-950/30 z-0"></div>
      
      {/* Main content with parallax effect */}
      <div
        style={{ 
          transform: `scale(${contentScale}) translateY(${contentY}px)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="container relative z-20 max-w-4xl mx-auto px-4"
      >
        <div
          className={`rounded-3xl border border-emerald-500/20 shadow-xl p-8 md:p-12 relative overflow-hidden ${
            mounted ? 'animate-fadeIn' : 'opacity-0'
          }`}
          style={{
            background: 'rgba(3, 24, 19, 0.8)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 200, 80, 0.1), 0 4px 16px rgba(0, 255, 120, 0.05)'
          }}
        >
          {/* Circuit-inspired decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            {/* Top-left circuit decoration */}
            <div className="absolute top-0 left-0 w-16 h-16 opacity-30">
              <div className="absolute top-4 left-0 w-12 h-1 bg-emerald-500/30"></div>
              <div className="absolute top-0 left-4 w-1 h-12 bg-emerald-500/30"></div>
              <div className="absolute top-9 left-4 w-1 h-1 rounded-full bg-emerald-400/60"></div>
            </div>
            
            {/* Bottom-right circuit decoration */}
            <div className="absolute bottom-0 right-0 w-24 h-24 opacity-30">
              <div className="absolute bottom-8 right-0 w-16 h-1 bg-emerald-500/30"></div>
              <div className="absolute bottom-0 right-8 w-1 h-16 bg-emerald-500/30"></div>
              <div className="absolute bottom-5 right-5 w-6 h-6 border border-emerald-500/40 rounded-sm"></div>
              <div className="absolute bottom-12 right-12 w-1 h-1 rounded-full bg-emerald-400/60"></div>
            </div>
          </div>
          
          {/* Subtle accent light */}
          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-green-500/10 blur-3xl"></div>
          
          <div className="text-center relative z-10">
            {/* Name with modern styling */}
            <div className="relative">
              <div
                className={`relative inline-block ${
                  mounted ? 'animate-scaleIn' : 'opacity-0 scale-90'
                }`}
                style={{ animationDelay: '200ms' }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-200">
                  Tuan Khang Phan
                </h1>
              </div>

              {/* Clean, minimal underline */}
              <div className="max-w-xs mx-auto mt-2">
                <div
                  className={`h-0.5 w-full bg-gradient-to-r from-emerald-400/50 via-green-400/80 to-emerald-400/50 ${
                    mounted ? 'animate-widthExpand' : 'w-0 opacity-0'
                  }`}
                  style={{ animationDelay: '600ms' }}
                />
              </div>
            </div>

            {/* Role title with typing effect */}
            <div className="h-16 mt-8 flex items-center justify-center">
              <h2 className="text-xl md:text-3xl font-light text-emerald-50/90">
                <span className="opacity-60">{`< `}</span>
                {displayText}
                <span className="animate-blink text-emerald-400">|</span>
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
        <div className="text-emerald-300 flex flex-col items-center animate-bounce">
          <span className="text-sm font-light mb-2 text-emerald-200/80">Scroll Down</span>
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
    primary: "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-emerald-500/30",
    secondary: "bg-emerald-950 border border-emerald-600/30 text-emerald-50 hover:bg-emerald-900 hover:border-emerald-500/50 hover:shadow-emerald-600/20"
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
      className="group flex items-center justify-center w-10 h-10 rounded-full bg-emerald-900/80 border border-emerald-600/30 text-emerald-400 hover:text-white hover:bg-emerald-700 hover:border-emerald-500/50 transition-all duration-300 hover:scale-110 active:scale-90"
    >
      {icon}
    </a>
  );
};

export default Hero;