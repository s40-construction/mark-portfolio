"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";

const languageMarks = [
  "</HTML>",
  "CSS.grid",
  "const ui",
  "PHP::render",
  "SELECT *",
  "firebase.app",
  "git push",
  "API.fetch",
  "gsap.to()",
] as const;

type Point = {
  depth: number;
  driftX: number;
  driftY: number;
  x: number;
  y: number;
};

type LanguageMark = Point & {
  label: (typeof languageMarks)[number];
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
    const background = backgroundRef.current;

    if (!background || window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap.to(".portfolio-background__gradient", {
        duration: 22,
        ease: "sine.inOut",
        repeat: -1,
        scale: 1.12,
        transformOrigin: "center",
        xPercent: 3,
        yPercent: -2,
        yoyo: true,
      });

      gsap.to(".portfolio-background__grid", {
        duration: 28,
        ease: "sine.inOut",
        repeat: -1,
        xPercent: -1.5,
        yPercent: 1,
        yoyo: true,
      });
    }, background);

    return () => context.revert();
  }, []);

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
    let marks: LanguageMark[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const nodeCount = Math.min(54, Math.max(22, Math.round((width * height) / 30000)));
      nodes = Array.from({ length: nodeCount }, createPoint);
      marks = languageMarks.map((label) => ({ ...createPoint(), label }));
    };

    const updatePointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      document.documentElement.style.setProperty("--background-light-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--background-light-y", `${event.clientY}px`);
    };

    const updateParallax = () => {
      document.documentElement.style.setProperty(
        "--background-scroll-offset",
        `${Math.min(window.scrollY * -0.025, 72)}px`,
      );
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

      context.lineWidth = 1;
      for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
        const first = nodes[firstIndex];
        const firstX = first.x * width;
        const firstY = first.y * height;

        for (let secondIndex = firstIndex + 1; secondIndex < nodes.length; secondIndex += 1) {
          const second = nodes[secondIndex];
          const secondX = second.x * width;
          const secondY = second.y * height;
          const distance = Math.hypot(secondX - firstX, secondY - firstY);
          const maxDistance = 150 * ((first.depth + second.depth) / 2);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.14;
            context.strokeStyle = `rgba(23, 28, 38, ${opacity})`;
            context.beginPath();
            context.moveTo(firstX, firstY);
            context.lineTo(secondX, secondY);
            context.stroke();
          }
        }
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

      context.font = '500 10px "Helvetica Neue", sans-serif';
      context.textBaseline = "middle";
      for (const mark of marks) {
        mark.x = (mark.x + mark.driftX * delta * 0.5) % 1;
        mark.y = (mark.y + mark.driftY * delta * 0.5) % 1;

        if (mark.x < 0) mark.x += 1;
        if (mark.y < 0) mark.y += 1;

        const markX = mark.x * width;
        const markY = mark.y * height;
        const alpha = 0.12 + mark.depth * 0.12;
        context.fillStyle = `rgba(23, 28, 38, ${alpha})`;
        context.fillText(mark.label, markX, markY);
      }
    };

    const animate = (time: number) => {
      draw(time);

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