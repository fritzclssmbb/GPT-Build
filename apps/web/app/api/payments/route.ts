import { NextResponse } from 'next/server';
import { currentUser,can } from '@/lib/auth';
import { query } from '@/lib/db';
import { requireSameOrigin } from '@/lib/security';

type Order={id:string;organization_id:string|null;user_id:string|null;plan_tier:string;amount_minor:string;currency:string;method:string;status:string;customer_reference:string|null;created_at:string;submitted_at:string|null};
async function scope(){
 const user=await currentUser();
 if(!user)return null;
 if(user.organizationId){
  const member=await query<{role:string}>(`SELECT role FROM organization_memberships WHERE organization_id=$1 AND user_id=$2 AND status='active'`,[user.organizationId,user.id]);
  if(!member.rows.length)return null;
  return {user,org:user.organizationId,allowed:can(member.rows[0].role as 'owner'|'admin'|'member','billing')};
 }
 return {user,org:null,allowed:true};
}
export async function GET(){
 const s=await scope();if(!s)return NextResponse.json({error:'Unauthorized'},{status:401});
 const result=await query<Order>(s.org?`SELECT id,organization_id,user_id,plan_tier,amount_minor,currency,method,status,customer_reference,created_at,submitted_at FROM payment_orders WHERE organization_id=$1 ORDER BY created_at DESC LIMIT 100`:`SELECT id,organization_id,user_id,plan_tier,amount_minor,currency,method,status,customer_reference,created_at,submitted_at FROM payment_orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100`,[s.org??s.user.id]);
 return NextResponse.json({orders:result.rows});
}
export async function PATCH(request:Request){
 const denied=requireSameOrigin(request);if(denied)return denied;
 const s=await scope();if(!s)return NextResponse.json({error:'Unauthorized'},{status:401});
 if(!s.allowed)return NextResponse.json({error:'Billing permission required'},{status:403});
 const body=await request.json().catch(()=>({}));
 const id=typeof body.id==='string'?body.id:'';
 const reference=typeof body.reference==='string'?body.reference.trim():'';
 const note=typeof body.note==='string'?body.note.trim():'';
 if(!/^[0-9a-f-]{36}$/i.test(id)||reference.length<6||reference.length>120||note.length>500)return NextResponse.json({error:'Valid order, transaction reference (6-120 characters) and note (max 500 characters) required'},{status:400});
 try{
  const result=await query<Order>(s.org?`UPDATE payment_orders SET customer_reference=$3,customer_note=$4,status='submitted',submitted_at=now(),updated_at=now() WHERE id=$1 AND organization_id=$2 AND status='awaiting_payment' RETURNING id,organization_id,user_id,plan_tier,amount_minor,currency,method,status,customer_reference,created_at,submitted_at`:`UPDATE payment_orders SET customer_reference=$3,customer_note=$4,status='submitted',submitted_at=now(),updated_at=now() WHERE id=$1 AND user_id=$2 AND status='awaiting_payment' RETURNING id,organization_id,user_id,plan_tier,amount_minor,currency,method,status,customer_reference,created_at,submitted_at`,[id,s.org??s.user.id,reference,note]);
  if(!result.rows.length)return NextResponse.json({error:'Order not found or not awaiting payment'},{status:409});
  await query(`INSERT INTO audit_logs(organization_id,actor_user_id,action,target_type,target_id,metadata) VALUES($1,$2,'payment.reference_submitted','payment_order',$3,$4::jsonb)`,[s.org,s.user.id,id,JSON.stringify({method:result.rows[0].method})]);
  return NextResponse.json({order:result.rows[0]});
 }catch(error:unknown){if((error as {code?:string})?.code==='23505')return NextResponse.json({error:'This payment reference is already used for the selected method'},{status:409});throw error;}
}
