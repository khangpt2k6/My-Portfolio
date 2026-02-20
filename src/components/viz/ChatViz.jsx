import { useState, useEffect, useRef, useCallback } from "react";

/**
 * ChatViz — Premium CampusConnect chat with floating gradient orbs,
 * glassmorphism, neon-glow message bubbles, and animated typing.
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

const statusDot = { online: "#4ADE80", away: "#FBBF24", offline: "#6B7280" };

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
  }, [clearAllTimeouts, addTimeout]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [visibleMessages, typing]);

  return (
    <div className="w-full h-full flex overflow-hidden select-none" style={{
      fontSize: "10px",
      background: "linear-gradient(160deg, #0C0118 0%, #150928 50%, #0D0420 100%)",
      position: "relative",
    }}>
      {/* ── Floating gradient orbs ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", width: "160px", height: "160px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)",
          top: "-40px", right: "-30px", animation: "chatOrb1 10s ease-in-out infinite",
          filter: "blur(20px)",
        }} />
        <div style={{
          position: "absolute", width: "120px", height: "120px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)",
          bottom: "-20px", left: "-20px", animation: "chatOrb2 12s ease-in-out infinite",
          filter: "blur(16px)",
        }} />
        <div style={{
          position: "absolute", width: "80px", height: "80px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217,70,239,0.1) 0%, transparent 70%)",
          top: "40%", left: "30%", animation: "chatOrb1 14s ease-in-out infinite reverse",
          filter: "blur(12px)",
        }} />
      </div>

      {/* ── Sidebar — glass panel ── */}
      <div className="flex flex-col w-[90px] shrink-0 relative z-10" style={{
        background: "rgba(168,85,247,0.04)",
        borderRight: "1px solid rgba(168,85,247,0.08)",
        backdropFilter: "blur(16px)",
      }}>
        <div className="flex items-center gap-1.5 px-2 py-2" style={{ borderBottom: "1px solid rgba(168,85,247,0.06)" }}>
          <div className="relative">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{
              background: "linear-gradient(135deg, #A855F7, #EC4899)",
              boxShadow: "0 0 10px rgba(168,85,247,0.4)",
            }}>KP</div>
            <div className="absolute -bottom-px -right-px w-[5px] h-[5px] rounded-full" style={{
              background: "#4ADE80", border: "1px solid #0C0118",
              boxShadow: "0 0 4px rgba(74,222,128,0.6)",
            }} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-semibold truncate" style={{ color: "#F0ABFC" }}>Kevin</span>
            <span className="text-[6px]" style={{ color: "#4ADE80" }}>Active</span>
          </div>
        </div>

        <div className="px-2 py-1.5">
          <div className="h-4 rounded-lg flex items-center px-1.5" style={{
            background: "rgba(168,85,247,0.06)",
            border: "0.5px solid rgba(168,85,247,0.1)",
          }}>
            <svg width="7" height="7" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="4" stroke="#D8B4FE" strokeWidth="1.2" opacity="0.3" /><line x1="8" y1="8" x2="11" y2="11" stroke="#D8B4FE" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" /></svg>
            <span className="text-[6px] ml-1" style={{ color: "rgba(216,180,254,0.25)" }}>Search</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {CONTACTS.map((contact, i) => {
            const isActive = activeContact === i;
            return (
              <div key={contact.name} className="flex items-center gap-1.5 px-2 py-1.5 transition-all duration-300" style={{
                background: isActive ? "rgba(168,85,247,0.1)" : "transparent",
                borderLeft: isActive ? "2px solid #D946EF" : "2px solid transparent",
                boxShadow: isActive ? "inset 0 0 20px rgba(168,85,247,0.05)" : "none",
              }}>
                <div className="relative shrink-0">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[6px] font-bold text-white" style={{
                    background: contact.color,
                    boxShadow: isActive ? `0 0 8px ${contact.color}40` : "none",
                  }}>{contact.avatar}</div>
                  <div className="absolute -bottom-px -right-px w-[5px] h-[5px] rounded-full" style={{
                    background: statusDot[contact.status],
                    border: "1px solid #0C0118",
                    boxShadow: contact.status === "online" ? `0 0 4px ${statusDot[contact.status]}80` : "none",
                  }} />
                  {/* Online pulse ring */}
                  {contact.status === "online" && isActive && (
                    <div className="absolute -bottom-px -right-px w-[5px] h-[5px] rounded-full" style={{
                      background: statusDot[contact.status],
                      animation: "chatPing 2s ease-out infinite",
                    }} />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[7px] font-medium truncate" style={{ color: isActive ? "#F0ABFC" : "#E9D5FF" }}>{contact.name.split(" ")[0]}</span>
                  <span className="text-[6px] truncate" style={{ color: "rgba(216,180,254,0.3)" }}>{contact.preview}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Chat header - glass */}
        <div className="flex items-center gap-1.5 px-3 py-2" style={{
          background: "rgba(168,85,247,0.03)",
          borderBottom: "1px solid rgba(168,85,247,0.06)",
          backdropFilter: "blur(12px)",
        }}>
          <div className="relative">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[6px] font-bold text-white" style={{
              background: "#A855F7",
              boxShadow: "0 0 8px rgba(168,85,247,0.4)",
            }}>JH</div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-semibold" style={{ color: "#F0ABFC" }}>Juniper Hall</span>
            <span className="text-[6px]" style={{ color: "rgba(216,180,254,0.35)" }}>4 members · 2 online</span>
          </div>
          <div className="ml-auto flex gap-1">
            {[
              <><circle cx="3" cy="6" r="1" fill="#D8B4FE" opacity="0.4" /><circle cx="6" cy="6" r="1" fill="#D8B4FE" opacity="0.4" /><circle cx="9" cy="6" r="1" fill="#D8B4FE" opacity="0.4" /></>,
              <><path d="M2 3l4 3-4 3V3z" fill="#D8B4FE" opacity="0.4" /><path d="M7 3l4 3-4 3V3z" fill="#D8B4FE" opacity="0.25" /></>,
            ].map((icon, i) => (
              <div key={i} className="w-4 h-4 rounded-full flex items-center justify-center" style={{
                background: "rgba(168,85,247,0.06)",
                border: "0.5px solid rgba(168,85,247,0.08)",
              }}>
                <svg width="7" height="7" viewBox="0 0 12 12" fill="none">{icon}</svg>
              </div>
            ))}
          </div>
        </div>

        {/* ── Messages ── */}
        <div ref={chatRef} className="flex-1 overflow-hidden px-2 py-2 space-y-1.5">
          {visibleMessages.map((msg, i) => {
            if (!msg) return null;
            return (
              <div key={i} className="flex gap-1.5" style={{
                justifyContent: msg.self ? "flex-end" : "flex-start",
                animation: "chatMsgIn 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}>
                {!msg.self && (
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[5px] font-bold text-white shrink-0 mt-auto" style={{
                    background: msg.color,
                    boxShadow: `0 0 6px ${msg.color}30`,
                  }}>{msg.avatar}</div>
                )}
                <div className="max-w-[70%] px-2 py-1 rounded-xl relative overflow-hidden" style={{
                  background: msg.self
                    ? "linear-gradient(135deg, #9333EA, #EC4899)"
                    : "rgba(168,85,247,0.08)",
                  border: msg.self ? "none" : "0.5px solid rgba(168,85,247,0.1)",
                  borderBottomRightRadius: msg.self ? "3px" : undefined,
                  borderBottomLeftRadius: !msg.self ? "3px" : undefined,
                  boxShadow: msg.self
                    ? "0 2px 12px rgba(147,51,234,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                    : "0 1px 4px rgba(0,0,0,0.1)",
                }}>
                  {/* Shimmer on self messages */}
                  {msg.self && (
                    <div style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)",
                    }} />
                  )}
                  {!msg.self && <span className="text-[6px] font-semibold block mb-0.5 relative z-10" style={{ color: msg.color }}>{msg.sender}</span>}
                  <span className="text-[7px] leading-tight block relative z-10" style={{ color: msg.self ? "#FFF" : "#E9D5FF" }}>{msg.text}</span>
                  <span className="text-[5px] block text-right mt-0.5 relative z-10" style={{ color: msg.self ? "rgba(255,255,255,0.45)" : "rgba(216,180,254,0.25)" }}>{msg.time}</span>
                </div>
              </div>
            );
          })}
          {typing && (
            <div className="flex items-center gap-1.5" style={{ animation: "chatMsgIn 0.3s ease-out" }}>
              <div className="px-2 py-1.5 rounded-xl" style={{
                background: "rgba(168,85,247,0.08)",
                border: "0.5px solid rgba(168,85,247,0.1)",
              }}>
                <div className="flex gap-[3px] items-center h-2">
                  <span className="text-[6px] mr-1" style={{ color: "rgba(216,180,254,0.35)" }}>{typing === "You" ? "You" : typing.split(" ")[0]}</span>
                  {[0, 1, 2].map((dot) => (
                    <div key={dot} className="w-[3px] h-[3px] rounded-full" style={{
                      background: "#D946EF",
                      boxShadow: "0 0 4px rgba(217,70,239,0.4)",
                      animation: `chatDot 1.2s ease-in-out infinite ${dot * 0.15}s`,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Input — glass with animated gradient border ── */}
        <div className="px-2 py-1.5 relative z-10" style={{
          background: "rgba(168,85,247,0.02)",
          borderTop: "1px solid rgba(168,85,247,0.06)",
        }}>
          <div className="relative rounded-full" style={{ padding: "1px", background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2), rgba(168,85,247,0.2))", backgroundSize: "200% 200%", animation: "chatBorderShift 4s ease infinite" }}>
            <div className="flex items-center gap-1.5 h-5 rounded-full px-2" style={{
              background: "rgba(12,1,24,0.9)",
            }}>
              <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="#D8B4FE" strokeWidth="1" opacity="0.2" />
                <line x1="6" y1="3.5" x2="6" y2="8.5" stroke="#D8B4FE" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
                <line x1="3.5" y1="6" x2="8.5" y2="6" stroke="#D8B4FE" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
              </svg>
              <span className="text-[7px] flex-1" style={{ color: "rgba(216,180,254,0.2)" }}>Type a message...</span>
              <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                <path d="M1 6l10-4.5L7.5 6l3.5 4.5L1 6z" fill="#D946EF" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes chatOrb1 { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(15px,-15px) scale(1.2); } 66% { transform: translate(-8px,10px) scale(0.9); } }
        @keyframes chatOrb2 { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(-12px,12px) scale(1.1); } 66% { transform: translate(10px,-8px) scale(1.15); } }
        @keyframes chatDot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.3; } 30% { transform: translateY(-3px); opacity: 1; } }
        @keyframes chatPing { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(3.5); opacity: 0; } }
        @keyframes chatMsgIn { from { opacity: 0; transform: translateY(6px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes chatBorderShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>
    </div>
  );
};

export default ChatViz;
