"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useEffect, useRef } from "react";

import { gsap, ScrollTrigger } from "@/animations/gsap";
import { useReducedMotion } from "@/animations/motion";
import "@/styles/navigation.css";

const navigationItems = ["Home", "About", "Skills", "Projects", "Experience", "Contact"] as const;

const routes: Record<(typeof navigationItems)[number], string> = {
  About: "/about",
  Contact: "/contact",
  Experience: "/experience",
  Home: "/",
  Projects: "/projects",
  Skills: "/skills",
};

export function EditorialNavigation() {
  const navigationRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const displayedActiveItem = navigationItems.find((item) => routes[item] === pathname) ?? "Home";

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
  }, [displayedActiveItem, reduceMotion]);

  const getHref = (item: (typeof navigationItems)[number]) => routes[item];

  const handleNavClick = (item: (typeof navigationItems)[number], event: React.MouseEvent) => {
    document.documentElement.classList.remove("is-scrolling-down");

    if (item === "Home" && pathname === "/") {
      event.preventDefault();
      window.scrollTo({ behavior: reduceMotion ? "auto" : "smooth", top: 0 });
    }
  };

  return (
    <nav aria-label="Primary navigation" className="editorial-nav" ref={navigationRef}>
      <div className="editorial-nav__shell ds-container-wide">
        <Link aria-label="Mark Keneth Bonquin home" className="editorial-nav__monogram" href="/">MK</Link>
        <div className="editorial-nav__links">
          {navigationItems.map((item) => (
            <Link
              aria-current={displayedActiveItem === item ? "page" : undefined}
              className="editorial-nav__link"
              href={getHref(item)}
              key={item}
              onClick={(event) => handleNavClick(item, event)}
            >
              {item}
              <span aria-hidden="true" className="editorial-nav__indicator" />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}