"use client";

interface ToneSliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (v: number) => void;
}

export default function ToneSlider({ label, leftLabel, rightLabel, value, onChange }: ToneSliderProps) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-xs tracking-widest uppercase" style={{ color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>
          {label}
        </label>
        <span className="text-xs" style={{ color: "var(--ink-light)" }}>{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-px cursor-pointer appearance-none"
        style={{
          background: `linear-gradient(to right, var(--ink) ${value}%, var(--rule) ${value}%)`,
          accentColor: "var(--ink)",
        }}
      />
      <div className="flex justify-between mt-1.5">
        <span className="text-xs" style={{ color: "var(--ink-light)" }}>{leftLabel}</span>
        <span className="text-xs" style={{ color: "var(--ink-light)" }}>{rightLabel}</span>
      </div>
    </div>
  );
}
