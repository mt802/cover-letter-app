"use client";

import { useState } from "react";
import type { FormData } from "@/lib/types";
import ToneSlider from "./ToneSlider";

interface Props {
  letter: string;
  isStreaming: boolean;
  form: FormData;
  onSliderChange: (updates: Partial<FormData>) => void;
  onRegenerate: () => void;
  onStartOver: () => void;
  onLetterEdit: (text: string) => void;
}

export default function CoverLetterOutput({
  letter, isStreaming, form, onSliderChange, onRegenerate, onStartOver, onLetterEdit,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateSlider = (key: keyof typeof form.toneSliders) => (v: number) =>
    onSliderChange({ toneSliders: { ...form.toneSliders, [key]: v } });

  return (
    <div>
      {/* Document area */}
      <div
        className="mb-8 px-8 py-10 sm:px-12 sm:py-12"
        style={{
          background: "var(--paper)",
          borderTop: "3px solid var(--ink)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
          minHeight: "320px",
        }}
      >
        {editing && !isStreaming ? (
          <textarea
            value={letter}
            onChange={(e) => onLetterEdit(e.target.value)}
            rows={18}
            className="w-full bg-transparent outline-none text-base leading-relaxed"
            style={{
              fontFamily: "Georgia, var(--font-serif), serif",
              color: "var(--ink)",
              border: "none",
              resize: "vertical",
            }}
          />
        ) : (
          <div
            className="whitespace-pre-wrap text-base leading-relaxed"
            style={{ fontFamily: "Georgia, var(--font-serif), serif", color: "var(--ink)" }}
          >
            {letter}
            {isStreaming && (
              <span
                className="inline-block w-0.5 h-4 ml-0.5 align-text-bottom animate-pulse"
                style={{ background: "var(--ink)" }}
              />
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {!isStreaming && (
        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={handleCopy}
            className="text-sm tracking-wide"
            style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
          >
            {copied ? "Copied" : "Copy to clipboard"}
          </button>
          <button
            onClick={() => setEditing(!editing)}
            className="text-sm"
            style={{ color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}
          >
            {editing ? "Preview" : "Edit text"}
          </button>
          <button
            onClick={onStartOver}
            className="text-sm ml-auto"
            style={{ color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}
          >
            Start over
          </button>
        </div>
      )}

      {/* Adjust tone */}
      {!isStreaming && (
        <div style={{ borderTop: "1px solid var(--rule-light)", paddingTop: "2rem" }}>
          <div className="flex items-baseline justify-between mb-6">
            <p className="text-xs tracking-widest uppercase" style={{ color: "var(--ink-light)" }}>
              Adjust & regenerate
            </p>
            <button
              onClick={onRegenerate}
              className="text-sm"
              style={{ color: "var(--ink)", fontFamily: "var(--font-sans)" }}
            >
              Regenerate →
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-7">
            <ToneSlider label="Formality" leftLabel="Casual" rightLabel="Formal" value={form.toneSliders.formality} onChange={updateSlider("formality")} />
            <ToneSlider label="Humor" leftLabel="None" rightLabel="Playful" value={form.toneSliders.humor} onChange={updateSlider("humor")} />
            <ToneSlider label="Enthusiasm" leftLabel="Measured" rightLabel="Energized" value={form.toneSliders.enthusiasm} onChange={updateSlider("enthusiasm")} />
            <ToneSlider label="Directness" leftLabel="Build-up" rightLabel="Lead with it" value={form.toneSliders.directness} onChange={updateSlider("directness")} />
          </div>
        </div>
      )}
    </div>
  );
}
