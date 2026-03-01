"use client";

import { useRef } from "react";
import { ScanLine, Mic, CheckCircle } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: ScanLine,
    title: "Select Machine",
    description: "Choose from your fleet or scan the QR code. See current status and inspection history at a glance.",
  },
  {
    number: "02",
    icon: Mic,
    title: "Capture & Speak",
    description: "Take photos of key areas. Speak your findings. AI transcribes and structures your notes in real-time.",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Get Status",
    description: "Receive PASS, FAIL, or MONITOR status. Clear summary, recommended actions, and part identification when needed.",
  },
];

function StepItem({ step, index, scrollYProgress }: { 
  step: typeof steps[0]; 
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Calculate the scroll range for this specific step
  const stepStart = 0.1 + (index * 0.25);
  const stepMid = stepStart + 0.12;
  const stepEnd = stepStart + 0.22;

  // Step becomes active - text goes from gray to black
  const textOpacity = useTransform(
    scrollYProgress,
    [stepStart, stepMid, stepEnd, stepEnd + 0.1],
    [0.3, 1, 1, 0.3]
  );

  // Icon container goes from gray to YELLOW when active
  const iconBgOpacity = useTransform(
    scrollYProgress,
    [stepStart, stepMid, stepEnd, stepEnd + 0.1],
    [0, 1, 1, 0]
  );

  // Y transform for subtle rise effect
  const y = useTransform(
    scrollYProgress,
    [stepStart, stepMid],
    [15, 0]
  );

  // Scale for the icon container
  const iconScale = useTransform(
    scrollYProgress,
    [stepStart, stepMid, stepEnd, stepEnd + 0.1],
    [0.95, 1.05, 1.05, 0.95]
  );

  // Number fades in when active
  const numberOpacity = useTransform(
    scrollYProgress,
    [stepStart, stepMid, stepEnd, stepEnd + 0.1],
    [0.05, 0.15, 0.15, 0.05]
  );

  return (
    <motion.div
      className="relative border-t border-cat-black/10 py-12 lg:py-16"
      style={{ y }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
        {/* Faded Number */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
          style={{ opacity: numberOpacity }}
        >
          <span className="text-[10rem] xl:text-[14rem] font-black text-cat-black leading-none">
            {step.number}
          </span>
        </motion.div>

        {/* Mobile Number */}
        <motion.span 
          className="lg:hidden text-6xl font-black text-cat-black"
          style={{ opacity: numberOpacity }}
        >
          {step.number}
        </motion.span>

        {/* Content */}
        <div className="lg:ml-auto lg:max-w-2xl lg:pl-32 xl:pl-48">
          {/* Icon - Yellow when active, gray border when inactive */}
          <div className="relative w-14 h-14 mb-6">
            {/* Gray border version (always visible, fades when active) */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-white border-2 border-cat-black/20 rounded-2xl"
              style={{ opacity: useTransform(iconBgOpacity, v => 1 - v) }}
            >
              <step.icon className="h-7 w-7 text-cat-black/40" />
            </motion.div>
            
            {/* Yellow version (fades in when active) */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-cat-yellow rounded-2xl"
              style={{ opacity: iconBgOpacity, scale: iconScale }}
            >
              <step.icon className="h-7 w-7 text-cat-black" />
            </motion.div>
          </div>

          {/* Title */}
          <motion.h3 
            className="text-2xl sm:text-3xl font-black text-cat-black mb-4"
            style={{ opacity: textOpacity }}
          >
            {step.title}
          </motion.h3>

          {/* Description */}
          <motion.p 
            className="text-lg text-muted-foreground leading-relaxed"
            style={{ opacity: textOpacity }}
          >
            {step.description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Header animation
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.1], [30, 0]);

  return (
    <section ref={sectionRef} id="how-it-works" className="bg-background py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-cat-black">
            How it works
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="space-y-0">
          {steps.map((step, index) => (
            <StepItem 
              key={step.number} 
              step={step} 
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
