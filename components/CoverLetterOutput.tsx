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
  letter,
  isStreaming,
  form,
  onSliderChange,
  onRegenerate,
  onStartOver,
  onLetterEdit,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateSlider = (key: keyof typeof form.toneSliders) => (v: number) => {
    onSliderChange({ toneSliders: { ...form.toneSliders, [key]: v } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Your Cover Letter</h2>
        <div className="flex items-center gap-2">
          {!isStreaming && (
            <>
              <button
                onClick={() => setEditing(!editing)}
                className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                {editing ? "Preview" : "Edit"}
              </button>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Letter */}
      <div className="relative">
        {editing && !isStreaming ? (
          <textarea
            value={letter}
            onChange={(e) => onLetterEdit(e.target.value)}
            rows={18}
            className="w-full px-5 py-4 border border-gray-300 rounded-xl font-serif text-gray-800 leading-relaxed text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ) : (
          <div className="px-5 py-5 bg-white border border-gray-200 rounded-xl shadow-sm min-h-[320px]">
            <div className="font-serif text-gray-800 leading-relaxed text-sm whitespace-pre-wrap">
              {letter}
              {isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-indigo-600 animate-pulse ml-0.5 align-text-bottom" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Adjust sliders */}
      {!isStreaming && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Adjust tone — then regenerate
            </h3>
            <button
              onClick={onRegenerate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <ToneSlider
              label="Formality"
              leftLabel="Casual"
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
      )}

      {!isStreaming && (
        <div className="flex justify-start">
          <button
            onClick={onStartOver}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
