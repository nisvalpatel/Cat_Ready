"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Stakes() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Sequential reveal for each stakes line
  const stake1Opacity = useTransform(scrollYProgress, [0.1, 0.25], [0.3, 1]);
  const stake1Y = useTransform(scrollYProgress, [0.1, 0.25], [20, 0]);
  const stake1Highlight = useTransform(scrollYProgress, [0.15, 0.3], [0, 100]);

  const stake2Opacity = useTransform(scrollYProgress, [0.25, 0.4], [0.3, 1]);
  const stake2Y = useTransform(scrollYProgress, [0.25, 0.4], [20, 0]);
  const stake2Highlight = useTransform(scrollYProgress, [0.3, 0.45], [0, 100]);

  const stake3Opacity = useTransform(scrollYProgress, [0.4, 0.55], [0.3, 1]);
  const stake3Y = useTransform(scrollYProgress, [0.4, 0.55], [20, 0]);
  const stake3Color = useTransform(
    scrollYProgress,
    [0.45, 0.6],
    ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.5)"]
  );

  // Conclusion reveal
  const conclusionOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const conclusionY = useTransform(scrollYProgress, [0.55, 0.7], [30, 0]);
  const conclusionScale = useTransform(scrollYProgress, [0.55, 0.7], [0.95, 1]);

  return (
    <section ref={sectionRef} className="dark-section bg-cat-black py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          {/* Stakes Escalation */}
          <div className="space-y-6 sm:space-y-8">
            <motion.p 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
              style={{ opacity: stake1Opacity, y: stake1Y }}
            >
              Every missed leak costs{" "}
              <motion.span 
                className="text-cat-yellow relative"
                style={{
                  backgroundImage: useTransform(stake1Highlight, (v) => 
                    `linear-gradient(to right, #FFCD11 ${v}%, transparent ${v}%)`
                  ),
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                }}
              >
                $47K
              </motion.span>
              .
            </motion.p>
            <motion.p 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
              style={{ opacity: stake2Opacity, y: stake2Y }}
            >
              Every delayed repair costs{" "}
              <motion.span 
                className="text-cat-yellow"
              >
                3 weeks
              </motion.span>
              .
            </motion.p>
            <motion.p 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
              style={{ opacity: stake3Opacity, y: stake3Y }}
            >
              Every skipped inspection is a{" "}
              <motion.span style={{ color: stake3Color }}>
                risk you didn&apos;t have to take
              </motion.span>
              .
            </motion.p>
          </div>

          {/* Conclusion */}
          <motion.div 
            className="mt-16 pt-16 border-t border-white/10"
            style={{ opacity: conclusionOpacity, y: conclusionY, scale: conclusionScale }}
          >
            <p className="text-3xl sm:text-4xl md:text-5xl font-black text-cat-yellow leading-tight">
              Avoid operator disasters entirely.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);

  return (
    <section ref={sectionRef} className="bg-cat-yellow py-20 lg:py-32">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ opacity, scale }}
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-cat-black mb-6">
          Try CAT Ready
        </h2>
        <p className="text-xl text-cat-black/80 mb-10 max-w-2xl mx-auto">
          Built on Caterpillar inspection standards. Powered by AI.
        </p>

        {/* CAT Wordmark */}
        <div className="mb-10 flex justify-center">
          <CaterpillarWordmark className="h-6 opacity-60" />
        </div>

        <Link
          href="/inspect"
          className="inline-flex items-center justify-center gap-2 bg-cat-black text-white font-bold text-lg px-8 py-4 rounded hover:bg-cat-black/90 transition-all"
        >
          Start Inspection
          <ArrowRight className="h-5 w-5" />
        </Link>
      </motion.div>
    </section>
  );
}

function CaterpillarWordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="0"
        y="20"
        fontFamily="Arial Black, sans-serif"
        fontSize="20"
        fontWeight="900"
        fill="#1A1A1A"
        letterSpacing="2"
      >
        CATERPILLAR
      </text>
    </svg>
  );
}
