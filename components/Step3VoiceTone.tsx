"use client";

import type { FormData } from "@/lib/types";
import ToneSlider from "./ToneSlider";

interface Props {
  form: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const LENGTH_OPTIONS = [
  { id: "short", label: "Short", desc: "~150 words" },
  { id: "medium", label: "Medium", desc: "~250 words" },
  { id: "long", label: "Long", desc: "~350 words" },
  { id: "custom", label: "Custom", desc: "specify below" },
] as const;

export default function Step3VoiceTone({ form, onChange, onNext, onBack }: Props) {
  const updateSlider = (key: keyof typeof form.toneSliders) => (v: number) =>
    onChange({ toneSliders: { ...form.toneSliders, [key]: v } });

  return (
    <div className="space-y-12">

      <div>
        <p className="text-xs tracking-widest uppercase mb-6" style={{ color: "var(--ink-light)" }}>
          Tone
        </p>
        <div className="space-y-7">
          <ToneSlider label="Formality" leftLabel="Casual" rightLabel="Formal" value={form.toneSliders.formality} onChange={updateSlider("formality")} />
          <ToneSlider label="Humor" leftLabel="None" rightLabel="Playful" value={form.toneSliders.humor} onChange={updateSlider("humor")} />
          <ToneSlider label="Enthusiasm" leftLabel="Measured" rightLabel="Energized" value={form.toneSliders.enthusiasm} onChange={updateSlider("enthusiasm")} />
          <ToneSlider label="Directness" leftLabel="Build-up" rightLabel="Lead with it" value={form.toneSliders.directness} onChange={updateSlider("directness")} />
        </div>
      </div>

      <div>
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--ink-light)" }}>
          Length
        </p>
        <div className="flex flex-wrap gap-2">
          {LENGTH_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange({ lengthTarget: opt.id })}
              className="px-3 py-1.5 text-sm transition-colors"
              style={{
                fontFamily: "var(--font-sans)",
                border: form.lengthTarget === opt.id ? "1px solid var(--ink)" : "1px solid var(--rule)",
                color: form.lengthTarget === opt.id ? "var(--paper)" : "var(--ink-mid)",
                background: form.lengthTarget === opt.id ? "var(--ink)" : "transparent",
              }}
            >
              {opt.label}
              <span className="ml-1.5 text-xs opacity-60">{opt.desc}</span>
            </button>
          ))}
        </div>
        {form.lengthTarget === "custom" && (
          <input
            type="text"
            placeholder="e.g. 3 short paragraphs, under 200 words"
            value={form.customLength ?? ""}
            onChange={(e) => onChange({ customLength: e.target.value })}
            className="input-line mt-4"
          />
        )}
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="text-sm tracking-wide transition-opacity"
          style={{ fontFamily: "var(--font-sans)", color: "var(--ink-light)" }}
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="text-sm tracking-wide"
          style={{ fontFamily: "var(--font-sans)", color: "var(--ink)" }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
