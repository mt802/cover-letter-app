import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import type { GenerateRequest } from "@/lib/types";

const client = new Anthropic();

export async function POST(req: Request) {
  const body: GenerateRequest = await req.json();

  const systemPrompt = buildSystemPrompt(body);
  const userPrompt = body.existingLetter
    ? `The user has adjusted their tone settings. Here is the previously generated letter:\n\n${body.existingLetter}\n\nRewrite it from scratch using the new tone settings. Keep the same core content and achievement story, but re-craft the language, rhythm, and voice to match the new settings.\n\n${buildUserPrompt(body)}`
    : buildUserPrompt(body);

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: "claude-opus-4-6",
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        controller.enqueue(encoder.encode(`\n\n[Error: ${msg}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
