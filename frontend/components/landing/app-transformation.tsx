"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Search, ScanLine, MapPin, Clock } from "lucide-react";

// Sample machine data for the preview
const previewMachines = [
  { id: "CAT-D8T-001", name: "D8T Dozer", location: "Site A", hours: 4250, status: "pending" },
  { id: "CAT-966M-003", name: "966M Loader", location: "Site B", hours: 3180, status: "pass" },
  { id: "CAT-320-007", name: "320 Excavator", location: "Site A", hours: 5420, status: "monitor" },
];

export function AppTransformation() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  // Background transitions from cream to dark
  const bgColorProgress = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);
  
  // Landing content fades out
  const landingOpacity = useTransform(scrollYProgress, [0.2, 0.5], [1, 0]);
  const landingY = useTransform(scrollYProgress, [0.2, 0.5], [0, -100]);

  // App UI fades in
  const appOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  const appY = useTransform(scrollYProgress, [0.5, 0.8], [60, 0]);
  const appScale = useTransform(scrollYProgress, [0.5, 0.8], [0.95, 1]);

  return (
    <section ref={sectionRef} className="relative min-h-[200vh]">
      {/* Background color transition layer */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ 
          backgroundColor: useTransform(bgColorProgress, [0, 1], ["#F4F2EE", "#1a1a1a"]),
          opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0, 1, 1])
        }}
      />

      {/* Sticky container */}
      <div className="sticky top-0 min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Landing CTA content - fades out */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ opacity: landingOpacity, y: landingY }}
        >
          <div className="text-center max-w-3xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-cat-black mb-6">
              Ready to transform your inspections?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              See exactly how operators will experience CAT Ready in the field.
            </p>
            <Link
              href="/inspect"
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg"
            >
              Try the Demo
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>

        {/* App UI Preview - fades in */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center px-4 py-8"
          style={{ opacity: appOpacity, y: appY, scale: appScale }}
        >
          <div className="w-full max-w-md bg-cat-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            {/* App Header */}
            <div className="bg-cat-black px-6 py-5 border-b border-white/10">
              <h3 className="text-xl font-black text-white">Select Machine</h3>
              <p className="text-sm text-white/60 mt-1">Choose a machine to inspect</p>
            </div>

            {/* Search */}
            <div className="px-6 py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <div className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-full text-white/40 text-sm">
                  Search by name, ID, or model...
                </div>
              </div>
            </div>

            {/* QR Button */}
            <div className="px-6 pb-4">
              <div className="w-full flex items-center justify-center gap-3 py-4 bg-cat-yellow text-cat-black font-bold rounded-full">
                <ScanLine className="h-5 w-5" />
                Scan QR Code
              </div>
            </div>

            {/* Machine List Preview */}
            <div className="px-6 pb-6 space-y-3">
              {previewMachines.map((machine, index) => (
                <motion.div
                  key={machine.id}
                  className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white truncate">
                          {machine.name}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                          machine.status === "pass" ? "bg-green-500 text-white" :
                          machine.status === "monitor" ? "bg-cat-yellow text-cat-black" :
                          "bg-white/20 text-white"
                        }`}>
                          {machine.status}
                        </span>
                      </div>
                      <p className="text-sm font-mono text-white/50 mb-2">
                        {machine.id}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {machine.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {machine.hours.toLocaleString()}h
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom indicator */}
            <div className="px-6 py-4 border-t border-white/10 text-center">
              <Link 
                href="/inspect"
                className="text-cat-yellow font-bold text-sm hover:underline"
              >
                Open Full Demo &rarr;
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
