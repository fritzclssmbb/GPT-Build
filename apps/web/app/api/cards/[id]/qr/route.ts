import QRCode from "qrcode";
import { demoCard } from "@/lib/demo-card";

type Context = { params: { id: string } };

export async function GET(request: Request, { params }: Context) {
  if (params.id !== demoCard.slug) return Response.json({ error: "Card not found" }, { status: 404 });
  const url = new URL(request.url);
  const publicUrl = `${url.protocol}//${url.host}/u/${demoCard.slug}`;
  const svg = await QRCode.toString(publicUrl, { type: "svg", margin: 1, errorCorrectionLevel: "M", width: 512 });
  return new Response(svg, { status: 200, headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=300" } });
}
