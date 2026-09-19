import QRCode from "qrcode";
import { query } from "@/lib/db";
export async function GET(request:Request,{params}:{params:{id:string}}){
 const r=await query<{slug:string}>(`SELECT slug FROM cards WHERE id=$1 AND status='published' LIMIT 1`,[params.id]);const c=r.rows[0];
 if(!c)return Response.json({error:"Card not found"},{status:404});
 const origin=new URL(request.url).origin;const svg=await QRCode.toString(`${origin}/u/${c.slug}`,{type:"svg",margin:1,errorCorrectionLevel:"M",width:512});
 return new Response(svg,{headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"public, max-age=300"}});
}
