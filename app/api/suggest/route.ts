import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: Request) {
  const { targetJobTitle, companyName, currentJobTitle } = await req.json();

  if (!companyName) {
    return Response.json({ suggestions: [] });
  }

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 512,
    thinking: { type: "adaptive" },
    messages: [
      {
        role: "user",
        content: `A ${currentJobTitle || "professional"} is applying for a ${targetJobTitle} role at ${companyName}.

Based on what you know about ${companyName} — their product, culture, mission, recent news, or industry position — suggest 4–5 specific, concrete reasons why someone might genuinely want to work there for this role. Make them specific and real, not generic. Write each as a short phrase (10–20 words), starting with an action verb or a "because" clause. No bullet symbols, just newline-separated.

Output only the suggestions, one per line, nothing else.`,
      },
    ],
  });

  const text =
    response.content.find((b) => b.type === "text")?.text?.trim() ?? "";
  const suggestions = text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);

  return Response.json({ suggestions });
}
