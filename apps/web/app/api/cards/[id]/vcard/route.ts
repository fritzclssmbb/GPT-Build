import { NextResponse } from "next/server";
import { query } from "@/lib/db";

type Card = { id:string; slug:string; display_name:string; title:string|null; company:string|null; phones:unknown; emails:unknown };

function first(value: unknown) {
  if (Array.isArray(value) && value.length) {
    const x = value[0];
    if (typeof x === "string") return x;
    if (x && typeof x === "object" && "value" in x) return String((x as { value: unknown }).value ?? "");
  }
  return "";
}

function esc(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const result = await query<Card>(
    "SELECT id,slug,display_name,title,company,phones,emails FROM cards WHERE id=$1 AND status='published' LIMIT 1",
    [params.id]
  );
  const card = result.rows[0];
  if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

  const phone = first(card.phones);
  const email = first(card.emails);
  await query(
    "INSERT INTO analytics_events(card_id,event_type,visitor_hash,referrer,device_type) VALUES($1,'vcard_download',NULL,$2,NULL)",
    [card.id, request.headers.get("referer")?.slice(0, 1000) ?? null]
  );

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${esc(card.display_name)}`,
    card.company ? `ORG:${esc(card.company)}` : "",
    card.title ? `TITLE:${esc(card.title)}` : "",
    phone ? `TEL;TYPE=CELL:${esc(phone)}` : "",
    email ? `EMAIL:${esc(email)}` : "",
    "END:VCARD"
  ].filter(Boolean);

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${card.slug}.vcf"`,
      "Cache-Control": "public, max-age=300"
    }
  });
}
