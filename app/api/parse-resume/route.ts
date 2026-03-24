import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const name = file.name.toLowerCase();

  try {
    if (name.endsWith(".pdf")) {
      const { extractText } = await import("unpdf");
      const { text } = await extractText(new Uint8Array(buffer), { mergePages: true });
      return Response.json({ text: text.trim() });
    }

    if (name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return Response.json({ text: result.value.trim() });
    }

    return Response.json({ error: "Unsupported file type. Use PDF or DOCX." }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: msg }, { status: 500 });
  }
}
