"use client";

import SplitType from "split-type";
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

  useEffect(() => {
    const progress = progressRef.current;

    if (!progress) {
      return;
    }

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
        if (scene && !reduceMotion) {
          gsap.fromTo(scene, { autoAlpha: 0.35, scale: 0.985 }, {
            autoAlpha: 1,
            ease: "none",
            scale: 1,
            scrollTrigger: { end: "center center", scrub: true, start: "top bottom", trigger: section },
          });
        }

        const title = section.querySelector<HTMLElement>("[data-editorial-title]");
        if (title && !reduceMotion) {
          const split = new SplitType(title, { types: "chars" });
          const characters = split.chars ?? [];
          splits.push(split);
          gsap.set(characters, { transformOrigin: "50% 100%", willChange: "filter, opacity, transform" });
          gsap.from(characters, {
            autoAlpha: 0,
            ease: "power4.out",
            filter: "blur(0.55rem)",
            stagger: 0.025,
            yPercent: 85,
            scrollTrigger: { end: "top 44%", start: "top 82%", toggleActions: "play none none reverse", trigger: title },
          });
        }

        section.querySelectorAll<HTMLElement>("[data-editorial-parallax]").forEach((element) => {
          if (!reduceMotion) {
            gsap.to(element, {
              ease: "none",
              yPercent: -8,
              scrollTrigger: { end: "bottom top", scrub: true, start: "top bottom", trigger: section },
            });
          }
        });
      });
    });

    return () => {
      context.revert();
      splits.forEach((split) => split.revert());
    };
  }, [reduceMotion]);

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