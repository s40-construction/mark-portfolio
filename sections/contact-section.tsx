"use client";

import { Download, Mail } from "lucide-react";
import { useEffect } from "react";

import "@/styles/global-experience.css";

export function ContactSection() {
  useEffect(() => {
    document.documentElement.classList.add("is-exiting");
    return () => {
      document.documentElement.classList.remove("is-exiting");
    };
  }, []);

  return (
    <section aria-labelledby="contact-title" className="cinematic-exit" data-editorial-section="contact" id="contact">
      <div className="cinematic-exit__content">
        <p>Final note / 2026</p>
        <h2 id="contact-title">Thank you.</h2>
        <strong>Let&apos;s build<br />something meaningful.</strong>
        <span>Mark Keneth Bonquin<br />Full Stack Developer</span>
        <div aria-label="Contact actions" className="cinematic-exit__actions">
          <a className="cinematic-exit__action cinematic-exit__action--primary" href="mailto:bonquin.109397@gmail.com"><Mail aria-hidden="true" size={16} />Let&apos;s Work Together</a>
          <a className="cinematic-exit__action" download href="/Mark-Keneth-Bonquin-Resume.pdf"><Download aria-hidden="true" size={16} />Download Resume</a>
        </div>
      </div>
    </section>
  );
}
