"use client";

import { useState, useEffect } from "react";
import type { FormData } from "@/lib/types";

interface Props {
  form: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onGenerate: () => void;
  onBack: () => void;
}

export default function Step4Motivation({ form, onChange, onGenerate, onBack }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const canGenerate = form.whyThisRole.trim().length > 0;

  useEffect(() => {
    if (!form.companyName?.trim()) return;
    setLoadingSuggestions(true);
    fetch("/api/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetJobTitle: form.targetJobTitle,
        companyName: form.companyName,
        currentJobTitle: form.currentJobTitle,
      }),
    })
      .then((r) => r.json())
      .then((data) => setSuggestions(data.suggestions ?? []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoadingSuggestions(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useSuggestion = (s: string) => {
    const current = form.whyThisRole.trim();
    onChange({ whyThisRole: current ? `${current}\n${s}` : s });
  };

  return (
    <div className="space-y-10">

      <div>
        <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: "var(--ink-light)" }}>
          Why this role? <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <p className="text-sm mb-4" style={{ color: "var(--ink-mid)", lineHeight: 1.6 }}>
          This is what separates a compelling letter from a generic one. Even a rough note works.
        </p>
        <textarea
          rows={4}
          placeholder="e.g. I've been building on their API for two years, I know their scaling problems firsthand…"
          value={form.whyThisRole}
          onChange={(e) => onChange({ whyThisRole: e.target.value })}
          className="input-line"
        />
      </div>

      {form.companyName && (
        <div>
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--ink-light)" }}>
            {loadingSuggestions ? `Researching ${form.companyName}…` : "Suggestions"}
          </p>
          {suggestions.length > 0 && (
            <div className="space-y-px">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => useSuggestion(s)}
                  className="w-full text-left py-3 text-sm transition-colors group"
                  style={{
                    borderBottom: "1px solid var(--rule-light)",
                    color: "var(--ink-mid)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <span className="mr-2 transition-colors" style={{ color: "var(--rule)" }}>+</span>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="text-sm tracking-wide transition-opacity"
          style={{ fontFamily: "var(--font-sans)", color: "var(--ink-light)" }}
        >
          ← Back
        </button>
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className="text-sm tracking-wide disabled:opacity-30 transition-opacity"
          style={{ fontFamily: "var(--font-sans)", color: "var(--ink)" }}
        >
          Generate →
        </button>
      </div>
    </div>
  );
}
