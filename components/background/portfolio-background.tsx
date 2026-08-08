"use client";

import { useEffect, useRef } from "react";

type Point = {
  depth: number;
  driftX: number;
  driftY: number;
  x: number;
  y: number;
};

const createPoint = (): Point => ({
  depth: 0.35 + Math.random() * 0.65,
  driftX: (Math.random() - 0.5) * 0.000012,
  driftY: (Math.random() - 0.5) * 0.00001,
  x: Math.random(),
  y: Math.random(),
});

export function PortfolioBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: window.innerWidth * 0.68, y: window.innerHeight * 0.34 };
    let frameId = 0;
    let lastTime = 0;
    let isDocumentVisible = !document.hidden;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let nodes: Point[] = [];
    let cssUpdateFrameId = 0;
    let pendingPointerX = pointer.x;
    let pendingPointerY = pointer.y;
    let pendingScroll = false;
    let isScrolling = false;
    let scrollResumeTimer = 0;

    const flushCssUpdates = () => {
      cssUpdateFrameId = 0;
      document.documentElement.style.setProperty("--background-light-x", `${pendingPointerX}px`);
      document.documentElement.style.setProperty("--background-light-y", `${pendingPointerY}px`);

      if (pendingScroll) {
        pendingScroll = false;
        document.documentElement.style.setProperty(
          "--background-scroll-offset",
          `${Math.min(window.scrollY * -0.025, 72)}px`,
        );
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const nodeCount = Math.min(32, Math.max(14, Math.round((width * height) / 46000)));
      nodes = Array.from({ length: nodeCount }, createPoint);
    };

    const updatePointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pendingPointerX = event.clientX;
      pendingPointerY = event.clientY;

      if (!cssUpdateFrameId) {
        cssUpdateFrameId = requestAnimationFrame(flushCssUpdates);
      }
    };

    const updateParallax = () => {
      pendingScroll = true;
      isScrolling = true;
      window.clearTimeout(scrollResumeTimer);
      scrollResumeTimer = window.setTimeout(() => {
        isScrolling = false;
      }, 220);

      if (!cssUpdateFrameId) {
        cssUpdateFrameId = requestAnimationFrame(flushCssUpdates);
      }
    };

    const draw = (time: number) => {
      const delta = Math.min(time - lastTime || 16.67, 40);
      lastTime = time;
      context.clearRect(0, 0, width, height);

      const pointerRadius = Math.max(width, height) * 0.35;
      const pointerLight = context.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        pointerRadius,
      );
      pointerLight.addColorStop(0, "rgba(54, 115, 255, 0.13)");
      pointerLight.addColorStop(1, "rgba(54, 115, 255, 0)");
      context.fillStyle = pointerLight;
      context.fillRect(0, 0, width, height);

      for (const node of nodes) {
        node.x = (node.x + node.driftX * delta) % 1;
        node.y = (node.y + node.driftY * delta) % 1;

        if (node.x < 0) node.x += 1;
        if (node.y < 0) node.y += 1;
      }

      for (const node of nodes) {
        const nodeX = node.x * width;
        const nodeY = node.y * height;
        const distanceToPointer = Math.hypot(nodeX - pointer.x, nodeY - pointer.y);
        const proximity = Math.max(0, 1 - distanceToPointer / pointerRadius);
        const radius = 1 + node.depth * 1.5 + proximity * 0.8;
        context.fillStyle = `rgba(23, 28, 38, ${0.17 + proximity * 0.22})`;
        context.beginPath();
        context.arc(nodeX, nodeY, radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    let lastDrawTime = 0;
    const frameInterval = 1000 / 30;

    const animate = (time: number) => {
      if (!isScrolling && time - lastDrawTime >= frameInterval) {
        lastDrawTime = time;
        draw(time);
      }

      if (!reducedMotionQuery.matches && isDocumentVisible) {
        frameId = requestAnimationFrame(animate);
      }
    };

    const onVisibilityChange = () => {
      isDocumentVisible = !document.hidden;

      if (isDocumentVisible && !reducedMotionQuery.matches) {
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(animate);
      }
    };

    const onMotionPreferenceChange = () => {
      cancelAnimationFrame(frameId);
      draw(performance.now());

      if (!reducedMotionQuery.matches && isDocumentVisible) {
        frameId = requestAnimationFrame(animate);
      }
    };

    resize();
    updateParallax();
    draw(performance.now());

    if (!reducedMotionQuery.matches) {
      frameId = requestAnimationFrame(animate);
    }

    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", updateParallax, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotionQuery.addEventListener("change", onMotionPreferenceChange);

    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(cssUpdateFrameId);
      window.clearTimeout(scrollResumeTimer);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateParallax);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotionQuery.removeEventListener("change", onMotionPreferenceChange);
    };
  }, []);

  return (
    <div aria-hidden="true" className="portfolio-background" ref={backgroundRef}>
      <div className="portfolio-background__gradient" />
      <div className="portfolio-background__ambient" />
      <div className="portfolio-background__grid" />
      <div className="portfolio-background__grid portfolio-background__grid--fine" />
      <canvas className="portfolio-background__canvas" ref={canvasRef} />
      <div className="portfolio-background__grain" />
    </div>
  );
}