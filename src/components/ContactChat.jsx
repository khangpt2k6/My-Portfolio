import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, CheckCircle } from "lucide-react";

const ContactChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const panelRef = useRef(null);
  const btnRef = useRef(null);

  /* ── Close on outside click ── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  /* ── Send via mailto ── */
  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const subject = encodeURIComponent(
      `Portfolio Message${name ? ` from ${name}` : ""}`
    );
    const body = encodeURIComponent(
      [name && `Name: ${name}`, email && `Email: ${email}`, "", message]
        .filter(Boolean)
        .join("\n")
    );
    window.open(`mailto:khang18@usf.edu?subject=${subject}&body=${body}`, "_self");

    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName("");
      setEmail("");
      setMessage("");
    }, 3000);
  };

  const inputClass =
    "w-full px-3 py-2 text-sm rounded-lg bg-[var(--color-surface2)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors";

  return (
    <>
      {/* ── Floating contact button ── */}
      <motion.button
        ref={btnRef}
        onClick={() => setIsOpen((p) => !p)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-shadow duration-300"
        style={{
          background:
            "linear-gradient(135deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))",
          boxShadow: isOpen
            ? "0 0 20px rgba(var(--color-primary-rgb), 0.5)"
            : "0 4px 12px rgba(0,0,0,0.2)",
        }}
        aria-label="Contact me"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <X size={20} />
            </motion.span>
          ) : (
            <motion.span
              key="msg"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <MessageCircle size={20} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] glass-card backdrop-blur-2xl rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}
          >
            {/* ── Header ── */}
            <div
              className="relative px-5 py-4"
              style={{
                background:
                  "linear-gradient(135deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))",
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10">
                <h3 className="text-base font-bold text-white">
                  Let's Connect
                </h3>
                <p className="text-xs text-white/70 mt-0.5">
                  Send me a message — I'll get back to you!
                </p>
              </div>
            </div>

            {/* ── Form / Success ── */}
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="px-5 py-10 flex flex-col items-center gap-2 text-center"
                >
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    Opening your email client...
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Complete sending from there!
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSend}
                  className="p-4 space-y-3"
                >
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                  <textarea
                    placeholder="Write your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    required
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background:
                        "linear-gradient(135deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))",
                    }}
                    onMouseEnter={(e) => {
                      if (message.trim()) e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    <Send size={14} />
                    Send Message
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ContactChat;
