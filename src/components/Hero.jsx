import React, { useEffect, useState, useRef } from "react";
import { Mail, Github, ArrowDown, Linkedin, Code } from "lucide-react";

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
      const timeout = setTimeout(() => {
        setDisplayText(currentTitle.substring(0, displayText.length - 1));
      }, typingSpeed / 2);
      return () => clearTimeout(timeout);
    } else if (shouldType) {
      const timeout = setTimeout(() => {
        setDisplayText(currentTitle.substring(0, displayText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setTextIndex((textIndex + 1) % titles.length);
      setTypingSpeed(100);
    } else if (!isDeleting && displayText.length === currentTitle.length) {
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
  
  // Enhanced animated background with more elements
  useEffect(() => {
    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Enhanced circuit nodes with more variety
    const circuitNodes = [];
    const nodeCount = Math.min(25, Math.floor(canvas.width / 80));
    
    for (let i = 0; i < nodeCount; i++) {
      circuitNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1.5,
        type: Math.random() > 0.7 ? 'square' : 'circle',
        connections: [],
        pulseRadius: 0,
        pulseOpacity: 0,
        nextPulseTime: Math.random() * 6000 + 3000,
        lastPulseTime: 0,
        glowIntensity: Math.random() * 0.3 + 0.1,
        rotationSpeed: (Math.random() - 0.5) * 0.001,
        rotation: 0
      });
    }
    
    // Create smart connections between nodes
    circuitNodes.forEach((node, i) => {
      const connectionsCount = Math.floor(Math.random() * 3) + 1;
      const distances = circuitNodes.map((otherNode, j) => {
        if (i === j) return { index: j, distance: Infinity };
        const dx = node.x - otherNode.x;
        const dy = node.y - otherNode.y;
        return { index: j, distance: Math.sqrt(dx * dx + dy * dy) };
      });
      
      const sortedDistances = distances.sort((a, b) => a.distance - b.distance);
      
      for (let c = 0; c < connectionsCount && c < sortedDistances.length; c++) {
        if (sortedDistances[c].distance < Math.min(canvas.width, canvas.height) * 0.25) {
          node.connections.push(sortedDistances[c].index);
        }
      }
    });
    
    // Floating geometric shapes
    const geometricShapes = [];
    for (let i = 0; i < 15; i++) {
      geometricShapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10,
        type: ['triangle', 'diamond', 'hexagon'][Math.floor(Math.random() * 3)],
        speed: Math.random() * 0.3 + 0.1,
        direction: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.1 + 0.05,
        rotationSpeed: (Math.random() - 0.5) * 0.002,
        rotation: 0,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
    
    // Code-like floating elements
    const codeElements = [];
    const codeSymbols = ['</', '{}', '[]', '()', '=>', '&&', '||', '++', '--', '!=', '==='];
    for (let i = 0; i < 20; i++) {
      codeElements.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        symbol: codeSymbols[Math.floor(Math.random() * codeSymbols.length)],
        size: Math.random() * 12 + 8,
        speed: Math.random() * 0.2 + 0.05,
        direction: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.15 + 0.05,
        phase: Math.random() * Math.PI * 2
      });
    }
    
    // Data streams
    const dataStreams = [];
    for (let i = 0; i < 8; i++) {
      dataStreams.push({
        x: Math.random() * canvas.width,
        y: -50,
        width: Math.random() * 2 + 1,
        height: Math.random() * 100 + 50,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.1 + 0.05,
        delay: Math.random() * 3000
      });
    }
    
    let lastTime = 0;
    
    function drawShape(ctx, x, y, size, type, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      ctx.beginPath();
      switch (type) {
        case 'triangle':
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(-size / 2, size / 2);
          ctx.lineTo(size / 2, size / 2);
          ctx.closePath();
          break;
        case 'diamond':
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(size / 2, 0);
          ctx.lineTo(0, size / 2);
          ctx.lineTo(-size / 2, 0);
          ctx.closePath();
          break;
        case 'hexagon':
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const px = Math.cos(angle) * size / 2;
            const py = Math.sin(angle) * size / 2;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          break;
      }
      
      ctx.restore();
    }
    
    function draw(currentTime) {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Clear canvas with subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(0.5, '#FEFEFE');
      gradient.addColorStop(1, '#FDFDFD');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Enhanced grid system
      ctx.strokeStyle = 'rgba(22, 163, 74, 0.15)';
      ctx.lineWidth = 0.8;
      const gridSize = 60;
      const offsetX = (currentTime * 0.01) % gridSize;
      const offsetY = (currentTime * 0.005) % gridSize;
      
      // Animated grid lines
      for (let x = -gridSize + offsetX; x <= canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = -gridSize + offsetY; y <= canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw data streams
      dataStreams.forEach(stream => {
        if (currentTime > stream.delay) {
          stream.y += stream.speed;
          
          if (stream.y > canvas.height + stream.height) {
            stream.y = -stream.height;
            stream.x = Math.random() * canvas.width;
          }
          
          // Create flowing data effect
          const streamGradient = ctx.createLinearGradient(0, stream.y, 0, stream.y + stream.height);
          streamGradient.addColorStop(0, 'rgba(22, 163, 74, 0)');
          streamGradient.addColorStop(0.5, `rgba(22, 163, 74, ${stream.opacity * 3})`);
          streamGradient.addColorStop(1, 'rgba(22, 163, 74, 0)');
          
          ctx.fillStyle = streamGradient;
          ctx.fillRect(stream.x, stream.y, stream.width, stream.height);
        }
      });
      
      // Draw enhanced circuit connections with energy flow
      ctx.lineWidth = 1;
      circuitNodes.forEach((node, i) => {
        node.connections.forEach(connectionIndex => {
          const connectedNode = circuitNodes[connectionIndex];
          
          // Calculate energy flow
          const flowOffset = (currentTime * 0.002) % 1;
          const distance = Math.sqrt(
            Math.pow(connectedNode.x - node.x, 2) + 
            Math.pow(connectedNode.y - node.y, 2)
          );
          
          // Draw main connection
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          
          const connectionGradient = ctx.createLinearGradient(
            node.x, node.y, connectedNode.x, connectedNode.y
          );
          
          const pulsing = node.pulseOpacity > 0 || connectedNode.pulseOpacity > 0;
          const baseOpacity = pulsing ? 0.2 : 0.1;
          
          connectionGradient.addColorStop(0, `rgba(22, 163, 74, ${baseOpacity})`);
          connectionGradient.addColorStop(0.5, `rgba(22, 163, 74, ${baseOpacity * 1.5})`);
          connectionGradient.addColorStop(1, `rgba(22, 163, 74, ${baseOpacity})`);
          
          ctx.strokeStyle = connectionGradient;
          ctx.stroke();
          
          // Draw energy packets
          if (Math.random() > 0.992) {
            const packetX = node.x + (connectedNode.x - node.x) * flowOffset;
            const packetY = node.y + (connectedNode.y - node.y) * flowOffset;
            
            ctx.beginPath();
            ctx.arc(packetX, packetY, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(22, 163, 74, 0.8)';
            ctx.fill();
            
            // Add glow effect
            ctx.shadowColor = 'rgba(22, 163, 74, 0.6)';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(22, 163, 74, 1)';
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });
      
      // Update and draw enhanced circuit nodes
      circuitNodes.forEach(node => {
        node.rotation += node.rotationSpeed;
        
        // Pulse system
        if (deltaTime && currentTime - node.lastPulseTime > node.nextPulseTime) {
          node.pulseRadius = 0;
          node.pulseOpacity = 0.5;
          node.lastPulseTime = currentTime;
          node.nextPulseTime = Math.random() * 6000 + 4000;
        }
        
        if (node.pulseOpacity > 0) {
          node.pulseRadius += deltaTime * 0.04;
          node.pulseOpacity -= deltaTime * 0.0004;
          
          if (node.pulseOpacity <= 0) {
            node.pulseOpacity = 0;
          }
          
          // Draw pulse effect
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(22, 163, 74, ${node.pulseOpacity * 0.3})`;
          ctx.fill();
          
          // Draw outer pulse ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.pulseRadius * 1.5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(22, 163, 74, ${node.pulseOpacity * 0.25})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        // Draw main node with glow
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(node.rotation);
        
        // Enhanced glow effect
        ctx.shadowColor = 'rgba(22, 163, 74, 0.6)';
        ctx.shadowBlur = 15;
        
        if (node.type === 'square') {
          ctx.fillStyle = `rgba(22, 163, 74, ${0.5 + node.glowIntensity})`;
          ctx.fillRect(-node.size / 2, -node.size / 2, node.size, node.size);
          
          // Inner square
          ctx.fillStyle = 'rgba(22, 163, 74, 0.8)';
          ctx.fillRect(-node.size / 4, -node.size / 4, node.size / 2, node.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, node.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(22, 163, 74, ${0.5 + node.glowIntensity})`;
          ctx.fill();
          
          // Inner circle
          ctx.beginPath();
          ctx.arc(0, 0, node.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(22, 163, 74, 0.8)';
          ctx.fill();
        }
        
        ctx.restore();
      });
      
      // Draw floating geometric shapes
      geometricShapes.forEach(shape => {
        shape.x += Math.cos(shape.direction) * shape.speed;
        shape.y += Math.sin(shape.direction) * shape.speed;
        shape.rotation += shape.rotationSpeed;
        
        // Wrap around edges with buffer
        const buffer = 50;
        if (shape.x < -buffer) shape.x = canvas.width + buffer;
        if (shape.x > canvas.width + buffer) shape.x = -buffer;
        if (shape.y < -buffer) shape.y = canvas.height + buffer;
        if (shape.y > canvas.height + buffer) shape.y = -buffer;
        
        // Pulsing opacity
        const pulseOpacity = shape.opacity * 2 * (1 + 0.5 * Math.sin(currentTime * 0.001 + shape.pulsePhase));
        
        ctx.strokeStyle = `rgba(22, 163, 74, ${pulseOpacity})`;
        ctx.lineWidth = 1.5;
        drawShape(ctx, shape.x, shape.y, shape.size, shape.type, shape.rotation);
        ctx.stroke();
      });
      
      // Draw floating code elements
      codeElements.forEach(element => {
        element.x += Math.cos(element.direction) * element.speed;
        element.y += Math.sin(element.direction) * element.speed;
        
        // Wrap around
        if (element.x < -50) element.x = canvas.width + 50;
        if (element.x > canvas.width + 50) element.x = -50;
        if (element.y < -50) element.y = canvas.height + 50;
        if (element.y > canvas.height + 50) element.y = -50;
        
        // Floating animation
        const floatY = element.y + Math.sin(currentTime * 0.001 + element.phase) * 10;
        const fadeOpacity = element.opacity * 2.5 * (1 + 0.8 * Math.sin(currentTime * 0.002 + element.phase));
        
        ctx.font = `${element.size}px 'Courier New', monospace`;
        ctx.fillStyle = `rgba(22, 163, 74, ${fadeOpacity})`;
        ctx.textAlign = 'center';
        ctx.fillText(element.symbol, element.x, floatY);
      });
      
      requestAnimationFrame(draw);
    }
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    requestAnimationFrame(draw);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate parallax effects
  const contentScale = Math.max(0.95, 1 - (scrollY * 0.0005));
  const contentY = scrollY * -0.2;
  
  return (
    <section
      id="hero"
      className="h-screen flex items-center justify-center relative overflow-hidden bg-white"
    >
      {/* Enhanced mouse interaction effect */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: isMouseInside
            ? `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(22, 163, 74, 0.2), rgba(22, 163, 74, 0.1) 40%, transparent 70%)`
            : 'transparent',
          transition: 'background 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      
      {/* Advanced animated background */}
      <canvas 
        ref={backgroundCanvasRef} 
        className="absolute inset-0 z-0"
      />

      {/* Floating elements overlay */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          >
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Main content with enhanced parallax */}
      <div
        style={{ 
          transform: `scale(${contentScale}) translateY(${contentY}px)`,
          transition: 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className="container relative z-20 max-w-4xl mx-auto px-4"
      >
        <div
          className={`relative overflow-hidden bg-white/85 backdrop-blur-md rounded-3xl border border-gray-200/50 shadow-2xl p-8 md:p-12 transition-all duration-700 ${
            mounted ? 'animate-fadeInScale' : 'opacity-0 scale-95'
          }`}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 50px rgba(22, 163, 74, 0.03)'
          }}
        >
          {/* Enhanced decorative elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Animated corner brackets */}
            <div className="absolute top-0 left-0 w-16 h-16 opacity-40">
              <div className="absolute top-4 left-0 w-10 h-0.5 bg-green-600 animate-slideInLeft"></div>
              <div className="absolute top-0 left-4 w-0.5 h-10 bg-green-600 animate-slideInDown"></div>
              <div className="absolute top-8 left-4 w-1 h-1 rounded-full bg-green-600 animate-ping"></div>
            </div>
            
            <div className="absolute top-0 right-0 w-16 h-16 opacity-40">
              <div className="absolute top-4 right-0 w-10 h-0.5 bg-green-600 animate-slideInRight"></div>
              <div className="absolute top-0 right-4 w-0.5 h-10 bg-green-600 animate-slideInDown"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-16 h-16 opacity-40">
              <div className="absolute bottom-4 left-0 w-10 h-0.5 bg-green-600 animate-slideInLeft"></div>
              <div className="absolute bottom-0 left-4 w-0.5 h-10 bg-green-600 animate-slideInUp"></div>
            </div>
            
            <div className="absolute bottom-0 right-0 w-20 h-20 opacity-40">
              <div className="absolute bottom-6 right-0 w-14 h-0.5 bg-green-600 animate-slideInRight"></div>
              <div className="absolute bottom-0 right-6 w-0.5 h-14 bg-green-600 animate-slideInUp"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border border-green-600/40 rounded-sm animate-spin-slow"></div>
            </div>
            
            {/* Floating elements */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${6 + i * 0.3}s`
                }}
              >
                <div className="w-1 h-1 bg-green-600 rounded-full"></div>
              </div>
            ))}
          </div>
          
          {/* Enhanced accent lighting */}
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-green-600/10 to-blue-600/5 blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-green-600/10 to-purple-600/5 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          
          <div className="text-center relative z-10">
            {/* Enhanced name presentation */}
            <div className="relative">
              <div
                className={`relative inline-block ${
                  mounted ? 'animate-slideInUp' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: '200ms' }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-800 relative">
                  Tuan Khang Phan
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 blur-xl opacity-50 animate-pulse-slow"></div>
                </h1>
              </div>

              {/* Animated underline with particles */}
              <div className="max-w-xs mx-auto mt-2 relative">
                <div
                  className={`h-0.5 w-full bg-gradient-to-r from-green-600/30 via-green-600/80 to-green-600/30 relative ${
                    mounted ? 'animate-expandWidth' : 'w-0 opacity-0'
                  }`}
                  style={{ animationDelay: '600ms' }}
                >
                  <div className="absolute left-0 top-0 w-2 h-2 bg-green-600 rounded-full -translate-y-0.5 animate-slideRight"></div>
                  <div className="absolute right-0 top-0 w-2 h-2 bg-green-600 rounded-full -translate-y-0.5 animate-slideLeft"></div>
                </div>
              </div>
            </div>

            {/* Enhanced typing effect */}
            <div className="h-16 mt-8 flex items-center justify-center">
              <h2 className="text-xl md:text-3xl font-light text-gray-700 relative">
                <span className="opacity-60 animate-pulse">{`< `}</span>
                <span className="relative">
                  {displayText}
                  <span className="absolute -top-1 -right-1 w-1 h-1 bg-green-600 rounded-full animate-ping"></span>
                </span>
                <span className="animate-blink text-green-600 font-bold">|</span>
                <span className="opacity-60 animate-pulse">{` />`}</span>
              </h2>
            </div>

            {/* Enhanced action buttons */}
            <div className="mt-12">
              <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                <ActionButton 
                  href="mailto:khang18@usf.edu"
                  icon={<Mail className="mr-2" size={18} />}
                  text="Contact Me"
                  variant="primary"
                />
                
                <ActionButton 
                  href="https://github.com/khangpt2k6"
                  icon={<Github className="mr-2" size={18} />}
                  text="View Projects"
                  variant="secondary"
                />
              </div>

              {/* Enhanced social links */}
              <div 
                className={`mt-10 flex justify-center space-x-6 ${
                  mounted ? 'animate-fadeInUp' : 'opacity-0 translate-y-5'
                }`}
                style={{ animationDelay: '1000ms' }}
              >
                <SocialButton
                  href="https://linkedin.com/in/tuankhangphan"
                  icon={<Linkedin size={20} />}
                  label="LinkedIn"
                />
                <SocialButton
                  href="https://leetcode.com/u/KHcqTUn9ld/"
                  icon={<Code size={20} />}
                  label="LeetCode"
                />
                <SocialButton
                  href="https://github.com/khangpt2k6"
                  icon={<Github size={20} />}
                  label="GitHub"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 ${
          mounted ? 'animate-fadeInBounce' : 'opacity-0'
        }`}
        style={{ animationDelay: '1500ms' }}
      >
        <div className="text-gray-600 flex flex-col items-center animate-bounce-slow">
          <span className="text-sm font-light mb-2 text-gray-500 animate-pulse">Scroll Down</span>
          <div className="relative">
            <ArrowDown size={18} />
            <div className="absolute inset-0 animate-ping">
              <ArrowDown size={18} className="opacity-30" />
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 100%;
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            width: 0;
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            width: 100%;
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInDown {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            height: 100%;
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          from {
            height: 0;
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            height: 100%;
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expandWidth {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 100%;
            opacity: 1;
          }
        }

        @keyframes slideRight {
          from {
            transform: translateX(-100%) translateY(-50%);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
        }

        @keyframes slideLeft {
          from {
            transform: translateX(100%) translateY(-50%);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInBounce {
          from {
            opacity: 0;
            transform: translateY(30px) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slideInDown {
          animation: slideInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-expandWidth {
          animation: expandWidth 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slideRight {
          animation: slideRight 1s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards;
        }

        .animate-slideLeft {
          animation: slideLeft 1s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-fadeInBounce {
          animation: fadeInBounce 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </section>
  );
};

// Enhanced action button component with micro-interactions
const ActionButton = ({ href, icon, text, variant }) => {
  const baseClasses = "group relative px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg overflow-hidden transform-gpu";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-2xl hover:shadow-green-600/25",
    secondary: "bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white hover:border-green-600/50 hover:shadow-2xl hover:shadow-green-600/10 hover:text-green-700"
  };
  
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      {/* Content */}
      <span className="relative z-10 flex items-center">
        <span className="transform group-hover:scale-110 transition-transform duration-200">
          {icon}
        </span>
        <span className="group-hover:tracking-wide transition-all duration-200">
          {text}
        </span>
      </span>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-white/30 transform scale-0 group-active:scale-100 transition-transform duration-150"></div>
    </a>
  );
};

// Enhanced social button component with hover animations
const SocialButton = ({ href, icon, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 hover:text-green-600 hover:bg-green-50 hover:border-green-600/30 transition-all duration-300 hover:scale-110 active:scale-90 shadow-lg hover:shadow-xl overflow-hidden"
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-green-600/10 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
      
      {/* Icon with animation */}
      <span className="relative z-10 transform group-hover:rotate-12 transition-transform duration-200">
        {icon}
      </span>
      
      {/* Pulse effect on hover */}
      <div className="absolute inset-0 rounded-full border-2 border-green-600/30 transform scale-100 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
    </a>
  );
};

export default Hero;