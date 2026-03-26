import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import apps from "../data/apps";
import DesktopIcon from "./DesktopIcon";
import { useWindows } from "./WindowContext";

export default function Desktop() {
  const { openApp } = useWindows();
  const [ctxMenu, setCtxMenu] = useState(null);

  const onContextMenu = useCallback((e) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const closeCtx = useCallback(() => setCtxMenu(null), []);

  /* Arrange icons in columns from top-right (macOS style) */
  const cols = {};
  apps.forEach((a) => {
    const c = a.desktopCol ?? 0;
    if (!cols[c]) cols[c] = [];
    cols[c].push(a);
  });

  return (
    <div
      className="absolute inset-0 pt-10 pb-24 overflow-hidden"
      onContextMenu={onContextMenu}
      onClick={closeCtx}
    >
      {/* Desktop icons — top right like real macOS */}
      <div className="absolute top-10 right-4 flex gap-1">
        {Object.values(cols)
          .reverse()
          .map((col, ci) => (
            <div key={ci} className="flex flex-col gap-1">
              {col
                .sort((a, b) => (a.desktopRow ?? 0) - (b.desktopRow ?? 0))
                .map((app, i) => (
                  <DesktopIcon key={app.id} app={app} index={ci * 6 + i} />
                ))}
            </div>
          ))}
      </div>

      {/* Watermark — subtle name in bottom-left */}
      <motion.div
        className="absolute bottom-20 left-6 pointer-events-none select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div
          className="text-[11px] font-medium tracking-wider"
          style={{ color: "rgba(255,255,255,0.12)" }}
        >
          KHANGOS v1.0
        </div>
      </motion.div>

      {/* Context menu */}
      <AnimatePresence>
        {ctxMenu && (
          <motion.div
            className="absolute rounded-xl py-1 min-w-[180px] z-[9999] overflow-hidden"
            style={{
              top: ctxMenu.y,
              left: ctxMenu.x,
              background: "var(--lg-menu)",
              backdropFilter: "var(--lg-blur)",
              WebkitBackdropFilter: "var(--lg-blur)",
              border: "0.5px solid var(--lg-menu-border)",
              boxShadow: "var(--lg-menu-shadow)",
            }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CtxItem label="About This Mac" onClick={() => { openApp("about"); closeCtx(); }} />
            <div className="h-px mx-2 my-0.5 bg-black/8 dark:bg-white/8" />
            <CtxItem label="Open Terminal" onClick={() => { openApp("terminal"); closeCtx(); }} />
            <CtxItem label="Open Settings" onClick={() => { openApp("settings"); closeCtx(); }} />
            <div className="h-px mx-2 my-0.5 bg-black/8 dark:bg-white/8" />
            <CtxItem label="Change Wallpaper…" onClick={() => { openApp("settings"); closeCtx(); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CtxItem({ label, onClick }) {
  return (
    <button
      className="w-full text-left px-3 py-1 text-[13px] text-black/80 dark:text-white/80
                 hover:bg-[var(--color-primary)] hover:text-white rounded-[4px] mx-1 transition-colors"
      style={{ width: "calc(100% - 8px)" }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
