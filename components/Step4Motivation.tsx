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
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Why do you want this role / company?{" "}
          <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          This is what separates a compelling letter from a generic one. Be specific — even a rough note works.
        </p>
        <textarea
          rows={4}
          placeholder="e.g. I've been building on their API for two years, I know their scaling problems firsthand, and their recent infra rewrite aligns exactly with what I've been doing at my current role..."
          value={form.whyThisRole}
          onChange={(e) => onChange({ whyThisRole: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      {form.companyName && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Need ideas?
            {loadingSuggestions && (
              <span className="text-xs text-gray-400 animate-pulse">
                Researching {form.companyName}...
              </span>
            )}
          </p>
          {suggestions.length > 0 && (
            <div className="space-y-1.5">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => useSuggestion(s)}
                  className="w-full text-left px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                >
                  <span className="text-indigo-500 font-medium mr-2">+</span>
                  {s}
                </button>
              ))}
            </div>
          )}
          {!loadingSuggestions && suggestions.length === 0 && (
            <p className="text-xs text-gray-400">No suggestions loaded.</p>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          Generate Letter
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
