import { createContext, useContext, useReducer, useCallback } from "react";
import apps from "../data/apps";

const WindowContext = createContext(null);

/* ── helpers ── */
const centerWindow = (w, h) => ({
  x: Math.max(40, (window.innerWidth - w) / 2 + (Math.random() - 0.5) * 60),
  y: Math.max(40, (window.innerHeight - h) / 2 + (Math.random() - 0.5) * 40),
});

const buildInitial = () => {
  const windows = {};
  apps.forEach((app) => {
    windows[app.id] = {
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: centerWindow(app.defaultSize.w, app.defaultSize.h),
      size: { ...app.defaultSize },
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
        // Already open — just focus
        return {
          ...state,
          windows: {
            ...state.windows,
            [id]: { ...win, zIndex: state.nextZIndex },
          },
          focusedWindow: id,
          nextZIndex: state.nextZIndex + 1,
        };
      }
      const app = apps.find((a) => a.id === id);
      const size = win?.size || { w: app.defaultSize.w, h: app.defaultSize.h };
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
        windows: {
          ...state.windows,
          [id]: { ...win, isOpen: false, isMinimized: false, isMaximized: false },
        },
        focusedWindow: state.focusedWindow === id ? null : state.focusedWindow,
      };
    case "MINIMIZE":
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: { ...win, isMinimized: true },
        },
        focusedWindow: state.focusedWindow === id ? null : state.focusedWindow,
      };
    case "MAXIMIZE":
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: {
            ...win,
            isMaximized: !win.isMaximized,
            zIndex: state.nextZIndex,
          },
        },
        focusedWindow: id,
        nextZIndex: state.nextZIndex + 1,
      };
    case "FOCUS":
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: { ...win, zIndex: state.nextZIndex },
        },
        focusedWindow: id,
        nextZIndex: state.nextZIndex + 1,
      };
    case "MOVE":
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: { ...win, position: action.position },
        },
      };
    case "RESIZE":
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: { ...win, size: action.size },
        },
      };
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
  const moveApp = useCallback(
    (id, position) => dispatch({ type: "MOVE", id, position }),
    []
  );
  const resizeApp = useCallback(
    (id, size) => dispatch({ type: "RESIZE", id, size }),
    []
  );

  return (
    <WindowContext.Provider
      value={{
        ...state,
        openApp,
        closeApp,
        minimizeApp,
        maximizeApp,
        focusApp,
        moveApp,
        resizeApp,
      }}
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
