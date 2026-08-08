"use client";

import SplitType from "split-type";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useReducedMotion } from "@/animations/motion";
import "@/styles/scroll-system.css";

const sectionLabels = ["Home", "About", "Skills", "Projects", "Experience", "Contact"] as const;

export function EditorialScrollSystem() {
  const systemRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [activeSection, setActiveSection] = useState<(typeof sectionLabels)[number]>("Home");
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    const progress = progressRef.current;

    if (!progress) {
      return;
    }

    const simplifyEffects = reduceMotion || window.matchMedia("(pointer: coarse)").matches;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-editorial-section]"));
    const splits: SplitType[] = [];
    const context = gsap.context(() => {
      const progressAxis = window.matchMedia("(max-width: 47.999rem)").matches ? "scaleX" : "scaleY";
      const setProgress = gsap.quickTo(progress, progressAxis, { duration: reduceMotion ? 0 : 0.25, ease: "power2.out" });

      ScrollTrigger.create({
        end: "max",
        onUpdate: (self) => setProgress(self.progress),
        start: 0,
      });

      sections.forEach((section) => {
        const sectionName = section.dataset.editorialSection;
        const label = sectionLabels.find((item) => item.toLowerCase() === sectionName);

        if (label) {
          ScrollTrigger.create({
            end: "bottom center",
            onEnter: () => setActiveSection(label),
            onEnterBack: () => setActiveSection(label),
            start: "top center",
            trigger: section,
          });
        }

        const scene = section.querySelector<HTMLElement>("[data-editorial-scene]");
        if (scene && !simplifyEffects) {
          gsap.from(scene, {
            autoAlpha: 0.35,
            duration: 0.6,
            ease: "power2.out",
            scale: 0.985,
            scrollTrigger: { start: "top 82%", toggleActions: "play none none reverse", trigger: section },
          });
        }

        const title = section.querySelector<HTMLElement>("[data-editorial-title]");
        if (title && !simplifyEffects) {
          const split = new SplitType(title, { types: "chars" });
          const characters = split.chars ?? [];
          splits.push(split);
          gsap.set(characters, { transformOrigin: "50% 100%", willChange: "filter, opacity, transform" });
          gsap.from(characters, {
            autoAlpha: 0,
            ease: "power4.out",
            filter: "blur(0.55rem)",
            onComplete: () => gsap.set(characters, { willChange: "auto" }),
            onReverseComplete: () => gsap.set(characters, { willChange: "auto" }),
            stagger: 0.025,
            yPercent: 85,
            scrollTrigger: { end: "top 44%", start: "top 82%", toggleActions: "play none none reverse", trigger: title },
          });
        }
      });
    });

    return () => {
      context.revert();
      splits.forEach((split) => split.revert());
    };
  }, [pathname, reduceMotion]);

  useEffect(() => {
    const system = systemRef.current;

    if (!system) {
      return;
    }

    const items = Array.from(system.querySelectorAll<HTMLElement>(".editorial-scroll-system__sections li"));
    const activeItem = items.find((item) => item.getAttribute("aria-current") === "step");
    gsap.to(items, { duration: reduceMotion ? 0 : 0.35, opacity: 0.38, overwrite: true, x: 0 });
    if (activeItem) {
      gsap.to(activeItem, { duration: reduceMotion ? 0 : 0.55, ease: "power3.out", opacity: 1, overwrite: true, x: 4 });
    }
  }, [activeSection, reduceMotion]);

  return (
    <aside aria-label={`Current section: ${activeSection}`} className="editorial-scroll-system" ref={systemRef}>
      <div aria-hidden="true" className="editorial-scroll-system__progress">
        <span ref={progressRef} />
      </div>
      <ol className="editorial-scroll-system__sections">
        {sectionLabels.map((label, index) => (
          <li aria-current={activeSection === label ? "step" : undefined} key={label}>
            <span>{label}</span>
            {index < sectionLabels.length - 1 ? <i aria-hidden="true">↓</i> : null}
          </li>
        ))}
      </ol>
    </aside>
  );
}