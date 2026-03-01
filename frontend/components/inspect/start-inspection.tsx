"use client";

import Link from "next/link";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { VEHICLE } from "@/lib/checklist";

interface StartInspectionProps {
  onStart: () => void;
}

export function StartInspection({ onStart }: StartInspectionProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 -ml-2 hover:bg-cat-gray rounded transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-cat-black">Daily Inspection</h1>
              <p className="text-sm text-muted-foreground">
                CAT 982 checklist
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-8">
        <div className="bg-cat-gray rounded-xl p-6 mb-6">
          <p className="text-sm text-muted-foreground mb-1">Equipment</p>
          <h2 className="text-2xl font-black text-cat-black">{VEHICLE.name}</h2>
          <p className="text-sm font-mono text-muted-foreground mt-1">
            {VEHICLE.make} · {VEHICLE.model}
          </p>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Use voice to go through each section quickly. Add a photo only if you see an issue so the AI can help assess it.
        </p>

        <button
          onClick={onStart}
          className="w-full py-4 bg-cat-yellow text-cat-black font-bold rounded flex items-center justify-center gap-3 hover:brightness-95 transition-all"
        >
          <ClipboardCheck className="h-6 w-6" />
          Start Inspection
        </button>
      </div>
    </div>
  );
}
