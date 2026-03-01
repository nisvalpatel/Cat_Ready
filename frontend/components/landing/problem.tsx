"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Yellow highlight fill animation for "Manual inspections"
  const yellowFill = useTransform(scrollYProgress, [0.1, 0.3], [0, 100]);
  const yellowTextColor = useTransform(
    scrollYProgress,
    [0.1, 0.3],
    ["rgb(255, 255, 255)", "rgb(26, 26, 26)"]
  );

  // Second paragraph fade in
  const secondParaOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0.3, 1]);
  const secondParaY = useTransform(scrollYProgress, [0.25, 0.4], [20, 0]);

  // "failures before they cost you" - red fill animation
  const redOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0.4, 1]);
  const redColor = useTransform(
    scrollYProgress,
    [0.3, 0.5],
    ["rgba(255, 255, 255, 0.4)", "rgb(222, 31, 38)"]
  );

  // Pivot section animations
  const pivotOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const pivotY = useTransform(scrollYProgress, [0.5, 0.65], [30, 0]);

  return (
    <section ref={sectionRef} className="dark-section bg-cat-black py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          {/* Problem Statement */}
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            <motion.span 
              className="inline-block px-3 py-1 mr-2 relative overflow-hidden"
              style={{ 
                background: useTransform(yellowFill, (v) => `linear-gradient(to right, #FFCD11 ${v}%, transparent ${v}%)`),
                color: yellowTextColor,
              }}
            >
              Manual inspections
            </motion.span>
            are slow, inconsistent, and disconnected from the fleet.
          </p>

          <motion.p 
            className="mt-8 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ opacity: secondParaOpacity, y: secondParaY }}
          >
            You fill out forms but never actually catch{" "}
            <motion.span style={{ color: redColor }}>
              failures before they cost you.
            </motion.span>
          </motion.p>

          {/* Pivot */}
          <motion.div 
            className="mt-16 pt-16 border-t border-white/10"
            style={{ opacity: pivotOpacity, y: pivotY }}
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-white/90 leading-relaxed">
              With <span className="text-cat-yellow font-bold">CAT Ready</span>, 
              your voice becomes a structured report. Every inspection is standardized. 
              Every machine has a status. Every failure is flagged.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
