import { createContext, useContext, useReducer, useCallback } from "react";
import apps from "../data/apps";

const WindowContext = createContext(null);

/* ── helpers ── */
const getScreenSize = () => {
  const el = document.getElementById("macbook-screen");
  if (el) return { w: el.offsetWidth, h: el.offsetHeight };
  return { w: 1000, h: 625 };
};

/** Clamp a window size to fit inside the screen with padding */
const clampSize = (w, h) => {
  const screen = getScreenSize();
  return {
    w: Math.min(w, screen.w - 32),
    h: Math.min(h, screen.h - 80), // room for menubar + dock
  };
};

const centerWindow = (w, h) => {
  const screen = getScreenSize();
  const clamped = clampSize(w, h);
  return {
    x: Math.max(8, (screen.w - clamped.w) / 2 + (Math.random() - 0.5) * 30),
    y: Math.max(30, (screen.h - clamped.h) / 2 + (Math.random() - 0.5) * 20),
  };
};

const buildInitial = () => {
  const windows = {};
  apps.forEach((app) => {
    const size = clampSize(app.defaultSize.w, app.defaultSize.h);
    windows[app.id] = {
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: centerWindow(size.w, size.h),
      size,
      zIndex: 0,
    };
  });
  return { windows, focusedWindow: null, nextZIndex: 1 };
};

/* ── reducer ── */
function reducer(state, action) {
  const { type, id } = action;
  const win = state.windows[id];

  switch (type) {
    case "OPEN": {
      if (win?.isOpen && !win.isMinimized) {
        return {
          ...state,
          windows: { ...state.windows, [id]: { ...win, zIndex: state.nextZIndex } },
          focusedWindow: id,
          nextZIndex: state.nextZIndex + 1,
        };
      }
      const app = apps.find((a) => a.id === id);
      const raw = win?.size || { w: app.defaultSize.w, h: app.defaultSize.h };
      const size = clampSize(raw.w, raw.h);
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: {
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            position: centerWindow(size.w, size.h),
            size,
            zIndex: state.nextZIndex,
          },
        },
        focusedWindow: id,
        nextZIndex: state.nextZIndex + 1,
      };
    }
    case "CLOSE":
      return {
        ...state,
        windows: { ...state.windows, [id]: { ...win, isOpen: false, isMinimized: false, isMaximized: false } },
        focusedWindow: state.focusedWindow === id ? null : state.focusedWindow,
      };
    case "MINIMIZE":
      return {
        ...state,
        windows: { ...state.windows, [id]: { ...win, isMinimized: true } },
        focusedWindow: state.focusedWindow === id ? null : state.focusedWindow,
      };
    case "MAXIMIZE":
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: { ...win, isMaximized: !win.isMaximized, zIndex: state.nextZIndex },
        },
        focusedWindow: id,
        nextZIndex: state.nextZIndex + 1,
      };
    case "FOCUS":
      return {
        ...state,
        windows: { ...state.windows, [id]: { ...win, zIndex: state.nextZIndex } },
        focusedWindow: id,
        nextZIndex: state.nextZIndex + 1,
      };
    case "MOVE":
      return { ...state, windows: { ...state.windows, [id]: { ...win, position: action.position } } };
    case "RESIZE":
      return { ...state, windows: { ...state.windows, [id]: { ...win, size: action.size } } };
    default:
      return state;
  }
}

/* ── Provider ── */
export function WindowProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, buildInitial);

  const openApp = useCallback((id) => dispatch({ type: "OPEN", id }), []);
  const closeApp = useCallback((id) => dispatch({ type: "CLOSE", id }), []);
  const minimizeApp = useCallback((id) => dispatch({ type: "MINIMIZE", id }), []);
  const maximizeApp = useCallback((id) => dispatch({ type: "MAXIMIZE", id }), []);
  const focusApp = useCallback((id) => dispatch({ type: "FOCUS", id }), []);
  const moveApp = useCallback((id, position) => dispatch({ type: "MOVE", id, position }), []);
  const resizeApp = useCallback((id, size) => dispatch({ type: "RESIZE", id, size }), []);

  return (
    <WindowContext.Provider
      value={{ ...state, openApp, closeApp, minimizeApp, maximizeApp, focusApp, moveApp, resizeApp }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function useWindows() {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWindows must be inside WindowProvider");
  return ctx;
}
