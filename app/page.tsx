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
  const [step, setStep] = useState(0);
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

        if (!res.ok) throw new Error(`Generation failed (${res.status})`);

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
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

  const handleStartOver = () => {
    setForm(DEFAULT_FORM);
    setLetter("");
    setStep(0);
    setError(null);
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto px-6 py-12 sm:py-16">

        {/* Masthead */}
        <header className="mb-12 pb-6" style={{ borderBottom: "1px solid var(--rule)" }}>
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>
            Writing Tools
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold leading-tight mb-3"
            style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
          >
            Cover Letter
          </h1>
          <p style={{ color: "var(--ink-mid)", fontSize: "1rem", fontFamily: "var(--font-sans)" }}>
            Letters that sound like you wrote them.
          </p>
        </header>

        {error && (
          <div className="mb-8 py-3 text-sm" style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "1rem", color: "var(--accent)" }}>
            {error}
          </div>
        )}

        {step < 4 && <StepIndicator current={step} />}

        {step === 0 && <Step1Profile form={form} onChange={updateForm} onNext={() => setStep(1)} />}
        {step === 1 && <Step2JobDetails form={form} onChange={updateForm} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
        {step === 2 && <Step3VoiceTone form={form} onChange={updateForm} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <Step4Motivation form={form} onChange={updateForm} onGenerate={() => generate()} onBack={() => setStep(2)} />}
        {step === 4 && (
          <CoverLetterOutput
            letter={letter}
            isStreaming={isStreaming}
            form={form}
            onSliderChange={updateForm}
            onRegenerate={() => generate(letter)}
            onStartOver={handleStartOver}
            onLetterEdit={(text) => setLetter(text)}
          />
        )}

        <footer className="mt-16 pt-6 text-xs" style={{ borderTop: "1px solid var(--rule-light)", color: "var(--ink-light)" }}>
          Powered by Claude — built to not sound like AI.
        </footer>
      </div>
    </main>
  );
}
