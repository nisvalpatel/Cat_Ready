"use client";

import { useRef } from "react";
import { Clock, ClipboardCheck, Wifi, Wrench, Shield } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const valueProps = [
  {
    number: "01",
    title: "FASTER INSPECTIONS",
    icon: Clock,
    description: "Complete inspections in minutes, not hours. Voice input eliminates manual data entry.",
  },
  {
    number: "02",
    title: "STANDARDIZED PROCESS",
    icon: ClipboardCheck,
    description: "Every inspection follows the same structure. No more inconsistent reports or missed checks.",
  },
  {
    number: "03",
    title: "REAL-TIME STATUS",
    icon: Wifi,
    description: "Fleet managers see machine status instantly. No waiting for paperwork to arrive.",
  },
  {
    number: "04",
    title: "REDUCED DOWNTIME",
    icon: Wrench,
    description: "Catch issues early. AI flags problems before they become expensive failures.",
  },
  {
    number: "05",
    title: "OPERATOR SAFETY",
    icon: Shield,
    description: "Ensure every safety check is completed. Protect your operators and your equipment.",
  },
];

function FeatureCard({ 
  prop, 
  index, 
  scrollYProgress 
}: { 
  prop: typeof valueProps[0]; 
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Calculate scroll range for this card
  const cardStart = 0.1 + (index * 0.12);
  const cardMid = cardStart + 0.08;
  const cardEnd = cardStart + 0.15;

  // Card becomes "active" - yellow left border, slight elevation
  const borderOpacity = useTransform(
    scrollYProgress,
    [cardStart, cardMid, cardEnd, cardEnd + 0.08],
    [0, 1, 1, 0]
  );

  const cardY = useTransform(
    scrollYProgress,
    [cardStart, cardMid],
    [20, 0]
  );

  const cardOpacity = useTransform(
    scrollYProgress,
    [cardStart, cardMid, cardEnd + 0.1, cardEnd + 0.18],
    [0.5, 1, 1, 0.5]
  );

  const elevation = useTransform(
    scrollYProgress,
    [cardStart, cardMid, cardEnd, cardEnd + 0.08],
    [0, 8, 8, 0]
  );

  return (
    <motion.div
      className="relative bg-white rounded-2xl p-6 border border-cat-black/10 overflow-hidden"
      style={{ 
        y: cardY, 
        opacity: cardOpacity,
        boxShadow: useTransform(elevation, v => `0 ${v}px ${v * 2}px rgba(0,0,0,0.08)`)
      }}
    >
      {/* Yellow left border indicator */}
      <motion.div 
        className="absolute left-0 top-0 bottom-0 w-1 bg-cat-yellow"
        style={{ opacity: borderOpacity }}
      />

      <div className="flex items-start gap-4">
        {/* Icon */}
        <motion.div 
          className="flex items-center justify-center w-12 h-12 bg-cat-yellow rounded-xl shrink-0"
          style={{ 
            scale: useTransform(borderOpacity, [0, 1], [0.95, 1.05])
          }}
        >
          <prop.icon className="h-6 w-6 text-cat-black" />
        </motion.div>
        
        <div>
          <span className="text-xs font-mono text-cat-black/40 block mb-1">
            {prop.number}
          </span>
          <h3 className="text-lg font-black text-cat-black mb-2">
            {prop.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {prop.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function ValueProps() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Header animation
  const headerOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.08], [30, 0]);

  return (
    <section ref={sectionRef} id="features" className="bg-background py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-cat-black">
            Why CAT Ready?
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {valueProps.map((prop, index) => (
            <FeatureCard 
              key={prop.number} 
              prop={prop} 
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
