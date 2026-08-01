"use client";

import { Braces, Database, LayoutTemplate, MonitorSmartphone } from "lucide-react";
import SplitType from "split-type";
import { useLayoutEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { useReducedMotion } from "@/animations/motion";
import "@/styles/selected-works.css";

const projects = [
  {
    challenge: "Present specialist temporary works and scaffolding services with the confidence and precision expected by commercial construction clients.",
    detail: "An editorial system combines generous space, structural grids, and purposeful motion so technical expertise feels direct rather than dense.",
    name: "S40 Construction", number: "01", role: "Frontend Developer", stack: "Next.js / React / GSAP / Framer Motion / Firebase", story: "Construction Company Website", visual: "construction",
  },
  {
    challenge: "Reduce manual encoding in a hospital transaction flow while keeping each handoff traceable for staff and administrators.",
    detail: "The system maps voice input to a structured transaction flow, with PHP and MySQL connecting the prototype, data model, and daily operational needs.",
    name: "Hospital Voice Transaction System", number: "02", role: "System Analyst / Full Stack Developer", stack: "PHP / MySQL / JavaScript", story: "Voice-enabled workflow", visual: "hospital",
  },
  {
    challenge: "Create a portfolio that makes the thinking behind the work as visible as the finished interface.",
    detail: "This site is an evolving case study in editorial systems, type, motion, and responsive engineering. It exists to make a professional practice tangible.",
    name: "Portfolio Website", number: "03", role: "Designer / Developer", stack: "Next.js / GSAP / Three.js / TypeScript", story: "An interface for the practice", visual: "portfolio",
  },
] as const;

export function SelectedWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section || reduceMotion) {
      return;
    }

    const splits: SplitType[] = [];
    const context = gsap.context(() => {
      const chapterTitle = section.querySelector<HTMLElement>(".selected-works__title");
      if (chapterTitle) {
        const split = new SplitType(chapterTitle, { types: "words,chars" });
        const characters = split.chars ?? [];
        splits.push(split);
        gsap.set(characters, { transformOrigin: "50% 100%", willChange: "filter, opacity, transform" });
        gsap.from(characters, {
          autoAlpha: 0,
          duration: 0.75,
          ease: "power4.out",
          filter: "blur(0.45rem)",
          stagger: 0.02,
          yPercent: 90,
          scrollTrigger: { start: "top 78%", toggleActions: "play none none reverse", trigger: chapterTitle },
        });
      }

      section.querySelectorAll<HTMLElement>(".case-study").forEach((project) => {
        const title = project.querySelector<HTMLElement>(".case-study__name");
        const visual = project.querySelector<HTMLElement>(".case-study__visual");
        const content = project.querySelector<HTMLElement>(".case-study__content");
        if (!title || !visual || !content) {
          return;
        }

        const split = new SplitType(title, { types: "words,chars" });
        const characters = split.chars ?? [];
        splits.push(split);
        gsap.set(characters, { transformOrigin: "50% 100%", willChange: "filter, opacity, transform" });
        gsap.timeline({ scrollTrigger: { start: "top 74%", toggleActions: "play none none reverse", trigger: project } })
          .from(visual, { autoAlpha: 0, duration: 1.05, ease: "power4.out", clipPath: "inset(8% 8% 8% 8%)", scale: 0.94 })
          .from(characters, { autoAlpha: 0, duration: 0.7, ease: "power4.out", filter: "blur(0.4rem)", stagger: 0.018, yPercent: 85 }, "-=0.72")
          .from(content.querySelectorAll(".case-study__summary, .case-study__facts, .case-study__chapter"), { autoAlpha: 0, duration: 0.6, ease: "power3.out", stagger: 0.08, y: 18 }, "-=0.35");

        gsap.to(visual, {
          ease: "none",
          scale: 1.035,
          yPercent: -4,
          scrollTrigger: { end: "bottom top", scrub: true, start: "top bottom", trigger: project },
        });
      });
    }, section);

    return () => {
      context.revert();
      splits.forEach((split) => split.revert());
    };
  }, [reduceMotion]);

  return (
    <section aria-labelledby="selected-works-title" className="selected-works" data-editorial-section="projects" id="projects" ref={sectionRef}>
      <header className="selected-works__header" data-editorial-scene>
        <p>Issue 06 / Case studies</p>
        <div>
          <p className="selected-works__eyebrow">A record of applied thinking</p>
          <h2 className="selected-works__title" id="selected-works-title">Selected<br />Works</h2>
          <p className="selected-works__subtitle">Projects built to solve real problems.</p>
        </div>
        <p>Three case studies<br />2023 - 2026</p>
      </header>

      <div className="selected-works__projects">
        {projects.map((project, index) => (
          <article className={`case-study case-study--${project.visual}`} key={project.number}>
            <p aria-hidden="true" className="case-study__number">{project.number}</p>
            <div className="case-study__visual" data-editorial-parallax>
              <div className="case-study__visual-glow" />
              {project.visual === "construction" ? <ConstructionVisual /> : null}
              {project.visual === "hospital" ? <HospitalVisual /> : null}
              {project.visual === "portfolio" ? <PortfolioVisual /> : null}
            </div>
            <div className="case-study__content">
              <p className="case-study__chapter">Case study / {project.number}</p>
              <p className="case-study__story">{project.story}</p>
              <h3 className="case-study__name">{project.name}</h3>
              <p className="case-study__summary"><strong>Problem.</strong> {project.challenge}</p>
              <p className="case-study__summary"><strong>Approach.</strong> {project.detail}</p>
              <dl className="case-study__facts">
                <div><dt>Role</dt><dd>{project.role}</dd></div>
                <div><dt>Stack</dt><dd>{project.stack}</dd></div>
              </dl>
            </div>
            <div className="case-study__next"><span>Next Case Study</span><strong>{index === projects.length - 1 ? "Contact" : projects[index + 1].name}</strong><i aria-hidden="true">↓</i></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ConstructionVisual() {
  return (
    <div aria-label="S40 Construction browser and phone preview" className="case-visual case-visual--construction" role="img">
      <div className="case-browser"><div className="case-browser__bar"><i /><i /><i /><span>s40construction.com</span></div><div className="case-browser__construction"><p>S40</p><strong>Temporary works.<br />Built with precision.</strong><span>Scaffolding / Access / Protection</span><div className="case-browser__structure"><i /><i /><i /><i /></div></div></div>
      <div className="case-phone"><div><span>S40</span><b>Structure<br />in motion.</b><i /></div></div>
    </div>
  );
}

function HospitalVisual() {
  return (
    <div aria-label="Hospital transaction system architecture preview" className="case-visual case-visual--hospital" role="img">
      <div className="case-architecture"><div className="case-architecture__voice"><MonitorSmartphone size={24} strokeWidth={1.3} /><span>Voice input</span></div><div className="case-architecture__line" /><div className="case-architecture__logic"><Braces size={25} strokeWidth={1.3} /><span>PHP flow</span></div><div className="case-architecture__line" /><div className="case-architecture__database"><Database size={25} strokeWidth={1.3} /><span>MySQL</span></div><p>Patient transaction<br />prototype / v1.0</p></div>
      <div className="case-terminal"><span>transcribe → classify → record</span><b>VOICE RECEIVED</b><i>Transaction saved</i></div>
    </div>
  );
}

function PortfolioVisual() {
  return (
    <div aria-label="Portfolio browser, phone, and code preview" className="case-visual case-visual--portfolio" role="img">
      <div className="case-browser"><div className="case-browser__bar"><i /><i /><i /><span>mark-portfolio</span></div><div className="case-browser__portfolio"><p>Portfolio / 2026</p><strong>Mark<br />Keneth</strong><span>Digital craft, considered</span><i /></div></div>
      <div className="case-code"><LayoutTemplate size={18} strokeWidth={1.25} /><span>const work = clarity;</span><i>GSAP / TypeScript</i></div>
    </div>
  );
}