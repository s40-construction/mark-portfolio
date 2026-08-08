"use client";

import SplitType from "split-type";
import { useLayoutEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { useReducedMotion } from "@/animations/motion";
import "@/styles/technology-journal.css";

const technologies = [
  { category: "Frontend", name: "HTML5", mark: "5", period: "2020 - Present", projects: "Portfolio sites / Web content", use: "Semantic structure", description: "Semantic HTML creates clear landmarks, useful hierarchy, and accessible content for every complete web application.", code: "<main aria-label=\"work\">" },
  { category: "Frontend", name: "CSS3", mark: "C", period: "2020 - Present", projects: "Responsive interfaces / Portfolio", use: "Responsive systems", description: "CSS turns layout, type, and responsive behavior into a coherent experience across devices and screen sizes.", code: "grid-template-columns: repeat(12, 1fr);" },
  { category: "Frontend", name: "JavaScript", mark: "JS", period: "2021 - Present", projects: "Interactive web experiences", use: "Interface behavior", description: "JavaScript connects user interactions, browser APIs, and application state into helpful, responsive behavior.", code: "const clarity = experience => experience;" },
  { category: "Frontend", name: "TypeScript", mark: "TS", period: "2026 - Present", projects: "Portfolio platform", use: "Reliable interfaces", description: "TypeScript makes data, components, and API contracts explicit before they become production problems.", code: "type Technology = { name: string };" },
  { category: "Frontend", name: "React", mark: "R", period: "2026 - Present", projects: "Portfolio interface", use: "Composable UI", description: "React supports focused, reusable interface components that stay understandable as a product evolves.", code: "function Interface() { return <Clarity />; }" },
  { category: "Frontend", name: "Next.js", mark: "N", period: "2026 - Present", projects: "Portfolio platform", use: "Production web", description: "Next.js provides the frontend and server-rendered foundation for fast, scalable web applications and deployment.", code: "export default function Page() {}" },
  { category: "Frontend", name: "GSAP", mark: "G", period: "2023 - Present", projects: "Interactive portfolios", use: "Purposeful motion", description: "GSAP adds performant, intentional motion that clarifies hierarchy and makes interactions feel responsive.", code: "gsap.to(element, { y: 24 });" },
  { category: "Frontend", name: "Three.js", mark: "3D", period: "2026 - Present", projects: "Interactive web experiences", use: "3D interfaces", description: "Three.js extends the interface into interactive 3D scenes when a project benefits from spatial storytelling.", code: "new THREE.Scene();" },
  { category: "Frontend", name: "Tailwind CSS", mark: "TW", period: "2026 - Present", projects: "Modern web applications", use: "Utility styling", description: "Tailwind CSS helps build consistent responsive interfaces quickly while keeping implementation details close to components.", code: "className=\"grid gap-6\"" },
  { category: "Backend", name: "PHP", mark: "P", period: "2023 - Present", projects: "Information Systems coursework", use: "Server-side logic", description: "PHP connects forms, requests, validation, and application logic into dependable server-side workflows.", code: "<?php echo $response; ?>" },
  { category: "Backend", name: "Node.js", mark: "N", period: "2026 - Present", projects: "Web applications", use: "Server runtime", description: "Node.js supports backend services, asynchronous processing, and API endpoints using the JavaScript ecosystem.", code: "server.listen(3000);" },
  { category: "Backend", name: "Express.js", mark: "EX", period: "2026 - Present", projects: "REST services", use: "API routing", description: "Express.js provides a practical structure for backend routes, middleware, validation, and web service logic.", code: "app.get(\"/api/projects\");" },
  { category: "Backend", name: "REST API", mark: "API", period: "2025 - Present", projects: "Integrated applications", use: "System integration", description: "REST APIs connect frontend experiences with backend services through clear, predictable data contracts.", code: "fetch(\"/api/projects\");" },
  { category: "Backend", name: "Firebase", mark: "F", period: "2025 - Present", projects: "Web applications", use: "Authentication", description: "Firebase adds authentication, managed data, and connected services for prototypes and production-ready application flows.", code: "initializeApp(projectConfig);" },
  { category: "Backend", name: "MySQL", mark: "SQL", period: "2023 - Present", projects: "Database coursework", use: "Database design", description: "MySQL supports structured data modeling, queries, and reliable persistence behind user-facing application features.", code: "SELECT * FROM projects;" },
  { category: "Tools", name: "Git", mark: "G", period: "2023 - Present", projects: "Development workflow", use: "Version control", description: "Git preserves project history, supports reviewable changes, and makes deliberate iteration possible.", code: "git commit -m \"refine the details\"" },
  { category: "Tools", name: "GitHub", mark: "GH", period: "2023 - Present", projects: "Portfolio source / Collaboration", use: "Collaboration", description: "GitHub supports shared code, pull requests, deployment workflows, and visible engineering practice.", code: "git push origin main" },
  { category: "Tools", name: "VS Code", mark: "VS", period: "2023 - Present", projects: "Daily development", use: "Development environment", description: "VS Code is the working environment for building, debugging, testing, and refining full stack applications.", code: "code ." },
  { category: "Tools", name: "Postman", mark: "PM", period: "2025 - Present", projects: "API development", use: "API testing", description: "Postman helps inspect, test, and document API requests before they reach the frontend experience.", code: "GET /api/health" },
  { category: "Tools", name: "Power BI", mark: "BI", period: "2023 - Present", projects: "Information Systems analysis", use: "Data storytelling", description: "Power BI turns structured information into useful reporting views that help people understand patterns.", code: "INSIGHT = SUM(Records[Value])" },
  { category: "Tools", name: "Figma", mark: "FG", period: "2023 - Present", projects: "Interface planning", use: "Product design", description: "Figma supports interface exploration and clear handoff before frontend and backend implementation begin.", code: "frame → prototype → build" },
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
          onComplete: () => gsap.set(characters, { willChange: "auto" }),
          onReverseComplete: () => gsap.set(characters, { willChange: "auto" }),
          scrollTrigger: { start: "top 71%", toggleActions: "play none none reverse", trigger: spread },
        })
          .from(logo, { autoAlpha: 0, duration: 1, ease: "power4.out", scale: 0.9 })
          .from(characters, { autoAlpha: 0, duration: 0.68, ease: "power4.out", filter: "blur(0.4rem)", stagger: 0.025, yPercent: 90 }, "-=0.62")
          .from(copy, { autoAlpha: 0, duration: 0.75, ease: "power3.out", y: 28 }, "-=0.34")
          .from(metadata, { autoAlpha: 0, duration: 0.62, ease: "power3.out", y: 14 }, "-=0.5");
      });
    }, section);

    return () => {
      context.revert();
      splits.forEach((split) => split.revert());
    };
  }, [reduceMotion]);

  return (
    <section aria-labelledby="technology-journal-title" className="technology-journal" data-editorial-section="skills" id="skills" ref={sectionRef}>
      <header className="technology-journal__masthead ds-container-wide">
        <p>Technology Journal / 03</p>
        <div>
          <p className="technology-journal__eyebrow">A field guide to the tools behind the work</p>
          <h2 id="technology-journal-title">Technology<br />Journal</h2>
        </div>
        <p>21 selected instruments<br />Frontend / Backend / Tools</p>
      </header>

      <div className="technology-journal__spreads ds-container-wide">
        {technologies.map((technology, index) => (
          <article className="technology-journal__spread" key={technology.name}>
            <p aria-hidden="true" className="technology-journal__page">{String(index + 1).padStart(2, "0")}</p>
            <code aria-hidden="true" className="technology-journal__code">{technology.code}</code>
            <div aria-label={`${technology.name} monogram`} className={`technology-journal__logo${technology.mark.length > 1 ? " technology-journal__logo--compact" : ""}`} role="img"><span>{technology.mark}</span></div>
            <div className="technology-journal__copy">
              <p className="technology-journal__category">{technology.category} / {String(index + 1).padStart(2, "0")}</p>
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