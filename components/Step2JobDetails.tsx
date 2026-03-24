"use client";

import type { FormData } from "@/lib/types";

interface Props {
  form: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2JobDetails({ form, onChange, onNext, onBack }: Props) {
  const canContinue = form.targetJobTitle.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target job title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Head of Product"
          value={form.targetJobTitle}
          onChange={(e) => onChange({ targetJobTitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company name{" "}
          <span className="text-gray-400 font-normal">(optional — used for research suggestions)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Stripe"
          value={form.companyName ?? ""}
          onChange={(e) => onChange({ companyName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job description{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Paste the full job posting. The letter will address the specific requirements.
        </p>
        <textarea
          rows={6}
          placeholder="Paste the job description here..."
          value={form.jobDescription ?? ""}
          onChange={(e) => onChange({ jobDescription: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
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
          disabled={!canContinue}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
