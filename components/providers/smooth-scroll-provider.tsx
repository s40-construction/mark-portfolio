"use client";

import Lenis from "lenis";
import { useEffect, type PropsWithChildren } from "react";

import { ScrollTrigger } from "@/animations/gsap";

export function SmoothScrollProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      return;
    }

    const lenis = new Lenis({ autoRaf: false });
    let frameId = 0;
  const updateScrollTrigger = () => ScrollTrigger.update();

    const onAnimationFrame = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(onAnimationFrame);
    };

    lenis.on("scroll", updateScrollTrigger);
    frameId = requestAnimationFrame(onAnimationFrame);
    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(frameId);
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();
    };
  }, []);

  return children;
}