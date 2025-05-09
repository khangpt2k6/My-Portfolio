"use client";
import { useEffect, useState, useRef } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaCode } from "react-icons/fa";
import { HiOutlineArrowNarrowDown } from "react-icons/hi";
import { SiLeetcode } from "react-icons/si";

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const titles = ["Full-Stack Developer", "UI/UX Designer", "Software Engineer", "AI Engineer"];
  const particlesRef = useRef(null);
  
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
  
  // Canvas galaxy-themed particle background
  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particlesArray = [];
    let hue = 140; // Start with emerald hue
    let mouseX = null;
    let mouseY = null;
    let galaxyCenterX = canvas.width / 2;
    let galaxyCenterY = canvas.height / 2;
    let galaxyRotation = 0;
    let rotationSpeed = 0.0005;
    
    // Create particle class with galaxy theme
    class Particle {
      constructor() {
        // Polar coordinates for galaxy distribution
        this.distance = Math.random() * canvas.width * 0.4;
        this.angle = Math.random() * Math.PI * 2;
        
        // Convert to cartesian coordinates
        this.x = galaxyCenterX + Math.cos(this.angle) * this.distance;
        this.y = galaxyCenterY + Math.sin(this.angle) * this.distance;
        
        this.size = Math.random() * 3 + 0.5;
        this.baseSize = this.size;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        
        // Add spiral arm effect
        const spiralFactor = Math.random() * 0.5 + 0.5;
        this.speedX += Math.cos(this.angle) * spiralFactor * 0.1;
        this.speedY += Math.sin(this.angle) * spiralFactor * 0.1;
        
        // Emerald-themed colors with occasional stars
        this.colorType = Math.random() > 0.8 ? 'star' : 'particle';
        
        if (this.colorType === 'star') {
          // Brighter star particles
          this.color = `rgb(255, 255, 255)`;
          this.baseSize *= 1.5;
          this.size = this.baseSize;
          this.glow = 10 + Math.random() * 10;
        } else {
          // Galaxy particles with emerald theme
          const greenHue = 140 + Math.random() * 30 - 15; // Emerald hue range
          const saturation = 70 + Math.random() * 30;
          const lightness = 40 + Math.random() * 30;
          this.color = `hsl(${greenHue}, ${saturation}%, ${lightness}%)`;
          this.glow = 5 + Math.random() * 5;
        }
        
        this.density = Math.random() * 30 + 10;
        this.originalDistance = this.distance;
        this.originalAngle = this.angle;
      }
      
      update() {
        // Galaxy rotation
        this.angle += rotationSpeed;
        
        // Mouse interaction
        if (mouseX !== null && mouseY !== null) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;
          
          if (distance < maxDistance) {
            // Create gravitational pull towards mouse
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (maxDistance - distance) / maxDistance;
            
            this.speedX += forceDirectionX * force * 0.2;
            this.speedY += forceDirectionY * force * 0.2;
            
            // Grow particles near mouse
            this.size = this.baseSize + (force * 3);
          } else {
            // Return to original size
            if (this.size > this.baseSize) {
              this.size -= 0.1;
            }
          }
        }
        
        // Update position with spiral galaxy motion
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Add slight damping for smoother movement
        this.speedX *= 0.99;
        this.speedY *= 0.99;
        
        // Pull back to galaxy structure over time
        const targetX = galaxyCenterX + Math.cos(this.angle) * this.originalDistance;
        const targetY = galaxyCenterY + Math.sin(this.angle) * this.originalDistance;
        
        this.x += (targetX - this.x) * 0.005;
        this.y += (targetY - this.y) * 0.005;
        
        // Wrap around edges with fading effect
        if (this.x < -100 || this.x > canvas.width + 100 || 
            this.y < -100 || this.y > canvas.height + 100) {
          // Reset to a new position in the galaxy
          this.distance = Math.random() * canvas.width * 0.4;
          this.angle = Math.random() * Math.PI * 2;
          this.x = galaxyCenterX + Math.cos(this.angle) * this.distance;
          this.y = galaxyCenterY + Math.sin(this.angle) * this.distance;
          this.originalDistance = this.distance;
          this.originalAngle = this.angle;
        }
      }
      
      draw() {
        // Add glow effect
        if (this.colorType === 'star') {
          ctx.shadowBlur = this.glow;
          ctx.shadowColor = 'white';
        } else {
          ctx.shadowBlur = this.glow;
          ctx.shadowColor = this.color;
        }
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow for performance
        ctx.shadowBlur = 0;
      }
    }
    
    // Init particles
    function init() {
      particlesArray = [];
      const particleCount = Math.min(window.innerWidth * 0.12, 250); // Responsive particle count
      
      for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
      }
    }
    
    // Animation loop
    function animate() {
      // Create semi-transparent fade effect for motion trails
      ctx.fillStyle = 'rgba(0, 10, 2, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Slowly shift the galaxy center
      galaxyCenterX = canvas.width/2 + Math.sin(Date.now() * 0.0002) * canvas.width * 0.1;
      galaxyCenterY = canvas.height/2 + Math.cos(Date.now() * 0.0001) * canvas.height * 0.1;
      
      // Draw connecting lines between close particles
      ctx.lineWidth = 0.3;
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80) {
            // Emerald-themed gradient connections
            const opacity = 0.1 - (distance/80) * 0.1;
            const gradient = ctx.createLinearGradient(
              particlesArray[i].x, 
              particlesArray[i].y, 
              particlesArray[j].x, 
              particlesArray[j].y
            );
            
            gradient.addColorStop(0, `rgba(30, 215, 96, ${opacity})`);
            gradient.addColorStop(1, `rgba(0, 180, 100, ${opacity})`);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Update and draw all particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      // Cycle hue for color variation
      hue += 0.2;
      
      requestAnimationFrame(animate);
    }
    
    // Track mouse position
    const handleMouseMove = (event) => {
      mouseX = event.x;
      mouseY = event.y;
      
      // Slightly increase rotation speed on mouse movement
      rotationSpeed = 0.001;
      setTimeout(() => {
        rotationSpeed = 0.0005;
      }, 1000);
    };
    
    const handleMouseLeave = () => {
      mouseX = null;
      mouseY = null;
    };
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      galaxyCenterX = canvas.width / 2;
      galaxyCenterY = canvas.height / 2;
      init();
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Initialize and start animation
    init();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Calculate styles based on scroll
  const bgOpacity = Math.max(0.2, 1 - (scrollY * 0.002));
  const contentScale = Math.max(0.95, 1 - (scrollY * 0.0005));
  const contentY = scrollY * -0.2;
  const titleRotate = scrollY * -0.02;
  
  return (
    <section
      id="hero"
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Canvas particle background */}
      <canvas 
        ref={particlesRef} 
        className="absolute inset-0 z-0 bg-slate-900"
      />

      {/* Gradient background - updated with emerald theme */}
      <div 
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-emerald-800/30 to-green-900/40 z-0"
      />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-emerald-900/30 to-slate-900/80 z-1"></div>

      {/* Circuit board pattern overlay with emerald theme */}
      <div className="absolute inset-0 z-1 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxMGI5ODEiIHN0cm9rZS13aWR0aD0iMC41Ij48cmVjdCB4PSIxIiB5PSIxIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCB4PSIxMSIgeT0iMTEiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjxyZWN0IHg9IjExIiB5PSIyMSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PHJlY3QgeD0iMjEiIHk9IjExIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48bGluZSB4MT0iMTYiIHkxPSI2IiB4Mj0iMTYiIHkyPSIxMSIvPjxsaW5lIHgxPSIyNiIgeTE9IjE2IiB4Mj0iMzEiIHkyPSIxNiIvPjxsaW5lIHgxPSIxNiIgeTE9IjIxIiB4Mj0iMTYiIHkyPSIxNiIvPjxsaW5lIHgxPSI2IiB5MT0iMTYiIHgyPSIxMSIgeTI9IjE2Ii8+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMiIvPjxjaXJjbGUgY3g9IjI2IiBjeT0iMTYiIHI9IjIiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjYiIHI9IjIiLz48Y2lyY2xlIGN4PSI2IiBjeT0iMTYiIHI9IjIiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjI2IiByPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>

      {/* Digital noise overlay - subtle emerald pattern */}
      <div className="absolute inset-0 z-1 opacity-10 mix-blend-screen bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjxmZUNvbG9yTWF0cml4IHR5cGU9InNhdHVyYXRlIiB2YWx1ZXM9IjAiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]"></div>

      {/* Main content with parallax effect */}
      <div
        style={{ 
          transform: `scale(${contentScale}) translateY(${contentY}px)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="container relative z-20 max-w-5xl mx-auto px-4"
      >
        <div
          className={`backdrop-blur-lg bg-black/30 rounded-2xl border border-emerald-500/20 shadow-2xl p-8 md:p-12 relative overflow-hidden ${
            mounted ? 'animate-fadeIn' : 'opacity-0'
          }`}
          style={{
            boxShadow: '0 8px 32px rgba(0, 200, 80, 0.1), 0 4px 16px rgba(0, 255, 120, 0.05)'
          }}
        >
          {/* Digital grid lines overlay */}
          <div className="absolute inset-0 z-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" style={{ backgroundSize: '20px 20px', backgroundImage: 'linear-gradient(to right, rgba(0, 204, 100, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 204, 100, 0.1) 1px, transparent 1px)' }}></div>
          </div>
          
          {/* Animated glowing orbs */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-green-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 -translate-y-1/2 -left-32 w-32 h-32 rounded-full bg-lime-500/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className="text-center relative z-10">
            {/* Name with 3D effect */}
            <div
              style={{ transform: `rotateX(${titleRotate}deg)` }}
              className="relative transition-transform duration-300"
            >
              <div
                className={`relative inline-block ${
                  mounted ? 'animate-scaleIn' : 'opacity-0 scale-90'
                }`}
                style={{ animationDelay: '200ms' }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-400 to-lime-300 drop-shadow-md">
                  Tuan Khang Phan
                </h1>
                
                {/* Tech-themed highlight effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 blur-sm animate-shine"></div>
              </div>

              {/* Animated underline - emerald style */}
              <div className="max-w-md mx-auto mt-2 h-2 relative">
                <div
                  className={`h-0.5 w-full bg-gradient-to-r from-green-300/50 via-emerald-400/50 to-lime-300/50 ${
                    mounted ? 'animate-widthExpand' : 'w-0 opacity-0'
                  }`}
                  style={{ animationDelay: '800ms' }}
                />
                
                {/* Tech scanner effect */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/80 to-emerald-500/0 animate-scanner"></div>
              </div>
            </div>

            <div className="h-24 mt-6 flex items-center justify-center">
              <h2 className="text-2xl md:text-4xl font-light text-emerald-50">
                <span className="opacity-80">{`< `}</span>
                {displayText}
                <span className="animate-blink text-emerald-400">|</span>
                <span className="opacity-80">{` />`}</span>
              </h2>
            </div>

            {/* Buttons with tech glass effect and hover animations */}
            <div className="mt-10">
              <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                <a
                  href="mailto:khang18@usf.edu"
                  className="group backdrop-blur-md bg-emerald-950/30 border border-emerald-500/30 text-emerald-50 px-6 py-3 rounded-full font-medium hover:bg-emerald-800/20 transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg hover:shadow-emerald-500/20 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 animate-shine transition-opacity"></div>
                  <FaEnvelope className="mr-2 text-emerald-400" />
                  <span>Contact Me</span>
                  <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400 w-0 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </a>
                
                <a
                  href="https://github.com/khangpt2k6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group backdrop-blur-md bg-green-950/30 border border-green-500/30 text-emerald-50 px-6 py-3 rounded-full font-medium hover:bg-green-800/20 transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/20 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 opacity-0 group-hover:opacity-100 animate-shine transition-opacity"></div>
                  <FaGithub className="mr-2 text-green-400" />
                  <span>View Projects</span>
                  <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 w-0 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </a>
              </div>

              {/* Social links with tech hover effects */}
              <div 
                className={`mt-8 flex justify-center space-x-6 ${
                  mounted ? 'animate-fadeInUp' : 'opacity-0 translate-y-5'
                }`}
                style={{ animationDelay: '1200ms' }}
              >
                <SocialButton
                  href="https://linkedin.com/in/tuankhangphan"
                  icon={<FaLinkedin size={22} />}
                  color="green"
                />
                <SocialButton
                  href="https://leetcode.com/u/KHcqTUn9ld/"
                  icon={<SiLeetcode size={22} />}
                  color="lime"
                />
                <SocialButton
                  href="https://github.com/khangpt2k6"
                  icon={<FaGithub size={22} />}
                  color="emerald"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 ${
          mounted ? 'animate-fadeIn' : 'opacity-0'
        }`}
        style={{ animationDelay: '2000ms' }}
      >
        <div
          className="text-emerald-300 flex flex-col items-center animate-bounce"
        >
          <span className="text-sm font-light mb-2 text-emerald-200">Scroll Down</span>
          <HiOutlineArrowNarrowDown size={20} />
        </div>
      </div>
    </section>
  );
};

// Enhanced social button component with emerald theme hover effects
const SocialButton = ({ href, icon, color }) => {
  const colorMap = {
    green: "after:bg-gradient-to-br after:from-green-400 after:to-emerald-400",
    lime: "after:bg-gradient-to-br after:from-green-400 after:to-lime-400",
    emerald: "after:bg-gradient-to-br after:from-emerald-400 after:to-green-400",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md bg-black/20 border border-${color}-500/30 text-${color}-400 hover:text-white transition-all duration-300 relative overflow-hidden hover:scale-110 active:scale-90 ${colorMap[color]} after:absolute after:inset-0 after:opacity-0 after:hover:opacity-100 after:transition-opacity after:duration-300 after:z-0`}
    >
      <div className="relative z-10">{icon}</div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 animate-shine"></div>
    </a>
  );
};

export default Hero;