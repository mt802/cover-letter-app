export type PersonalityTrait =
  | "casual"
  | "confident"
  | "warm"
  | "direct"
  | "professional"
  | "enthusiastic";

export interface ToneSliders {
  formality: number;      // 0–100
  humor: number;          // 0–100
  enthusiasm: number;     // 0–100
  directness: number;     // 0–100
}

export interface FormData {
  // Step 1 — Applicant
  currentJobTitle: string;
  resumeText?: string;
  writingSample?: string;
  personalityTraits: PersonalityTrait[];
  toneSliders: ToneSliders;

  // Step 2 — Job
  targetJobTitle: string;
  jobDescription?: string;
  companyName?: string;

  // Step 3 — Motivation
  whyThisRole: string;

  // Step 4 — Length
  lengthTarget: "short" | "medium" | "long" | "custom";
  customLength?: string;
}

export interface GenerateRequest extends FormData {
  existingLetter?: string; // for re-generation with adjusted sliders
}
