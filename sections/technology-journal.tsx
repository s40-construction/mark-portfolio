"use client";

import SplitType from "split-type";
import { useLayoutEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { useReducedMotion } from "@/animations/motion";
import "@/styles/technology-journal.css";

const technologies = [
  { name: "HTML5", mark: "5", period: "2020 - Present", projects: "Portfolio sites / Web content", use: "Semantic structure", description: "The quiet architecture beneath every interface: clear landmarks, useful hierarchy, and content that arrives in the right order.", code: "<main aria-label=\"work\">" },
  { name: "CSS3", mark: "C", period: "2020 - Present", projects: "Responsive interfaces / Portfolio", use: "Editorial systems", description: "I use CSS to make rhythm visible. Layout, type, and responsive behavior become a coherent reading experience rather than a collection of rules.", code: "grid-template-columns: repeat(12, 1fr);" },
  { name: "JavaScript", mark: "JS", period: "2021 - Present", projects: "Interactive web experiences", use: "Interface behavior", description: "JavaScript gives an interface its sense of timing. I use it to turn considered designs into helpful interactions with an unhurried, natural feel.", code: "const clarity = experience => experience;" },
  { name: "TypeScript", mark: "TS", period: "2026 - Present", projects: "This portfolio", use: "Reliable interfaces", description: "TypeScript makes decisions explicit before they become problems. It brings useful structure to components, data, and the small details that keep a product dependable.", code: "type Technology = { name: string };" },
  { name: "React", mark: "R", period: "2026 - Present", projects: "Portfolio interface", use: "Composable UI", description: "I use React to compose an interface from focused parts. It keeps an evolving product legible, where each component has a clear role in the whole.", code: "function Interface() { return <Clarity />; }" },
  { name: "Next.js", mark: "N", period: "2026 - Present", projects: "Portfolio platform", use: "Production web", description: "Next.js provides a practical home for a polished web experience: fast pages, thoughtful rendering boundaries, and a path from experiment to deployment.", code: "export default function Page() {}" },
  { name: "PHP", mark: "P", period: "2023 - Present", projects: "Information Systems coursework", use: "Server-side logic", description: "PHP helped me understand the web beyond the interface: how requests, forms, and application logic work together to support a complete user journey.", code: "<?php echo $response; ?>" },
  { name: "MySQL", mark: "SQL", period: "2023 - Present", projects: "Database coursework", use: "Structured data", description: "With MySQL, I think carefully about the information behind an experience. Good data structure makes later decisions clearer for both people and systems.", code: "SELECT clarity FROM projects;" },
  { name: "Firebase", mark: "F", period: "2025 - Present", projects: "Web applications", use: "Connected services", description: "Firebase is a useful bridge between a front end and real application behavior, especially when a project needs authentication, data, or a fast route to a working prototype.", code: "initializeApp(projectConfig);" },
  { name: "Git", mark: "G", period: "2023 - Present", projects: "Development workflow", use: "Version control", description: "Git makes iteration deliberate. It gives a project memory, keeps changes reviewable, and allows experimentation without losing the thread of the work.", code: "git commit -m \"refine the details\"" },
  { name: "GitHub", mark: "GH", period: "2023 - Present", projects: "Portfolio source / Collaboration", use: "Shared practice", description: "GitHub is where working code becomes a visible practice: organized history, clear handoffs, and a home for the details behind an evolving project.", code: "git push origin main" },
  { name: "Power BI", mark: "BI", period: "2023 - Present", projects: "Information Systems analysis", use: "Data storytelling", description: "Power BI brings another lens to systems work: turning raw information into a view that helps people notice patterns and make more confident decisions.", code: "INSIGHT = SUM(Records[Value])" },
] as const;

export function TechnologyJournal() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section || reduceMotion) {
      return;
    }

    const splits: SplitType[] = [];
    const context = gsap.context(() => {
      section.querySelectorAll<HTMLElement>(".technology-journal__spread").forEach((spread) => {
        const title = spread.querySelector<HTMLElement>(".technology-journal__name");
        const logo = spread.querySelector<HTMLElement>(".technology-journal__logo");
        const copy = spread.querySelector<HTMLElement>(".technology-journal__copy");
        const metadata = spread.querySelector<HTMLElement>(".technology-journal__metadata");
        const fragment = spread.querySelector<HTMLElement>(".technology-journal__code");

        if (!title || !logo || !copy || !metadata || !fragment) {
          return;
        }

        const split = new SplitType(title, { types: "words,chars" });
        const characters = split.chars ?? [];
        splits.push(split);
        gsap.set(characters, { transformOrigin: "50% 100%", willChange: "filter, opacity, transform" });

        gsap.timeline({
          scrollTrigger: { start: "top 71%", toggleActions: "play none none reverse", trigger: spread },
        })
          .from(logo, { autoAlpha: 0, duration: 1, ease: "power4.out", scale: 0.9 })
          .from(characters, { autoAlpha: 0, duration: 0.68, ease: "power4.out", filter: "blur(0.4rem)", stagger: 0.025, yPercent: 90 }, "-=0.62")
          .from(copy, { autoAlpha: 0, duration: 0.75, ease: "power3.out", y: 28 }, "-=0.34")
          .from(metadata, { autoAlpha: 0, duration: 0.62, ease: "power3.out", y: 14 }, "-=0.5");

        gsap.to(fragment, {
          ease: "none",
          yPercent: -30,
          scrollTrigger: { end: "bottom top", scrub: true, start: "top bottom", trigger: spread },
        });
      });
    }, section);

    return () => {
      context.revert();
      splits.forEach((split) => split.revert());
    };
  }, [reduceMotion]);

  return (
    <section aria-labelledby="technology-journal-title" className="technology-journal" data-editorial-section="skills" id="skills" ref={sectionRef}>
      <header className="technology-journal__masthead">
        <p>Technology Journal / 03</p>
        <div>
          <p className="technology-journal__eyebrow">A field guide to the tools behind the work</p>
          <h2 id="technology-journal-title">Technology<br />Journal</h2>
        </div>
        <p>12 selected instruments<br />2020 - 2026</p>
      </header>

      <div className="technology-journal__spreads">
        {technologies.map((technology, index) => (
          <article className="technology-journal__spread" key={technology.name}>
            <p aria-hidden="true" className="technology-journal__page">{String(index + 1).padStart(2, "0")}</p>
            <code aria-hidden="true" className="technology-journal__code">{technology.code}</code>
            <div aria-label={`${technology.name} monogram`} className={`technology-journal__logo${technology.mark.length > 1 ? " technology-journal__logo--compact" : ""}`} role="img"><span>{technology.mark}</span></div>
            <div className="technology-journal__copy">
              <p className="technology-journal__category">Technology / {String(index + 1).padStart(2, "0")}</p>
              <h3 className="technology-journal__name">{technology.name}</h3>
              <p className="technology-journal__description">{technology.description}</p>
              <dl className="technology-journal__metadata">
                <div><dt>Application</dt><dd>{technology.use}</dd></div>
                <div><dt>Selected work</dt><dd>{technology.projects}</dd></div>
                <div><dt>Period</dt><dd>{technology.period}</dd></div>
              </dl>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}