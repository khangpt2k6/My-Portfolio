import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowUp } from "react-icons/fa";
import { Link } from "react-scroll";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const currentYear = new Date().getFullYear();

  // Controls scroll button visibility
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <footer className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white py-12">
      {/* Semi-transparent divider */}
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left section */}
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Tuan Khang Phan</h2>
            <p className="text-emerald-200 mb-6">
              Computer Science Student
            </p>
            <div className="flex space-x-5 justify-center md:justify-start">
              <a
                href="https://github.com/khangpt2k6"
                target="_blank"
                rel="noopener noreferrer"
                className="transform transition-transform hover:-translate-y-1 duration-300"
                aria-label="GitHub Profile"
              >
                <div className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300">
                  <FaGithub size={20} />
                </div>
              </a>
              <a
                href="https://linkedin.com/in/tuankhangphan"
                target="_blank"
                rel="noopener noreferrer"
                className="transform transition-transform hover:-translate-y-1 duration-300"
                aria-label="LinkedIn Profile"
              >
                <div className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300">
                  <FaLinkedin size={20} />
                </div>
              </a>
              <a
                href="mailto:khang18@usf.edu"
                className="transform transition-transform hover:-translate-y-1 duration-300"
                aria-label="Email Contact"
              >
                <div className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300">
                  <FaEnvelope size={20} />
                </div>
              </a>
            </div>
          </div>

          {/* Right section */}
          <div className="text-center md:text-right">
            <div className="mb-4">
              <p className="mb-2 text-emerald-100">Contact Information</p>
              <p className="text-sm text-emerald-200">Phone: 813-570-4370</p>
              <p className="text-sm text-emerald-200">Email: khang18@usf.edu</p>
            </div>
            
            <div 
              className={`flex justify-center md:justify-end transition-opacity duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Link
                to="hero"
                smooth={true}
                duration={500}
                className="cursor-pointer inline-flex"
              >
                <div className="flex items-center gap-2 text-sm text-emerald-300 hover:text-white transition-colors duration-300">
                  <span>Back to top</span>
                  <FaArrowUp size={14} />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-sm text-emerald-200/70">
          <p>&copy; {currentYear} Tuan Khang Phan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;