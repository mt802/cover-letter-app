"use client";

import { useRef, useState } from "react";
import type { FormData, PersonalityTrait } from "@/lib/types";

const TRAITS: { id: PersonalityTrait; label: string }[] = [
  { id: "casual", label: "Casual" },
  { id: "confident", label: "Confident" },
  { id: "warm", label: "Warm" },
  { id: "direct", label: "Direct" },
  { id: "professional", label: "Professional" },
  { id: "enthusiastic", label: "Enthusiastic" },
];

interface Props {
  form: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
}

export default function Step1Profile({ form, onChange, onNext }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [uploadError, setUploadError] = useState("");

  const toggleTrait = (trait: PersonalityTrait) => {
    const current = form.personalityTraits;
    onChange({
      personalityTraits: current.includes(trait)
        ? current.filter((t) => t !== trait)
        : [...current, trait],
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadState("loading");
    setUploadError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/parse-resume", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Parse failed");
      onChange({ resumeText: data.text });
      setUploadState("done");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setUploadState("error");
    }
  };

  const canContinue = form.currentJobTitle.trim().length > 0;

  return (
    <div className="space-y-10">

      <div>
        <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: "var(--ink-light)" }}>
          Current job title <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Senior Software Engineer"
          value={form.currentJobTitle}
          onChange={(e) => onChange({ currentJobTitle: e.target.value })}
          className="input-line"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-3">
          <label className="text-xs tracking-widest uppercase" style={{ color: "var(--ink-light)" }}>
            Resume / background
            <span className="ml-2 normal-case" style={{ color: "var(--ink-light)", letterSpacing: 0, fontSize: "0.75rem" }}>(optional)</span>
          </label>
          <div className="flex items-center gap-3">
            {uploadState === "done" && (
              <span className="text-xs" style={{ color: "var(--ink-light)" }}>Extracted — review below</span>
            )}
            {uploadState === "error" && (
              <span className="text-xs" style={{ color: "var(--accent)" }}>{uploadError}</span>
            )}
            <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileUpload} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadState === "loading"}
              className="text-xs underline underline-offset-2 disabled:opacity-40 transition-opacity"
              style={{ color: "var(--ink-mid)", fontFamily: "var(--font-sans)" }}
            >
              {uploadState === "loading" ? "Parsing…" : "Upload PDF or DOCX"}
            </button>
          </div>
        </div>
        <textarea
          rows={5}
          placeholder="Paste your resume, key achievements, or a short bio…"
          value={form.resumeText ?? ""}
          onChange={(e) => onChange({ resumeText: e.target.value })}
          className="input-line"
        />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: "var(--ink-light)" }}>
          Writing sample
          <span className="ml-2 normal-case" style={{ color: "var(--ink-light)", letterSpacing: 0, fontSize: "0.75rem" }}>(optional — helps match your voice)</span>
        </label>
        <textarea
          rows={3}
          placeholder="A paragraph you've written before — an email, bio, anything in your natural style…"
          value={form.writingSample ?? ""}
          onChange={(e) => onChange({ writingSample: e.target.value })}
          className="input-line"
        />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase mb-4" style={{ color: "var(--ink-light)" }}>
          Your personality
          <span className="ml-2 normal-case" style={{ color: "var(--ink-light)", letterSpacing: 0, fontSize: "0.75rem" }}>(pick what fits)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {TRAITS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleTrait(t.id)}
              className="px-3 py-1.5 text-sm transition-colors"
              style={{
                fontFamily: "var(--font-sans)",
                border: form.personalityTraits.includes(t.id) ? "1px solid var(--ink)" : "1px solid var(--rule)",
                color: form.personalityTraits.includes(t.id) ? "var(--paper)" : "var(--ink-mid)",
                background: form.personalityTraits.includes(t.id) ? "var(--ink)" : "transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="text-sm tracking-wide disabled:opacity-30 transition-opacity"
          style={{ fontFamily: "var(--font-sans)", color: "var(--ink)" }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
