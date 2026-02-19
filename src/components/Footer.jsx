import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowUp, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { Link } from "react-scroll";
import footerData from "../data/footer";

const socialIconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  email: FaEnvelope,
};

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);
  const currentYear = new Date().getFullYear();

  // Generate particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 25; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speedX + 100) % 100,
        y: (particle.y + particle.speedY + 100) % 100,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

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
    <footer className="relative bg-white dark:bg-neutral-900 text-gray-800 dark:text-neutral-200 py-16 overflow-hidden transition-colors">
      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-green-600 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              transform: `scale(${particle.size})`,
              transition: 'all 0.05s linear',
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">

          {/* Personal Branding Section */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {footerData.name}
              </h2>
              <div className="w-12 h-1 bg-green-600 mb-4"></div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {footerData.socialLinks.map((link, index) => {
                const IconComponent = socialIconMap[link.type];
                return (
                  <a
                    key={index}
                    href={link.href}
                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="group relative"
                    aria-label={link.label}
                  >
                    <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:border-green-600 group-hover:shadow-lg group-hover:-translate-y-1">
                      {IconComponent && <IconComponent className="text-gray-700 group-hover:text-green-600 transition-colors duration-300" size={18} />}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Get In Touch
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="text-green-600" size={14} />
                  </div>
                  <span className="text-sm">{footerData.contact.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaPhone className="text-green-600" size={14} />
                  </div>
                  <span className="text-sm">{footerData.contact.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt className="text-green-600" size={14} />
                  </div>
                  <span className="text-sm">{footerData.contact.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Overview
              </h3>
              <div className="space-y-2">
                {footerData.navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    smooth={true}
                    duration={500}
                    className="block text-neutral-600 dark:text-neutral-300 hover:text-green-600 transition-colors duration-300 cursor-pointer text-sm py-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Back to Top Button */}
            <div
              className={`transition-opacity duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Link
                to="hero"
                smooth={true}
                duration={500}
                className="cursor-pointer inline-flex"
              >
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                  <FaArrowUp size={12} />
                  <span className="text-sm font-medium">Back to Top</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              &copy; {currentYear} {footerData.copyright}. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-neutral-500 dark:text-neutral-400">
              <span>{footerData.tagline}</span>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
