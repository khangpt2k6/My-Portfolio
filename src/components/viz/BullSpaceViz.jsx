import { useState, useEffect, useRef, useCallback } from "react";

/**
 * BullSpaceViz — Premium dark-emerald glass campus booking visualization.
 * Features: animated mesh background, glassmorphism cards, glow effects,
 * dramatic booking animations with pulse rings & shimmer.
 */

const ROOMS = [
  { id: "301A", building: "Library", floor: "3rd Floor", capacity: 4, status: "available" },
  { id: "205B", building: "Marshall Center", floor: "2nd Floor", capacity: 6, status: "available" },
  { id: "412C", building: "Engineering", floor: "4th Floor", capacity: 2, status: "booked" },
  { id: "108D", building: "Library", floor: "1st Floor", capacity: 8, status: "available" },
];

const BullSpaceViz = () => {
  const [rooms, setRooms] = useState(ROOMS);
  const [bookingId, setBookingId] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const [activeUsers] = useState(23);
  const mountedRef = useRef(true);
  const timeoutsRef = useRef([]);

  const addTimeout = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const runLoop = () => {
      if (!mountedRef.current) return;
      setRooms(ROOMS);
      setBookingId(null);
      setConfirmed(null);

      addTimeout(() => {
        if (!mountedRef.current) return;
        setBookingId("301A");
        addTimeout(() => {
          if (!mountedRef.current) return;
          setBookingId(null);
          setConfirmed("301A");
          setRooms((prev) => prev.map((r) => (r.id === "301A" ? { ...r, status: "booked" } : r)));
          addTimeout(() => {
            if (!mountedRef.current) return;
            setConfirmed(null);
            setBookingId("205B");
            addTimeout(() => {
              if (!mountedRef.current) return;
              setBookingId(null);
              setConfirmed("205B");
              setRooms((prev) => prev.map((r) => (r.id === "205B" ? { ...r, status: "booked" } : r)));
              addTimeout(() => { if (mountedRef.current) runLoop(); }, 2500);
            }, 1200);
          }, 1800);
        }, 1200);
      }, 1400);
    };
    runLoop();
    return () => { mountedRef.current = false; clearAll(); };
  }, [addTimeout, clearAll]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden select-none" style={{
      background: "linear-gradient(170deg, #071A14 0%, #0A2018 50%, #061510 100%)",
      fontFamily: "inherit",
      position: "relative",
    }}>
      {/* ── Animated gradient mesh background ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", width: "140px", height: "140px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,214,127,0.15) 0%, transparent 70%)",
          top: "-30px", right: "-20px", animation: "bsMesh1 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: "100px", height: "100px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
          bottom: "30px", left: "-20px", animation: "bsMesh2 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: "80px", height: "80px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,214,127,0.06) 0%, transparent 70%)",
          top: "50%", left: "50%", animation: "bsMesh1 12s ease-in-out infinite reverse",
        }} />
      </div>

      {/* ── Glass Header ── */}
      <div className="flex items-center gap-1.5 px-3 py-2 shrink-0 relative z-10" style={{
        background: "rgba(0,214,127,0.03)",
        borderBottom: "1px solid rgba(0,214,127,0.08)",
        backdropFilter: "blur(12px)",
      }}>
        <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{
          background: "linear-gradient(135deg, #00D67F, #006747)",
          boxShadow: "0 0 12px rgba(0,214,127,0.4)",
        }}>
          <svg width="8" height="8" viewBox="0 0 14 14" fill="none">
            <path d="M2 12V5l5-3.5L12 5v7" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="5" y="8" width="4" height="4" stroke="white" strokeWidth="1" fill="none" rx="0.5" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold" style={{ fontSize: "8px", color: "#E0FFF0" }}>BullSpace</span>
          <span style={{ fontSize: "5px", color: "rgba(0,214,127,0.4)" }}>Campus Rooms</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Active users */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md" style={{
            background: "rgba(0,214,127,0.06)",
            border: "0.5px solid rgba(0,214,127,0.1)",
          }}>
            <div className="flex -space-x-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-[8px] h-[8px] rounded-full" style={{
                  background: `hsl(${155 + i * 15}, 70%, ${55 - i * 10}%)`,
                  border: "0.5px solid rgba(0,20,14,0.5)",
                }} />
              ))}
            </div>
            <span style={{ fontSize: "5px", color: "rgba(0,214,127,0.6)" }}>{activeUsers}</span>
          </div>
          {/* Live pulse */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{
            background: "rgba(0,214,127,0.08)",
            border: "0.5px solid rgba(0,214,127,0.15)",
          }}>
            <div className="relative">
              <div className="w-[4px] h-[4px] rounded-full" style={{ background: "#00D67F", boxShadow: "0 0 6px rgba(0,214,127,0.8)" }} />
              <div className="absolute inset-0 w-[4px] h-[4px] rounded-full" style={{ background: "#00D67F", animation: "bsPing 2s ease-out infinite" }} />
            </div>
            <span style={{ fontSize: "5px", color: "#00D67F", fontWeight: 600 }}>Live</span>
          </div>
        </div>
      </div>

      {/* ── Search bar - glass ── */}
      <div className="px-2 py-1.5 shrink-0 relative z-10">
        <div className="flex items-center gap-1 h-5 rounded-lg px-2" style={{
          background: "rgba(0,214,127,0.04)",
          border: "1px solid rgba(0,214,127,0.08)",
          backdropFilter: "blur(8px)",
        }}>
          <svg width="7" height="7" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="4" stroke="rgba(0,214,127,0.4)" strokeWidth="1.2" />
            <line x1="8" y1="8" x2="11" y2="11" stroke="rgba(0,214,127,0.4)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "6px", color: "rgba(0,214,127,0.25)" }}>Search buildings...</span>
          <div className="ml-auto flex items-center gap-0.5">
            <div className="w-[3px] h-[3px] rounded-full" style={{ background: "#00D67F", opacity: 0.4 }} />
            <span style={{ fontSize: "4.5px", color: "rgba(0,214,127,0.3)" }}>4 available</span>
          </div>
        </div>
      </div>

      {/* ── Room cards - glass morphism ── */}
      <div className="flex-1 overflow-hidden px-2 py-1 space-y-1.5 relative z-10">
        {rooms.map((room) => {
          const isBooking = bookingId === room.id;
          const isConfirmed = confirmed === room.id;
          const isAvailable = room.status === "available";

          return (
            <div
              key={room.id}
              className="rounded-xl px-2.5 py-2 relative overflow-hidden"
              style={{
                background: isConfirmed
                  ? "rgba(0,214,127,0.1)"
                  : isBooking
                    ? "rgba(250,204,21,0.06)"
                    : "rgba(0,214,127,0.03)",
                border: isConfirmed
                  ? "1px solid rgba(0,214,127,0.4)"
                  : isBooking
                    ? "1px solid rgba(250,204,21,0.3)"
                    : "1px solid rgba(0,214,127,0.06)",
                backdropFilter: "blur(8px)",
                boxShadow: isConfirmed
                  ? "0 0 24px rgba(0,214,127,0.2), inset 0 0 24px rgba(0,214,127,0.05)"
                  : isBooking
                    ? "0 0 20px rgba(250,204,21,0.1), inset 0 0 12px rgba(250,204,21,0.03)"
                    : "0 1px 4px rgba(0,0,0,0.1)",
                transform: isBooking ? "scale(1.02)" : "scale(1)",
                transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* Shimmer overlay for booking state */}
              {isBooking && (
                <div style={{
                  position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
                  borderRadius: "inherit",
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: "-100%", width: "50%", height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(250,204,21,0.08), transparent)",
                    animation: "bsShimmer 1.5s ease-in-out infinite",
                  }} />
                </div>
              )}
              {/* Glow burst for confirmed */}
              {isConfirmed && (
                <div style={{
                  position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
                  borderRadius: "inherit",
                }}>
                  <div style={{
                    position: "absolute", top: "50%", left: "50%", width: "100%", height: "100%",
                    transform: "translate(-50%, -50%)",
                    background: "radial-gradient(circle, rgba(0,214,127,0.15) 0%, transparent 70%)",
                    animation: "bsBurst 0.8s ease-out",
                  }} />
                </div>
              )}

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{
                    background: isAvailable ? "rgba(0,214,127,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isAvailable ? "rgba(0,214,127,0.2)" : "rgba(255,255,255,0.05)"}`,
                    boxShadow: isAvailable ? "0 0 8px rgba(0,214,127,0.1)" : "none",
                  }}>
                    <svg width="8" height="8" viewBox="0 0 14 14" fill="none">
                      <path d="M2 12V5l5-3.5L12 5v7" stroke={isAvailable ? "#00D67F" : "rgba(255,255,255,0.15)"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="5" y="8" width="4" height="4" stroke={isAvailable ? "#00D67F" : "rgba(255,255,255,0.15)"} strokeWidth="1" fill="none" rx="0.5" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold block" style={{ fontSize: "7.5px", color: "#E0FFF0" }}>{room.building}</span>
                    <div className="flex items-center gap-1">
                      <span style={{ fontSize: "5px", color: "rgba(0,214,127,0.35)" }}>{room.floor}</span>
                      <span style={{ fontSize: "5px", color: "rgba(0,214,127,0.15)" }}>·</span>
                      {/* Capacity as mini dots */}
                      <div className="flex items-center gap-[1.5px]">
                        {Array.from({ length: Math.min(room.capacity, 8) }).map((_, i) => (
                          <div key={i} className="w-[2.5px] h-[2.5px] rounded-full" style={{
                            background: isAvailable ? "#00D67F" : "rgba(255,255,255,0.1)",
                            opacity: isAvailable ? 0.6 : 0.3,
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: "4.5px", color: "rgba(0,214,127,0.3)" }}>{room.capacity}</span>
                    </div>
                  </div>
                </div>
                <div>
                  {isConfirmed ? (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{
                      background: "rgba(0,214,127,0.15)",
                      fontSize: "5px", color: "#00D67F", fontWeight: 600,
                      boxShadow: "0 0 10px rgba(0,214,127,0.3)",
                      animation: "bsConfirm 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}>
                      <svg width="5" height="5" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#00D67F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Booked
                    </span>
                  ) : isBooking ? (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{
                      background: "rgba(250,204,21,0.1)",
                      border: "0.5px solid rgba(250,204,21,0.2)",
                      fontSize: "5px", color: "#FACC15", fontWeight: 600,
                    }}>
                      <div className="flex gap-[2px]">
                        {[0,1,2].map(d => (
                          <div key={d} className="w-[2.5px] h-[2.5px] rounded-full" style={{
                            background: "#FACC15",
                            animation: `bsDot 1s ease-in-out ${d * 0.15}s infinite`,
                          }} />
                        ))}
                      </div>
                      Reserving
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-full" style={{
                      background: isAvailable ? "rgba(0,214,127,0.1)" : "rgba(239,68,68,0.1)",
                      fontSize: "5px", fontWeight: 600,
                      color: isAvailable ? "#00D67F" : "#EF4444",
                      boxShadow: isAvailable ? "0 0 6px rgba(0,214,127,0.15)" : "0 0 6px rgba(239,68,68,0.1)",
                    }}>
                      {isAvailable ? "Open" : "In Use"}
                    </span>
                  )}
                </div>
              </div>
              {isAvailable && !isBooking && !isConfirmed && (
                <div className="flex gap-1 mt-1.5">
                  {["9:00 AM", "11:30 AM", "2:00 PM"].map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded-md" style={{
                      background: "rgba(0,214,127,0.04)",
                      fontSize: "4.5px", color: "rgba(0,214,127,0.5)",
                      border: "0.5px solid rgba(0,214,127,0.08)",
                    }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Glass bottom nav ── */}
      <div className="flex items-center justify-around px-2 py-1.5 shrink-0 relative z-10" style={{
        borderTop: "1px solid rgba(0,214,127,0.08)",
        background: "rgba(0,214,127,0.02)",
        backdropFilter: "blur(12px)",
      }}>
        {[
          { label: "Rooms", active: true, icon: <><path d="M3 9l9-6 9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><rect x="5" y="9" width="14" height="11" stroke="currentColor" strokeWidth="2" fill="none" /><rect x="9" y="14" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none" /></> },
          { label: "Bookings", active: false, icon: <><rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="15" r="1.5" fill="currentColor" /></> },
          { label: "Map", active: false, icon: <><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" fill="none" /><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" /></> },
        ].map((tab) => (
          <div key={tab.label} className="flex flex-col items-center gap-0.5 relative">
            {tab.active && (
              <div style={{
                position: "absolute", top: "-6px", width: "16px", height: "2px",
                borderRadius: "1px", background: "#00D67F",
                boxShadow: "0 0 8px rgba(0,214,127,0.5)",
              }} />
            )}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{
              color: tab.active ? "#00D67F" : "rgba(0,214,127,0.2)",
              filter: tab.active ? "drop-shadow(0 0 4px rgba(0,214,127,0.4))" : "none",
            }}>
              {tab.icon}
            </svg>
            <span style={{
              fontSize: "4.5px",
              color: tab.active ? "#00D67F" : "rgba(0,214,127,0.2)",
              fontWeight: tab.active ? 600 : 400,
            }}>{tab.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes bsPing { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(4); opacity: 0; } }
        @keyframes bsConfirm { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes bsDot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-3px); opacity: 1; } }
        @keyframes bsShimmer { 0% { left: -100%; } 100% { left: 200%; } }
        @keyframes bsBurst { from { transform: translate(-50%,-50%) scale(0.3); opacity: 1; } to { transform: translate(-50%,-50%) scale(1.5); opacity: 0; } }
        @keyframes bsMesh1 { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(12px,-12px) scale(1.15); } 66% { transform: translate(-6px,8px) scale(0.9); } }
        @keyframes bsMesh2 { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(-10px,10px) scale(1.1); } 66% { transform: translate(8px,-6px) scale(1.05); } }
      `}</style>
    </div>
  );
};

export default BullSpaceViz;
