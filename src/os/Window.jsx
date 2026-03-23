import { useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindows } from "./WindowContext";

const MIN_W = 320;
const MIN_H = 240;

export default function Window({ id, title, children }) {
  const {
    windows, focusedWindow,
    closeApp, minimizeApp, maximizeApp, focusApp, moveApp, resizeApp,
  } = useWindows();

  const win = windows[id];
  const isFocused = focusedWindow === id;
  const winRef = useRef(null);
  const [hoverBtn, setHoverBtn] = useState(false);

  /* ── Get screen container offset ── */
  const getScreenOffset = () => {
    const el = document.getElementById("macbook-screen");
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  };

  /* ── Drag logic ── */
  const onDragStart = useCallback(
    (e) => {
      if (win?.isMaximized) return;
      e.preventDefault();
      focusApp(id);

      const offset = getScreenOffset();
      const startX = e.clientX - offset.x - win.position.x;
      const startY = e.clientY - offset.y - win.position.y;

      const onMove = (ev) => {
        const off = getScreenOffset();
        moveApp(id, {
          x: Math.max(0, ev.clientX - off.x - startX),
          y: Math.max(28, ev.clientY - off.y - startY),
        });
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [id, win?.position, win?.isMaximized, focusApp, moveApp]
  );

  /* ── Resize logic ── */
  const onResizeStart = useCallback(
    (e, direction) => {
      if (win?.isMaximized) return;
      e.preventDefault();
      e.stopPropagation();
      focusApp(id);

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = win.size.w;
      const startH = win.size.h;
      const startPosX = win.position.x;
      const startPosY = win.position.y;

      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        const screen = document.getElementById("macbook-screen");
        const maxW = screen ? screen.offsetWidth - 20 : 1200;
        const maxH = screen ? screen.offsetHeight - 40 : 700;
        let newW = startW, newH = startH, newX = startPosX, newY = startPosY;

        if (direction.includes("e")) newW = Math.max(MIN_W, startW + dx);
        if (direction.includes("s")) newH = Math.max(MIN_H, startH + dy);
        if (direction.includes("w")) {
          newW = Math.max(MIN_W, startW - dx);
          if (newW > MIN_W) newX = startPosX + dx;
        }
        if (direction.includes("n")) {
          newH = Math.max(MIN_H, startH - dy);
          if (newH > MIN_H) newY = startPosY + dy;
        }

        resizeApp(id, { w: newW, h: newH });
        moveApp(id, { x: newX, y: newY });
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [id, win?.size, win?.position, win?.isMaximized, focusApp, resizeApp, moveApp]
  );

  const visible = win?.isOpen && !win?.isMinimized;
  const isMax = win?.isMaximized;

  const style = isMax
    ? { top: 26, left: 0, width: "100%", height: "calc(100% - 26px - 56px)", zIndex: win?.zIndex || 0 }
    : {
        top: win?.position?.y || 100,
        left: win?.position?.x || 100,
        width: win?.size?.w || 600,
        height: win?.size?.h || 400,
        zIndex: win?.zIndex || 0,
      };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={winRef}
          className="absolute select-none"
          style={style}
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 30 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          onMouseDown={() => !isFocused && focusApp(id)}
        >
          <div
            className={`w-full h-full flex flex-col rounded-xl overflow-hidden
              border border-[var(--glass-border)]
              ${isFocused
                ? "shadow-[0_12px_60px_rgba(0,0,0,0.25)]"
                : "shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
              }`}
            style={{ background: "var(--glass-bg)", backdropFilter: "blur(40px)" }}
          >
            {/* ── Title bar ── */}
            <div
              className="flex items-center h-9 px-3 shrink-0 cursor-grab active:cursor-grabbing"
              style={{
                background: "linear-gradient(180deg, rgba(var(--color-primary-rgb),0.06), rgba(var(--color-primary-rgb),0.02))",
                borderBottom: "1px solid var(--glass-border)",
              }}
              onMouseDown={onDragStart}
              onDoubleClick={() => maximizeApp(id)}
            >
              {/* Traffic lights */}
              <div
                className="flex items-center gap-2 z-10"
                onMouseEnter={() => setHoverBtn(true)}
                onMouseLeave={() => setHoverBtn(false)}
              >
                <button
                  className="w-3 h-3 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "#FF5F57" }}
                  onClick={(e) => { e.stopPropagation(); closeApp(id); }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {hoverBtn && (
                    <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                      <path d="M0.5 0.5L5.5 5.5M5.5 0.5L0.5 5.5" stroke="#4a0000" strokeWidth="1.2" />
                    </svg>
                  )}
                </button>
                <button
                  className="w-3 h-3 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "#FEBC2E" }}
                  onClick={(e) => { e.stopPropagation(); minimizeApp(id); }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {hoverBtn && (
                    <svg width="6" height="2" viewBox="0 0 6 2" fill="none">
                      <path d="M0.5 1H5.5" stroke="#995700" strokeWidth="1.2" />
                    </svg>
                  )}
                </button>
                <button
                  className="w-3 h-3 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "#28C840" }}
                  onClick={(e) => { e.stopPropagation(); maximizeApp(id); }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {hoverBtn && (
                    <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                      <path d="M0.75 2L3 0.5L5.25 2M0.75 4L3 5.5L5.25 4" stroke="#006500" strokeWidth="1" />
                    </svg>
                  )}
                </button>
              </div>

              <span className="flex-1 text-center text-xs font-medium text-[var(--color-text-muted)] select-none pointer-events-none">
                {title}
              </span>
              <div className="w-[52px]" />
            </div>

            {/* ── Content ── */}
            <div className="flex-1 overflow-auto window-content" style={{ background: "var(--color-surface)" }}>
              {children}
            </div>
          </div>

          {/* ── Resize handles ── */}
          {!isMax && (
            <>
              <div className="absolute top-0 left-0 right-0 h-1 cursor-n-resize" onMouseDown={(e) => onResizeStart(e, "n")} />
              <div className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize" onMouseDown={(e) => onResizeStart(e, "s")} />
              <div className="absolute top-0 left-0 bottom-0 w-1 cursor-w-resize" onMouseDown={(e) => onResizeStart(e, "w")} />
              <div className="absolute top-0 right-0 bottom-0 w-1 cursor-e-resize" onMouseDown={(e) => onResizeStart(e, "e")} />
              <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize" onMouseDown={(e) => onResizeStart(e, "nw")} />
              <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize" onMouseDown={(e) => onResizeStart(e, "ne")} />
              <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" onMouseDown={(e) => onResizeStart(e, "sw")} />
              <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" onMouseDown={(e) => onResizeStart(e, "se")} />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
