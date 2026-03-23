import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import about from "../data/about";

const socialConfig = {
  Github: { Icon: FaGithub, color: "#6e5494", label: "GitHub" },
  Linkedin: { Icon: FaLinkedin, color: "#0A66C2", label: "LinkedIn" },
  Mail: { Icon: FaEnvelope, color: "#EA4335", label: "Email" },
};

const ProfileImage = () => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative w-full aspect-[3/4]">
      <motion.div
        className="absolute -inset-4 rounded-2xl pointer-events-none"
        style={{
          background: "conic-gradient(from 180deg, rgba(var(--color-primary-rgb),0.15), rgba(var(--color-secondary-rgb),0.08), rgba(var(--color-primary-rgb),0.15))",
          filter: "blur(30px)",
        }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative rounded-2xl overflow-hidden h-full cursor-pointer"
        style={{ perspective: 800 }}
        onClick={() => setFlipped((f) => !f)}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={about.image} alt="Khang Phan"
            className="absolute inset-0 z-[1] w-full h-full object-cover object-top rounded-2xl"
            style={{ backfaceVisibility: "hidden" }} />
          <img src="/notion_avatar.png" alt="Khang Phan — Avatar"
            className="absolute inset-0 z-[1] w-full h-full object-cover object-center rounded-2xl bg-[var(--color-surface)]"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} />
        </motion.div>
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl
                        bg-black/0 hover:bg-black/30 opacity-0 hover:opacity-100 transition-all duration-300">
          <span className="text-xs font-medium text-white">Click to flip</span>
        </div>
      </motion.div>
    </div>
  );
};

export default function AboutApp() {
  return (
    <div className="p-0">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Left — Image */}
        <div className="p-5 md:p-6">
          <ProfileImage />
        </div>

        {/* Right — Content */}
        <div className="p-5 md:p-6 flex flex-col justify-center md:border-l border-[var(--glass-border)]">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text)] leading-tight mb-4">
            {about.greeting}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6">
            {about.bio}
          </p>

          <div className="h-px mb-5" style={{
            background: "linear-gradient(90deg, var(--color-primary), rgba(var(--color-secondary-rgb),0.3), transparent)"
          }} />

          <div className="flex flex-col gap-3 mb-6">
            {about.details.map((item) => (
              <div key={item.label} className="flex items-baseline gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] w-16 shrink-0">
                  {item.label}
                </span>
                <span className="text-sm text-[var(--color-text)] font-medium">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {about.socialLinks.map((link) => {
              const config = socialConfig[link.type];
              if (!config) return null;
              const { Icon, color, label } = config;
              return (
                <a key={label} href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="group relative">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg
                                  border border-[var(--glass-border)] bg-[var(--color-surface)]
                                  hover:shadow-lg transition-all"
                    onMouseEnter={(e) => { e.currentTarget.style.background = color; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}>
                    <Icon className="w-3.5 h-3.5 group-hover:!text-white transition-colors" style={{ color }} />
                    <span className="text-xs font-semibold group-hover:!text-white transition-colors" style={{ color }}>
                      {label}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
