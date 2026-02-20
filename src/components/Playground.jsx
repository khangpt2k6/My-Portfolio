import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Pen,
  Pencil,
  Eraser,
  Minus,
  Square,
  Circle,
  Triangle,
  Type,
  PaintBucket,
  Download,
  Trash2,
  Undo2,
  Redo2,
  Maximize,
  Minimize,
  Plus,
  Pipette,
  SprayCan,
  ArrowRight,
  Star,
  Hexagon,
  Diamond,
  ZoomIn,
  ZoomOut,
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
  const [color2, setColor2] = useState("#FFFFFF"); // secondary color (right click)
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

    const isShapeTool = ["line", "arrow", "rect", "ellipse", "triangle", "diamond", "star", "hexagon"].includes(tool);
    if (isShapeTool) {
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

    const isShapeTool = ["line", "arrow", "rect", "ellipse", "triangle", "diamond", "star", "hexagon"].includes(tool);

    if (isShapeTool) {
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

    const isShapeTool = ["line", "arrow", "rect", "ellipse", "triangle", "diamond", "star", "hexagon"].includes(tool);
    if (isShapeTool) {
      const pos = e.touches ? getPos(e) : getPos(e);
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
          {/* ══════ TOP TOOLBAR ══════ */}
          <div className="shrink-0 bg-[#F5F5F5] dark:bg-[#2b2b2b] border-b border-[#d4d4d4] dark:border-[#404040]">
            {/* Row 1: Actions */}
            <div className="flex items-center gap-1 px-2 py-1 border-b border-[#e5e5e5] dark:border-[#333]">
              <button onClick={undo} disabled={!canUndo} className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-25" title="Undo (Ctrl+Z)"><Undo2 size={15} className="text-[#555] dark:text-[#bbb]" /></button>
              <button onClick={redo} disabled={!canRedo} className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-25" title="Redo (Ctrl+Y)"><Redo2 size={15} className="text-[#555] dark:text-[#bbb]" /></button>
              <div className="w-px h-4 bg-[#d4d4d4] dark:bg-[#555] mx-1" />
              <button onClick={clearCanvas} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30" title="Clear canvas"><Trash2 size={15} className="text-[#555] dark:text-[#bbb]" /></button>
              <button onClick={toggleFullscreen} className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10" title="Fullscreen">{isFullscreen ? <Minimize size={15} className="text-[#555] dark:text-[#bbb]" /> : <Maximize size={15} className="text-[#555] dark:text-[#bbb]" />}</button>

              <button onClick={saveImage} className="flex items-center gap-1.5 ml-auto px-3 py-1 rounded-lg text-xs font-semibold text-white shadow-sm hover:brightness-110" style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)" }} title="Save as PNG (Ctrl+S)">
                <Download size={13} />Save PNG
              </button>
            </div>

            {/* Row 2: Tools + Colors */}
            <div className="flex items-start gap-0 px-1 py-1.5">
              {/* Drawing tools group */}
              <div className="flex flex-col items-center px-1">
                <div className="flex items-center gap-px flex-wrap justify-center max-w-[200px]">
                  {drawTools.map(t => (
                    <button key={t.id} onClick={() => setTool(t.id)} className={`p-1.5 rounded-md transition-all ${tool === t.id ? "bg-[#cce4ff] dark:bg-[#264f78] shadow-inner" : "hover:bg-black/5 dark:hover:bg-white/8"}`} title={t.label}>
                      <t.Icon size={16} className={tool === t.id ? "text-[#0066cc] dark:text-[#69b4ff]" : "text-[#444] dark:text-[#aaa]"} />
                    </button>
                  ))}
                </div>
                <span className="text-[9px] text-[#888] mt-0.5 font-medium">Tools</span>
              </div>

              <div className="w-px h-12 bg-[#d4d4d4] dark:bg-[#555] mx-1 self-center" />

              {/* Shape tools group */}
              <div className="flex flex-col items-center px-1">
                <div className="flex items-center gap-px flex-wrap justify-center max-w-[220px]">
                  {shapeTools.map(t => (
                    <button key={t.id} onClick={() => setTool(t.id)} className={`p-1.5 rounded-md transition-all ${tool === t.id ? "bg-[#cce4ff] dark:bg-[#264f78] shadow-inner" : "hover:bg-black/5 dark:hover:bg-white/8"}`} title={t.label}>
                      <t.Icon size={16} className={tool === t.id ? "text-[#0066cc] dark:text-[#69b4ff]" : "text-[#444] dark:text-[#aaa]"} />
                    </button>
                  ))}
                  {/* Fill toggle */}
                  {isShapeTool && (
                    <button onClick={() => setFillShape(f => !f)} className={`p-1.5 rounded-md transition-all ${fillShape ? "bg-[#cce4ff] dark:bg-[#264f78]" : "hover:bg-black/5 dark:hover:bg-white/8"}`} title={fillShape ? "Filled" : "Outline"}>
                      <Square size={16} className={fillShape ? "text-[#0066cc] dark:text-[#69b4ff] fill-current" : "text-[#444] dark:text-[#aaa]"} />
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-[#888] mt-0.5 font-medium">Shapes</span>
              </div>

              <div className="w-px h-12 bg-[#d4d4d4] dark:bg-[#555] mx-1 self-center" />

              {/* Color palette */}
              <div className="flex flex-col items-center px-1">
                <div className="flex items-center gap-1.5">
                  {/* Primary/Secondary color */}
                  <div className="relative w-8 h-8 mr-1">
                    <div className="absolute top-0 left-0 w-6 h-6 rounded-sm border-2 border-white shadow-md z-10 cursor-pointer" style={{ background: color }} title={`Primary: ${color}`} onClick={() => document.getElementById("color-primary")?.click()} />
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-sm border-2 border-white shadow cursor-pointer" style={{ background: color2 }} title={`Secondary: ${color2}`} onClick={() => { const tmp = color; setColor(color2); setColor2(tmp); }} />
                    <input id="color-primary" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="sr-only" />
                  </div>

                  {/* Palette grid */}
                  <div className="flex flex-col gap-px">
                    <div className="flex gap-px">
                      {PALETTE_ROW1.map(c => (
                        <button key={c} onClick={() => setColor(c)} onContextMenu={(e) => { e.preventDefault(); setColor2(c); }}
                          className="w-[16px] h-[16px] rounded-sm border border-[#aaa] hover:scale-125 transition-transform"
                          style={{ background: c, outline: color === c ? "2px solid #0066cc" : "none", outlineOffset: "1px" }} title={c} />
                      ))}
                    </div>
                    <div className="flex gap-px">
                      {PALETTE_ROW2.map(c => (
                        <button key={c} onClick={() => setColor(c)} onContextMenu={(e) => { e.preventDefault(); setColor2(c); }}
                          className="w-[16px] h-[16px] rounded-sm border border-[#aaa] hover:scale-125 transition-transform"
                          style={{ background: c, outline: color === c ? "2px solid #0066cc" : "none", outlineOffset: "1px" }} title={c} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[9px] text-[#888] mt-0.5 font-medium">Colors</span>
              </div>
            </div>
          </div>

          {/* ══════ MAIN AREA: Sidebar + Canvas ══════ */}
          <div className="flex flex-1 min-h-0">
            {/* ── Left sidebar: Brush size + Opacity ── */}
            <div className="w-16 shrink-0 bg-[#F5F5F5] dark:bg-[#2b2b2b] border-r border-[#d4d4d4] dark:border-[#404040] flex flex-col items-center py-3 gap-4">
              {/* Line widths */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[8px] text-[#888] font-semibold uppercase tracking-wider">Size</span>
                <div className="flex flex-col gap-0.5 items-center">
                  {LINE_WIDTHS.map(w => (
                    <button key={w} onClick={() => setBrushSize(w)}
                      className={`w-10 h-5 rounded flex items-center justify-center transition-all ${brushSize === w ? "bg-[#cce4ff] dark:bg-[#264f78]" : "hover:bg-black/5 dark:hover:bg-white/8"}`}
                      title={`${w}px`}
                    >
                      <div className="rounded-full bg-[#333] dark:bg-[#ccc]" style={{ width: Math.min(w + 2, 30), height: Math.min(w, 14) }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Brush size slider */}
              <div className="flex flex-col items-center gap-1 w-full px-2">
                <span className="text-[8px] text-[#888] font-semibold">{brushSize}px</span>
                <input
                  type="range" min="1" max="48" value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full accent-[#0066cc]"
                  style={{ writingMode: "vertical-lr", height: "80px", direction: "rtl" }}
                />
              </div>

              {/* Opacity slider */}
              <div className="flex flex-col items-center gap-1 w-full px-2">
                <span className="text-[8px] text-[#888] font-semibold uppercase tracking-wider">Opacity</span>
                <span className="text-[9px] text-[#666] dark:text-[#aaa] font-mono">{opacity}%</span>
                <input
                  type="range" min="5" max="100" value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-[#0066cc]"
                  style={{ writingMode: "vertical-lr", height: "60px", direction: "rtl" }}
                />
              </div>
            </div>

            {/* ── Canvas ── */}
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
                <div
                  className="absolute pointer-events-none z-30"
                  style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* Crosshair */}
                  <svg width={Math.max(cursorSize + 20, 24)} height={Math.max(cursorSize + 20, 24)}
                    style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
                    {/* Brush circle */}
                    <circle
                      cx="50%" cy="50%"
                      r={Math.max(cursorSize / 2, 1)}
                      fill={tool === "eraser" ? "rgba(255,255,255,0.5)" : tool === "picker" ? "none" : `${color}30`}
                      stroke={tool === "eraser" ? "#999" : tool === "picker" ? "#333" : color}
                      strokeWidth="1"
                      strokeDasharray={tool === "eraser" ? "3 2" : "none"}
                    />
                    {/* Crosshair lines */}
                    <line x1="50%" y1="0" x2="50%" y2={Math.max(cursorSize + 20, 24) / 2 - Math.max(cursorSize / 2, 1) - 2} stroke="#333" strokeWidth="0.5" opacity="0.6" />
                    <line x1="50%" y1={Math.max(cursorSize + 20, 24) / 2 + Math.max(cursorSize / 2, 1) + 2} x2="50%" y2={Math.max(cursorSize + 20, 24)} stroke="#333" strokeWidth="0.5" opacity="0.6" />
                    <line y1="50%" x1="0" y2="50%" x2={Math.max(cursorSize + 20, 24) / 2 - Math.max(cursorSize / 2, 1) - 2} stroke="#333" strokeWidth="0.5" opacity="0.6" />
                    <line y1="50%" x1={Math.max(cursorSize + 20, 24) / 2 + Math.max(cursorSize / 2, 1) + 2} y2="50%" x2={Math.max(cursorSize + 20, 24)} stroke="#333" strokeWidth="0.5" opacity="0.6" />
                  </svg>
                </div>
              )}

              {/* Text input overlay */}
              {textPos && (
                <div className="absolute z-20" style={{ left: textPos.x, top: textPos.y }}>
                  <input
                    type="text" autoFocus value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") commitText(); if (e.key === "Escape") { setTextPos(null); setTextInput(""); } }}
                    onBlur={commitText}
                    className="bg-white/90 dark:bg-black/80 border border-dashed border-blue-400 outline-none px-1.5 py-0.5 min-w-[100px] rounded"
                    style={{ color, fontSize: `${Math.max(14, brushSize * 3)}px`, fontFamily: "sans-serif" }}
                    placeholder="Type here..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* ══════ STATUS BAR ══════ */}
          <div className="flex items-center justify-between px-3 py-1 bg-[#F0F0F0] dark:bg-[#252525] border-t border-[#d4d4d4] dark:border-[#404040] shrink-0">
            <div className="flex items-center gap-3 text-[10px] text-[#666] dark:text-[#999] font-mono">
              <span className="flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 9L1 1 3 1" stroke="currentColor" strokeWidth="1" fill="none" /></svg>
                {mousePos.x}, {mousePos.y}px
              </span>
              <span>|</span>
              <span>{canvasSize.w} × {canvasSize.h}px</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10"><ZoomOut size={12} className="text-[#666] dark:text-[#999]" /></button>
              <span className="text-[10px] text-[#666] dark:text-[#999] font-mono w-8 text-center">{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10"><ZoomIn size={12} className="text-[#666] dark:text-[#999]" /></button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Playground;
