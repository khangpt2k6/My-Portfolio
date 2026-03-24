import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Pen, Pencil, Eraser, Minus, Square, Circle, Triangle, Type,
  PaintBucket, Download, Trash2, Undo2, Redo2, Maximize, Minimize,
  Pipette, SprayCan, ArrowRight, Star, Hexagon, Diamond,
  ZoomIn, ZoomOut,
} from "lucide-react";

/* ── Tool definitions ────────────────────────────────────────────────────── */
const TOOLS = [
  { id: "pencil", label: "Pencil", Icon: Pencil, group: "draw" },
  { id: "brush", label: "Brush", Icon: Pen, group: "draw" },
  { id: "spray", label: "Spray", Icon: SprayCan, group: "draw" },
  { id: "eraser", label: "Eraser", Icon: Eraser, group: "draw" },
  { id: "fill", label: "Fill", Icon: PaintBucket, group: "draw" },
  { id: "picker", label: "Picker", Icon: Pipette, group: "draw" },
  { id: "text", label: "Text", Icon: Type, group: "draw" },
  { id: "line", label: "Line", Icon: Minus, group: "shape" },
  { id: "arrow", label: "Arrow", Icon: ArrowRight, group: "shape" },
  { id: "rect", label: "Rect", Icon: Square, group: "shape" },
  { id: "ellipse", label: "Ellipse", Icon: Circle, group: "shape" },
  { id: "triangle", label: "Triangle", Icon: Triangle, group: "shape" },
  { id: "diamond", label: "Diamond", Icon: Diamond, group: "shape" },
  { id: "star", label: "Star", Icon: Star, group: "shape" },
  { id: "hexagon", label: "Hexagon", Icon: Hexagon, group: "shape" },
];

const PALETTE_ROW1 = [
  "#000000", "#464646", "#787878", "#980036", "#ED1C24", "#FF7F27",
  "#FFF200", "#22B14C", "#00A2E8", "#3F48CC", "#A349A4", "#B97A57",
];
const PALETTE_ROW2 = [
  "#FFFFFF", "#B4B4B4", "#C8C8C8", "#FFAEC9", "#F2ACAC", "#FFCA96",
  "#EFE4B0", "#B5E61D", "#99D9EA", "#7092BE", "#C8BFE7", "#FEE5C7",
];

const LINE_WIDTHS = [1, 2, 3, 5, 8, 12, 18, 24];

/* ── Flood fill ──────────────────────────────────────────────────────────── */
function floodFill(ctx, startX, startY, fillColor, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const sx = Math.floor(startX);
  const sy = Math.floor(startY);
  if (sx < 0 || sx >= width || sy < 0 || sy >= height) return;

  const startIdx = (sy * width + sx) * 4;
  const sr = data[startIdx], sg = data[startIdx + 1], sb = data[startIdx + 2], sa = data[startIdx + 3];

  const tmp = document.createElement("canvas");
  tmp.width = tmp.height = 1;
  const tc = tmp.getContext("2d");
  tc.fillStyle = fillColor;
  tc.fillRect(0, 0, 1, 1);
  const fc = tc.getImageData(0, 0, 1, 1).data;
  if (sr === fc[0] && sg === fc[1] && sb === fc[2] && sa === 255) return;

  const tol = 32;
  const match = (i) =>
    Math.abs(data[i] - sr) <= tol && Math.abs(data[i + 1] - sg) <= tol &&
    Math.abs(data[i + 2] - sb) <= tol && Math.abs(data[i + 3] - sa) <= tol;

  const stack = [[sx, sy]];
  const visited = new Uint8Array(width * height);
  while (stack.length) {
    const [cx, cy] = stack.pop();
    if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;
    const idx = cy * width + cx;
    if (visited[idx]) continue;
    const pi = idx * 4;
    if (!match(pi)) continue;
    visited[idx] = 1;
    data[pi] = fc[0]; data[pi + 1] = fc[1]; data[pi + 2] = fc[2]; data[pi + 3] = 255;
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }
  ctx.putImageData(imageData, 0, 0);
}

/* ── Draw polygon helper ─────────────────────────────────────────────────── */
function drawPolygon(ctx, cx, cy, r, sides, rotation = 0) {
  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
    const angle = (i * 2 * Math.PI) / sides + rotation - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawStar(ctx, cx, cy, outerR, innerR, points) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawArrow(ctx, x1, y1, x2, y2, headLen = 14) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

/* ── Component ───────────────────────────────────────────────────────────── */
const Playground = ({ embedded = false }) => {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const containerRef = useRef(null);
  const canvasAreaRef = useRef(null);

  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState("#000000");
  const [color2, setColor2] = useState("#FFFFFF");
  const [brushSize, setBrushSize] = useState(4);
  const [opacity, setOpacity] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fillShape, setFillShape] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPos, setTextPos] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isOnCanvas, setIsOnCanvas] = useState(false);
  const [zoom, setZoom] = useState(100);

  const isDrawingRef = useRef(false);
  const lastPosRef = useRef(null);
  const shapeStartRef = useRef(null);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  /* ── Init canvas ── */
  const initCanvas = useCallback((preserveContent = false) => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;
    const container = canvasAreaRef.current;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    let prevData = null;
    if (preserveContent) {
      prevData = canvas.toDataURL();
    }

    for (const c of [canvas, overlay]) {
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = w + "px";
      c.style.height = h + "px";
      c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const ctx = canvas.getContext("2d");

    if (prevData) {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0, w, h); };
      img.src = prevData;
    } else {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);
      saveToHistory();
    }

    setCanvasSize({ w, h });
  }, []);

  useEffect(() => {
    initCanvas();
    const onResize = () => initCanvas(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [initCanvas]);

  /* ── History ── */
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(dataUrl);
    if (historyRef.current.length > 50) historyRef.current.shift();
    historyIndexRef.current = historyRef.current.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  const restoreFromHistory = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.drawImage(img, 0, 0, canvas.clientWidth, canvas.clientHeight);
    };
    img.src = historyRef.current[index];
    historyIndexRef.current = index;
    setCanUndo(index > 0);
    setCanRedo(index < historyRef.current.length - 1);
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) restoreFromHistory(historyIndexRef.current - 1);
  }, [restoreFromHistory]);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) restoreFromHistory(historyIndexRef.current + 1);
  }, [restoreFromHistory]);

  /* ── Utils ── */
  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const setupCtx = (ctx, col) => {
    ctx.strokeStyle = col || color;
    ctx.fillStyle = col || color;
    ctx.lineWidth = tool === "pencil" ? 1 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = opacity / 100;
  };

  /* ── Draw shape on context ── */
  const drawShape = useCallback((ctx, start, end, preview = false) => {
    setupCtx(ctx, color);
    const minX = Math.min(start.x, end.x), minY = Math.min(start.y, end.y);
    const w = Math.abs(end.x - start.x), h = Math.abs(end.y - start.y);
    const cx = (start.x + end.x) / 2, cy = (start.y + end.y) / 2;
    const r = Math.max(w, h) / 2;

    if (tool === "line") {
      ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
    } else if (tool === "arrow") {
      drawArrow(ctx, start.x, start.y, end.x, end.y, Math.max(10, brushSize * 2));
    } else if (tool === "rect") {
      if (fillShape) ctx.fillRect(minX, minY, w, h);
      ctx.strokeRect(minX, minY, w, h);
    } else if (tool === "ellipse") {
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.max(1, w / 2), Math.max(1, h / 2), 0, 0, Math.PI * 2);
      if (fillShape) ctx.fill();
      ctx.stroke();
    } else if (tool === "triangle") {
      ctx.beginPath();
      ctx.moveTo(cx, minY); ctx.lineTo(minX, minY + h); ctx.lineTo(minX + w, minY + h);
      ctx.closePath();
      if (fillShape) ctx.fill();
      ctx.stroke();
    } else if (tool === "diamond") {
      ctx.beginPath();
      ctx.moveTo(cx, minY); ctx.lineTo(minX + w, cy); ctx.lineTo(cx, minY + h); ctx.lineTo(minX, cy);
      ctx.closePath();
      if (fillShape) ctx.fill();
      ctx.stroke();
    } else if (tool === "star") {
      drawStar(ctx, cx, cy, r, r * 0.4, 5);
      if (fillShape) ctx.fill();
      ctx.stroke();
    } else if (tool === "hexagon") {
      drawPolygon(ctx, cx, cy, r, 6);
      if (fillShape) ctx.fill();
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, [tool, color, brushSize, fillShape, opacity]);

  /* ── Pointer handlers ── */
  const handlePointerDown = (e) => {
    e.preventDefault();
    const pos = getPos(e);

    if (tool === "text") { setTextPos(pos); return; }

    if (tool === "picker") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const px = ctx.getImageData(pos.x * dpr, pos.y * dpr, 1, 1).data;
      const hex = "#" + [px[0], px[1], px[2]].map(v => v.toString(16).padStart(2, "0")).join("");
      setColor(hex);
      return;
    }

    if (tool === "fill") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      floodFill(ctx, pos.x, pos.y, color, canvas.clientWidth, canvas.clientHeight);
      saveToHistory();
      return;
    }

    isDrawingRef.current = true;
    lastPosRef.current = pos;

    const isShape = ["line", "arrow", "rect", "ellipse", "triangle", "diamond", "star", "hexagon"].includes(tool);
    if (isShape) {
      shapeStartRef.current = pos;
    } else {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      setupCtx(ctx, tool === "eraser" ? "#FFFFFF" : color);

      if (tool === "spray") {
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * brushSize;
          ctx.fillRect(pos.x + Math.cos(angle) * dist, pos.y + Math.sin(angle) * dist, 1, 1);
        }
      } else {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, (tool === "pencil" ? 0.5 : brushSize / 2), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  };

  const handlePointerMove = (e) => {
    const pos = getPos(e);
    setMousePos({ x: Math.round(pos.x), y: Math.round(pos.y) });

    if (!isDrawingRef.current) return;
    e.preventDefault();

    const isShape = ["line", "arrow", "rect", "ellipse", "triangle", "diamond", "star", "hexagon"].includes(tool);

    if (isShape) {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const ctx = overlay.getContext("2d");
      ctx.clearRect(0, 0, overlay.clientWidth, overlay.clientHeight);
      drawShape(ctx, shapeStartRef.current, pos, true);
    } else {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      setupCtx(ctx, tool === "eraser" ? "#FFFFFF" : color);

      if (tool === "spray") {
        for (let i = 0; i < 15; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * brushSize;
          ctx.fillRect(pos.x + Math.cos(angle) * dist, pos.y + Math.sin(angle) * dist, 1, 1);
        }
      } else {
        const prev = lastPosRef.current;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      lastPosRef.current = pos;
    }
  };

  const handlePointerUp = (e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    const isShape = ["line", "arrow", "rect", "ellipse", "triangle", "diamond", "star", "hexagon"].includes(tool);
    if (isShape) {
      const pos = getPos(e);
      const canvas = canvasRef.current;
      const overlay = overlayRef.current;
      if (canvas && shapeStartRef.current) {
        const ctx = canvas.getContext("2d");
        drawShape(ctx, shapeStartRef.current, pos);
      }
      if (overlay) overlay.getContext("2d").clearRect(0, 0, overlay.clientWidth, overlay.clientHeight);
      shapeStartRef.current = null;
    }
    saveToHistory();
    lastPosRef.current = null;
  };

  /* ── Text commit ── */
  const commitText = useCallback(() => {
    if (!textPos || !textInput.trim()) { setTextPos(null); setTextInput(""); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity / 100;
    ctx.font = `${Math.max(14, brushSize * 3)}px sans-serif`;
    ctx.textBaseline = "top";
    ctx.fillText(textInput, textPos.x, textPos.y);
    ctx.globalAlpha = 1;
    setTextPos(null);
    setTextInput("");
    saveToHistory();
  }, [textPos, textInput, color, brushSize, opacity, saveToHistory]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    saveToHistory();
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "artpad-drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const handler = (e) => {
      if (textPos) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); saveImage(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, textPos]);

  const isShapeTool = ["line", "arrow", "rect", "ellipse", "triangle", "diamond", "star", "hexagon"].includes(tool);
  const drawTools = TOOLS.filter(t => t.group === "draw");
  const shapeTools = TOOLS.filter(t => t.group === "shape");
  const cursorSize = tool === "pencil" ? 2 : tool === "eraser" ? brushSize + 4 : brushSize;

  /* ══════════════════════════════════════════════════════════════════════════
     JSX — macOS-native layout
     ══════════════════════════════════════════════════════════════════════════ */
  return (
    <section className={`relative ${embedded ? "" : "min-h-screen bg-[var(--color-bg)] dark:bg-transparent pt-24 pb-16"}`}>
      <div className={`relative mx-auto ${isFullscreen ? "max-w-none px-0" : embedded ? "" : "max-w-6xl px-4 sm:px-6"}`}>
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`relative flex flex-col overflow-hidden bg-[#F0F0F0] dark:bg-[#1e1e1e] ${
            isFullscreen ? "w-screen h-screen" : "rounded-2xl border border-[var(--color-border)] shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
          }`}
          style={isFullscreen ? {} : { height: "clamp(520px, 72vh, 850px)" }}
        >
          {/* ── Toolbar ── */}
          <div className="artpad-toolbar">
            <div className="flex items-center gap-0.5">
              <button onClick={undo} disabled={!canUndo} className="artpad-btn" title="Undo (Ctrl+Z)"><Undo2 size={15} /></button>
              <button onClick={redo} disabled={!canRedo} className="artpad-btn" title="Redo (Ctrl+Y)"><Redo2 size={15} /></button>
            </div>

            <div className="artpad-sep" />

            {/* Draw tools — segmented control */}
            <div className="artpad-segment">
              {drawTools.map(t => (
                <button key={t.id} onClick={() => setTool(t.id)}
                  className={`artpad-seg-btn${tool === t.id ? " active" : ""}`} title={t.label}>
                  <t.Icon size={14} />
                </button>
              ))}
            </div>

            <div className="artpad-sep" />

            {/* Shape tools — segmented control */}
            <div className="artpad-segment">
              {shapeTools.map(t => (
                <button key={t.id} onClick={() => setTool(t.id)}
                  className={`artpad-seg-btn${tool === t.id ? " active" : ""}`} title={t.label}>
                  <t.Icon size={14} />
                </button>
              ))}
              {isShapeTool && (
                <button onClick={() => setFillShape(f => !f)}
                  className={`artpad-seg-btn${fillShape ? " active" : ""}`} title={fillShape ? "Filled" : "Outline"}>
                  <Square size={14} className={fillShape ? "fill-current" : ""} />
                </button>
              )}
            </div>

            <div className="flex-1" />

            <button onClick={clearCanvas} className="artpad-btn" title="Clear canvas"><Trash2 size={15} /></button>
            <button onClick={toggleFullscreen} className="artpad-btn" title="Fullscreen">
              {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            </button>
            <button onClick={saveImage} className="artpad-export" title="Save as PNG (Ctrl+S)">
              <Download size={13} /><span>Export</span>
            </button>
          </div>

          {/* ── Main: Canvas + Inspector ── */}
          <div className="flex flex-1 min-h-0">
            {/* Canvas */}
            <div ref={canvasAreaRef} className="relative flex-1 overflow-hidden bg-[#E8E8E8] dark:bg-[#1a1a1a]">
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full touch-none"
                style={{ cursor: "none" }}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseEnter={() => setIsOnCanvas(true)}
                onMouseLeave={() => { isDrawingRef.current = false; lastPosRef.current = null; setIsOnCanvas(false); }}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
              />
              <canvas ref={overlayRef} className="absolute inset-0 w-full h-full pointer-events-none" />

              {/* Custom cursor */}
              {isOnCanvas && (
                <div className="absolute pointer-events-none z-30"
                  style={{ left: mousePos.x, top: mousePos.y, transform: "translate(-50%, -50%)" }}>
                  <svg width={Math.max(cursorSize + 20, 24)} height={Math.max(cursorSize + 20, 24)}
                    style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
                    <circle cx="50%" cy="50%" r={Math.max(cursorSize / 2, 1)}
                      fill={tool === "eraser" ? "rgba(255,255,255,0.5)" : tool === "picker" ? "none" : `${color}30`}
                      stroke={tool === "eraser" ? "#999" : tool === "picker" ? "#333" : color}
                      strokeWidth="1" strokeDasharray={tool === "eraser" ? "3 2" : "none"} />
                    <line x1="50%" y1="0" x2="50%" y2={Math.max(cursorSize + 20, 24) / 2 - Math.max(cursorSize / 2, 1) - 2} stroke="#333" strokeWidth="0.5" opacity="0.6" />
                    <line x1="50%" y1={Math.max(cursorSize + 20, 24) / 2 + Math.max(cursorSize / 2, 1) + 2} x2="50%" y2={Math.max(cursorSize + 20, 24)} stroke="#333" strokeWidth="0.5" opacity="0.6" />
                    <line y1="50%" x1="0" y2="50%" x2={Math.max(cursorSize + 20, 24) / 2 - Math.max(cursorSize / 2, 1) - 2} stroke="#333" strokeWidth="0.5" opacity="0.6" />
                    <line y1="50%" x1={Math.max(cursorSize + 20, 24) / 2 + Math.max(cursorSize / 2, 1) + 2} y2="50%" x2={Math.max(cursorSize + 20, 24)} stroke="#333" strokeWidth="0.5" opacity="0.6" />
                  </svg>
                </div>
              )}

              {/* Text input */}
              {textPos && (
                <div className="absolute z-20" style={{ left: textPos.x, top: textPos.y }}>
                  <input type="text" autoFocus value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") commitText(); if (e.key === "Escape") { setTextPos(null); setTextInput(""); } }}
                    onBlur={commitText}
                    className="bg-white/90 dark:bg-black/80 border border-dashed border-blue-400 outline-none px-1.5 py-0.5 min-w-[100px] rounded"
                    style={{ color, fontSize: `${Math.max(14, brushSize * 3)}px`, fontFamily: "sans-serif" }}
                    placeholder="Type here..." />
                </div>
              )}
            </div>

            {/* ── Inspector Panel ── */}
            <div className="artpad-inspector">
              {/* Color */}
              <div className="artpad-section">
                <h4 className="artpad-label">Color</h4>
                <div className="flex items-center gap-2 mb-3">
                  <div className="artpad-color-well" style={{ background: color }}
                    onClick={() => document.getElementById("artpad-color-input")?.click()} title={`Primary: ${color}`} />
                  <button className="text-[11px] text-[#999] hover:text-[#555] dark:hover:text-[#ccc] px-1 select-none"
                    onClick={() => { const tmp = color; setColor(color2); setColor2(tmp); }} title="Swap colors">
                    ⇄
                  </button>
                  <div className="artpad-color-well secondary" style={{ background: color2 }}
                    onClick={() => { const tmp = color; setColor(color2); setColor2(tmp); }} title={`Secondary: ${color2}`} />
                  <input id="artpad-color-input" type="color" value={color}
                    onChange={(e) => setColor(e.target.value)} className="sr-only" />
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {[...PALETTE_ROW1, ...PALETTE_ROW2].map(c => (
                    <button key={c} onClick={() => setColor(c)}
                      onContextMenu={(e) => { e.preventDefault(); setColor2(c); }}
                      className="artpad-swatch"
                      style={{
                        background: c,
                        boxShadow: color === c ? "0 0 0 2px var(--color-primary), 0 0 0 3.5px #fff" : "none",
                      }} title={c} />
                  ))}
                </div>
              </div>

              {/* Stroke Size */}
              <div className="artpad-section">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="artpad-label">Size</h4>
                  <span className="text-[11px] text-[#666] dark:text-[#aaa] font-mono">{brushSize}px</span>
                </div>
                <input type="range" min="1" max="48" value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))} className="artpad-slider" />
                <div className="grid grid-cols-4 gap-1 mt-2">
                  {LINE_WIDTHS.map(w => (
                    <button key={w} onClick={() => setBrushSize(w)}
                      className={`artpad-size-btn${brushSize === w ? " active" : ""}`} title={`${w}px`}>
                      <div className="rounded-full bg-[#444] dark:bg-[#bbb] mx-auto"
                        style={{ width: Math.min(w + 2, 22), height: Math.min(Math.max(w, 2), 10) }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity */}
              <div className="artpad-section">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="artpad-label">Opacity</h4>
                  <span className="text-[11px] text-[#666] dark:text-[#aaa] font-mono">{opacity}%</span>
                </div>
                <input type="range" min="5" max="100" value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))} className="artpad-slider" />
              </div>
            </div>
          </div>

          {/* ── Status Bar ── */}
          <div className="artpad-statusbar">
            <div className="flex items-center gap-3 text-[10px] text-[#666] dark:text-[#999] font-mono">
              <span>{mousePos.x}, {mousePos.y}</span>
              <span className="text-[#ccc] dark:text-[#444]">|</span>
              <span>{canvasSize.w} × {canvasSize.h}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="artpad-btn small"><ZoomOut size={11} /></button>
              <span className="text-[10px] text-[#666] dark:text-[#999] font-mono w-8 text-center">{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="artpad-btn small"><ZoomIn size={11} /></button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Playground;
