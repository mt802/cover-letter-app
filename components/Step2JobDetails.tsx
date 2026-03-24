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
    <div className="space-y-10">

      <div>
        <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: "var(--ink-light)" }}>
          Target job title <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Head of Product"
          value={form.targetJobTitle}
          onChange={(e) => onChange({ targetJobTitle: e.target.value })}
          className="input-line"
        />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: "var(--ink-light)" }}>
          Company name
          <span className="ml-2 normal-case" style={{ color: "var(--ink-light)", letterSpacing: 0, fontSize: "0.75rem" }}>(optional — used for research suggestions)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Stripe"
          value={form.companyName ?? ""}
          onChange={(e) => onChange({ companyName: e.target.value })}
          className="input-line"
        />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: "var(--ink-light)" }}>
          Job description
          <span className="ml-2 normal-case" style={{ color: "var(--ink-light)", letterSpacing: 0, fontSize: "0.75rem" }}>(optional)</span>
        </label>
        <textarea
          rows={6}
          placeholder="Paste the full job posting…"
          value={form.jobDescription ?? ""}
          onChange={(e) => onChange({ jobDescription: e.target.value })}
          className="input-line"
        />
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
