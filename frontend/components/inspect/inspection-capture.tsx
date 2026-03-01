"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Camera, Mic, MicOff, Check, X, ChevronRight } from "lucide-react";
import { Machine, inspectionCategories } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export type PhotosByCategory = Record<string, File[]>;

interface InspectionCaptureProps {
  machine: Machine;
  onComplete: (photosByCategory: PhotosByCategory, audioBlob: Blob | null) => void;
  onBack: () => void;
}

export function InspectionCapture({ machine, onComplete, onBack }: InspectionCaptureProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [photosByCategory, setPhotosByCategory] = useState<PhotosByCategory>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const currentCategory = inspectionCategories[currentCategoryIndex];
  const currentPhotos = photosByCategory[currentCategory.id] || [];
  const totalRequiredPhotos = inspectionCategories.reduce((sum, cat) => sum + cat.requiredPhotos, 0);
  const totalCapturedPhotos = Object.values(photosByCategory).flat().length;

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;
      const newFiles = Array.from(files);
      setPhotosByCategory((prev) => ({
        ...prev,
        [currentCategory.id]: [...(prev[currentCategory.id] || []), ...newFiles],
      }));
      e.target.value = "";
    },
    [currentCategory.id]
  );

  const handleCapturePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = (index: number) => {
    setPhotosByCategory((prev) => ({
      ...prev,
      [currentCategory.id]: prev[currentCategory.id]?.filter((_, i) => i !== index) || [],
    }));
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (chunksRef.current.length) {
          setRecordedAudioBlob(new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" }));
        }
      };
      recorder.start(200);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access failed:", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const handleToggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handleNextCategory = () => {
    if (currentCategoryIndex < inspectionCategories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    }
  };

  const handlePrevCategory = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(photosByCategory, recordedAudioBlob);
  };

  const canSubmit = totalCapturedPhotos >= totalRequiredPhotos * 0.5;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        aria-label="Add photo"
      />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-cat-gray rounded transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{machine.id}</p>
              <h1 className="text-lg font-bold text-cat-black">{machine.name}</h1>
            </div>
            <div className="w-10" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-2 bg-cat-gray rounded overflow-hidden">
              <div
                className="h-full bg-cat-yellow transition-all"
                style={{
                  width: `${((currentCategoryIndex + 1) / inspectionCategories.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {currentCategoryIndex + 1}/{inspectionCategories.length}
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <div className="px-4 py-4 bg-cat-gray">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevCategory}
              disabled={currentCategoryIndex === 0}
              className="p-2 hover:bg-white rounded disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <h2 className="text-xl font-black text-cat-black">{currentCategory.name}</h2>
              <p className="text-sm text-muted-foreground">
                {currentPhotos.length}/{currentCategory.requiredPhotos} photos required
              </p>
            </div>
            <button
              onClick={handleNextCategory}
              disabled={currentCategoryIndex === inspectionCategories.length - 1}
              className="p-2 hover:bg-white rounded disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {currentPhotos.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="aspect-square bg-cat-gray rounded relative overflow-hidden"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 p-1 bg-cat-red text-white rounded"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-cat-black/70 text-white text-xs rounded">
                  Photo {index + 1}
                </div>
              </div>
            ))}

            <button
              onClick={handleCapturePhoto}
              className="aspect-square bg-cat-yellow hover:brightness-95 rounded flex flex-col items-center justify-center transition-all"
            >
              <Camera className="h-8 w-8 text-cat-black" />
              <span className="text-xs font-bold text-cat-black mt-1">Add Photo</span>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">Check these items:</p>
            <div className="flex flex-wrap gap-2">
              {currentCategory.items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-cat-gray text-cat-black text-sm rounded"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-cat-gray rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-cat-black">Voice Notes</span>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isRecording ? "bg-cat-red animate-pulse" : "bg-gray-300"
                  )}
                />
                <span className="text-xs text-muted-foreground">
                  {isRecording ? "Recording..." : recordedAudioBlob ? "Recording saved" : "Tap to record"}
                </span>
              </div>
            </div>

            <div className="bg-white rounded p-3 min-h-[80px] mb-3">
              <p className="text-sm text-cat-black leading-relaxed">
                {isRecording ? (
                  <>
                    Recording...
                    <span className="inline-block w-0.5 h-4 bg-cat-yellow ml-1 animate-pulse" />
                  </>
                ) : recordedAudioBlob ? (
                  "Voice note recorded. You can record again to replace."
                ) : (
                  <span className="text-muted-foreground italic">
                    Speak your inspection findings (optional).
                  </span>
                )}
              </p>
            </div>

            <button
              onClick={handleToggleRecording}
              className={cn(
                "w-full py-4 rounded font-bold flex items-center justify-center gap-2 transition-all",
                isRecording ? "bg-cat-red text-white" : "bg-cat-black text-white"
              )}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-5 w-5" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5" />
                  {recordedAudioBlob ? "Record Again" : "Start Voice Note"}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-border p-4">
          <div className="flex gap-3">
            <button
              onClick={handleNextCategory}
              disabled={currentCategoryIndex === inspectionCategories.length - 1}
              className="flex-1 py-4 bg-cat-gray text-cat-black font-bold rounded disabled:opacity-50"
            >
              Next Category
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={cn(
                "flex-1 py-4 font-bold rounded flex items-center justify-center gap-2",
                canSubmit ? "bg-cat-yellow text-cat-black" : "bg-gray-200 text-gray-400"
              )}
            >
              <Check className="h-5 w-5" />
              Submit Inspection
            </button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            {totalCapturedPhotos} of {totalRequiredPhotos} required photos captured
          </p>
        </div>
      </div>
    </div>
  );
}
