import { useState, useEffect } from "react";
import { Mail, Github, Linkedin, FileText, Sparkles } from "lucide-react";

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const titles = ["Full-Stack Developer", "UI/UX Designer", "Software Engineer", "AI Engineer"];
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const bioText = "I'm Khang, a Computer Science student at USF who lives off coffee, code, and curiosity. I love turning random ideas into full-stack projects, tinkering with AI, and seeing things actually work after hours of debugging (best feeling ever). I'm always chasing new challenges that make me learn, build, and maybe break a few things along the way";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const currentTitle = titles[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting && displayText.length < currentTitle.length) {
        setDisplayText(currentTitle.substring(0, displayText.length + 1));
      } else if (isDeleting && displayText.length > 0) {
        setDisplayText(currentTitle.substring(0, displayText.length - 1));
      } else if (!isDeleting && displayText.length === currentTitle.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText.length === 0) {
        setIsDeleting(false);
        setTextIndex((textIndex + 1) % titles.length);
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, titles]);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-white py-24 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          
          {/* Left column - Profile */}
          <div className={`flex flex-col items-center lg:items-start transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Profile Image with enhanced styling */}
            <div className="relative w-72 h-72 mb-10 group">
              {/* Animated gradient border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 rounded-full opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition duration-500"></div>
              
              {/* Image container */}
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/anh.jpg?height=1000&width=800"
                  alt="Tuan Khang Phan"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-100 rounded-full -z-10 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-50 rounded-full -z-10"></div>
            </div>

            {/* Name with stylish design */}
            <div className="text-center lg:text-left mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-600 tracking-wider uppercase">Hello, I'm</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 mb-2 tracking-tight">
                Khang
              </h1>
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tracking-tight">
                Phan
              </h1>
            </div>
            
            {/* Typing effect with improved styling */}
            <div className="h-16 flex items-center justify-center lg:justify-start mb-10 w-full">
              <div className="text-xl lg:text-2xl font-medium text-neutral-700 flex items-center gap-2">
                <span className="text-green-600 text-2xl font-bold">&lt;</span>
                <span className="min-w-[280px]">{displayText}</span>
                <span className="animate-pulse text-green-600 font-bold">|</span>
                <span className="text-green-600 text-2xl font-bold">/&gt;</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-6 w-full max-w-md mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">4+</div>
                <div className="text-sm text-neutral-600">Roles</div>
              </div>
              <div className="text-center border-x border-neutral-200">
                <div className="text-3xl font-bold text-green-600 mb-1">∞</div>
                <div className="text-sm text-neutral-600">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">24/7</div>
                <div className="text-sm text-neutral-600">Learning</div>
              </div>
            </div>
          </div>

          {/* Right column - Bio & Contact */}
          <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Biography section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-green-600 to-emerald-600"></div>
                <h3 className="text-3xl font-bold text-neutral-900 tracking-tight">
                  Biography
                </h3>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl transform rotate-1"></div>
                <div className="relative bg-white p-8 rounded-2xl border-2 border-neutral-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <p className="text-neutral-700 leading-relaxed text-lg">
                    {bioText}
                  </p>
                  
                  {/* Decorative quote mark */}
                  <div className="absolute top-4 right-6 text-6xl text-green-100 font-serif">"</div>
                </div>
              </div>
            </div>

            {/* Contact & Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Mail, text: "Contact Me", href: "mailto:khang18@usf.edu", color: "from-blue-500 to-blue-600" },
                { icon: Github, text: "View Projects", href: "https://github.com/khangpt2k6", color: "from-neutral-700 to-neutral-900" },
                { icon: Linkedin, text: "LinkedIn", href: "https://linkedin.com/in/tuankhangphan", color: "from-blue-600 to-blue-700" },
                { icon: FileText, text: "Resume", href: "https://leetcode.com/u/KHcqTUn9ld/", color: "from-green-600 to-emerald-600" },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group relative p-5 rounded-xl flex items-center bg-white border-2 border-neutral-100 hover:border-transparent hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Hover gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  {/* Content */}
                  <div className="relative flex items-center w-full">
                    <div className="p-3 rounded-lg bg-neutral-50 group-hover:bg-white/20 mr-4 transition-colors duration-300">
                      <item.icon className="w-5 h-5 text-neutral-700 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="font-semibold text-neutral-800 group-hover:text-white transition-colors duration-300">
                      {item.text}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;