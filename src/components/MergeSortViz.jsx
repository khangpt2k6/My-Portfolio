import { useEffect, useRef } from "react";

const MergeSortViz = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const runSort = () => {
      if (!mountedRef.current) return;

      // Set canvas size to match parent (2x for retina)
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
      const W = rect.width;
      const H = rect.height;

      const N = 40;
      // Create and shuffle array
      let arr = Array.from({ length: N }, (_, i) => (i + 1) / N);
      for (let i = N - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      // Pre-compute frames
      const frames = [];
      const snap = (active = [], merged = []) => {
        frames.push({
          arr: [...arr],
          active: new Set(active),
          merged: new Set(merged),
        });
      };

      snap(); // initial state

      function mergeSort(start, end) {
        if (end - start <= 1) return;
        const mid = Math.floor((start + end) / 2);
        mergeSort(start, mid);
        mergeSort(mid, end);
        merge(start, mid, end);
      }

      function merge(start, mid, end) {
        const temp = [];
        let i = start,
          j = mid;
        while (i < mid && j < end) {
          snap([i, j]);
          if (arr[i] <= arr[j]) temp.push(arr[i++]);
          else temp.push(arr[j++]);
        }
        while (i < mid) {
          snap([i]);
          temp.push(arr[i++]);
        }
        while (j < end) {
          snap([j]);
          temp.push(arr[j++]);
        }

        const placed = [];
        for (let k = 0; k < temp.length; k++) {
          arr[start + k] = temp[k];
          placed.push(start + k);
        }
        snap([], placed);
      }

      mergeSort(0, N);
      // Final sorted frame
      snap(
        [],
        Array.from({ length: N }, (_, i) => i),
      );

      // Animate through frames
      let fi = 0;
      const barGap = 1;
      const barWidth = (W - barGap) / N;
      const padBottom = 4;

      const draw = () => {
        if (!mountedRef.current) return;
        if (fi >= frames.length) {
          // Hold sorted state, then restart
          animRef.current = setTimeout(() => runSort(), 2000);
          return;
        }

        const frame = frames[fi];
        ctx.clearRect(0, 0, W, H);

        frame.arr.forEach((val, idx) => {
          const barH = val * (H - padBottom - 8) + 8;
          const x = idx * barWidth + barGap / 2;
          const w = barWidth - barGap;
          const y = H - padBottom - barH;

          ctx.save();
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;

          if (frame.active.has(idx)) {
            ctx.fillStyle = "#22D3EE";
            ctx.shadowColor = "#22D3EE";
            ctx.shadowBlur = 12;
          } else if (frame.merged.has(idx)) {
            ctx.fillStyle = "#34D399";
            ctx.shadowColor = "#34D399";
            ctx.shadowBlur = 8;
          } else {
            const grad = ctx.createLinearGradient(x, y, x, H - padBottom);
            grad.addColorStop(0, "#818CF8");
            grad.addColorStop(1, "#4F46E5");
            ctx.fillStyle = grad;
          }

          // Rounded top bar
          const r = 2;
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + w - r, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
          ctx.lineTo(x + w, H - padBottom);
          ctx.lineTo(x, H - padBottom);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.fill();

          ctx.restore();
        });

        fi++;
        animRef.current = setTimeout(draw, 60);
      };

      draw();
    };

    runSort();

    return () => {
      mountedRef.current = false;
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
};

export default MergeSortViz;
