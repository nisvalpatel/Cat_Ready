"use client";

import { useState } from "react";
import { StartInspection } from "@/components/inspect/start-inspection";
import { InspectionCapture, type PhotosByStep, type AudioByStep } from "@/components/inspect/inspection-capture";
import { InspectionResults } from "@/components/inspect/inspection-results";
import { VEHICLE, CHECKLIST_STEPS } from "@/lib/checklist";
import {
  createInspection,
  getInspection,
  submitStep,
  inspectionToResult,
  type InspectionDetail,
} from "@/lib/api";
import type { InspectionResult } from "@/lib/mock-data";

type Step = "start" | "capture" | "processing" | "results" | "error";

const MACHINE_FOR_RESULTS = {
  id: VEHICLE.id,
  name: VEHICLE.name,
  type: "loader" as const,
  model: VEHICLE.model,
  lastInspection: "",
  status: "pending" as const,
  location: "",
  hours: 0,
};

export default function InspectPage() {
  const [step, setStep] = useState<Step>("start");
  const [inspectionResult, setInspectionResult] = useState<InspectionResult | null>(null);
  const [inspectionId, setInspectionId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStart = () => setStep("capture");

  const handleCaptureComplete = async (photosByStep: PhotosByStep, audioByStep: AudioByStep) => {
    setStep("processing");
    setErrorMessage(null);

    try {
      const { id: inspId } = await createInspection(VEHICLE.id);

      for (let i = 0; i < CHECKLIST_STEPS.length; i++) {
        const checklistStep = CHECKLIST_STEPS[i];
        const images = photosByStep[checklistStep.id] || [];
        const audio = audioByStep[i] ?? null;
        await submitStep(inspId, i, checklistStep.name, audio, images);
      }

      const inspection: InspectionDetail = await getInspection(inspId);
      const result = inspectionToResult(inspection, VEHICLE.id);
      setInspectionResult(result as InspectionResult);
      setInspectionId(inspId);
      setStep("results");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Submission failed.");
      setStep("error");
    }
  };

  const handleNewInspection = () => {
    setStep("start");
    setInspectionResult(null);
    setInspectionId(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen">
      {step === "start" && <StartInspection onStart={handleStart} />}

      {step === "capture" && (
        <InspectionCapture
          vehicleName={VEHICLE.name}
          vehicleId={VEHICLE.id}
          onComplete={handleCaptureComplete}
          onBack={() => setStep("start")}
        />
      )}

      {step === "processing" && <ProcessingScreen />}

      {step === "error" && (
        <ErrorScreen message={errorMessage || "Something went wrong."} onRetry={handleNewInspection} />
      )}

      {step === "results" && inspectionResult && (
        <InspectionResults
          machine={MACHINE_FOR_RESULTS}
          result={inspectionResult}
          onNewInspection={handleNewInspection}
          inspectionId={inspectionId ?? undefined}
        />
      )}
    </div>
  );
}

function ProcessingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-cat-gray">
      <div className="text-center">
        <div className="mb-8">
          <svg viewBox="0 0 60 52" className="w-16 h-16 mx-auto animate-pulse">
            <polygon points="30,0 60,52 0,52" fill="#FFCD11" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-cat-black mb-2">Analyzing inspection</h2>
        <p className="text-muted-foreground mb-8">{VEHICLE.name}</p>
        <div className="w-64 h-2 bg-white rounded overflow-hidden mx-auto">
          <div className="h-full w-0 bg-cat-yellow rounded animate-progress-bar" />
        </div>
      </div>
    </div>
  );
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-cat-gray">
      <div className="max-w-md text-center">
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded font-medium">{message}</div>
        <p className="text-sm text-muted-foreground mb-6">
          Make sure the backend is running and CORS is enabled.
        </p>
        <button onClick={onRetry} className="py-3 px-6 bg-cat-yellow text-cat-black font-bold rounded">
          Start over
        </button>
      </div>
    </div>
  );
}
