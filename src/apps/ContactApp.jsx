import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  Github,
  Linkedin,
  Paperclip,
  Type,
} from "lucide-react";

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

export default function ContactApp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
    const obs = new MutationObserver(() => setIsDark(root.classList.contains("dark")));
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const handleSend = async () => {
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
          subject: subject || `Portfolio Message from ${name || "a visitor"}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setTimeout(() => {
          setStatus("idle");
          setName("");
          setEmail("");
          setSubject("");
          setMessage("");
        }, 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const div = isDark ? "#3a3a3c" : "#e5e5ea";
  const label = isDark ? "#98989d" : "#8e8e93";
  const text = isDark ? "#f5f5f7" : "#1d1d1f";
  const bg = isDark ? "#2c2c2e" : "#ffffff";
  const toolbar = isDark ? "#1c1c1e" : "#f5f5f7";
  const inputPlaceholder = isDark ? "#636366" : "#aeaeb2";

  return (
    <div className="h-full flex flex-col" style={{ background: bg }}>
      {/* ── Toolbar ── */}
      <div
        className="flex items-center px-3 py-1.5 shrink-0 gap-2"
        style={{ background: toolbar, borderBottom: `0.5px solid ${div}` }}
      >
        <motion.button
          onClick={handleSend}
          disabled={!message.trim() || status === "sending"}
          whileTap={{ scale: 0.92 }}
          className="flex items-center justify-center w-7 h-7 rounded-md disabled:opacity-30 cursor-pointer transition-opacity"
          style={{ background: "var(--color-primary)" }}
          title="Send"
        >
          {status === "sending" ? (
            <Loader2 size={14} className="animate-spin text-white" />
          ) : (
            <Send size={14} className="text-white" style={{ transform: "translateX(1px)" }} />
          )}
        </motion.button>

        <div className="w-px h-4 mx-0.5" style={{ background: div }} />

        <button className="p-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10 cursor-default" title="Attach">
          <Paperclip size={14} style={{ color: label }} />
        </button>
        <button className="p-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10 cursor-default" title="Format">
          <Type size={14} style={{ color: label }} />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-0.5">
          <a
            href="https://github.com/khangpt2k6"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Github size={13} style={{ color: label }} />
          </a>
          <a
            href="https://linkedin.com/in/kvphan27"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Linkedin size={13} style={{ color: label }} />
          </a>
        </div>
      </div>

      {/* ── Mail fields ── */}
      <div className="shrink-0">
        <div
          className="flex items-center px-3 py-2"
          style={{ borderBottom: `0.5px solid ${div}` }}
        >
          <span className="text-[12px] font-medium w-16 shrink-0" style={{ color: label }}>
            To:
          </span>
          <div
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium"
            style={{
              background: isDark ? "rgba(10,132,255,0.15)" : "rgba(0,122,255,0.08)",
              color: "var(--color-primary)",
            }}
          >
            Khang Phan
          </div>
          <span className="text-[11px] ml-1.5" style={{ color: label }}>
            &lt;khang18@usf.edu&gt;
          </span>
        </div>

        <div
          className="flex items-center px-3 py-2 gap-2"
          style={{ borderBottom: `0.5px solid ${div}` }}
        >
          <span className="text-[12px] font-medium w-16 shrink-0" style={{ color: label }}>
            From:
          </span>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-[12px] bg-transparent outline-none min-w-0"
            style={{ color: text, flex: "0 1 120px", "::placeholder": { color: inputPlaceholder } }}
          />
          <span className="text-[11px]" style={{ color: label }}>&lt;</span>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-[12px] bg-transparent outline-none flex-1 min-w-0"
            style={{ color: text }}
          />
          <span className="text-[11px]" style={{ color: label }}>&gt;</span>
        </div>

        <div
          className="flex items-center px-3 py-2"
          style={{ borderBottom: `0.5px solid ${div}` }}
        >
          <span className="text-[12px] font-medium w-16 shrink-0" style={{ color: label }}>
            Subject:
          </span>
          <input
            type="text"
            placeholder="Portfolio Message"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="text-[12px] bg-transparent outline-none flex-1"
            style={{ color: text }}
          />
        </div>
      </div>

      {/* ── Compose body ── */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            >
              <CheckCircle className="w-10 h-10 text-emerald-500" />
              <p className="text-sm font-bold" style={{ color: text }}>
                Message Sent!
              </p>
              <p className="text-[11px]" style={{ color: label }}>
                Thanks for reaching out
              </p>
            </motion.div>
          ) : status === "error" ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            >
              <AlertCircle className="w-10 h-10 text-red-500" />
              <p className="text-sm font-bold" style={{ color: text }}>
                Failed to Send
              </p>
              <p className="text-[11px]" style={{ color: label }}>
                Please try again later
              </p>
            </motion.div>
          ) : (
            <motion.textarea
              key="compose"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-full p-3 text-[12px] leading-relaxed bg-transparent outline-none resize-none"
              style={{ color: text }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div
        className="flex items-center gap-3 px-3 py-2 shrink-0"
        style={{ borderTop: `0.5px solid ${div}`, background: toolbar }}
      >
        <a
          href="mailto:khang18@usf.edu"
          className="flex items-center gap-1.5 text-[10px] font-medium transition-opacity hover:opacity-70"
          style={{ color: label }}
        >
          <Mail size={11} style={{ color: "var(--color-primary)" }} />
          khang18@usf.edu
        </a>
        <a
          href="tel:8135704370"
          className="flex items-center gap-1.5 text-[10px] font-medium transition-opacity hover:opacity-70"
          style={{ color: label }}
        >
          <Phone size={11} style={{ color: "var(--color-primary)" }} />
          813-570-4370
        </a>
      </div>
    </div>
  );
}
