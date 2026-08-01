"use client";

import { ArrowUpRight, Mail, Phone } from "lucide-react";
import SplitType from "split-type";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { gsap } from "@/animations/gsap";
import { useReducedMotion } from "@/animations/motion";
import "@/styles/hero.css";

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const mastheadRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const firstNameRef = useRef<HTMLSpanElement>(null);
  const lastNameRef = useRef<HTMLSpanElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const introProgressRef = useRef<HTMLSpanElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const intro = introRef.current;
    const progress = introProgressRef.current;

    if (!intro || !progress) {
      return;
    }

    if (reduceMotion) {
      gsap.set(intro, { autoAlpha: 0, pointerEvents: "none" });
      const completion = gsap.delayedCall(0, () => setIntroComplete(true));
      return () => {
        completion.kill();
      };
    }

    const timeline = gsap.timeline({ onComplete: () => setIntroComplete(true) });
    timeline
      .from(".home-intro__mark", { autoAlpha: 0, duration: 0.6, ease: "power3.out", scale: 0.94 })
      .from(".home-intro__caption", { autoAlpha: 0, duration: 0.5, ease: "power3.out", y: 8 }, "-=0.24")
      .to(progress, { duration: 1.25, ease: "power2.inOut", scaleX: 1 }, "-=0.18")
      .to(".home-intro__percentage", { duration: 0.2, textContent: "100%", snap: { textContent: 1 } }, "-=0.18")
      .to(intro, { autoAlpha: 0, duration: 0.8, ease: "power3.inOut", pointerEvents: "none" }, "+=0.18");

    return () => {
      timeline.kill();
    };
  }, [reduceMotion]);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const masthead = mastheadRef.current;
    const eyebrow = eyebrowRef.current;
    const firstName = firstNameRef.current;
    const lastName = lastNameRef.current;
    const details = detailsRef.current;
    const title = titleRef.current;
    const footer = footerRef.current;

    if (!introComplete || !hero || !masthead || !eyebrow || !firstName || !lastName || !details || !title || !footer) {
      return;
    }

    const splitFirstName = new SplitType(firstName, { types: "chars" });
    const splitLastName = new SplitType(lastName, { types: "chars" });
    const characters = [...(splitFirstName.chars ?? []), ...(splitLastName.chars ?? [])];
    const cleanupListeners: Array<() => void> = [];

    const context = gsap.context(() => {
      if (!reduceMotion) {
        gsap.set(characters, { transformOrigin: "50% 100%", willChange: "filter, opacity, transform" });
        gsap.timeline()
          .from(masthead, { autoAlpha: 0, duration: 0.8, ease: "power3.out", y: 14 })
          .from(eyebrow, { autoAlpha: 0, duration: 0.7, ease: "power3.out", y: 14 }, "-=0.48")
          .from(characters, { autoAlpha: 0, duration: 1.05, ease: "power4.out", filter: "blur(0.7rem)", stagger: 0.028, yPercent: 110 }, "-=0.3")
          .from(title, { autoAlpha: 0, duration: 0.8, ease: "power3.out", y: 18 }, "-=0.58")
          .from(details, { autoAlpha: 0, duration: 0.8, ease: "power3.out", y: 18 }, "-=0.58")
          .from(footer, { autoAlpha: 0, duration: 0.8, ease: "power3.out", y: 18 }, "-=0.48");

        if (scrollIndicatorRef.current) {
          gsap.to(scrollIndicatorRef.current, {
            duration: 1.8,
            ease: "sine.inOut",
            repeat: -1,
            y: 6,
            yoyo: true,
          });
        }

        gsap.to(hero, {
          ease: "none",
          scale: 0.97,
          scrollTrigger: { end: "bottom top", scrub: true, start: "top top" },
          transformOrigin: "center top",
          yPercent: -2,
        });
        gsap.to(".home-hero__name", {
          ease: "none",
          scrollTrigger: { end: "bottom top", scrub: true, start: "top top" },
          yPercent: -9,
        });
        const background = document.querySelector(".portfolio-background");
        if (background) {
          gsap.to(background, {
            ease: "none",
            scrollTrigger: { end: "bottom top", scrub: true, start: "top top" },
            yPercent: -1.25,
          });
        }
      }

      const setPointerX = gsap.quickTo(hero, "--hero-pointer-x", { duration: 0.65, ease: "power3.out" });
      const setPointerY = gsap.quickTo(hero, "--hero-pointer-y", { duration: 0.65, ease: "power3.out" });
      const onHeroPointerMove = (event: PointerEvent) => {
        const bounds = hero.getBoundingClientRect();
        setPointerX(event.clientX - bounds.left);
        setPointerY(event.clientY - bounds.top);
      };

      hero.addEventListener("pointermove", onHeroPointerMove, { passive: true });
      cleanupListeners.push(() => hero.removeEventListener("pointermove", onHeroPointerMove));

      hero.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((button) => {
        const glow = button.querySelector<HTMLElement>(".home-hero__button-glow");
        const setX = gsap.quickTo(button, "x", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
        const setY = gsap.quickTo(button, "y", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
        const onEnter = () => {
          gsap.to(glow, { duration: 0.35, opacity: 1, overwrite: true });
          gsap.to(button, { boxShadow: "0 1.25rem 3.5rem oklch(0.16 0.008 80 / 20%)", duration: 0.35, overwrite: true });
        };
        const onMove = (event: PointerEvent) => {
          const bounds = button.getBoundingClientRect();
          setX((event.clientX - (bounds.left + bounds.width / 2)) * 0.16);
          setY((event.clientY - (bounds.top + bounds.height / 2)) * 0.18);
        };
        const onLeave = () => {
          setX(0);
          setY(0);
          gsap.to(glow, { duration: 0.35, opacity: 0, overwrite: true });
          gsap.to(button, { boxShadow: "0 1rem 3rem oklch(0.16 0.008 80 / 8%)", duration: 0.35, overwrite: true });
        };

        if (!reduceMotion) {
          button.addEventListener("pointerenter", onEnter);
          button.addEventListener("pointermove", onMove, { passive: true });
          button.addEventListener("pointerleave", onLeave);
          cleanupListeners.push(() => {
            button.removeEventListener("pointerenter", onEnter);
            button.removeEventListener("pointermove", onMove);
            button.removeEventListener("pointerleave", onLeave);
          });
        }
      });
    }, hero);

    return () => {
      cleanupListeners.forEach((cleanup) => cleanup());
      context.revert();
      splitFirstName.revert();
      splitLastName.revert();
    };
  }, [introComplete, reduceMotion]);

  return (
    <main>
      <div aria-live="polite" aria-label="Loading portfolio" className="home-intro" ref={introRef}>
        <div className="home-intro__content">
          <span className="home-intro__mark">MKB</span>
          <span className="home-intro__caption">Mark Keneth Bonquin / Portfolio 2026</span>
          <span className="home-intro__track"><span className="home-intro__progress" ref={introProgressRef} /></span>
          <span className="home-intro__percentage">00%</span>
        </div>
      </div>
      <section aria-labelledby="hero-name" className="home-hero" data-editorial-section="home" id="home" ref={heroRef}>
        <div className="home-hero__spotlight" />
        <div className="home-hero__frame">
          <div className="home-hero__masthead" ref={mastheadRef}>
            <p className="home-hero__label">Portfolio / 2026</p>
            <p className="home-hero__issue">Issue No. 01</p>
          </div>
          <div className="home-hero__body">
            <p className="home-hero__eyebrow" ref={eyebrowRef}>Digital craft, considered</p>
            <h1 className="home-hero__name" id="hero-name">
              <span className="home-hero__name-line" ref={firstNameRef}>Mark Keneth</span>
              <span className="home-hero__name-line home-hero__name-line--offset" ref={lastNameRef}>Bonquin</span>
            </h1>
            <div className="home-hero__details" ref={detailsRef}>
              <div className="home-hero__roles">
                <p>Frontend Developer</p>
                <p>Information Systems Graduate</p>
              </div>
              <p className="home-hero__note">Building clear, thoughtful interfaces for the web.</p>
            </div>
            <div className="home-hero__title" ref={titleRef}>
              <span>Section / Opening Note</span>
              <span>Designer&apos;s note: clarity is the quiet luxury.</span>
            </div>
          </div>
          <div className="home-hero__footer" ref={footerRef}>
            <div className="home-hero__actions" aria-label="Contact Mark Keneth Bonquin">
              <a className="home-hero__button home-hero__button--primary" data-magnetic href="mailto:bonquin.109397@gmail.com">
                <span className="home-hero__button-glow" />
                <span className="home-hero__button-border" />
                <span className="home-hero__button-content"><Mail aria-hidden="true" size={16} strokeWidth={1.75} />Start a conversation<ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} /></span>
              </a>
              <a className="home-hero__button home-hero__button--glass" data-magnetic href="tel:+639506310182">
                <span className="home-hero__button-glow" />
                <span className="home-hero__button-border" />
                <span className="home-hero__button-content"><Phone aria-hidden="true" size={15} strokeWidth={1.75} />Call me</span>
              </a>
            </div>
            <div className="home-hero__folio"><span>Publication year / 2026</span><strong>01</strong></div>
          </div>
        </div>
        <div aria-hidden="true" className="home-hero__scroll-indicator" ref={scrollIndicatorRef}>
          <span>Scroll to explore</span>
          <i />
        </div>
      </section>
    </main>
  );
}