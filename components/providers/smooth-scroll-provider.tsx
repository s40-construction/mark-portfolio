"use client";

import Lenis from "lenis";
import { useEffect, type PropsWithChildren } from "react";

import { ScrollTrigger } from "@/animations/gsap";

export function SmoothScrollProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    window.scrollTo({ behavior: "auto", top: 0 });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      return () => {
        window.history.scrollRestoration = previousScrollRestoration;
      };
    }

    const lenis = new Lenis({ autoRaf: false });
    lenis.scrollTo(0, { immediate: true });
    let frameId = 0;
    let previousScroll = 0;
    const updateScrollTrigger = ({ scroll }: { scroll: number }) => {
      ScrollTrigger.update();
      const isScrollingDown = scroll > previousScroll + 4;
      const isScrollingUp = scroll < previousScroll - 4;

      if (scroll <= 32 || isScrollingUp) {
        document.documentElement.classList.remove("is-scrolling-down");
      } else if (isScrollingDown) {
        document.documentElement.classList.add("is-scrolling-down");
      }

      previousScroll = scroll;
    };

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
      document.documentElement.classList.remove("is-scrolling-down");
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return children;
}