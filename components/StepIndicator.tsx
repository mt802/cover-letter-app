"use client";

const STEPS = ["Your profile", "The role", "Voice & tone", "Motivation"];

interface StepIndicatorProps {
  current: number;
}

export default function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="mb-10">
      {/* Progress bar */}
      <div className="w-full h-px mb-4" style={{ background: "var(--rule-light)" }}>
        <div
          className="h-px transition-all duration-500"
          style={{
            background: "var(--ink)",
            width: `${((current + 1) / 4) * 100}%`,
          }}
        />
      </div>

      {/* Step label */}
      <div className="flex items-baseline justify-between">
        <p className="text-xs tracking-widest uppercase" style={{ color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>
          Step {current + 1} of 4
        </p>
        <p className="text-sm font-medium" style={{ color: "var(--ink-mid)" }}>
          {STEPS[current]}
        </p>
      </div>
    </div>
  );
}
