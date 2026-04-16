"use client";

import { useEffect, useRef } from "react";

/**
 * Port of Framer “Interactive Dot Grid” — canvas dots with pointer distortion.
 * https://framer.com/m/InteractiveDotGrid-1-cbaw.js
 *
 * useWindowPointer: track viewport mouse so the layer can stay pointer-events-none
 * (dots animate when moving over the page, UI above stays clickable).
 */
export default function InteractiveDotGrid({
  className = "",
  dotSize = 1,
  dotSpacing = 20,
  /** Default dot color (rest of the grid). */
  dotColor = "rgba(255, 255, 255, 0.4)",
  /** Only dots within `distortionRadius` of the cursor use this color. */
  hoverDotColor = "rgba(204, 255, 0, 0.85)",
  distortionRadius = 100,
  distortionStrength = 30,
  animationSpeed = 0.15,
  useWindowPointer = true,
}) {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const animationFrameId = useRef(0);
  const needsUpdateRef = useRef(true);
  const dotsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initializeDots = (width, height) => {
      const cols = Math.ceil(width / dotSpacing);
      const rows = Math.ceil(height / dotSpacing);
      const dots = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * dotSpacing + dotSpacing / 2;
          const y = row * dotSpacing + dotSpacing / 2;
          dots.push({
            originalX: x,
            originalY: y,
            currentX: x,
            currentY: y,
            randomOffsetX: 0,
            randomOffsetY: 0,
            isRandomized: false,
            col,
            row,
          });
        }
      }
      dotsRef.current = dots;
    };

    const setMouseFromEvent = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      needsUpdateRef.current = true;
    };

    const leaveMouse = () => {
      mousePos.current = { x: -1000, y: -1000 };
      needsUpdateRef.current = true;
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initializeDots(canvas.width, canvas.height);
      needsUpdateRef.current = true;
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    const animate = () => {
      if (needsUpdateRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const mouseCol = Math.floor(mousePos.current.x / dotSpacing);
        const mouseRow = Math.floor(mousePos.current.y / dotSpacing);
        const checkRadius = Math.ceil(distortionRadius / dotSpacing) + 1;
        const mouseActive = mousePos.current.x > -500;

        let hasMovingDots = false;

        dotsRef.current.forEach((dot) => {
          const colDiff = Math.abs(dot.col - mouseCol);
          const rowDiff = Math.abs(dot.row - mouseRow);

          if (colDiff <= checkRadius && rowDiff <= checkRadius) {
            const dx = mousePos.current.x - dot.originalX;
            const dy = mousePos.current.y - dot.originalY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            let targetX = dot.originalX;
            let targetY = dot.originalY;

            if (distance < distortionRadius) {
              if (!dot.isRandomized) {
                dot.randomOffsetX =
                  (Math.random() - 0.5) * distortionStrength * 2;
                dot.randomOffsetY =
                  (Math.random() - 0.5) * distortionStrength * 2;
                dot.isRandomized = true;
              }
              targetX = dot.originalX + dot.randomOffsetX;
              targetY = dot.originalY + dot.randomOffsetY;
            } else if (dot.isRandomized) {
              dot.isRandomized = false;
            }

            dot.currentX += (targetX - dot.currentX) * animationSpeed;
            dot.currentY += (targetY - dot.currentY) * animationSpeed;

            if (
              Math.abs(dot.currentX - targetX) > 0.1 ||
              Math.abs(dot.currentY - targetY) > 0.1
            ) {
              hasMovingDots = true;
            }
          } else {
            if (dot.isRandomized) dot.isRandomized = false;
            const targetX = dot.originalX;
            const targetY = dot.originalY;
            dot.currentX += (targetX - dot.currentX) * animationSpeed;
            dot.currentY += (targetY - dot.currentY) * animationSpeed;
            if (
              Math.abs(dot.currentX - targetX) > 0.1 ||
              Math.abs(dot.currentY - targetY) > 0.1
            ) {
              hasMovingDots = true;
            }
          }

          const dxColor = mousePos.current.x - dot.originalX;
          const dyColor = mousePos.current.y - dot.originalY;
          const distColor = Math.sqrt(dxColor * dxColor + dyColor * dyColor);
          const inHoverRing =
            mouseActive && distColor < distortionRadius;

          ctx.fillStyle = inHoverRing ? hoverDotColor : dotColor;
          ctx.beginPath();
          ctx.arc(dot.currentX, dot.currentY, dotSize / 2, 0, Math.PI * 2);
          ctx.fill();
        });

        needsUpdateRef.current = hasMovingDots;
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    if (useWindowPointer) {
      window.addEventListener("mousemove", setMouseFromEvent, {
        passive: true,
      });
    } else {
      canvas.addEventListener("mousemove", setMouseFromEvent);
      canvas.addEventListener("mouseleave", leaveMouse);
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      if (useWindowPointer) {
        window.removeEventListener("mousemove", setMouseFromEvent);
      } else {
        canvas.removeEventListener("mousemove", setMouseFromEvent);
        canvas.removeEventListener("mouseleave", leaveMouse);
      }
    };
  }, [
    dotSize,
    dotSpacing,
    dotColor,
    hoverDotColor,
    distortionRadius,
    distortionStrength,
    animationSpeed,
    useWindowPointer,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        cursor: useWindowPointer ? "default" : "none",
      }}
      aria-hidden
    />
  );
}
