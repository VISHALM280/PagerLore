"use client";

import { animate, createTimeline, stagger } from "animejs";

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

