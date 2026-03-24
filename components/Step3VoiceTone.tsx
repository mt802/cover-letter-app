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
  { id: "custom", label: "Custom", desc: "I'll specify" },
] as const;

export default function Step3VoiceTone({ form, onChange, onNext, onBack }: Props) {
  const updateSlider = (key: keyof typeof form.toneSliders) => (v: number) => {
    onChange({ toneSliders: { ...form.toneSliders, [key]: v } });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
          Tone Sliders
        </h3>
        <div className="space-y-5">
          <ToneSlider
            label="Formality"
            leftLabel="Very casual"
            rightLabel="Formal"
            value={form.toneSliders.formality}
            onChange={updateSlider("formality")}
          />
          <ToneSlider
            label="Humor"
            leftLabel="None"
            rightLabel="Playful"
            value={form.toneSliders.humor}
            onChange={updateSlider("humor")}
          />
          <ToneSlider
            label="Enthusiasm"
            leftLabel="Measured"
            rightLabel="Energized"
            value={form.toneSliders.enthusiasm}
            onChange={updateSlider("enthusiasm")}
          />
          <ToneSlider
            label="Directness"
            leftLabel="Build-up"
            rightLabel="Lead with it"
            value={form.toneSliders.directness}
            onChange={updateSlider("directness")}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Letter Length
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LENGTH_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange({ lengthTarget: opt.id })}
              className={`px-3 py-2 rounded-lg border text-center transition-colors ${
                form.lengthTarget === opt.id
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="text-sm font-medium">{opt.label}</div>
              <div className="text-xs text-gray-500">{opt.desc}</div>
            </button>
          ))}
        </div>
        {form.lengthTarget === "custom" && (
          <input
            type="text"
            placeholder="e.g. 3 short paragraphs, under 200 words"
            value={form.customLength ?? ""}
            onChange={(e) => onChange({ customLength: e.target.value })}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
