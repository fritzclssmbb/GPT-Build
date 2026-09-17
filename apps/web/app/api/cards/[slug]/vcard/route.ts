import { NextResponse } from "next/server";
import { demoCard, toVCard } from "@/lib/demo-card";

type Context = { params: { slug: string } };

export async function GET(_: Request, { params }: Context) {
  if (params.slug !== demoCard.slug) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return new NextResponse(toVCard(demoCard), {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${demoCard.slug}.vcf"`,
      "Cache-Control": "public, max-age=300"
    }
  });
}
