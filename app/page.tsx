"use client";

import { useState, useCallback } from "react";
import StepIndicator from "@/components/StepIndicator";
import Step1Profile from "@/components/Step1Profile";
import Step2JobDetails from "@/components/Step2JobDetails";
import Step3VoiceTone from "@/components/Step3VoiceTone";
import Step4Motivation from "@/components/Step4Motivation";
import CoverLetterOutput from "@/components/CoverLetterOutput";
import type { FormData } from "@/lib/types";

const DEFAULT_FORM: FormData = {
  currentJobTitle: "",
  resumeText: "",
  writingSample: "",
  personalityTraits: [],
  toneSliders: {
    formality: 50,
    humor: 20,
    enthusiasm: 50,
    directness: 60,
  },
  targetJobTitle: "",
  jobDescription: "",
  companyName: "",
  whyThisRole: "",
  lengthTarget: "short",
  customLength: "",
};

export default function Home() {
  const [step, setStep] = useState(0); // 0–3: wizard steps; 4: output
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [letter, setLetter] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateForm = useCallback((updates: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const generate = useCallback(
    async (existingLetter?: string) => {
      setError(null);
      setLetter("");
      setIsStreaming(true);
      setStep(4);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, existingLetter }),
        });

        if (!res.ok) {
          throw new Error(`Generation failed (${res.status})`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setLetter(accumulated);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
        setStep(3);
      } finally {
        setIsStreaming(false);
      }
    },
    [form]
  );

  const handleRegenerate = () => {
    generate(letter);
  };

  const handleStartOver = () => {
    setForm(DEFAULT_FORM);
    setLetter("");
    setStep(0);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Cover Letter Generator
          </h1>
          <p className="text-gray-500 text-sm">
            Letters that actually sound like you wrote them.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {step < 4 && <StepIndicator current={step} />}

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {step === 0 && (
            <Step1Profile
              form={form}
              onChange={updateForm}
              onNext={() => setStep(1)}
            />
          )}

          {step === 1 && (
            <Step2JobDetails
              form={form}
              onChange={updateForm}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}

          {step === 2 && (
            <Step3VoiceTone
              form={form}
              onChange={updateForm}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <Step4Motivation
              form={form}
              onChange={updateForm}
              onGenerate={() => generate()}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <CoverLetterOutput
              letter={letter}
              isStreaming={isStreaming}
              form={form}
              onSliderChange={updateForm}
              onRegenerate={handleRegenerate}
              onStartOver={handleStartOver}
              onLetterEdit={(text) => setLetter(text)}
            />
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by Claude — built to not sound like AI.
        </p>
      </div>
    </main>
  );
}
