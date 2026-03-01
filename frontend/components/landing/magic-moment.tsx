"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mic, ArrowRight } from "lucide-react";

// Smooth waveform component with sine-wave based animation
function SmoothWaveform() {
  const [bars, setBars] = useState<number[]>(Array(20).fill(25));
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      
      const newBars = Array(20).fill(0).map((_, i) => {
        const wave1 = Math.sin(elapsed * 1.5 + i * 0.4) * 12;
        const wave2 = Math.sin(elapsed * 2.3 + i * 0.25) * 8;
        const wave3 = Math.sin(elapsed * 0.8 + i * 0.6) * 5;
        const centerBoost = Math.sin((i / 19) * Math.PI) * 10;
        return Math.max(8, 25 + wave1 + wave2 + wave3 + centerBoost);
      });
      
      setBars(newBars);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="flex items-center gap-1 w-full justify-center h-16">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-1 bg-cat-yellow rounded-full transition-all duration-150 ease-out"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
}

const transcriptText = "Left track tensioner showing minor hydraulic seepage. Recommend monitoring over next 48 hours.";

const checklistItems = [
  { category: "Hydraulics", status: "MONITOR", finding: "Minor seepage detected" },
  { category: "Tracks", status: "PASS", finding: "Within tolerance" },
  { category: "Engine", status: "PASS", finding: "Operating normally" },
];

export function MagicMoment() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [showChecklist, setShowChecklist] = useState(false);
  const [activeItems, setActiveItems] = useState(0);

  // Scroll-linked background transition
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background color interpolation: cream -> black -> cream (extended range for smoother transition)
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.65, 0.85, 1],
    ["#F4F2EE", "#F4F2EE", "#1a1a1a", "#1a1a1a", "#F4F2EE", "#F4F2EE"]
  );

  // Top gradient opacity (fades out as we enter dark zone)
  const topGradientOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.35],
    [1, 0]
  );

  // Bottom gradient opacity (fades in as we exit dark zone)
  const bottomGradientOpacity = useTransform(
    scrollYProgress,
    [0.65, 0.85],
    [0, 1]
  );

  // Text color interpolation: black -> white -> black
  const textColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.65, 0.85, 1],
    ["#0B0B0B", "#0B0B0B", "#ffffff", "#ffffff", "#0B0B0B", "#0B0B0B"]
  );

  // Muted text color
  const mutedTextColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.65, 0.85, 1],
    ["#6b7280", "#6b7280", "#9ca3af", "#9ca3af", "#6b7280", "#6b7280"]
  );

  // Card background
  const cardBg = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.65, 0.85, 1],
    ["#e8e6e3", "#e8e6e3", "#2a2a2a", "#2a2a2a", "#e8e6e3", "#e8e6e3"]
  );

  // Inner card background
  const innerCardBg = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.65, 0.85, 1],
    ["#ffffff", "#ffffff", "#1a1a1a", "#1a1a1a", "#ffffff", "#ffffff"]
  );

  useEffect(() => {
    if (!isAnimating) return;

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < transcriptText.length) {
        setDisplayedText(transcriptText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setShowChecklist(true);
          let itemIndex = 0;
          const itemInterval = setInterval(() => {
            if (itemIndex < checklistItems.length) {
              setActiveItems(itemIndex + 1);
              itemIndex++;
            } else {
              clearInterval(itemInterval);
            }
          }, 400);
        }, 500);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [isAnimating]);

  const handleStart = () => {
    setIsAnimating(true);
    setDisplayedText("");
    setShowChecklist(false);
    setActiveItems(0);
  };

  const handleReset = () => {
    setIsAnimating(false);
    setDisplayedText("");
    setShowChecklist(false);
    setActiveItems(0);
  };

  return (
    <motion.section 
      ref={sectionRef} 
      className="relative py-20 lg:py-32"
      style={{ backgroundColor }}
    >
      {/* Top feathered gradient overlay */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-32 md:h-48 pointer-events-none"
        style={{ 
          opacity: topGradientOpacity,
          background: "linear-gradient(to bottom, #F4F2EE 0%, #F4F2EE 20%, transparent 100%)"
        }}
      />
      
      {/* Bottom feathered gradient overlay */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-32 md:h-48 pointer-events-none"
        style={{ 
          opacity: bottomGradientOpacity,
          background: "linear-gradient(to top, #F4F2EE 0%, #F4F2EE 20%, transparent 100%)"
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl font-black"
            style={{ color: textColor }}
          >
            Speak It. See It. Submit It.
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg"
            style={{ color: mutedTextColor }}
          >
            Your voice becomes a structured report in seconds.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="rounded-2xl p-6 sm:p-8 lg:p-12"
            style={{ backgroundColor: cardBg }}
          >
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${isAnimating ? "bg-cat-red animate-pulse" : "bg-gray-400"}`} />
                  <motion.span 
                    className="text-sm font-medium"
                    style={{ color: mutedTextColor }}
                  >
                    {isAnimating ? "Recording..." : "Tap to record"}
                  </motion.span>
                </div>

                <motion.div 
                  className="rounded-xl p-4 mb-6 min-h-[80px] flex items-center"
                  style={{ backgroundColor: innerCardBg }}
                >
                  {isAnimating ? (
                    <SmoothWaveform />
                  ) : (
                    <motion.p 
                      className="text-sm text-center w-full"
                      style={{ color: mutedTextColor }}
                    >
                      Audio waveform will appear here
                    </motion.p>
                  )}
                </motion.div>

                <motion.div 
                  className="rounded-xl p-4 min-h-[100px]"
                  style={{ backgroundColor: innerCardBg }}
                >
                  <motion.p 
                    className="text-xs font-medium mb-2"
                    style={{ color: mutedTextColor }}
                  >
                    TRANSCRIPT
                  </motion.p>
                  <motion.p 
                    className="leading-relaxed"
                    style={{ color: textColor }}
                  >
                    {displayedText}
                    {isAnimating && displayedText.length < transcriptText.length && (
                      <span className="inline-block w-0.5 h-4 bg-cat-yellow ml-1 animate-pulse" />
                    )}
                  </motion.p>
                </motion.div>

                <button
                  onClick={isAnimating ? handleReset : handleStart}
                  className={`mt-6 w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${
                    isAnimating ? "bg-white text-cat-black" : "bg-cat-yellow text-cat-black"
                  }`}
                >
                  <Mic className="h-5 w-5" />
                  {isAnimating ? "Reset Demo" : "Try Voice Demo"}
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <motion.div style={{ color: mutedTextColor }}>
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                  <motion.span 
                    className="text-sm font-medium"
                    style={{ color: mutedTextColor }}
                  >
                    Auto-generated checklist
                  </motion.span>
                </div>

                <div className="space-y-3">
                  {checklistItems.map((item, index) => (
                    <motion.div
                      key={item.category}
                      className={`rounded-xl p-4 transition-all duration-300 ${
                        showChecklist && index < activeItems
                          ? "opacity-100 translate-y-0"
                          : "opacity-30 translate-y-2"
                      }`}
                      style={{ backgroundColor: innerCardBg }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <motion.span 
                          className="font-bold"
                          style={{ color: textColor }}
                        >
                          {item.category}
                        </motion.span>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            item.status === "PASS"
                              ? "bg-green-500 text-white"
                              : item.status === "MONITOR"
                              ? "bg-cat-yellow text-cat-black"
                              : "bg-cat-red text-white"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <motion.p 
                        className="text-sm"
                        style={{ color: mutedTextColor }}
                      >
                        {item.finding}
                      </motion.p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
