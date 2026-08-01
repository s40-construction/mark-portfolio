"use client";

import { Download, ExternalLink, GitBranch, Play, TerminalSquare } from "lucide-react";
import SplitType from "split-type";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { gsap } from "@/animations/gsap";
import { useReducedMotion } from "@/animations/motion";
import "@/styles/developer-workspace.css";

const terminalSteps = [
  ["$ npm install", "Packages installed successfully"],
  ["$ npm run dev", "Ready on localhost:3000"],
  ["$ git status", "Working tree clean"],
  ["$ git commit -m \"Portfolio improvements\"", "Commit successful"],
  ["$ git push origin main", "Done."],
] as const;

const files = ["app/", "  page.tsx", "components/", "sections/", "styles/", "public/", "package.json", "next.config.ts", "README.md"] as const;

const sourceLines = [
  ["1", "import", " { TechnologyJournal } ", "from", " \"@/sections/technology-journal\";"],
  ["2", ""],
  ["3", "export default function", " Home() {"],
  ["4", "  return ("],
  ["5", "    <>"],
  ["6", "      <TechnologyJournal />"],
  ["7", "      <DeveloperWorkspace />"],
  ["8", "    </>"],
  ["9", "  );"],
  ["10", "}"],
] as const;

export function DeveloperWorkspace() {
  const sectionRef = useRef<HTMLElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [terminalStep, setTerminalStep] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setTerminalStep((current) => (current + 1) % terminalSteps.length);
    }, 2900);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section || reduceMotion) {
      return;
    }

    const title = section.querySelector<HTMLElement>(".developer-workspace__title");
    if (!title) {
      return;
    }

    const split = new SplitType(title, { types: "words,chars" });
    const characters = split.chars ?? [];
    const context = gsap.context(() => {
      gsap.set(characters, { transformOrigin: "50% 100%", willChange: "filter, opacity, transform" });
      gsap.timeline({ scrollTrigger: { start: "top 74%", toggleActions: "play none none reverse", trigger: section } })
        .from(".developer-workspace__eyebrow", { autoAlpha: 0, duration: 0.55, ease: "power3.out", y: 14 })
        .from(characters, { autoAlpha: 0, duration: 0.75, ease: "power4.out", filter: "blur(0.45rem)", stagger: 0.022, yPercent: 90 }, "-=0.25")
        .from(".developer-workspace__lede, .developer-workspace__actions, .developer-workspace__facts", { autoAlpha: 0, duration: 0.65, ease: "power3.out", stagger: 0.1, y: 18 }, "-=0.4")
        .from(".workspace-machine", { autoAlpha: 0, duration: 1, ease: "power4.out", scale: 0.96, y: 32 }, "-=0.75");

      gsap.to(".workspace-machine", {
        ease: "none",
        yPercent: -3,
        scrollTrigger: { end: "bottom top", scrub: true, start: "top bottom", trigger: section },
      });
    }, section);

    return () => {
      context.revert();
      split.revert();
    };
  }, [reduceMotion]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const workspace = workspaceRef.current;
    if (!workspace || reduceMotion) {
      return;
    }

    const bounds = workspace.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;
    gsap.to(workspace, { duration: 0.65, ease: "power3.out", rotateX: relativeY * -3, rotateY: relativeX * 4, transformPerspective: 1200 });
    workspace.style.setProperty("--workspace-light-x", `${(relativeX + 0.5) * 100}%`);
    workspace.style.setProperty("--workspace-light-y", `${(relativeY + 0.5) * 100}%`);
  };

  const resetPointer = () => {
    if (workspaceRef.current && !reduceMotion) {
      gsap.to(workspaceRef.current, { duration: 0.8, ease: "power3.out", rotateX: 0, rotateY: 0 });
    }
  };

  const [command, response] = terminalSteps[terminalStep];

  return (
    <section aria-labelledby="workspace-title" className="developer-workspace" data-editorial-section="skills" id="workspace" ref={sectionRef}>
      <div className="developer-workspace__inner" data-editorial-scene>
        <div className="developer-workspace__copy">
          <p className="developer-workspace__eyebrow">Issue 04 / Working edition</p>
          <h2 className="developer-workspace__title" id="workspace-title">My<br />Workspace</h2>
          <p className="developer-workspace__lede">A focused environment for turning an idea into a clear, responsive web experience. The workflow stays simple: inspect closely, build deliberately, and ship with care.</p>
          <div className="developer-workspace__actions" aria-label="Workspace links">
            <a className="developer-workspace__button developer-workspace__button--dark" href="https://github.com" rel="noreferrer" target="_blank"><GitBranch aria-hidden="true" size={16} />View GitHub<ExternalLink aria-hidden="true" size={14} /></a>
            <a className="developer-workspace__button" download href="/Mark-Keneth-Bonquin-Resume.pdf"><Download aria-hidden="true" size={16} />Download Resume</a>
          </div>
          <dl className="developer-workspace__facts">
            <div><dt>Environment</dt><dd>Windows</dd></div>
            <div><dt>Editor</dt><dd>VS Code</dd></div>
            <div><dt>Framework</dt><dd>Next.js / React</dd></div>
            <div><dt>Build tool</dt><dd>Turbopack</dd></div>
            <div><dt>Deployment</dt><dd>Production ready</dd></div>
          </dl>
        </div>

        <div className="workspace-machine" onPointerLeave={resetPointer} onPointerMove={handlePointerMove} ref={workspaceRef}>
          <div className="workspace-machine__glow" />
          <div className="workspace-machine__screen">
            <div className="workspace-machine__topbar"><span className="workspace-machine__dots"><i /><i /><i /></span><span>mark-portfolio - Visual Studio Code</span><span className="workspace-machine__topbar-status">main</span></div>
            <div className="workspace-machine__body">
              <aside className="workspace-explorer" aria-label="Project files">
                <div className="workspace-explorer__heading"><span>Explorer</span><strong>...</strong></div>
                <p className="workspace-explorer__project">Mark-portfolio</p>
                <ul>{files.map((file) => <li className={file === "  page.tsx" ? "is-active" : file.endsWith("/") ? "is-folder" : ""} key={file}>{file}</li>)}</ul>
              </aside>
              <div className="workspace-editor">
                <div className="workspace-editor__tabs"><span className="is-current">page.tsx <i>×</i></span><span>technology-journal.tsx</span></div>
                <pre aria-label="page.tsx source code" className="workspace-editor__code">{sourceLines.map(([number, first, middle, last]) => <code key={number}><span className="workspace-editor__line-number">{number}</span><span className="workspace-editor__keyword">{first}</span><span>{middle}</span><span className="workspace-editor__keyword">{last}</span>{"\n"}</code>)}</pre>
                <div className="workspace-editor__status"><span>main</span><span>TypeScript React</span><span>Prettier</span></div>
              </div>
              <div className="workspace-panels">
                <div className="workspace-terminal">
                  <div className="workspace-panel__header"><span><TerminalSquare aria-hidden="true" size={12} />Terminal</span><span>+  ×</span></div>
                  <div className="workspace-terminal__content">
                    <p className="workspace-terminal__prompt">{command}<i /></p>
                    <p className="workspace-terminal__response">&#10003; {response}</p>
                  </div>
                </div>
                <div className="workspace-browser">
                  <div className="workspace-panel__header"><span><Play aria-hidden="true" size={12} fill="currentColor" />localhost:3000</span><span>...</span></div>
                  <div className="workspace-browser__viewport">
                    <div className="workspace-browser__scrolling"><span>Mark Keneth Bonquin</span><b>Digital craft,<br />considered.</b><i>Portfolio / 2026</i></div>
                  </div>
                </div>
                <div className="workspace-github">
                  <div className="workspace-panel__header"><span><GitBranch aria-hidden="true" size={12} />GitHub</span><span>main</span></div>
                  <strong>mark-portfolio</strong>
                  <p><span>Production Ready</span><i>●</i></p>
                  <ul><li>feat: add technology journal</li><li>style: refine editorial rhythm</li><li>chore: prepare deployment</li></ul>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="workspace-machine__base"><i /></div>
        </div>
      </div>
      <div className="developer-workspace__next"><span>Next chapter</span><strong>Projects</strong><i aria-hidden="true">↓</i></div>
    </section>
  );
}