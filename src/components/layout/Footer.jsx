import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail, ArrowUp } from "lucide-react";
import footerData from "../../data/footer";

const socialIconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  email: Mail,
};

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (link, e) => {
    if (link.hash) {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.querySelector(link.hash)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.querySelector(link.hash)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
    const observer = new MutationObserver(() => setIsDark(root.classList.contains("dark")));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-[var(--color-surface2)] dark:bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-3">
        {/* Single compact row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left — copyright */}
          <span className="text-xs text-[var(--color-text-muted)]">
            &copy; {currentYear} {footerData.copyright}
          </span>

          {/* Center — nav links inline */}
          <nav className="flex items-center gap-3">
            {footerData.navLinks.map((link, i) => (
              <Link
                key={i}
                to={link.to}
                onClick={(e) => handleNavClick(link, e)}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right — socials + back-to-top */}
          <div className="flex items-center gap-2">
            {footerData.socialLinks.map((link, i) => {
              const Icon = socialIconMap[link.type];
              return (
                <a
                  key={i}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={link.label}
                  className="w-7 h-7 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors duration-200"
                >
                  {Icon && <Icon size={13} />}
                </a>
              );
            })}

            <AnimatePresence>
              {showTopBtn && (
                <motion.button
                  onClick={scrollToTop}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center hover:shadow-md transition-shadow"
                  aria-label="Back to top"
                >
                  <ArrowUp size={13} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
