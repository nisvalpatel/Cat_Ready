"use client";

import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, RefObject } from "react";

interface ScrollAnimationOptions {
  offset?: ["start end" | "start start" | "center center" | "end end" | "end start", "start end" | "start start" | "center center" | "end end" | "end start"];
}

export function useScrollAnimation(options?: ScrollAnimationOptions) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: options?.offset || ["start end", "end start"],
  });

  return { ref, scrollYProgress };
}

export function useSectionScroll(ref: RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return scrollYProgress;
}

// Create a scroll-linked opacity that fades in as element enters viewport
export function useScrollFadeIn(scrollYProgress: MotionValue<number>) {
  return useTransform(scrollYProgress, [0, 0.3], [0, 1]);
}

// Create a scroll-linked transform for sequential reveals
export function useSequentialReveal(
  scrollYProgress: MotionValue<number>,
  index: number,
  total: number
) {
  const start = index / (total + 1);
  const end = (index + 1) / (total + 1);
  
  const opacity = useTransform(scrollYProgress, [start, end], [0.3, 1]);
  const color = useTransform(scrollYProgress, [start, end], [0.3, 1]);
  
  return { opacity, color };
}

// Create a fill animation (for highlight effects)
export function useScrollFill(
  scrollYProgress: MotionValue<number>,
  startPoint: number = 0.2,
  endPoint: number = 0.5
) {
  return useTransform(scrollYProgress, [startPoint, endPoint], [0, 100]);
}
