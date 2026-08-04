"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useReducedMotion } from "@/animations/motion";
import "@/styles/navigation.css";

const navigationItems = ["Home", "About", "Skills", "Projects", "Experience", "Contact"] as const;

export function EditorialNavigation() {
  const navigationRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuLinksRef = useRef<HTMLAnchorElement[]>([]);
  const [activeItem, setActiveItem] = useState<(typeof navigationItems)[number]>("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const navigation = navigationRef.current;

    if (!navigation) {
      return;
    }

    const cleanupListeners: Array<() => void> = [];
    const context = gsap.context(() => {
      const logo = navigation.querySelector(".editorial-nav__monogram");
      const shell = navigation.querySelector(".editorial-nav__shell");

      if (!reduceMotion) {
        gsap.from(logo, { autoAlpha: 0, duration: 0.8, ease: "power3.out", rotate: -8, scale: 0.9 });
      }

      const applyScrolledState = (isScrolled: boolean) => {
        navigation.classList.toggle("is-scrolled", isScrolled);
        gsap.to(shell, {
          backdropFilter: isScrolled ? "blur(1.25rem) saturate(150%)" : "blur(0rem) saturate(100%)",
          backgroundColor: isScrolled ? "oklch(1 0 0 / 72%)" : "oklch(1 0 0 / 0%)",
          borderColor: isScrolled ? "oklch(0.16 0.008 80 / 13%)" : "oklch(0.16 0.008 80 / 0%)",
          boxShadow: isScrolled ? "0 0.75rem 2.5rem oklch(0.16 0.008 80 / 9%)" : "0 0 0 oklch(0.16 0.008 80 / 0%)",
          duration: reduceMotion ? 0 : 0.45,
          ease: "power3.out",
          paddingInline: isScrolled ? "0.9rem" : "0rem",
        });
        gsap.to(logo, { duration: reduceMotion ? 0 : 0.45, ease: "power3.out", scale: isScrolled ? 0.88 : 1 });
      };

      let isScrolled = false;
      const updateScrolledState = (scrollPosition: number) => {
        const nextScrolledState = scrollPosition > 32;
        if (nextScrolledState !== isScrolled) {
          isScrolled = nextScrolledState;
          applyScrolledState(isScrolled);
        }
      };

      const scrollTrigger = ScrollTrigger.create({
        end: "max",
        onRefresh: (self) => updateScrolledState(self.scroll()),
        onUpdate: (self) => updateScrolledState(self.scroll()),
        start: 0,
      });
      updateScrolledState(scrollTrigger.scroll());
      const onScroll = () => updateScrolledState(window.scrollY);
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanupListeners.push(() => {
        window.removeEventListener("scroll", onScroll);
      });

      navigation.querySelectorAll<HTMLElement>(".editorial-nav__link").forEach((link) => {
        const indicator = link.querySelector(".editorial-nav__indicator");
        const setY = gsap.quickTo(link, "y", { duration: 0.45, ease: "power3.out" });
        const onEnter = () => {
          gsap.to(link, { duration: 0.35, opacity: 1, overwrite: true });
          gsap.to(indicator, { duration: 0.45, ease: "power3.out", overwrite: true, scaleX: 1 });
          setY(-2);
        };
        const onLeave = () => {
          gsap.to(link, { duration: 0.35, opacity: link.getAttribute("aria-current") === "page" ? 1 : 0.68, overwrite: true });
          gsap.to(indicator, { duration: 0.45, ease: "power3.out", overwrite: true, scaleX: link.getAttribute("aria-current") === "page" ? 1 : 0 });
          setY(0);
        };

        if (!reduceMotion) {
          link.addEventListener("pointerenter", onEnter);
          link.addEventListener("pointerleave", onLeave);
          cleanupListeners.push(() => {
            link.removeEventListener("pointerenter", onEnter);
            link.removeEventListener("pointerleave", onLeave);
          });
        }
      });
    }, navigation);

    return () => {
      cleanupListeners.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, [reduceMotion]);

  useEffect(() => {
    let touchStartY = 0;
    const setNavigationRetracted = (isRetracted: boolean) => {
      document.documentElement.classList.toggle("is-scrolling-down", isRetracted);
    };
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 4) {
        return;
      }
      setNavigationRetracted(event.deltaY > 0);
    };
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      const currentTouchY = event.touches[0]?.clientY ?? touchStartY;
      const touchDelta = touchStartY - currentTouchY;
      if (Math.abs(touchDelta) < 4) {
        return;
      }
      setNavigationRetracted(touchDelta > 0);
      touchStartY = currentTouchY;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      setNavigationRetracted(false);
    };
  }, []);

  useEffect(() => {
    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    const links = menuLinksRef.current;
    const timeline = gsap.timeline({ defaults: { ease: "power4.inOut" } });

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      timeline
        .set(menu, { autoAlpha: 1, pointerEvents: "auto" })
        .fromTo(menu, { clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }, { clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)", duration: reduceMotion ? 0 : 0.8 })
        .fromTo(".editorial-menu__close", { autoAlpha: 0, rotate: -90 }, { autoAlpha: 1, duration: reduceMotion ? 0 : 0.45, rotate: 0 }, "-=0.35")
        .fromTo(links, { autoAlpha: 0, x: 32 }, { autoAlpha: 1, duration: reduceMotion ? 0 : 0.65, stagger: reduceMotion ? 0 : 0.075, x: 0 }, "-=0.35")
        .fromTo(".editorial-menu__metadata", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, duration: reduceMotion ? 0 : 0.55, y: 0 }, "-=0.25")
        .call(() => links[0]?.focus());
    } else {
      timeline
        .to(links, { autoAlpha: 0, duration: reduceMotion ? 0 : 0.25, stagger: reduceMotion ? 0 : 0.03, x: 20 })
        .to(menu, { autoAlpha: 0, clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)", duration: reduceMotion ? 0 : 0.6, pointerEvents: "none" }, "-=0.08");
      document.body.style.overflow = "";
    }

    return () => {
      timeline.kill();
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, reduceMotion]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const links = menuLinksRef.current;
      const first = links[0];
      const last = links.at(-1);

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    const navigation = navigationRef.current;

    if (!navigation) {
      return;
    }

    navigation.querySelectorAll<HTMLElement>(".editorial-nav__link").forEach((link) => {
      const isActive = link.getAttribute("aria-current") === "page";
      gsap.to(link, { duration: reduceMotion ? 0 : 0.35, opacity: isActive ? 1 : 0.68, overwrite: true });
      gsap.to(link.querySelector(".editorial-nav__indicator"), {
        duration: reduceMotion ? 0 : 0.45,
        ease: "power3.out",
        overwrite: true,
        scaleX: isActive ? 1 : 0,
      });
    });
  }, [activeItem, reduceMotion]);

  const getHref = (item: (typeof navigationItems)[number]) => {
    if (item === "Home") {
      return "/";
    }

    return item === "Experience" ? "#process" : `#${item.toLowerCase()}`;
  };

  const selectItem = (item: (typeof navigationItems)[number]) => {
    const href = getHref(item);
    setActiveItem(item);
    setIsMenuOpen(false);
    document.documentElement.classList.remove("is-scrolling-down");

    if (item === "Home") {
      window.history.pushState(null, "", window.location.pathname);
      window.scrollTo({ behavior: reduceMotion ? "auto" : "smooth", top: 0 });
      return;
    }

    window.history.pushState(null, "", href);
    document.querySelector(href)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <nav aria-label="Primary navigation" className="editorial-nav" ref={navigationRef}>
      <div className="editorial-nav__shell">
        <Link aria-label="Mark Keneth Bonquin home" className="editorial-nav__monogram" href="/">MK</Link>
        <div className="editorial-nav__links">
          {navigationItems.map((item) => (
            <Link
              aria-current={activeItem === item ? "page" : undefined}
              className="editorial-nav__link"
              href={getHref(item)}
              key={item}
              onClick={(event) => {
                event.preventDefault();
                selectItem(item);
              }}
            >
              {item}
              <span aria-hidden="true" className="editorial-nav__indicator" />
            </Link>
          ))}
        </div>
        <button
          aria-controls="editorial-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="editorial-nav__toggle"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          ref={menuButtonRef}
          type="button"
        >
          {isMenuOpen ? <X aria-hidden="true" size={19} strokeWidth={1.6} /> : <Menu aria-hidden="true" size={20} strokeWidth={1.6} />}
        </button>
      </div>

      <div aria-hidden={!isMenuOpen} className="editorial-menu" id="editorial-menu" ref={menuRef}>
        <button aria-label="Close navigation menu" className="editorial-menu__close" onClick={() => setIsMenuOpen(false)} type="button">
          <X aria-hidden="true" size={22} strokeWidth={1.5} />
        </button>
        <div className="editorial-menu__content">
          <div className="editorial-menu__links">
            {navigationItems.map((item, index) => (
              <Link
                className="editorial-menu__link"
                href={getHref(item)}
                key={item}
                onClick={(event) => {
                  event.preventDefault();
                  selectItem(item);
                }}
                ref={(element) => {
                  if (element) {
                    menuLinksRef.current[index] = element;
                  }
                }}
              >
                <span>{item}</span>
                <ArrowUpRight aria-hidden="true" size={22} strokeWidth={1.25} />
              </Link>
            ))}
          </div>
          <div className="editorial-menu__metadata">
            <p>Portfolio / 2026</p>
            <p>Issue No. 01</p>
            <p>Current time / {new Intl.DateTimeFormat("en-PH", { hour: "2-digit", minute: "2-digit" }).format(new Date())}</p>
            <p>Cainta, Rizal</p>
            <p>Open for Opportunities</p>
          </div>
        </div>
      </div>
    </nav>
  );
}