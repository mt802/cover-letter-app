"use client";

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
  const toggleTrait = (trait: PersonalityTrait) => {
    const current = form.personalityTraits;
    if (current.includes(trait)) {
      onChange({ personalityTraits: current.filter((t) => t !== trait) });
    } else {
      onChange({ personalityTraits: [...current, trait] });
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
          Paste your resume or a summary of your experience. The more specific, the better the letter.
        </p>
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
