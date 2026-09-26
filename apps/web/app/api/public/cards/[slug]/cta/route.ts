import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { safeHttpUrl } from "@/lib/security";

type Card={id:string;primary_cta:unknown};
function destination(value:unknown){if(!value||typeof value!=="object")return null;const url=(value as Record<string,unknown>).url;return typeof url==="string"?safeHttpUrl(url):null;}
export async function GET(request:Request,{params}:{params:{slug:string}}){
 const result=await query<Card>("SELECT id,primary_cta FROM cards WHERE slug=$1 AND status='published' LIMIT 1",[params.slug]);
 const card=result.rows[0];if(!card)return NextResponse.json({error:"Card not found"},{status:404});
 const url=destination(card.primary_cta);if(!url)return NextResponse.json({error:"CTA unavailable"},{status:404});
 await query("INSERT INTO analytics_events(card_id,event_type,visitor_hash,referrer,device_type) VALUES($1,'link_click',NULL,$2,NULL)",[card.id,request.headers.get("referer")?.slice(0,1000)??null]);
 return NextResponse.redirect(url,302);
}
