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
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse") as (b: Buffer) => Promise<{ text: string }>;
      const data = await pdfParse(buffer);
      return Response.json({ text: data.text.trim() });
    }

    if (name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return Response.json({ text: result.value.trim() });
    }

    return Response.json({ error: "Unsupported file type. Use PDF or DOCX." }, { status: 400 });
  } catch {
    return Response.json({ error: "Failed to parse file." }, { status: 500 });
  }
}
