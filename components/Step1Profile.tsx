"use client";

import { useRef, useState } from "react";
import type { FormData, PersonalityTrait } from "@/lib/types";

const TRAITS: { id: PersonalityTrait; label: string; desc: string }[] = [
  { id: "casual", label: "Casual", desc: "Relaxed, conversational" },
  { id: "confident", label: "Confident", desc: "Direct, assured tone" },
  { id: "warm", label: "Warm", desc: "Friendly and human" },
  { id: "direct", label: "Direct", desc: "No fluff, gets to the point" },
  { id: "professional", label: "Professional", desc: "Polished and precise" },
  { id: "enthusiastic", label: "Enthusiastic", desc: "Energetic and engaged" },
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
    if (current.includes(trait)) {
      onChange({ personalityTraits: current.filter((t) => t !== trait) });
    } else {
      onChange({ personalityTraits: [...current, trait] });
    }
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
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your current job title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Senior Software Engineer"
          value={form.currentJobTitle}
          onChange={(e) => onChange({ currentJobTitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Resume / background{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Upload a file or paste text. The more specific, the better the letter.
        </p>

        {/* Upload button */}
        <div className="flex items-center gap-2 mb-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadState === "loading"}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {uploadState === "loading" ? "Parsing..." : "Upload PDF or DOCX"}
          </button>
          {uploadState === "done" && (
            <span className="text-xs text-green-600 font-medium">Extracted — review below</span>
          )}
          {uploadState === "error" && (
            <span className="text-xs text-red-500">{uploadError}</span>
          )}
        </div>

        <textarea
          rows={5}
          placeholder="Paste your resume text, key achievements, or a short bio here..."
          value={form.resumeText ?? ""}
          onChange={(e) => onChange({ resumeText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Writing sample{" "}
          <span className="text-gray-400 font-normal">(optional — helps match your voice)</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          A paragraph or two you've written before — an email, bio, or anything in your natural style.
        </p>
        <textarea
          rows={3}
          placeholder="Paste a short sample of your writing here..."
          value={form.writingSample ?? ""}
          onChange={(e) => onChange({ writingSample: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Personality traits{" "}
          <span className="text-gray-400 font-normal">(pick what fits you)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TRAITS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleTrait(t.id)}
              className={`px-3 py-2 rounded-lg border text-left transition-colors ${
                form.personalityTraits.includes(t.id)
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="text-sm font-medium">{t.label}</div>
              <div className="text-xs text-gray-500">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
