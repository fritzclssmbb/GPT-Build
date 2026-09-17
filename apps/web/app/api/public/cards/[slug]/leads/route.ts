import { NextResponse } from 'next/server';
import { query } from '../../../../../../lib/db';

export async function POST(request:Request,{params}:{params:{slug:string}}){
 const b=await request.json().catch(()=>({}));
 const name=typeof b.name==='string'?b.name.trim():'';const email=typeof b.email==='string'?b.email.trim().toLowerCase():null;const phone=typeof b.phone==='string'?b.phone.trim():null;const note=typeof b.note==='string'?b.note.trim().slice(0,2000):null;
 if(name.length<2||(!email&&!phone))return NextResponse.json({error:'Name and email or phone are required'},{status:400});
 const c=await query<{id:string}>(`SELECT id FROM cards WHERE slug=$1 AND status='published' LIMIT 1`,[params.slug]);if(!c.rows[0])return NextResponse.json({error:'Not found'},{status:404});
 const r=await query<{id:string;created_at:string}>(`INSERT INTO lead_captures(card_id,submitted_name,email,phone,note,consent_at) VALUES($1,$2,$3,$4,$5,now()) RETURNING id,created_at`,[c.rows[0].id,name,email,phone,note]);
 await query(`INSERT INTO analytics_events(card_id,event_type) VALUES($1,'lead_submit')`,[c.rows[0].id]);
 return NextResponse.json({ok:true,lead:r.rows[0]},{status:201});
}
