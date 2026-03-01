"use client";

import { useRef } from "react";
import Link from "next/link";
import { Camera, Cpu, FileText, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const words = ["Inspect.", "Report.", "Deploy."];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Each word takes a turn being "active" (large, centered, full opacity)
  // As you scroll, the active word hands off to the next

  // Word 1: Inspect - active from 0-20%, fades 20-30%
  const word1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0.15]);
  const word1Scale = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0.85]);
  const word1X = useTransform(scrollYProgress, [0, 0.15, 0.25], [0, 0, -30]);

  // Word 2: Report - faded until 15%, active 20-40%, fades 40-50%
  const word2Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25, 0.4, 0.5], [0.15, 0.15, 1, 1, 0.15]);
  const word2Scale = useTransform(scrollYProgress, [0.15, 0.25, 0.4, 0.5], [0.85, 1, 1, 0.85]);
  const word2X = useTransform(scrollYProgress, [0.15, 0.25, 0.4, 0.5], [-20, 0, 0, -30]);

  // Word 3: Deploy - faded until 35%, active 40-60%, stays until exit
  const word3Opacity = useTransform(scrollYProgress, [0, 0.35, 0.45, 0.65], [0.15, 0.15, 1, 1]);
  const word3Scale = useTransform(scrollYProgress, [0.35, 0.45, 0.65], [0.85, 1, 1]);
  const word3X = useTransform(scrollYProgress, [0.35, 0.45], [-20, 0]);

  // Content fades out at the end
  const contentOpacity = useTransform(scrollYProgress, [0.6, 0.85], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0.6, 0.85], [0, -60]);

  // Stagger indents (like the reference image)
  const indents = ["0%", "8%", "16%"];

  return (
    <section 
      ref={sectionRef} 
      className="min-h-[200vh] relative"
    >
      {/* Sticky container */}
      <div className="sticky top-0 min-h-screen flex flex-col justify-center bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
          <div className="max-w-5xl">
            {/* Stacked Statement Typography - Word by Word Activation */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-cat-black leading-[0.95] tracking-tight">
              {words.map((word, index) => {
                const opacityValues = [word1Opacity, word2Opacity, word3Opacity];
                const scaleValues = [word1Scale, word2Scale, word3Scale];
                const xValues = [word1X, word2X, word3X];

                return (
                  <motion.span
                    key={word}
                    className="block origin-left"
                    style={{
                      paddingLeft: indents[index],
                      opacity: opacityValues[index],
                      scale: scaleValues[index],
                      x: xValues[index],
                    }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </h1>

            {/* Subheadline */}
            <motion.p
              className="mt-12 text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed"
              style={{ opacity: contentOpacity, y: contentY }}
            >
              Voice-first inspection system for field operators. Speak your findings,
              let AI structure the report. Get machines back to work faster.
            </motion.p>

            {/* CTA */}
            <motion.div
              className="mt-10 flex flex-col sm:flex-row gap-4"
              style={{ opacity: contentOpacity, y: contentY }}
            >
              <Link
                href="/inspect"
                className="btn-primary inline-flex items-center justify-center gap-2 text-lg"
              >
                Start Inspection
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-lg"
              >
                See How It Works
              </Link>
            </motion.div>
          </div>

          {/* Flow Icons */}
          <motion.div
            className="mt-16 lg:mt-24"
            style={{ opacity: contentOpacity, y: contentY }}
          >
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <motion.div
                className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-cat-yellow rounded-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Camera className="h-8 w-8 sm:h-10 sm:w-10 text-cat-black" />
              </motion.div>
              <ArrowRight className="h-6 w-6 text-muted-foreground hidden sm:block" />
              <motion.div
                className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-cat-black rounded-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Cpu className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </motion.div>
              <ArrowRight className="h-6 w-6 text-muted-foreground hidden sm:block" />
              <motion.div
                className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-cat-black rounded-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-cat-black" />
              </motion.div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Capture &rarr; AI Analysis &rarr; Structured Report
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
