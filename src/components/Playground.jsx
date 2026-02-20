import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Pen,
  Eraser,
  Minus,
  Square,
  Circle,
  Type,
  PaintBucket,
  Download,
  Trash2,
  Undo2,
  Redo2,
  Maximize,
  Minimize,
  Plus,
} from "lucide-react";

/* ── Tools ──────────────────────────────────────────────────────────────────── */
const TOOLS = [
  { id: "brush", label: "Brush", Icon: Pen },
  { id: "eraser", label: "Eraser", Icon: Eraser },
  { id: "line", label: "Line", Icon: Minus },
  { id: "rect", label: "Rectangle", Icon: Square },
  { id: "ellipse", label: "Ellipse", Icon: Circle },
  { id: "text", label: "Text", Icon: Type },
  { id: "fill", label: "Fill", Icon: PaintBucket },
];

const PALETTE = [
  "#000000", "#FFFFFF", "#808080", "#C0C0C0",
  "#FF0000", "#800000", "#FFFF00", "#808000",
  "#00FF00", "#008000", "#00FFFF", "#008080",
  "#0000FF", "#000080", "#FF00FF", "#800080",
  "#FF6B6B", "#FFA500", "#FFD700", "#A855F7",
  "#6366F1", "#06B6D4", "#34D399", "#FB7185",
];

const SIZES = [2, 4, 6, 10, 16, 24];

/* ── Flood fill (iterative to avoid stack overflow) ─────────────────────────── */
function floodFill(ctx, startX, startY, fillColor, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const sx = Math.floor(startX);
  const sy = Math.floor(startY);
  if (sx < 0 || sx >= width || sy < 0 || sy >= height) return;

  const startIdx = (sy * width + sx) * 4;
  const startR = data[startIdx], startG = data[startIdx + 1], startB = data[startIdx + 2], startA = data[startIdx + 3];

  // Parse fill color
  const tmp = document.createElement("canvas");
  tmp.width = tmp.height = 1;
  const tmpCtx = tmp.getContext("2d");
  tmpCtx.fillStyle = fillColor;
  tmpCtx.fillRect(0, 0, 1, 1);
  const fc = tmpCtx.getImageData(0, 0, 1, 1).data;
  const fillR = fc[0], fillG = fc[1], fillB = fc[2];

  if (startR === fillR && startG === fillG && startB === fillB && startA === 255) return;

  const tolerance = 32;
  const match = (i) =>
    Math.abs(data[i] - startR) <= tolerance &&
    Math.abs(data[i + 1] - startG) <= tolerance &&
    Math.abs(data[i + 2] - startB) <= tolerance &&
    Math.abs(data[i + 3] - startA) <= tolerance;

  const stack = [[sx, sy]];
  const visited = new Uint8Array(width * height);

  while (stack.length > 0) {
    const [cx, cy] = stack.pop();
    const idx = cy * width + cx;
    if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;
    if (visited[idx]) continue;
    const pi = idx * 4;
    if (!match(pi)) continue;
    visited[idx] = 1;
    data[pi] = fillR;
    data[pi + 1] = fillG;
    data[pi + 2] = fillB;
    data[pi + 3] = 255;
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }

  ctx.putImageData(imageData, 0, 0);
}

/* ── Component ──────────────────────────────────────────────────────────────── */
const Playground = ({ embedded = false }) => {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const containerRef = useRef(null);

  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fillShape, setFillShape] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPos, setTextPos] = useState(null);

  const isDrawingRef = useRef(false);
  const lastPosRef = useRef(null);
  const shapeStartRef = useRef(null);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  /* ── Init canvas with white bg ── */
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;
    const container = canvas.parentElement;
    const w = container.clientWidth;
    const h = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    for (const c of [canvas, overlay]) {
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = w + "px";
      c.style.height = h + "px";
      const ctx = c.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // White background
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, w, h);

    // Save initial state
    saveToHistory();
  }, []);

  useEffect(() => {
    initCanvas();
    const onResize = () => initCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [initCanvas]);

  /* ── History (undo/redo) ── */
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    // Trim redo stack
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
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
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

  /* ── Get mouse/touch position ── */
  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  /* ── Draw a line segment on the main canvas ── */
  const drawLine = useCallback((ctx, x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }, []);

  /* ── Shape preview on overlay ── */
  const drawShapePreview = useCallback((start, end) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    const w = overlay.clientWidth;
    const h = overlay.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "line") {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    } else if (tool === "rect") {
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const rw = Math.abs(end.x - start.x);
      const rh = Math.abs(end.y - start.y);
      if (fillShape) ctx.fillRect(x, y, rw, rh);
      else ctx.strokeRect(x, y, rw, rh);
    } else if (tool === "ellipse") {
      const cx = (start.x + end.x) / 2;
      const cy = (start.y + end.y) / 2;
      const rx = Math.abs(end.x - start.x) / 2;
      const ry = Math.abs(end.y - start.y) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
      if (fillShape) ctx.fill();
      else ctx.stroke();
    }
  }, [tool, color, brushSize, fillShape]);

  /* ── Commit shape from overlay to main canvas ── */
  const commitShape = useCallback((start, end) => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "line") {
      drawLine(ctx, start.x, start.y, end.x, end.y);
    } else if (tool === "rect") {
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const rw = Math.abs(end.x - start.x);
      const rh = Math.abs(end.y - start.y);
      if (fillShape) ctx.fillRect(x, y, rw, rh);
      else ctx.strokeRect(x, y, rw, rh);
    } else if (tool === "ellipse") {
      const cx = (start.x + end.x) / 2;
      const cy = (start.y + end.y) / 2;
      const rx = Math.abs(end.x - start.x) / 2;
      const ry = Math.abs(end.y - start.y) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
      if (fillShape) ctx.fill();
      else ctx.stroke();
    }

    // Clear overlay
    const oCtx = overlay.getContext("2d");
    oCtx.clearRect(0, 0, overlay.clientWidth, overlay.clientHeight);
    saveToHistory();
  }, [tool, color, brushSize, fillShape, drawLine, saveToHistory]);

  /* ── Pointer handlers ── */
  const handlePointerDown = (e) => {
    e.preventDefault();
    const pos = getPos(e);

    if (tool === "text") {
      setTextPos(pos);
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

    if (tool === "line" || tool === "rect" || tool === "ellipse") {
      shapeStartRef.current = pos;
    } else {
      // Brush / Eraser — draw a dot
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
      ctx.fillStyle = tool === "eraser" ? "#FFFFFF" : color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const pos = getPos(e);

    if (tool === "line" || tool === "rect" || tool === "ellipse") {
      drawShapePreview(shapeStartRef.current, pos);
    } else {
      // Brush / Eraser — continuous stroke
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const prev = lastPosRef.current;
      drawLine(ctx, prev.x, prev.y, pos.x, pos.y);
      lastPosRef.current = pos;
    }
  };

  const handlePointerUp = (e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (tool === "line" || tool === "rect" || tool === "ellipse") {
      const pos = getPos(e);
      commitShape(shapeStartRef.current, pos);
      shapeStartRef.current = null;
    } else {
      saveToHistory();
    }
    lastPosRef.current = null;
  };

  /* ── Text commit ── */
  const commitText = useCallback(() => {
    if (!textPos || !textInput.trim()) { setTextPos(null); setTextInput(""); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.font = `${Math.max(14, brushSize * 3)}px sans-serif`;
    ctx.textBaseline = "top";
    ctx.fillText(textInput, textPos.x, textPos.y);
    setTextPos(null);
    setTextInput("");
    saveToHistory();
  }, [textPos, textInput, color, brushSize, saveToHistory]);

  /* ── Clear canvas ── */
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    saveToHistory();
  };

  /* ── Save as PNG ── */
  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Create a temp canvas at DPR scale to export full resolution
    const link = document.createElement("a");
    link.download = "artpad-drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  /* ── Fullscreen ── */
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
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const handler = (e) => {
      if (textPos) return; // Don't intercept typing
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); saveImage(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, textPos]);

  const isShape = tool === "line" || tool === "rect" || tool === "ellipse";

  return (
    <section className={`relative ${embedded ? "" : "min-h-screen bg-[var(--color-bg)] dark:bg-transparent pt-24 pb-16"}`}>
      <div className={`relative mx-auto ${isFullscreen ? "max-w-none px-0" : embedded ? "" : "max-w-6xl px-4 sm:px-6"}`}>
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`relative flex flex-col overflow-hidden ${
            isFullscreen
              ? "w-screen h-screen"
              : "rounded-2xl border border-[var(--color-border)] shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
          }`}
          style={isFullscreen ? {} : { height: "clamp(500px, 70vh, 800px)" }}
        >
          {/* ── Toolbar ── */}
          <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-[var(--color-surface2)] border-b border-[var(--color-border)] shrink-0">
            {/* Tool buttons */}
            <div className="flex items-center gap-0.5 mr-2">
              {TOOLS.map((t) => {
                const active = tool === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                      active
                        ? "bg-[var(--color-primary)] text-white shadow-sm"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
                    }`}
                    title={t.label}
                  >
                    <t.Icon size={14} />
                    <span className="hidden lg:inline">{t.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="w-px h-6 bg-[var(--color-border)]" />

            {/* Fill toggle for shapes */}
            {isShape && (
              <>
                <button
                  onClick={() => setFillShape((f) => !f)}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ml-1 ${
                    fillShape
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
                  }`}
                  title="Fill shape"
                >
                  <Square size={12} className={fillShape ? "fill-current" : ""} />
                  <span className="hidden sm:inline">Fill</span>
                </button>
                <div className="w-px h-6 bg-[var(--color-border)]" />
              </>
            )}

            {/* Brush size */}
            <div className="flex items-center gap-1 ml-1">
              <button
                onClick={() => setBrushSize((s) => Math.max(1, s - 2))}
                className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                title="Smaller"
              >
                <Minus size={12} />
              </button>
              <div className="flex items-center justify-center w-8" title={`Size: ${brushSize}px`}>
                <div
                  className="rounded-full"
                  style={{
                    width: Math.max(4, Math.min(brushSize, 20)),
                    height: Math.max(4, Math.min(brushSize, 20)),
                    backgroundColor: tool === "eraser" ? "var(--color-text-muted)" : color,
                  }}
                />
              </div>
              <button
                onClick={() => setBrushSize((s) => Math.min(48, s + 2))}
                className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                title="Larger"
              >
                <Plus size={12} />
              </button>
              {/* Size presets */}
              <div className="hidden md:flex items-center gap-1 ml-1">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setBrushSize(s)}
                    className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                      brushSize === s
                        ? "bg-[var(--color-primary)]/20 ring-1 ring-[var(--color-primary)]"
                        : "hover:bg-[var(--color-surface)]"
                    }`}
                    title={`${s}px`}
                  >
                    <div
                      className="rounded-full bg-[var(--color-text)]"
                      style={{ width: Math.max(2, Math.min(s, 14)), height: Math.max(2, Math.min(s, 14)) }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="w-px h-6 bg-[var(--color-border)] ml-1" />

            {/* Actions */}
            <div className="flex items-center gap-0.5 ml-1">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={14} />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 size={14} />
              </button>
              <button
                onClick={clearCanvas}
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-500 hover:bg-[var(--color-surface)] transition-all"
                title="Clear"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-all"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
              </button>
            </div>

            {/* Save button — prominent */}
            <button
              onClick={saveImage}
              className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:brightness-110 shadow-sm"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary, var(--color-primary)))" }}
              title="Save as PNG (Ctrl+S)"
            >
              <Download size={14} />
              <span>Save PNG</span>
            </button>
          </div>

          {/* ── Color palette bar ── */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-surface)] border-b border-[var(--color-border)] shrink-0">
            {/* Active color preview */}
            <div className="flex items-center gap-2 mr-2">
              <div
                className="w-7 h-7 rounded-lg border-2 border-[var(--color-border)] shadow-inner"
                style={{ backgroundColor: color }}
                title={`Current: ${color}`}
              />
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                title="Custom color"
              />
            </div>

            <div className="w-px h-5 bg-[var(--color-border)]" />

            {/* Palette swatches */}
            <div className="flex items-center gap-0.5 flex-wrap ml-1">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-5 h-5 rounded transition-transform hover:scale-125 flex-shrink-0"
                  style={{
                    backgroundColor: c,
                    border: c === "#FFFFFF" ? "1px solid #d1d5db" : color === c ? `2px solid var(--color-primary)` : "1px solid transparent",
                    boxShadow: color === c ? `0 0 0 1px var(--color-primary)` : "none",
                  }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* ── Canvas area ── */}
          <div className="relative flex-1 overflow-hidden bg-[#F0F0F0] dark:bg-[#2A2A2E]">
            {/* Centered white canvas with shadow */}
            <div className="absolute inset-2 flex items-center justify-center">
              <div className="relative w-full h-full shadow-lg">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full touch-none"
                  style={{
                    cursor: tool === "text" ? "text" :
                            tool === "fill" ? "crosshair" :
                            tool === "eraser" ? "cell" : "crosshair",
                  }}
                  onMouseDown={handlePointerDown}
                  onMouseMove={handlePointerMove}
                  onMouseUp={handlePointerUp}
                  onMouseLeave={() => { isDrawingRef.current = false; lastPosRef.current = null; }}
                  onTouchStart={handlePointerDown}
                  onTouchMove={handlePointerMove}
                  onTouchEnd={handlePointerUp}
                />
                {/* Shape preview overlay */}
                <canvas
                  ref={overlayRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />

                {/* Text input overlay */}
                {textPos && (
                  <div
                    className="absolute z-20"
                    style={{ left: textPos.x, top: textPos.y }}
                  >
                    <input
                      type="text"
                      autoFocus
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") commitText(); if (e.key === "Escape") { setTextPos(null); setTextInput(""); } }}
                      onBlur={commitText}
                      className="bg-transparent border border-dashed border-blue-400 outline-none px-1 min-w-[80px]"
                      style={{
                        color: color,
                        fontSize: `${Math.max(14, brushSize * 3)}px`,
                        fontFamily: "sans-serif",
                      }}
                      placeholder="Type here..."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Status bar ── */}
          <div className="flex items-center justify-between px-3 py-1 bg-[var(--color-surface2)] border-t border-[var(--color-border)] text-[10px] text-[var(--color-text-muted)] shrink-0">
            <span>{tool.charAt(0).toUpperCase() + tool.slice(1)} tool · {brushSize}px</span>
            <span>Ctrl+Z Undo · Ctrl+Y Redo · Ctrl+S Save</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Playground;
