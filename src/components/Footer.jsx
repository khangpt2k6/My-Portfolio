import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import FadeInView from "./FadeInView";
import footerData from "../data/footer";

const socialIconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  email: Mail,
};

const socialColorMap = {
  github: null, // handled dynamically for dark/light mode
  linkedin: "#0A66C2",
  email: null,
};

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect dark mode by observing the .dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const getIconColor = (type) => {
    if (type === "github") {
      return isDark ? "#fff" : "#333";
    }
    return socialColorMap[type] || undefined;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[var(--color-surface2)] dark:bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Three-column grid */}
        <FadeInView direction="up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left column — Branding & Socials */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                {footerData.name}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                {footerData.tagline}
              </p>
              <div className="flex items-center gap-3">
                {footerData.socialLinks.map((link, index) => {
                  const Icon = socialIconMap[link.type];
                  const color = getIconColor(link.type);
                  return (
                    <a
                      key={index}
                      href={link.href}
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={
                        link.href.startsWith("mailto:")
                          ? undefined
                          : "noopener noreferrer"
                      }
                      aria-label={link.label}
                      className="group w-10 h-10 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] backdrop-blur-xl flex items-center justify-center transition-colors duration-300 hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)]"
                    >
                      {Icon && (
                        <Icon
                          size={18}
                          style={color ? { color } : undefined}
                          className={
                            color
                              ? "transition-colors duration-300 group-hover:!text-white"
                              : "text-[var(--color-text-muted)] transition-colors duration-300 group-hover:text-white"
                          }
                        />
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Center column — Overview nav */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
                Overview
              </h3>
              <nav className="flex flex-col gap-2">
                {footerData.navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right column — Contact + Back-to-top */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-[var(--color-primary)] shrink-0" />
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {footerData.contact.email}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-[var(--color-primary)] shrink-0" />
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {footerData.contact.phone}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={16} className="text-[var(--color-primary)] shrink-0" />
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {footerData.contact.location}
                  </span>
                </li>
              </ul>

              {/* Back-to-top button */}
              <AnimatePresence>
                {showTopBtn && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <button
                      onClick={scrollToTop}
                      className="inline-flex cursor-pointer"
                      aria-label="Back to top"
                    >
                      <div className="w-10 h-10 glass backdrop-blur-xl rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center transition-shadow duration-300 hover:shadow-lg">
                        <ArrowUp size={18} />
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </FadeInView>

        {/* Bottom bar */}
        <div className="mt-12 pt-6">
          <div className="flex justify-center items-center">
            <span className="text-sm text-[var(--color-text-muted)]">
              &copy; {currentYear} {footerData.copyright}. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
