import { useState, useEffect, useRef, useCallback } from "react";

/**
 * BullSpaceViz — Animated mobile room-booking UI preview
 * Shows a phone-like interface with room cards cycling through
 * availability states and a booking confirmation animation.
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

      // Step 1: After a pause, start booking room 301A
      addTimeout(() => {
        if (!mountedRef.current) return;
        setBookingId("301A");

        // Step 2: Confirm booking
        addTimeout(() => {
          if (!mountedRef.current) return;
          setBookingId(null);
          setConfirmed("301A");
          setRooms((prev) =>
            prev.map((r) => (r.id === "301A" ? { ...r, status: "booked" } : r))
          );

          // Step 3: Book another room
          addTimeout(() => {
            if (!mountedRef.current) return;
            setConfirmed(null);
            setBookingId("205B");

            addTimeout(() => {
              if (!mountedRef.current) return;
              setBookingId(null);
              setConfirmed("205B");
              setRooms((prev) =>
                prev.map((r) => (r.id === "205B" ? { ...r, status: "booked" } : r))
              );

              // Restart loop
              addTimeout(() => {
                if (mountedRef.current) runLoop();
              }, 2500);
            }, 1000);
          }, 1800);
        }, 1000);
      }, 1200);
    };

    runLoop();
    return () => {
      mountedRef.current = false;
      clearAll();
    };
  }, [addTimeout, clearAll]);

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden select-none"
      style={{ background: "#006747", fontFamily: "inherit" }}
    >
      {/* Header - USF green theme */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 shrink-0"
        style={{ background: "rgba(0,0,0,0.3)" }}
      >
        {/* Bull icon */}
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "#CFC493" }}
        >
          <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 5C2 3 1 2 1 2s2 0 3 1c1-2 4-2 4-2s3 0 4 2c1-1 3-1 3-1s-1 1-2 3c0 1 1 3 0 5s-3 4-5 4-5-2-5-4 0-4 0-5z"
              fill="#006747"
              stroke="#006747"
              strokeWidth="0.5"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white" style={{ fontSize: "8px" }}>
            BullSpace
          </span>
          <span className="text-white/50" style={{ fontSize: "5px" }}>
            USF Room Booking
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div
            className="w-[6px] h-[6px] rounded-full"
            style={{ background: "#22C55E" }}
          />
          <span className="text-white/60" style={{ fontSize: "5px" }}>
            Live
          </span>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-2 py-1.5 shrink-0" style={{ background: "rgba(0,0,0,0.15)" }}>
        <div
          className="flex items-center gap-1 h-4 rounded-full px-2"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <svg width="6" height="6" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="4" stroke="white" strokeWidth="1.2" opacity="0.4" />
            <line
              x1="8"
              y1="8"
              x2="11"
              y2="11"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>
          <span className="text-white/30" style={{ fontSize: "6px" }}>
            Search rooms...
          </span>
        </div>
      </div>

      {/* Room cards */}
      <div
        className="flex-1 overflow-hidden px-2 py-1.5 space-y-1.5"
        style={{ background: "rgba(0,0,0,0.1)" }}
      >
        {rooms.map((room) => {
          const isBooking = bookingId === room.id;
          const isConfirmed = confirmed === room.id;
          const isAvailable = room.status === "available";

          return (
            <div
              key={room.id}
              className="rounded-lg px-2.5 py-2 transition-all duration-500"
              style={{
                background: isConfirmed
                  ? "rgba(34,197,94,0.15)"
                  : isBooking
                  ? "rgba(207,196,147,0.12)"
                  : "rgba(255,255,255,0.07)",
                border: isConfirmed
                  ? "1px solid rgba(34,197,94,0.4)"
                  : isBooking
                  ? "1px solid rgba(207,196,147,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
                transform: isBooking ? "scale(1.02)" : "scale(1)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center"
                    style={{ background: "rgba(207,196,147,0.2)" }}
                  >
                    <span
                      className="font-bold"
                      style={{ fontSize: "5px", color: "#CFC493" }}
                    >
                      {room.id}
                    </span>
                  </div>
                  <div>
                    <span
                      className="font-semibold text-white/90 block"
                      style={{ fontSize: "7px" }}
                    >
                      {room.building}
                    </span>
                    <span className="text-white/40" style={{ fontSize: "5px" }}>
                      {room.floor} &middot; {room.capacity} seats
                    </span>
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-1">
                  {isConfirmed ? (
                    <span
                      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                      style={{
                        background: "rgba(34,197,94,0.2)",
                        fontSize: "5px",
                        color: "#22C55E",
                        animation: "bsConfirm 0.4s ease-out",
                      }}
                    >
                      <svg width="5" height="5" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="#22C55E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Booked!
                    </span>
                  ) : isBooking ? (
                    <span
                      className="px-1.5 py-0.5 rounded-full"
                      style={{
                        background: "rgba(207,196,147,0.2)",
                        fontSize: "5px",
                        color: "#CFC493",
                        animation: "bsPulse 1s ease-in-out infinite",
                      }}
                    >
                      Booking...
                    </span>
                  ) : (
                    <span
                      className="px-1.5 py-0.5 rounded-full"
                      style={{
                        background: isAvailable
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(239,68,68,0.15)",
                        fontSize: "5px",
                        color: isAvailable ? "#22C55E" : "#EF4444",
                      }}
                    >
                      {isAvailable ? "Available" : "Occupied"}
                    </span>
                  )}
                </div>
              </div>

              {/* Time slots */}
              {isAvailable && !isBooking && !isConfirmed && (
                <div className="flex gap-1 mt-1">
                  {["9:00", "11:00", "2:00"].map((t) => (
                    <span
                      key={t}
                      className="px-1 py-px rounded"
                      style={{
                        background: "rgba(207,196,147,0.1)",
                        fontSize: "4.5px",
                        color: "rgba(255,255,255,0.5)",
                        border: "0.5px solid rgba(207,196,147,0.2)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom nav */}
      <div
        className="flex items-center justify-around px-2 py-1.5 shrink-0"
        style={{ background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {["Rooms", "My Bookings", "Map"].map((tab, i) => (
          <div key={tab} className="flex flex-col items-center gap-0.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                background: i === 0 ? "#CFC493" : "rgba(255,255,255,0.15)",
                opacity: i === 0 ? 1 : 0.5,
              }}
            />
            <span
              style={{
                fontSize: "4.5px",
                color: i === 0 ? "#CFC493" : "rgba(255,255,255,0.4)",
              }}
            >
              {tab}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes bsPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bsConfirm {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BullSpaceViz;
