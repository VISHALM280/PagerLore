"use client";

import { animate, createTimeline, stagger } from "animejs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Word-by-word blur-to-sharp upward reveal
 */
export function animateWordByWord(
  container: HTMLElement,
  onComplete?: () => void
) {
  if (prefersReducedMotion() || typeof window === "undefined") {
    container.style.opacity = "1";
    container.style.filter = "none";
    if (onComplete) onComplete();
    return;
  }

  // Get words
  const words = container.querySelectorAll(".hero-word");
  if (words.length === 0) return;

  gsap.fromTo(
    words,
    {
      opacity: 0,
      y: 28,
      filter: "blur(8px)",
    },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.85,
      stagger: 0.07,
      ease: "power3.out",
      onComplete,
    }
  );
}

/**
 * Editorial headline reveal animation
 */
export function animateHeadline(target: string | HTMLElement | HTMLElement[]) {
  if (prefersReducedMotion() || typeof window === "undefined") return;

  return animate(target, {
    opacity: [0, 1],
    translateY: [24, 0],
    duration: 850,
    ease: "outExpo",
  });
}

/**
 * Staggered entrance for list items, cards, or paragraphs
 */
export function animateStagger(
  targets: string | HTMLElement | HTMLElement[] | NodeListOf<Element>,
  delayOffset: number = 60
) {
  if (prefersReducedMotion() || typeof window === "undefined") return;

  return animate(targets, {
    opacity: [0, 1],
    translateY: [16, 0],
    delay: stagger(delayOffset),
    duration: 700,
    ease: "outQuad",
  });
}

/**
 * SVG Path / Line drawing animation
 */
export function animateLineDraw(target: string | SVGPathElement | SVGLineElement) {
  if (prefersReducedMotion() || typeof window === "undefined") return;

  return animate(target, {
    strokeDashoffset: [1000, 0],
    duration: 1200,
    ease: "inOutQuad",
  });
}

/**
 * Interactive memory network node pulse
 */
export function animateNodePulse(target: string | SVGElement | HTMLElement) {
  if (prefersReducedMotion() || typeof window === "undefined") return;

  return animate(target, {
    scale: [1, 1.18, 1],
    opacity: [0.85, 1, 0.85],
    duration: 2200,
    ease: "inOutSine",
    loop: true,
  });
}

/**
 * Smooth numeric counter animation
 */
export function animateNumber(
  targetObj: { value: number },
  endValue: number,
  onUpdate: (val: number) => void,
  duration: number = 900
) {
  if (prefersReducedMotion() || typeof window === "undefined") {
    onUpdate(endValue);
    return;
  }

  return animate(targetObj, {
    value: endValue,
    duration,
    ease: "outExpo",
    onUpdate: () => {
      onUpdate(Math.round(targetObj.value));
    },
  });
}

/**
 * ScrollTrigger Section Entrance
 */
export function initScrollReveal(
  triggerElement: HTMLElement | string,
  targetElements: HTMLElement[] | string,
  options?: {
    y?: number;
    stagger?: number;
    duration?: number;
    scrub?: boolean;
  }
) {
  if (prefersReducedMotion() || typeof window === "undefined") return;

  const y = options?.y ?? 30;
  const staggerVal = options?.stagger ?? 0.1;
  const duration = options?.duration ?? 0.8;

  return gsap.fromTo(
    targetElements,
    {
      opacity: 0,
      y,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger: staggerVal,
      ease: "power2.out",
      scrollTrigger: {
        trigger: triggerElement,
        start: "top 82%",
        toggleActions: "play none none none",
      },
    }
  );
}
