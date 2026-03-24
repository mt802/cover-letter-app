import type { FormData, ToneSliders } from "./types";

function describeFormality(v: number): string {
  if (v <= 25) return "very casual — write like you're emailing a friend who works there";
  if (v <= 50) return "conversational — professional enough but relaxed, no stiff language";
  if (v <= 75) return "polished professional — clear and direct, no jargon";
  return "formal — sharp, measured, boardroom-ready tone";
}

function describeHumor(v: number): string {
  if (v <= 10) return "no humor whatsoever — keep it straight";
  if (v <= 40) return "a very light touch of wit — one dry observation max, never forced";
  if (v <= 70) return "gently playful — a line or two of personality without undermining credibility";
  return "distinctly warm and witty — let personality shine, but stay professional";
}

function describeEnthusiasm(v: number): string {
  if (v <= 25) return "measured and calm — no exclamation marks, no 'excited to', just confident";
  if (v <= 60) return "genuine interest, calmly expressed — state facts, not feelings";
  if (v <= 85) return "clearly engaged and motivated — enthusiasm comes through the specifics";
  return "visibly energized — let the genuine excitement come through, but earned by specifics, not adjectives";
}

function describeDirectness(v: number): string {
  if (v <= 25) return "narrative and contextual — build up to points gradually";
  if (v <= 60) return "balanced — make the point, then briefly support it";
  return "direct and assertive — lead with the claim, then prove it. No hedging.";
}

function describeLengthTarget(form: FormData): string {
  if (form.lengthTarget === "custom" && form.customLength) {
    return form.customLength;
  }
  const map = { short: "~150 words", medium: "~250 words", long: "~350 words" };
  return map[form.lengthTarget as "short" | "medium" | "long"] ?? "~200 words";
}

export function buildSystemPrompt(form: FormData): string {
  const traits = form.personalityTraits.length > 0
    ? `The person's personality traits: ${form.personalityTraits.join(", ")}.`
    : "Use a balanced, authentic professional voice.";

  const sliders: ToneSliders = form.toneSliders;

  return `You are an expert cover letter ghostwriter. Your only job is to produce a single, complete, ready-to-send cover letter — no preamble, no commentary, no "Here is your cover letter:", no closing notes. Just the letter.

=== VOICE & TONE ===
${traits}
Formality level: ${describeFormality(sliders.formality)}
Humor: ${describeHumor(sliders.humor)}
Enthusiasm: ${describeEnthusiasm(sliders.enthusiasm)}
Directness: ${describeDirectness(sliders.directness)}

=== LENGTH ===
Target: ${describeLengthTarget(form)}. Do not pad to hit the target — only hit it if the content earns it.

=== ANTI-AI STRUCTURAL RULES (non-negotiable) ===
1. SENTENCE BURSTINESS: Violently vary sentence length. Include at least two sentences under 6 words. Place a short sentence immediately before or after a complex one.
2. NO 5-PARAGRAPH ESSAY: Do NOT write Intro → Skill → Skill → Conclusion. Open with a metric, a bold observation about the company, or a direct claim — never "I am writing to apply."
3. NO SUMMARY SENTENCES: Never end a paragraph with a sentence that summarizes what the paragraph just said ("Thus, my experience in X will help Y achieve Z"). Let the evidence speak.
4. ASYMMETRICAL PARAGRAPHS: One paragraph must be exactly one sentence. Another must be three or more sentences. They must not all be roughly the same length.
5. ICEBERG RULE: Pick ONE specific achievement or project from the applicant's background. Go deep on it. Ignore the rest — the resume covers breadth. This single example should anchor ~40% of the letter.
6. SO WHAT ANCHOR: Every statement about the applicant's past must connect to a stated goal or problem of the employer. Do not state a skill without stating how it solves the employer's actual problem.

=== BANNED WORDS & PHRASES ===
Never use: "delve", "tapestry", "beacon", "spearhead", "catalyst", "pivotal", "landscape" (as in business landscape), "testament", "underscore", "seamlessly", "Furthermore", "Moreover", "Consequently", "Additionally", "In conclusion", "Ultimately".
Never use sycophantic openers: "I was thrilled to see", "I am extremely passionate about", "It would be an honor", "I am eager to", "I am excited to apply".
Never use: "utilize" (say "use"), "facilitate" (say "help"), "leverage" (say "use" or "apply").

=== I-RULE ===
Do NOT start more than two sentences in the entire letter with the word "I". Force passive constructions, object-focused sentences, or reordering. This constraint is absolute.

=== CONFIDENT CLOSE ===
End with a forward-looking, specific action — not a passive hope. Example: "I'll follow up next week" or "I'd love to walk you through how I pulled that off on a brief call." Never write "I look forward to the opportunity to..." or "Thank you for your consideration."

=== SHOW DON'T TELL ===
For every soft skill or personality adjective used, pair it immediately with a hard number, percentage, timeframe, or dollar amount. If no metric exists, frame the impact in concrete terms (shipped X, reduced Y, closed Z).`;
}

export function buildUserPrompt(form: FormData): string {
  const parts: string[] = [];

  parts.push(`TARGET ROLE: ${form.targetJobTitle}`);

  if (form.companyName) {
    parts.push(`COMPANY: ${form.companyName}`);
  }

  if (form.jobDescription?.trim()) {
    parts.push(`JOB DESCRIPTION:\n${form.jobDescription.trim()}`);
  }

  parts.push(`APPLICANT'S CURRENT ROLE: ${form.currentJobTitle}`);

  if (form.resumeText?.trim()) {
    parts.push(`RESUME / BACKGROUND:\n${form.resumeText.trim()}`);
  }

  if (form.writingSample?.trim()) {
    parts.push(`WRITING SAMPLE (match this person's voice closely):\n${form.writingSample.trim()}`);
  }

  if (form.whyThisRole?.trim()) {
    parts.push(`WHY THIS ROLE / COMPANY (use this as the emotional core of the letter):\n${form.whyThisRole.trim()}`);
  }

  parts.push("Now write the cover letter. Output nothing but the letter itself.");

  return parts.join("\n\n");
}
