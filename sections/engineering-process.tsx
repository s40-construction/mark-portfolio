"use client";

import { Code2, Compass, Rocket, ScanLine, Search, SquareDashed } from "lucide-react";
import SplitType from "split-type";
import { useLayoutEffect, useRef, useState } from "react";

import { gsap } from "@/animations/gsap";
import { useReducedMotion } from "@/animations/motion";
import "@/styles/engineering-process.css";

const stages = [
  { detail: "Goals / Users / Requirements", fragment: "const brief = listen();", icon: Search, name: "Discover", note: "Every useful product begins by clarifying the real problem, the people involved, and the result they need.", number: "01", pattern: "orbit" },
  { detail: "Patterns / Flows / Architecture", fragment: "map(userJourney);", icon: Compass, name: "Research", note: "I study comparable products and established UX patterns before selecting a calm, maintainable path forward.", number: "02", pattern: "grid" },
  { detail: "Wireframes / UI / Usability", fragment: "layout = intent + rhythm;", icon: SquareDashed, name: "Design", note: "Wireframes turn the brief into hierarchy. The visual system follows, with editorial rhythm and usability held together.", number: "03", pattern: "frame" },
  { detail: "Components / Motion / Performance", fragment: "export const clarity = true;", icon: Code2, name: "Develop", note: "I build reusable React and Next.js components, responsive layouts, purposeful motion, and a structure that stays readable.", number: "04", pattern: "code" },
  { detail: "Browsers / Access / Refinement", fragment: "assert(experience.isClear);", icon: ScanLine, name: "Test", note: "Testing crosses screen sizes, browsers, accessibility details, and performance. Small checks keep quality from becoming an afterthought.", number: "05", pattern: "scan" },
  { detail: "GitHub / Build / Maintenance", fragment: "git push origin main", icon: Rocket, name: "Deploy", note: "A production build is a beginning, not a finish: release carefully, optimize what matters, and keep the system ready to evolve.", number: "06", pattern: "launch" },
] as const;

export function EngineeringProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section || reduceMotion) {
      return;
    }

    const title = section.querySelector<HTMLElement>(".engineering-process__title");
    if (!title) {
      return;
    }

    const split = new SplitType(title, { types: "words,chars" });
    const characters = split.chars ?? [];
    const context = gsap.context(() => {
      gsap.set(characters, { transformOrigin: "50% 100%", willChange: "filter, opacity, transform" });
      gsap.timeline({ scrollTrigger: { start: "top 74%", toggleActions: "play none none reverse", trigger: section } })
        .from(".engineering-process__eyebrow, .engineering-process__index", { autoAlpha: 0, duration: 0.55, ease: "power3.out", stagger: 0.08, y: 12 })
        .from(characters, { autoAlpha: 0, duration: 0.75, ease: "power4.out", filter: "blur(0.45rem)", stagger: 0.02, yPercent: 90 }, "-=0.25")
        .from(".engineering-process__subtitle, .engineering-process__method", { autoAlpha: 0, duration: 0.65, ease: "power3.out", stagger: 0.08, y: 16 }, "-=0.38");

      const line = section.querySelector<HTMLElement>(".engineering-process__line-fill");
      if (line) {
        gsap.fromTo(line, { scaleX: 0 }, {
          ease: "none",
          scaleX: 1,
          transformOrigin: "left center",
          scrollTrigger: { end: "bottom 58%", scrub: true, start: "top 76%", trigger: ".engineering-process__timeline" },
        });
      }

      section.querySelectorAll<HTMLElement>(".process-stage").forEach((stage, index) => {
        const icon = stage.querySelector<HTMLElement>(".process-stage__icon");
        const visual = stage.querySelector<HTMLElement>(".process-stage__visual");
        gsap.timeline({ scrollTrigger: { start: "top 82%", toggleActions: "play none none reverse", trigger: stage } })
          .from(stage, { autoAlpha: 0, duration: 0.65, ease: "power3.out", y: 24 })
          .from(icon, { duration: 0.72, ease: "back.out(1.8)", rotate: index % 2 === 0 ? -14 : 14, scale: 0.76 }, "-=0.44");

        if (visual) {
          gsap.to(visual, {
            ease: "none",
            yPercent: -10,
            scrollTrigger: { end: "bottom top", scrub: true, start: "top bottom", trigger: stage },
          });
        }
      });
    }, section);

    return () => {
      context.revert();
      split.revert();
    };
  }, [reduceMotion]);

  return (
    <section aria-labelledby="engineering-process-title" className="engineering-process" data-editorial-section="experience" id="process" ref={sectionRef}>
      <div className="engineering-process__inner" data-editorial-scene>
        <header className="engineering-process__header">
          <p className="engineering-process__eyebrow">Issue 05 / Methodology</p>
          <div>
            <h2 className="engineering-process__title" id="engineering-process-title">Engineering<br />Process</h2>
            <p className="engineering-process__subtitle">Every great product starts with understanding the problem.</p>
          </div>
          <div className="engineering-process__method">
            <span>Reading time / 3 minutes</span>
            <span>Framework / Discover to Deploy</span>
            <span>Method / Human-centered engineering</span>
          </div>
        </header>

        <div className="engineering-process__index" aria-live="polite">
          <span>Process index</span>
          <strong>{stages[activeStage].number} / {stages[activeStage].name}</strong>
          <i aria-hidden="true">●</i>
        </div>

        <div className="engineering-process__timeline">
          <div aria-hidden="true" className="engineering-process__line"><span className="engineering-process__line-fill" /></div>
          <div className="engineering-process__stages">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index === activeStage;
              return (
                <article aria-current={isActive ? "step" : undefined} className={`process-stage process-stage--${stage.pattern}`} key={stage.number} onFocus={() => setActiveStage(index)} onPointerEnter={() => setActiveStage(index)} tabIndex={0}>
                  <div className="process-stage__node"><i /></div>
                  <p className="process-stage__number">{stage.number}</p>
                  <div className="process-stage__visual" aria-hidden="true"><span /><span /><span /><Icon className="process-stage__icon" size={30} strokeWidth={1.25} /></div>
                  <p className="process-stage__caption">Stage / {stage.number}</p>
                  <h3>{stage.name}</h3>
                  <p className="process-stage__detail">{stage.detail}</p>
                  <p className="process-stage__note">{stage.note}</p>
                  <code>{stage.fragment}</code>
                </article>
              );
            })}
          </div>
        </div>
      </div>
      <div className="engineering-process__next"><span>Next chapter</span><strong>Contact</strong><i aria-hidden="true">↓</i></div>
    </section>
  );
}