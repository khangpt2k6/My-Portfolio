import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  Github,
  Linkedin,
  MapPin,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const MY_LOCATION = { lat: 27.9506, lng: -82.4572 };

/* ── Compact map ── */
function MiniMap({ isDark }) {
  const ref = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

    const tile = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    const map = L.map(ref.current, {
      center: [MY_LOCATION.lat, MY_LOCATION.lng],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    });
    mapRef.current = map;

    L.tileLayer(tile, { maxZoom: 18, subdomains: "abcd" }).addTo(map);

    const icon = L.divIcon({
      className: "",
      html: `<div style="position:relative;width:20px;height:20px;">
        <div style="position:absolute;inset:0;border-radius:50%;background:rgb(var(--color-primary-rgb));opacity:0.3;animation:mp 2s ease-in-out infinite;"></div>
        <div style="position:absolute;inset:4px;border-radius:50%;background:rgb(var(--color-primary-rgb));border:2px solid white;"></div>
      </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
    L.marker([MY_LOCATION.lat, MY_LOCATION.lng], { icon }).addTo(map);

    return () => { map.remove(); mapRef.current = null; };
  }, [isDark]);

  return (
    <div className="relative w-full h-full min-h-0 rounded-lg overflow-hidden">
      <div ref={ref} className="absolute inset-0" />
      <style>{`@keyframes mp{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(2);opacity:0}}.leaflet-container{background:transparent!important}`}</style>
    </div>
  );
}

export default function ContactApp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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

  const inputCls =
    "w-full px-3 py-2 text-xs rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-all";

  return (
    <div className="h-full flex flex-col overflow-auto" style={{ background: "var(--window-bg)" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold text-[var(--color-text)]">Get In Touch</h2>
        <p className="text-[10px] text-[var(--color-text-muted)]">
          Send me a message or find me on socials
        </p>
      </div>

      {/* Content: form + map side by side or stacked */}
      <div className="flex-1 flex flex-col min-h-0 px-4 pb-4 gap-3">
        <div className="flex-1 flex gap-3 min-h-0">
          {/* Form */}
          <div className="flex-1 min-w-0">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
                <p className="text-sm font-bold text-[var(--color-text)]">Sent!</p>
              </div>
            ) : status === "error" ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <AlertCircle className="w-10 h-10 text-red-500" />
                <p className="text-sm font-bold text-[var(--color-text)]">Failed</p>
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex flex-col gap-2 h-full">
                <div className="flex gap-2">
                  <input type="text" placeholder="Name" value={name}
                    onChange={(e) => setName(e.target.value)} className={inputCls} />
                  <input type="email" placeholder="Email" value={email}
                    onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </div>
                <textarea
                  placeholder="Your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${inputCls} flex-1 resize-none min-h-[60px]`}
                  required
                />
                <motion.button
                  type="submit"
                  disabled={!message.trim() || status === "sending"}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, rgb(var(--color-primary-rgb)), rgb(var(--color-secondary-rgb)))",
                  }}
                >
                  {status === "sending" ? (
                    <><Loader2 size={12} className="animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={12} /> Send Message</>
                  )}
                </motion.button>
              </form>
            )}
          </div>

          {/* Map */}
          <div className="w-[40%] min-w-[140px] max-w-[240px] rounded-lg overflow-hidden border border-[var(--color-border)] hidden sm:block"
            style={{ minHeight: 140 }}>
            <MiniMap isDark={isDark} />
          </div>
        </div>

        {/* Contact row */}
        <div className="flex gap-2 flex-wrap">
          <a href="mailto:khang18@usf.edu"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border border-[var(--color-border)] hover:bg-[var(--color-primary)]/10 transition-colors"
            style={{ color: "var(--color-text-muted)" }}>
            <Mail size={11} style={{ color: "var(--color-primary)" }} /> khang18@usf.edu
          </a>
          <a href="tel:8135704370"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border border-[var(--color-border)] hover:bg-[var(--color-primary)]/10 transition-colors"
            style={{ color: "var(--color-text-muted)" }}>
            <Phone size={11} style={{ color: "var(--color-primary)" }} /> 813-570-4370
          </a>
          <a href="https://github.com/khangpt2k6" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center w-7 h-7 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-primary)]/10 transition-colors">
            <Github size={12} style={{ color: "var(--color-text-muted)" }} />
          </a>
          <a href="https://linkedin.com/in/kvphan27" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center w-7 h-7 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-primary)]/10 transition-colors">
            <Linkedin size={12} style={{ color: "var(--color-text-muted)" }} />
          </a>
        </div>
      </div>
    </div>
  );
}
