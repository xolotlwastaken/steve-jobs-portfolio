"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";

export interface InkRevealProps {
  /** Optional base image URL to display as the top layer (e.g. mature portrait) */
  imageSrc?: string;
  /** Optional reveal image URL to reveal inside the carved ink stamps (e.g. young portrait) */
  revealImageSrc?: string;
  /** RGB color of the mask overlay when imageSrc is omitted, e.g. [252, 250, 248] */
  maskColor?: [number, number, number];
  /** Radius of each ink stamp in px */
  brushSize?: number;
  /** How long each stamp lives before fading (ms) */
  lifetime?: number;
  /** Initial radius before the stamp expands */
  rStart?: number;
  /** Random variation factor for stamp radius (0–1) */
  rVary?: number;
  /** Min pixel distance between stamps along a stroke */
  stampStep?: number;
  /** Max stamps alive at once (oldest are pruned) */
  maxStamps?: number;
  /** Number of segments on the wobble circle (higher = smoother) */
  segments?: number;
  /** Wobble amplitude weights [primary, secondary, tertiary] */
  wobble?: [number, number, number];
  /** Gradient inner-radius factor (0–1, relative to stamp radius) */
  gradientInnerRadius?: number;
  /** Gradient opacity stops [center, mid, edge] */
  gradientStops?: [number, number, number];
  /** Extra CSS class for the canvas element */
  className?: string;
  /** Extra inline styles for the canvas element */
  style?: React.CSSProperties;
}

interface Stamp {
  x: number;
  y: number;
  born: number;
  seed: number;
  rmax: number;
}

export default function InkReveal({
  imageSrc,
  revealImageSrc,
  maskColor = [252, 250, 248],
  brushSize = 128,
  lifetime = 600,
  rStart = 10,
  rVary = 0.45,
  stampStep = 10,
  maxStamps = 200,
  segments = 36,
  wobble = [0.14, 0.08, 0.05],
  gradientInnerRadius = 0.2,
  gradientStops = [0.95, 0.88, 0],
  className,
  style,
}: InkRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stampsRef = useRef<Stamp[]>([]);
  const runningRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const dimsRef = useRef({ w: 0, h: 0 });
  const dprRef = useRef(1);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const revealImgRef = useRef<HTMLImageElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  const mc = maskColor;

  // Initialize offscreen canvas once
  if (!offscreenCanvasRef.current && typeof document !== "undefined") {
    offscreenCanvasRef.current = document.createElement("canvas");
  }

  const drawBaseLayer = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      if (imgRef.current && imgRef.current.complete) {
        ctx.drawImage(imgRef.current, 0, 0, w, h);
      } else {
        ctx.fillStyle = `rgb(${mc[0]},${mc[1]},${mc[2]})`;
        ctx.fillRect(0, 0, w, h);
      }
    },
    [mc]
  );

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    const rect = parent.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    dimsRef.current = { w, h };
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawBaseLayer(ctx, w, h);
  }, [drawBaseLayer]);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      drawBaseLayer(ctx, dimsRef.current.w, dimsRef.current.h);
    };
    if (img.complete) {
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) drawBaseLayer(ctx, dimsRef.current.w, dimsRef.current.h);
      }
    }
  }, [imageSrc, drawBaseLayer]);

  useEffect(() => {
    if (!revealImageSrc) return;
    const rImg = new Image();
    rImg.crossOrigin = "anonymous";
    rImg.src = revealImageSrc;
    rImg.onload = () => {
      revealImgRef.current = rImg;
    };
    if (rImg.complete) {
      revealImgRef.current = rImg;
    }
  }, [revealImageSrc]);

  const carveInk = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      seed: number,
      alpha: number
    ) => {
      const g = ctx.createRadialGradient(
        x,
        y,
        r * gradientInnerRadius,
        x,
        y,
        r
      );
      g.addColorStop(0, `rgba(0,0,0,${gradientStops[0] * alpha})`);
      g.addColorStop(0.5, `rgba(0,0,0,${gradientStops[1] * alpha})`);
      g.addColorStop(1, `rgba(0,0,0,${gradientStops[2] * alpha})`);
      ctx.fillStyle = g;

      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const wob =
          0.78 +
          wobble[0] * Math.sin(a * 3 + seed) +
          wobble[1] * Math.sin(a * 5 + seed * 2.1) +
          wobble[2] * Math.sin(a * 7 + seed * 0.7);
        const px = x + Math.cos(a) * r * wob;
        const py = y + Math.sin(a) * r * wob;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    },
    [segments, wobble, gradientInnerRadius, gradientStops]
  );

  const addStamp = useCallback(
    (x: number, y: number) => {
      const stamps = stampsRef.current;
      if (stamps.length >= maxStamps) stamps.shift();
      stamps.push({
        x,
        y,
        born: performance.now(),
        seed: Math.random() * Math.PI * 2,
        rmax: brushSize * (1 - rVary + Math.random() * rVary),
      });
    },
    [brushSize, rVary, maxStamps]
  );

  const stampAlong = useCallback(
    (x: number, y: number) => {
      const last = lastPosRef.current;
      if (!last) {
        addStamp(x, y);
      } else {
        const dx = x - last.x;
        const dy = y - last.y;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.ceil(dist / stampStep));
        for (let i = 1; i <= steps; i++) {
          addStamp(last.x + (dx * i) / steps, last.y + (dy * i) / steps);
        }
      }
      lastPosRef.current = { x, y };
    },
    [addStamp, stampStep]
  );

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = dimsRef.current;
    const dpr = dprRef.current;
    const now = performance.now();
    const stamps = stampsRef.current;
    const off = offscreenCanvasRef.current;

    if (off && (off.width !== canvas.width || off.height !== canvas.height)) {
      off.width = canvas.width;
      off.height = canvas.height;
    }

    if (off && stamps.length > 0) {
      const offCtx = off.getContext("2d");
      if (offCtx) {
        offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        offCtx.clearRect(0, 0, w, h);
        offCtx.globalCompositeOperation = "source-over";

        for (let i = stamps.length - 1; i >= 0; i--) {
          const t = (now - stamps[i].born) / lifetime;
          if (t >= 1) {
            stamps.splice(i, 1);
            continue;
          }
          const ease = 1 - Math.pow(1 - t, 3);
          const r = rStart + (stamps[i].rmax - rStart) * ease;
          const alpha = 1 - t * t;
          carveInk(offCtx, stamps[i].x, stamps[i].y, r, stamps[i].seed, alpha);
        }

        // Draw base layer
        drawBaseLayer(ctx, w, h);

        if (revealImgRef.current && revealImgRef.current.complete) {
          // Cut holes in base layer
          ctx.globalCompositeOperation = "destination-out";
          ctx.drawImage(off, 0, 0, w, h);

          // Composite reveal image only within the stamp areas on the offscreen canvas
          offCtx.globalCompositeOperation = "source-in";
          offCtx.drawImage(revealImgRef.current, 0, 0, w, h);

          // Draw the masked reveal image over the cut holes
          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(off, 0, 0, w, h);
        } else {
          // Standard destination-out mode (reveals whatever HTML element is underneath)
          ctx.globalCompositeOperation = "destination-out";
          ctx.drawImage(off, 0, 0, w, h);
        }
      }
    } else {
      drawBaseLayer(ctx, w, h);
    }

    if (stamps.length) {
      requestAnimationFrame(loop);
    } else {
      runningRef.current = false;
      drawBaseLayer(ctx, w, h);
    }
  }, [carveInk, drawBaseLayer, lifetime, rStart]);

  const startLoop = useCallback(() => {
    if (!runningRef.current) {
      runningRef.current = true;
      requestAnimationFrame(loop);
    }
  }, [loop]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  const getRelativePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          cursor: "crosshair",
          ...style,
        }}
        onMouseEnter={(e) => {
          const pos = getRelativePos(e);
          lastPosRef.current = pos;
          setCursorPos(pos);
          stampAlong(pos.x, pos.y);
          startLoop();
        }}
        onMouseMove={(e) => {
          const pos = getRelativePos(e);
          setCursorPos(pos);
          stampAlong(pos.x, pos.y);
          startLoop();
        }}
        onMouseLeave={() => {
          lastPosRef.current = null;
          setCursorPos(null);
        }}
        onTouchStart={(e) => {
          if (!e.touches[0]) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const pos = {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top,
          };
          lastPosRef.current = pos;
          stampAlong(pos.x, pos.y);
          startLoop();
        }}
        onTouchMove={(e) => {
          if (!e.touches[0]) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const pos = {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top,
          };
          stampAlong(pos.x, pos.y);
          startLoop();
        }}
        onTouchEnd={() => {
          lastPosRef.current = null;
        }}
      />
      {cursorPos && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/50 bg-cream/10 backdrop-blur-[1px] transition-transform duration-75 z-10"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            width: brushSize * 0.7,
            height: brushSize * 0.7,
          }}
        />
      )}
    </>
  );
}
