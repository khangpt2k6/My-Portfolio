import { useState, useEffect, useRef, useCallback } from "react";

/**
 * ChatViz — Zelo chat with layered pink/purple palette.
 * Many intensities of pink and light purple mixed together.
 */

const CONTACTS = [
  { name: "Juniper Hall", avatar: "JH", color: "#A855F7", status: "online", preview: "hi everyone 👋" },
  { name: "Alex Chen", avatar: "AC", color: "#EC4899", status: "online", preview: "sounds good!" },
  { name: "Evin Park", avatar: "EP", color: "#D946EF", status: "away", preview: "see you later" },
  { name: "Peter Liu", avatar: "PL", color: "#F472B6", status: "offline", preview: "nice work 🎉" },
];

const MESSAGES = [
  { sender: "Juniper Hall", avatar: "JH", color: "#A855F7", text: "hi everyone 👋", time: "10:42 AM", self: false },
  { sender: "You", avatar: "KP", color: "#7C3AED", text: "Hey! What's up?", time: "10:42 AM", self: true },
  { sender: "Alex Chen", avatar: "AC", color: "#EC4899", text: "Working on the new feature", time: "10:43 AM", self: false },
  { sender: "You", avatar: "KP", color: "#7C3AED", text: "Nice, need any help? 🚀", time: "10:43 AM", self: true },
  { sender: "Juniper Hall", avatar: "JH", color: "#A855F7", text: "Let's sync at 3pm", time: "10:44 AM", self: false },
  { sender: "Alex Chen", avatar: "AC", color: "#EC4899", text: "sounds good!", time: "10:44 AM", self: false },
];

const statusDot = { online: "#4ADE80", away: "#FBBF24", offline: "#9CA3AF" };

const ChatViz = () => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [typing, setTyping] = useState(null);
  const [activeContact, setActiveContact] = useState(0);
  const chatRef = useRef(null);
  const mountedRef = useRef(true);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const addTimeout = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
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
          addTimeout(() => { if (mountedRef.current) runChatLoop(); }, 3000);
          return;
        }
        const msg = MESSAGES[step];
        if (!msg) return;
        setTyping(msg.self ? "You" : msg.sender);
        const contactIdx = CONTACTS.findIndex((c) => c.name === msg.sender);
        if (contactIdx >= 0) setActiveContact(contactIdx);
        addTimeout(() => {
          if (!mountedRef.current) return;
          setTyping(null);
          setVisibleMessages((prev) => [...prev, msg]);
          step++;
          addTimeout(nextStep, 600);
        }, 800);
      };
      addTimeout(nextStep, 500);
    };
    runChatLoop();
    return () => { mountedRef.current = false; clearAllTimeouts(); };
  }, [clearAllTimeouts]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [visibleMessages, typing]);

  return (
    <div className="w-full h-full flex overflow-hidden select-none" style={{ fontSize: "10px", background: "#1A0A2E" }}>
      {/* Sidebar — soft purple/pink tint */}
      <div className="flex flex-col w-[90px] shrink-0" style={{ background: "linear-gradient(180deg, rgba(168,85,247,0.08) 0%, rgba(236,72,153,0.06) 100%)", borderRight: "1px solid rgba(168,85,247,0.1)" }}>
        <div className="flex items-center gap-1.5 px-2 py-2" style={{ borderBottom: "1px solid rgba(168,85,247,0.08)" }}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{ background: "linear-gradient(135deg, #A855F7, #EC4899)" }}>KP</div>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-semibold truncate" style={{ color: "#F0ABFC" }}>Khang</span>
            <span className="text-[6px]" style={{ color: "#4ADE80" }}>Active</span>
          </div>
        </div>

        <div className="px-2 py-1.5">
          <div className="h-4 rounded-lg flex items-center px-1.5" style={{ background: "rgba(168,85,247,0.08)", border: "0.5px solid rgba(168,85,247,0.12)" }}>
            <svg width="7" height="7" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="4" stroke="#D8B4FE" strokeWidth="1.2" opacity="0.4" /><line x1="8" y1="8" x2="11" y2="11" stroke="#D8B4FE" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" /></svg>
            <span className="text-[6px] ml-1" style={{ color: "rgba(216,180,254,0.3)" }}>Search</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {CONTACTS.map((contact, i) => (
            <div key={contact.name} className="flex items-center gap-1.5 px-2 py-1.5 transition-colors duration-300" style={{
              background: activeContact === i ? "rgba(168,85,247,0.12)" : "transparent",
              borderLeft: activeContact === i ? "2px solid #D946EF" : "2px solid transparent",
            }}>
              <div className="relative shrink-0">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[6px] font-bold text-white" style={{ background: contact.color }}>{contact.avatar}</div>
                <div className="absolute -bottom-px -right-px w-[5px] h-[5px] rounded-full" style={{ background: statusDot[contact.status], border: "1px solid #1A0A2E" }} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[7px] font-medium truncate" style={{ color: "#E9D5FF" }}>{contact.name.split(" ")[0]}</span>
                <span className="text-[6px] truncate" style={{ color: "rgba(216,180,254,0.35)" }}>{contact.preview}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: "rgba(168,85,247,0.04)", borderBottom: "1px solid rgba(168,85,247,0.08)" }}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[6px] font-bold text-white" style={{ background: "#A855F7" }}>JH</div>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-semibold" style={{ color: "#F0ABFC" }}>Juniper Hall</span>
            <span className="text-[6px]" style={{ color: "rgba(216,180,254,0.4)" }}>4 members · 2 online</span>
          </div>
          <div className="ml-auto flex gap-1">
            <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(168,85,247,0.08)" }}>
              <svg width="7" height="7" viewBox="0 0 12 12" fill="none"><circle cx="3" cy="6" r="1" fill="#D8B4FE" opacity="0.4" /><circle cx="6" cy="6" r="1" fill="#D8B4FE" opacity="0.4" /><circle cx="9" cy="6" r="1" fill="#D8B4FE" opacity="0.4" /></svg>
            </div>
            <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(168,85,247,0.08)" }}>
              <svg width="7" height="7" viewBox="0 0 12 12" fill="none"><path d="M1 3l5 3-5 3V3z" fill="#D8B4FE" opacity="0.4" /><path d="M7 3l5 3-5 3V3z" fill="#D8B4FE" opacity="0.25" /></svg>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-hidden px-2 py-2 space-y-1.5" style={{ background: "linear-gradient(180deg, rgba(26,10,46,1) 0%, rgba(30,10,50,1) 100%)" }}>
          {visibleMessages.map((msg, i) => {
            if (!msg) return null;
            return (
              <div key={i} className="flex gap-1.5 animate-fadeIn" style={{ justifyContent: msg.self ? "flex-end" : "flex-start", animationDuration: "0.3s" }}>
                {!msg.self && (
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[5px] font-bold text-white shrink-0 mt-auto" style={{ background: msg.color }}>{msg.avatar}</div>
                )}
                <div className="max-w-[70%] px-2 py-1 rounded-xl" style={{
                  background: msg.self
                    ? "linear-gradient(135deg, #9333EA, #EC4899)"
                    : "rgba(168,85,247,0.1)",
                  border: msg.self ? "none" : "0.5px solid rgba(168,85,247,0.12)",
                  borderBottomRightRadius: msg.self ? "3px" : undefined,
                  borderBottomLeftRadius: !msg.self ? "3px" : undefined,
                }}>
                  {!msg.self && <span className="text-[6px] font-semibold block mb-0.5" style={{ color: msg.color }}>{msg.sender}</span>}
                  <span className="text-[7px] leading-tight block" style={{ color: msg.self ? "#FFF" : "#E9D5FF" }}>{msg.text}</span>
                  <span className="text-[5px] block text-right mt-0.5" style={{ color: msg.self ? "rgba(255,255,255,0.5)" : "rgba(216,180,254,0.3)" }}>{msg.time}</span>
                </div>
              </div>
            );
          })}
          {typing && (
            <div className="flex items-center gap-1.5 animate-fadeIn" style={{ animationDuration: "0.2s" }}>
              <div className="px-2 py-1.5 rounded-xl" style={{ background: "rgba(168,85,247,0.1)", border: "0.5px solid rgba(168,85,247,0.12)" }}>
                <div className="flex gap-[3px] items-center h-2">
                  <span className="text-[6px] mr-1" style={{ color: "rgba(216,180,254,0.4)" }}>{typing === "You" ? "You" : typing.split(" ")[0]}</span>
                  {[0, 1, 2].map((dot) => (
                    <div key={dot} className="w-[3px] h-[3px] rounded-full" style={{ background: "#D946EF", animation: "zeloDot 1.2s ease-in-out infinite", animationDelay: `${dot * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-2 py-1.5" style={{ background: "rgba(168,85,247,0.03)", borderTop: "1px solid rgba(168,85,247,0.08)" }}>
          <div className="flex items-center gap-1.5 h-5 rounded-full px-2" style={{ background: "rgba(168,85,247,0.06)", border: "0.5px solid rgba(168,85,247,0.1)" }}>
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#D8B4FE" strokeWidth="1" opacity="0.3" />
              <line x1="6" y1="3.5" x2="6" y2="8.5" stroke="#D8B4FE" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
              <line x1="3.5" y1="6" x2="8.5" y2="6" stroke="#D8B4FE" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
            </svg>
            <span className="text-[7px] flex-1" style={{ color: "rgba(216,180,254,0.2)" }}>Type a message...</span>
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
              <path d="M1 6l10-4.5L7.5 6l3.5 4.5L1 6z" fill="#D946EF" opacity="0.5" />
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes zeloDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-2px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ChatViz;
