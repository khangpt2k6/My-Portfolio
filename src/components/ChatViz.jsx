import { useState, useEffect, useRef, useCallback } from "react";

/**
 * ChatViz — Matches the real Zelo app design:
 * Dark theme with PURPLE accents (#8B5CF6), purple sidebar tint,
 * purple message bubbles for "You", violet active states.
 */

const CONTACTS = [
  { name: "Juniper Hall", avatar: "JH", color: "#8B5CF6", status: "online", preview: "hi everyone 👋" },
  { name: "Alex Chen", avatar: "AC", color: "#06B6D4", status: "online", preview: "sounds good!" },
  { name: "Evin Park", avatar: "EP", color: "#EC4899", status: "away", preview: "see you later" },
  { name: "Peter Liu", avatar: "PL", color: "#F59E0B", status: "offline", preview: "nice work 🎉" },
];

const MESSAGES = [
  { sender: "Juniper Hall", avatar: "JH", color: "#8B5CF6", text: "hi everyone 👋", time: "10:42 AM", self: false },
  { sender: "You", avatar: "KP", color: "#7C3AED", text: "Hey! What's up?", time: "10:42 AM", self: true },
  { sender: "Alex Chen", avatar: "AC", color: "#06B6D4", text: "Working on the new feature", time: "10:43 AM", self: false },
  { sender: "You", avatar: "KP", color: "#7C3AED", text: "Nice, need any help? 🚀", time: "10:43 AM", self: true },
  { sender: "Juniper Hall", avatar: "JH", color: "#8B5CF6", text: "Let's sync at 3pm", time: "10:44 AM", self: false },
  { sender: "Alex Chen", avatar: "AC", color: "#06B6D4", text: "sounds good!", time: "10:44 AM", self: false },
];

const statusColor = { online: "#22C55E", away: "#F59E0B", offline: "#6B7280" };

const ChatViz = () => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [typing, setTyping] = useState(null);
  const [activeContact, setActiveContact] = useState(0);
  const chatRef = useRef(null);
  const mountedRef = useRef(true);
  const timeoutRef = useRef(null);

  const clearAllTimeouts = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const runChatLoop = () => {
      if (!mountedRef.current) return;
      setVisibleMessages([]);
      setTyping(null);
      setActiveContact(0);

      let step = 0;

      const nextStep = () => {
        if (!mountedRef.current) return;
        if (step >= MESSAGES.length) {
          timeoutRef.current = setTimeout(() => {
            if (mountedRef.current) runChatLoop();
          }, 3000);
          return;
        }

        const msg = MESSAGES[step];
        setTyping(msg.self ? "You" : msg.sender);

        const contactIdx = CONTACTS.findIndex((c) => c.name === msg.sender);
        if (contactIdx >= 0) setActiveContact(contactIdx);

        timeoutRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          setTyping(null);
          setVisibleMessages((prev) => [...prev, MESSAGES[step]]);
          step++;
          timeoutRef.current = setTimeout(nextStep, 600);
        }, 800);
      };

      timeoutRef.current = setTimeout(nextStep, 500);
    };

    runChatLoop();

    return () => {
      mountedRef.current = false;
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleMessages, typing]);

  return (
    <div className="w-full h-full flex overflow-hidden select-none" style={{ fontSize: "10px", background: "#0F0F1A" }}>
      {/* Sidebar — purple tint matching Zelo */}
      <div className="flex flex-col w-[90px] shrink-0 border-r border-white/[0.06]" style={{ background: "rgba(139,92,246,0.06)" }}>
        {/* Sidebar header */}
        <div className="flex items-center gap-1.5 px-2 py-2 border-b border-white/[0.06]">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{ background: "#7C3AED" }}>
            KP
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-semibold text-white/90 truncate">Khang</span>
            <span className="text-[6px] text-green-400">Active</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-2 py-1.5">
          <div className="h-4 rounded bg-white/[0.05] flex items-center px-1.5">
            <svg width="7" height="7" viewBox="0 0 12 12" fill="none" className="shrink-0 opacity-40">
              <circle cx="5" cy="5" r="4" stroke="white" strokeWidth="1.5" />
              <line x1="8" y1="8" x2="11" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[6px] text-white/30 ml-1">Search</span>
          </div>
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-hidden">
          {CONTACTS.map((contact, i) => (
            <div
              key={contact.name}
              className="flex items-center gap-1.5 px-2 py-1.5 transition-colors duration-300"
              style={{
                background: activeContact === i ? "rgba(139,92,246,0.12)" : "transparent",
                borderLeft: activeContact === i ? "2px solid #8B5CF6" : "2px solid transparent",
              }}
            >
              <div className="relative shrink-0">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[6px] font-bold text-white"
                  style={{ background: contact.color }}
                >
                  {contact.avatar}
                </div>
                <div
                  className="absolute -bottom-px -right-px w-[5px] h-[5px] rounded-full border border-[#0F0F1A]"
                  style={{ background: statusColor[contact.status] }}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[7px] font-medium text-white/80 truncate">{contact.name.split(" ")[0]}</span>
                <span className="text-[6px] text-white/30 truncate">{contact.preview}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[6px] font-bold text-white" style={{ background: "#8B5CF6" }}>
            JH
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-semibold text-white/90">Juniper Hall</span>
            <span className="text-[6px] text-white/40">4 members • 2 online</span>
          </div>
          <div className="ml-auto flex gap-1.5">
            <div className="w-4 h-4 rounded-full bg-white/[0.05] flex items-center justify-center">
              <svg width="7" height="7" viewBox="0 0 12 12" fill="none">
                <path d="M1 4h10M1 8h10" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
              </svg>
            </div>
            <div className="w-4 h-4 rounded-full bg-white/[0.05] flex items-center justify-center">
              <svg width="7" height="7" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="3" r="1" fill="white" opacity="0.4" />
                <circle cx="6" cy="6" r="1" fill="white" opacity="0.4" />
                <circle cx="6" cy="9" r="1" fill="white" opacity="0.4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-hidden px-2 py-2 space-y-1.5" style={{ background: "rgba(0,0,0,0.2)" }}>
          {visibleMessages.map((msg, i) => (
            <div
              key={i}
              className="flex gap-1.5 animate-fadeIn"
              style={{
                justifyContent: msg.self ? "flex-end" : "flex-start",
                animationDuration: "0.3s",
              }}
            >
              {!msg.self && (
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[5px] font-bold text-white shrink-0 mt-auto"
                  style={{ background: msg.color }}
                >
                  {msg.avatar}
                </div>
              )}
              <div
                className="max-w-[70%] px-2 py-1 rounded-lg"
                style={{
                  background: msg.self
                    ? "linear-gradient(135deg, #7C3AED, #8B5CF6)"
                    : "rgba(255,255,255,0.06)",
                  borderBottomRightRadius: msg.self ? "2px" : undefined,
                  borderBottomLeftRadius: !msg.self ? "2px" : undefined,
                }}
              >
                {!msg.self && (
                  <span className="text-[6px] font-semibold block mb-0.5" style={{ color: msg.color }}>
                    {msg.sender}
                  </span>
                )}
                <span className="text-[7px] text-white/90 leading-tight block">{msg.text}</span>
                <span className="text-[5px] text-white/30 block text-right mt-0.5">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex items-center gap-1.5 animate-fadeIn" style={{ animationDuration: "0.2s" }}>
              <div className="px-2 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="flex gap-[3px] items-center h-2">
                  <span className="text-[6px] text-white/40 mr-1">{typing === "You" ? "You" : typing.split(" ")[0]}</span>
                  {[0, 1, 2].map((dot) => (
                    <div
                      key={dot}
                      className="w-[3px] h-[3px] rounded-full bg-white/40"
                      style={{
                        animation: "chatDotBounce 1.2s ease-in-out infinite",
                        animationDelay: `${dot * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="px-2 py-1.5 border-t border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-1.5 h-5 rounded-full px-2" style={{ background: "rgba(255,255,255,0.05)" }}>
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1" opacity="0.3" />
              <line x1="6" y1="3.5" x2="6" y2="8.5" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
              <line x1="3.5" y1="6" x2="8.5" y2="6" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
            </svg>
            <span className="text-[7px] text-white/20 flex-1">Type a message...</span>
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
              <path d="M1 6l10-4.5L7.5 6l3.5 4.5L1 6z" fill="#8B5CF6" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes chatDotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-2px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default ChatViz;
