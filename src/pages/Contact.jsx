"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ArrowUpRight,
} from "lucide-react";
import AnimatedHeading from "../components/ui/AnimatedHeading";

const WEB3FORMS_KEY = "YOUR_ACCESS_KEY_HERE";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "khang18@usf.edu",
    href: "mailto:khang18@usf.edu",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "813-570-4370",
    href: "tel:8135704370",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Tampa, Florida",
    href: null,
  },
];

const socials = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/khangpt2k6",
    color: "#333",
    darkColor: "#fff",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/kvphan27",
    color: "#0A66C2",
    darkColor: "#0A66C2",
  },
];

/* ── Animated info card ── */
const InfoCard = ({ icon: Icon, label, value, href, index }) => {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--glow-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    ref.current.style.setProperty("--glow-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group glass-card glow-on-hover rounded-xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-300"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
        style={{
          backgroundColor: "rgba(var(--color-primary-rgb), 0.1)",
        }}
      >
        <Icon
          size={20}
          className="text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-[var(--color-text)] truncate group-hover:text-[var(--color-primary)] transition-colors duration-300">
          {value}
        </p>
      </div>
      {href && (
        <ArrowUpRight
          size={16}
          className="ml-auto text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--color-primary)] transition-all duration-300 flex-shrink-0"
        />
      )}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("mailto:") || href.startsWith("tel:") ? undefined : "_blank"} rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return content;
};

/* ── Main Contact Section ── */
const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const formRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!formRef.current) return;
    const rect = formRef.current.getBoundingClientRect();
    formRef.current.style.setProperty("--glow-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    formRef.current.style.setProperty("--glow-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: name || "Anonymous",
          email: email || "no-reply@portfolio.com",
          message,
          subject: `Portfolio Message from ${name || "a visitor"}`,
          from_name: "Portfolio Contact Form",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setTimeout(() => { setStatus("idle"); setName(""); setEmail(""); setMessage(""); }, 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const inputClass =
    "w-full px-4 py-3 text-sm rounded-xl bg-[var(--color-surface2)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-300";

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 px-4 bg-[var(--color-surface)] dark:bg-transparent overflow-hidden"
    >
      {/* Decorative gradient orbs */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, rgb(var(--color-primary-rgb)), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, rgb(var(--color-secondary-rgb)), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <AnimatedHeading>Get In Touch</AnimatedHeading>
        </div>

        <motion.p
          className="text-center text-[var(--color-text-muted)] text-sm md:text-base max-w-lg mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Have a project in mind or want to chat? Drop me a message and I'll get back to you.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* ── Left side: Form ── */}
          <motion.div
            ref={formRef}
            onMouseMove={handleMouseMove}
            className="lg:col-span-3 glass-card glow-on-hover animated-border rounded-2xl p-6 md:p-8"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 gap-3"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                >
                  <CheckCircle className="w-14 h-14 text-emerald-500" />
                </motion.div>
                <p className="text-lg font-bold text-[var(--color-text)]">Message Sent!</p>
                <p className="text-sm text-[var(--color-text-muted)]">I'll get back to you soon.</p>
              </motion.div>
            ) : status === "error" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 gap-3"
              >
                <AlertCircle className="w-14 h-14 text-red-500" />
                <p className="text-lg font-bold text-[var(--color-text)]">Failed to Send</p>
                <p className="text-sm text-[var(--color-text-muted)]">Please try again or email me directly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSend} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell me about your project..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className={`${inputClass} resize-none`}
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={!message.trim() || status === "sending"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))",
                    boxShadow: "0 4px 20px rgba(var(--color-primary-rgb), 0.3)",
                  }}
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* ── Right side: Info + Socials ── */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-4"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {contactInfo.map((info, i) => (
              <InfoCard key={info.label} {...info} index={i} />
            ))}

            {/* Social links */}
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
                Find me on
              </p>
              <div className="flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="group w-11 h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface2)] flex items-center justify-center transition-all duration-300 hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:-translate-y-1 hover:shadow-lg"
                    style={{ "--hover-shadow": `0 8px 24px rgba(var(--color-primary-rgb), 0.3)` }}
                  >
                    <s.icon
                      size={18}
                      className="text-[var(--color-text-muted)] transition-colors duration-300 group-hover:text-white"
                    />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
