"use client";

import { ArrowUp, Command, Download, ExternalLink, GitBranch, Mail, Speaker, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ScrollTrigger } from "@/animations/gsap";
import { useReducedMotion } from "@/animations/motion";
import "@/styles/global-experience.css";

const loadingSteps = ["Preparing Experience", "Loading Editorial System", "Initializing Motion", "Loading Assets", "Done."] as const;
const labels = ["DESIGN", "CODE", "SYSTEMS", "RESEARCH", "FRONTEND", "CASE STUDY", "NEXT CHAPTER"] as const;
const quotes = ["Design is invisible until it matters.", "Code tells a story.", "Simplicity requires discipline."] as const;

const commands = [
  ["H", "Home", "#home"],
  ["S", "Skills", "#skills"],
  ["P", "Projects", "#projects"],
  ["C", "Contact", "#contact"],
  ["G", "GitHub", "https://github.com"],
  ["R", "Download resume", "/Mark-Keneth-Bonquin-Resume.pdf"],
] as const;

export function GlobalCinematicExperience() {
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState("Home");
  const [fps, setFps] = useState(60);
  const [quickActionsVisible, setQuickActionsVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      const timer = window.setTimeout(() => setLoadingVisible(false), 0);
      return () => window.clearTimeout(timer);
    }

    const timers = loadingSteps.map((_, index) => window.setTimeout(() => setLoadingStep(index), index * 480));
    const hideTimer = window.setTimeout(() => setLoadingVisible(false), loadingSteps.length * 480 + 260);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(hideTimer);
    };
  }, [reduceMotion]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-editorial-section]"));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
      if (visible) {
        setCurrentSection((visible.target as HTMLElement).dataset.editorialSection ?? "Home");
      }
    }, { rootMargin: "-35% 0px -45%", threshold: [0.05, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const quoteInterval = window.setInterval(() => setQuoteIndex((current) => (current + 1) % quotes.length), 7400);
    return () => window.clearInterval(quoteInterval);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const headings = Array.from(document.querySelectorAll<HTMLElement>("h1, h2, h3"));
    const onMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--experience-light-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--experience-light-y", `${event.clientY}px`);
      const offsetX = (event.clientX / innerWidth - 0.5) * 5;
      const offsetY = (event.clientY / innerHeight - 0.5) * 5;
      headings.forEach((heading) => heading.style.setProperty("translate", `${offsetX}px ${offsetY}px`));
    };
    const reset = () => headings.forEach((heading) => heading.style.removeProperty("translate"));
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", reset);
      reset();
    };
  }, [reduceMotion]);

  useEffect(() => {
    let frameId = 0;
    let lastTime = performance.now();
    let frames = 0;
    const countFrames = (time: number) => {
      frames += 1;
      if (time - lastTime >= 700) {
        setFps(Math.round((frames * 1000) / (time - lastTime)));
        lastTime = time;
        frames = 0;
      }
      frameId = requestAnimationFrame(countFrames);
    };
    frameId = requestAnimationFrame(countFrames);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const updateQuickActions = () => setQuickActionsVisible(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", updateQuickActions, { passive: true });
    return () => window.removeEventListener("scroll", updateQuickActions);
  }, []);

  useEffect(() => () => audioRef.current?.pause(), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }
      if (event.shiftKey && event.key.toLowerCase() === "d") {
        event.preventDefault();
        setShowDiagnostics((open) => !open);
        return;
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      const command = commands.find(([shortcut]) => shortcut.toLowerCase() === event.key.toLowerCase());
      if (command) {
        event.preventDefault();
        executeCommand(command[2]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const exit = document.querySelector<HTMLElement>(".cinematic-exit");
    if (!exit) {
      return;
    }
    const updateExitFromHash = () => document.documentElement.classList.toggle("is-exiting", location.hash === "#contact");
    const trigger = ScrollTrigger.create({
      end: "bottom 40%",
      onEnter: () => document.documentElement.classList.add("is-exiting"),
      onEnterBack: () => document.documentElement.classList.add("is-exiting"),
      onLeaveBack: () => document.documentElement.classList.remove("is-exiting"),
      start: "top 60%",
      trigger: exit,
    });
    updateExitFromHash();
    window.addEventListener("hashchange", updateExitFromHash);
    return () => {
      trigger.kill();
      window.removeEventListener("hashchange", updateExitFromHash);
      document.documentElement.classList.remove("is-exiting");
    };
  }, []);

  const toggleSound = () => {
    const ambience = audioRef.current;
    if (!ambience) {
      return;
    }

    if (soundEnabled) {
      ambience.pause();
      ambience.currentTime = 0;
      setSoundEnabled(false);
      return;
    }
    ambience.volume = 0.95;
    void ambience.play().then(() => setSoundEnabled(true)).catch(() => setSoundEnabled(false));
  };

  return (
    <>
      <div aria-hidden={!loadingVisible} className={`experience-loader${loadingVisible ? " is-visible" : ""}`}>
        <div><span>Portfolio / 2026</span><strong>{loadingSteps[loadingStep]}</strong><i><b style={{ transform: `scaleX(${(loadingStep + 1) / loadingSteps.length})` }} /></i></div>
      </div>
      <div aria-hidden="true" className="experience-mouse-light" />
      <audio loop preload="auto" ref={audioRef} src="/portfolio-ambient-loop.wav" />
      <aside aria-live="polite" className="experience-floating-label"><span>{labels[quoteIndex * 2 % labels.length]}</span><i>/{currentSection}</i></aside>
      <aside aria-live="polite" className="experience-quote"><q>{quotes[quoteIndex]}</q></aside>
      <button aria-pressed={soundEnabled} aria-label={soundEnabled ? "Disable ambient sound" : "Enable ambient sound"} className={`experience-sound${soundEnabled ? "" : " is-muted"}`} onClick={toggleSound} type="button"><Speaker aria-hidden="true" size={15} /></button>
      <button aria-label="Open command palette" className="experience-command" onClick={() => setPaletteOpen(true)} type="button"><Command aria-hidden="true" size={14} /><span>Command</span><kbd>Ctrl K</kbd></button>
      <nav aria-label="Recruiter quick actions" className={`experience-quick-actions${quickActionsVisible ? " is-visible" : ""}`}>
        <a aria-label="Download Mark Keneth Bonquin resume" download href="/Mark-Keneth-Bonquin-Resume.pdf"><Download aria-hidden="true" size={15} /><span>Resume</span></a>
        <a aria-label="Open GitHub" href="https://github.com" rel="noreferrer" target="_blank"><GitBranch aria-hidden="true" size={15} /><span>GitHub</span></a>
        <a aria-label="Search Mark Keneth Bonquin on LinkedIn" href="https://www.linkedin.com/search/results/people/?keywords=Mark%20Keneth%20Bonquin" rel="noreferrer" target="_blank"><ExternalLink aria-hidden="true" size={15} /><span>LinkedIn</span></a>
        <a aria-label="Email Mark Keneth Bonquin" href="mailto:bonquin.109397@gmail.com"><Mail aria-hidden="true" size={15} /><span>Email</span></a>
        <a aria-label="Back to top" href="#home"><ArrowUp aria-hidden="true" size={15} /><span>Top</span></a>
      </nav>
      {paletteOpen ? <div className="experience-palette-backdrop" onPointerDown={() => setPaletteOpen(false)}><section aria-label="Command palette" aria-modal="true" className="experience-palette" onPointerDown={(event) => event.stopPropagation()} role="dialog"><header><span>Navigate portfolio</span><button aria-label="Close command palette" onClick={() => setPaletteOpen(false)} type="button"><X aria-hidden="true" size={16} /></button></header><div>{commands.map(([key, label, target]) => <button key={key} onClick={() => { executeCommand(target); setPaletteOpen(false); }} type="button"><span>{label}</span><kbd>{key}</kbd></button>)}</div></section></div> : null}
      {showDiagnostics ? <aside className="experience-diagnostics"><span>Diagnostics / Shift D</span><strong>{fps} FPS</strong><p>Section / {currentSection}</p><p>Theme / Editorial light</p><p>Screen / {typeof window === "undefined" ? "" : `${innerWidth} × ${innerHeight}`}</p><p>Device / {typeof window === "undefined" ? "" : (innerWidth < 768 ? "Mobile" : "Desktop")}</p></aside> : null}
      <section aria-labelledby="contact-title" className="cinematic-exit" data-editorial-section="contact" id="contact"><div className="cinematic-exit__content"><p>Final note / 2026</p><h2 id="contact-title">Thank you.</h2><strong>Let&apos;s build<br />something meaningful.</strong><span>Mark Keneth Bonquin<br />Full Stack Developer</span><div aria-label="Contact actions" className="cinematic-exit__actions"><a className="cinematic-exit__action cinematic-exit__action--primary" href="mailto:bonquin.109397@gmail.com"><Mail aria-hidden="true" size={16} />Let&apos;s Work Together</a><a className="cinematic-exit__action" download href="/Mark-Keneth-Bonquin-Resume.pdf"><Download aria-hidden="true" size={16} />Download Resume</a></div></div></section>
    </>
  );
}

function executeCommand(target: string) {
  if (target.startsWith("#")) {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (target.startsWith("/")) {
    const anchor = document.createElement("a");
    anchor.href = target;
    anchor.download = "";
    anchor.click();
    return;
  }
  window.open(target, "_blank", "noopener,noreferrer");
}