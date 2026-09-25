import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { safeHttpUrl } from "@/lib/security";

type Row={id:string;card_id:string;url:string};
export async function GET(request:Request,{params}:{params:{id:string}}){
 const result=await query<Row>(`SELECT l.id,l.card_id,l.url FROM link_blocks l JOIN cards c ON c.id=l.card_id WHERE l.id=$1 AND c.status='published' LIMIT 1`,[params.id]);
 const link=result.rows[0];
 if(!link)return NextResponse.json({error:"Link not found"},{status:404});
 const destination=safeHttpUrl(link.url);
 if(!destination)return NextResponse.json({error:"Unsafe link destination"},{status:400});
 await query(`INSERT INTO analytics_events(card_id,event_type,link_block_id,visitor_hash,referrer,device_type) VALUES($1,'link_click',$2,NULL,$3,NULL)`,[link.card_id,link.id,request.headers.get("referer")?.slice(0,1000)??null]);
 return NextResponse.redirect(destination,302);
}
