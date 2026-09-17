import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { query } from '../../../../../lib/db';

export async function GET(request:Request,{params}:{params:{slug:string}}){
 const r=await query<any>(`SELECT id,slug,display_name,title,company,photo_url,phones,emails,address,bio,primary_cta,template_id FROM cards WHERE slug=$1 AND status='published' LIMIT 1`,[params.slug]);
 const card=r.rows[0];if(!card)return NextResponse.json({error:'Not found'},{status:404});
 const forwarded=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
 const agent=request.headers.get('user-agent')||'';
 const visitorHash=createHash('sha256').update(`${forwarded}|${agent}|${process.env.ANALYTICS_SALT||'dev'}`).digest('hex');
 await query(`INSERT INTO analytics_events(card_id,event_type,visitor_hash,referrer,device_type) VALUES($1,'view',$2,$3,$4)`,[card.id,visitorHash,request.headers.get('referer'),/mobile/i.test(agent)?'mobile':'desktop']);
 return NextResponse.json({card},{headers:{'Cache-Control':'private, no-store'}});
}
