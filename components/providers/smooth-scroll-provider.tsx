"use client";

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

    // Native scroll instead of JS-virtualized smooth scroll: the browser's own compositor-driven
    // scrolling is far less prone to FPS drops than any JS smoothing layer running every frame.
    let previousScroll = window.scrollY;
    const onScroll = () => {
      const scroll = window.scrollY;
      const isScrollingDown = scroll > previousScroll + 4;
      const isScrollingUp = scroll < previousScroll - 4;

      if (scroll <= 32 || isScrollingUp) {
        document.documentElement.classList.remove("is-scrolling-down");
      } else if (isScrollingDown) {
        document.documentElement.classList.add("is-scrolling-down");
      }

      previousScroll = scroll;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.classList.remove("is-scrolling-down");
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return children;
}