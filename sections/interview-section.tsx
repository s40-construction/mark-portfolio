"use client";

import SplitType from "split-type";
import { useLayoutEffect, useRef } from "react";

import { gsap } from "@/animations/gsap";
import { useReducedMotion } from "@/animations/motion";
import "@/styles/interview.css";

const interviewEntries = [
  {
    answer: "I am an Information Systems graduate and an emerging frontend developer based in Cainta, Rizal. My work is shaped by customer-facing roles, website support, and a steady interest in making digital information feel clear and useful.",
    question: "Who is Mark Keneth Bonquin?",
  },
  {
    answer: "Information Systems made sense because it connects technology with the people and processes it serves. I enjoy understanding how a system works end to end, then using that understanding to make the experience simpler.",
    question: "Why Information Systems?",
  },
  {
    answer: "During my internship at Ollopa Corporation, I saw how accurate, well-organized website content supports a business. Frontend development is where structure, communication, and visual clarity meet in something people can use every day.",
    question: "Why Frontend Development?",
  },
  {
    answer: "I am inspired by products that respect attention. The best interfaces make complex tasks feel calm, direct, and considered, while still giving people the information they need at the right moment.",
    question: "What inspires your work?",
  },
  {
    answer: "I start by clarifying the goal, checking the details, and breaking the work into smaller decisions. My experience in support and operations taught me that patient verification usually leads to faster, more reliable solutions.",
    question: "How do you approach problem solving?",
  },
  {
    answer: "I enjoy working with HTML, CSS, JavaScript, PHP, MySQL, GSAP, Firebase, API integrations, and GitHub. I also use Figma to think through the interface before the code begins.",
    question: "What technologies do you enjoy?",
  },
  {
    answer: "I am looking for a junior frontend or digital product opportunity where I can contribute with curiosity, dependable communication, and a strong willingness to learn from an experienced team.",
    question: "What kind of opportunities are you looking for?",
  },
] as const;

const timeline = [
  ["2020 - 2023", "Customer support and agent training"],
  ["2025", "Virtual assistant, exam readiness and compliance"],
  ["2026", "IT internship: website and digital platform support"],
] as const;

export function InterviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section || reduceMotion) {
      return;
    }

    const splits: SplitType[] = [];
    const context = gsap.context(() => {
      gsap.from(".interview-section__metadata", {
        autoAlpha: 0,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: { start: "top 76%", toggleActions: "play none none reverse", trigger: section },
        y: 18,
      });

      section.querySelectorAll<HTMLElement>(".interview-entry").forEach((entry) => {
        const question = entry.querySelector<HTMLElement>(".interview-entry__question");
        const answer = entry.querySelector<HTMLElement>(".interview-entry__answer");

        if (!question || !answer) {
          return;
        }

        const split = new SplitType(question, { types: "words,chars" });
        const characters = split.chars ?? [];
        splits.push(split);

        gsap.set(characters, { transformOrigin: "50% 100%", willChange: "filter, opacity, transform" });
        const reveal = gsap.timeline({
          scrollTrigger: {
            start: "top 78%",
            toggleActions: "play none none reverse",
            trigger: entry,
          },
        });
        reveal
          .from(characters, { autoAlpha: 0, duration: 0.72, ease: "power4.out", filter: "blur(0.45rem)", stagger: 0.018, yPercent: 70 })
          .from(answer, { autoAlpha: 0, duration: 0.72, ease: "power3.out", filter: "blur(0.2rem)", y: 18 }, "-=0.4");
      });

      const image = section.querySelector(".interview-section__image");
      if (image) {
        gsap.fromTo(image, { scale: 1.1 }, {
          ease: "none",
          scale: 1,
          scrollTrigger: { end: "bottom top", scrub: true, start: "top bottom", trigger: image },
        });
      }

      gsap.from(".interview-section__timeline", {
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { start: "top 78%", toggleActions: "play none none reverse", trigger: ".interview-section__timeline" },
        x: 20,
      });
      gsap.from(".interview-section__quote", {
        autoAlpha: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { start: "top 82%", toggleActions: "play none none reverse", trigger: ".interview-section__quote" },
        y: 32,
      });
    }, section);

    return () => {
      context.revert();
      splits.forEach((split) => split.revert());
    };
  }, [reduceMotion]);

  return (
    <section aria-labelledby="interview-title" className="interview-section" data-editorial-section="about" id="about" ref={sectionRef}>
      <div className="interview-section__scene">
        <header className="interview-section__header">
          <div className="interview-section__metadata">
            <p>Feature article / 02</p>
            <p>Interview</p>
            <p>Published / 01 August 2026</p>
            <p>Reading time / 4 minutes</p>
            <p>Cainta, Rizal</p>
          </div>
          <div className="interview-section__heading">
            <p className="interview-section__kicker">A conversation in systems and craft</p>
            <h2 id="interview-title">The Interview</h2>
          </div>
        </header>

        <div className="interview-section__content">
          <div className="interview-section__reading-index" aria-hidden="true">
            <span>Reading index</span>
            <strong>01 - 07</strong>
          </div>

          <div className="interview-section__entries">
            {interviewEntries.map((entry, index) => (
              <article className="interview-entry" key={entry.question}>
                <div className="interview-entry__question-wrap">
                  <p className="interview-entry__number">0{index + 1}</p>
                  <h3 className="interview-entry__question">{entry.question}</h3>
                </div>
                <div className="interview-entry__answer">
                  <p>{entry.answer}</p>
                  {index === 0 ? (
                    <figure className="interview-section__figure">
                      <div aria-label="A developer workspace with a laptop and code" className="interview-section__image" role="img" />
                      <figcaption>Field note / A clear system begins with close attention to the details.</figcaption>
                    </figure>
                  ) : null}
                </div>
              </article>
            ))}

            <div className="interview-section__timeline" data-editorial-parallax>
              <p>Selected timeline</p>
              <ol>
                {timeline.map(([date, detail]) => (
                  <li key={date}>
                    <span>{date}</span>
                    <strong>{detail}</strong>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <blockquote className="interview-section__quote">
          <p>“Clarity is not just a design choice. It is a way of respecting the person on the other side of the screen.”</p>
          <cite>Mark Keneth Bonquin</cite>
        </blockquote>
      </div>
    </section>
  );
}