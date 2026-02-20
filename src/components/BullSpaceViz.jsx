import { useState, useEffect, useRef, useCallback } from "react";

/**
 * BullSpaceViz — Clean white mobile UI with USF green + rare gold accents.
 * Looks like a real polished iOS room-booking app.
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
            }, 1000);
          }, 1800);
        }, 1000);
      }, 1200);
    };
    runLoop();
    return () => { mountedRef.current = false; clearAll(); };
  }, [addTimeout, clearAll]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden select-none" style={{ background: "#FFFFFF", fontFamily: "inherit" }}>
      {/* Header — white with green accent */}
      <div className="flex items-center gap-1.5 px-3 py-2 shrink-0" style={{ borderBottom: "1px solid #F1F5F9" }}>
        <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#006747" }}>
          <span className="font-bold text-white" style={{ fontSize: "6px" }}>BS</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold" style={{ fontSize: "8px", color: "#0F172A" }}>BullSpace</span>
          <span style={{ fontSize: "5px", color: "#94A3B8" }}>Campus Rooms</span>
        </div>
        <div className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: "#F0FDF4" }}>
          <div className="w-[4px] h-[4px] rounded-full" style={{ background: "#006747" }} />
          <span style={{ fontSize: "5px", color: "#006747", fontWeight: 600 }}>Live</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-2 py-1.5 shrink-0">
        <div className="flex items-center gap-1 h-5 rounded-lg px-2" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
          <svg width="7" height="7" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="4" stroke="#94A3B8" strokeWidth="1.2" />
            <line x1="8" y1="8" x2="11" y2="11" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "6px", color: "#CBD5E1" }}>Search buildings...</span>
        </div>
      </div>

      {/* Room cards */}
      <div className="flex-1 overflow-hidden px-2 py-1 space-y-1.5">
        {rooms.map((room) => {
          const isBooking = bookingId === room.id;
          const isConfirmed = confirmed === room.id;
          const isAvailable = room.status === "available";

          return (
            <div
              key={room.id}
              className="rounded-xl px-2.5 py-2 transition-all duration-400"
              style={{
                background: isConfirmed ? "#F0FDF4" : isBooking ? "#FFFBEB" : "#FFFFFF",
                border: isConfirmed ? "1px solid #BBF7D0" : isBooking ? "1px solid #FDE68A" : "1px solid #F1F5F9",
                boxShadow: isBooking ? "0 2px 8px rgba(207,196,147,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
                transform: isBooking ? "scale(1.01)" : "scale(1)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <span className="font-bold" style={{ fontSize: "5px", color: "#006747" }}>{room.id}</span>
                  </div>
                  <div>
                    <span className="font-semibold block" style={{ fontSize: "7.5px", color: "#0F172A" }}>{room.building}</span>
                    <span style={{ fontSize: "5px", color: "#94A3B8" }}>{room.floor} · {room.capacity} seats</span>
                  </div>
                </div>
                <div>
                  {isConfirmed ? (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{ background: "#DCFCE7", fontSize: "5px", color: "#006747", fontWeight: 600, animation: "bsConfirm 0.4s ease-out" }}>
                      <svg width="5" height="5" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#006747" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      Booked
                    </span>
                  ) : isBooking ? (
                    <span className="px-1.5 py-0.5 rounded-full" style={{ background: "#FEF3C7", fontSize: "5px", color: "#92400E", fontWeight: 600, animation: "bsPulse 1s ease-in-out infinite" }}>
                      Reserving...
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-full" style={{
                      background: isAvailable ? "#F0FDF4" : "#FEF2F2",
                      fontSize: "5px", fontWeight: 600,
                      color: isAvailable ? "#006747" : "#DC2626",
                    }}>
                      {isAvailable ? "Open" : "In Use"}
                    </span>
                  )}
                </div>
              </div>
              {isAvailable && !isBooking && !isConfirmed && (
                <div className="flex gap-1 mt-1.5">
                  {["9:00 AM", "11:30 AM", "2:00 PM"].map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded-md" style={{ background: "#F8FAFC", fontSize: "4.5px", color: "#64748B", border: "0.5px solid #E2E8F0" }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom nav — white with green active */}
      <div className="flex items-center justify-around px-2 py-1.5 shrink-0" style={{ borderTop: "1px solid #F1F5F9" }}>
        {[{ label: "Rooms", active: true }, { label: "Bookings", active: false }, { label: "Map", active: false }].map((tab) => (
          <div key={tab.label} className="flex flex-col items-center gap-0.5">
            <div className="w-3 h-3 rounded" style={{ background: tab.active ? "#006747" : "#E2E8F0" }} />
            <span style={{ fontSize: "4.5px", color: tab.active ? "#006747" : "#94A3B8", fontWeight: tab.active ? 600 : 400 }}>{tab.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes bsPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes bsConfirm { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default BullSpaceViz;
