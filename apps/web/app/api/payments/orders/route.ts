import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { query,transaction } from '@/lib/db';
import { requireSameOrigin } from '@/lib/security';

// Pilot price catalog is deliberately disabled until the seller approves pricing.
// Prices must be set in server-only configuration as PHP centavos, never by clients.
const catalog:Record<string,string>={pro:'PILOT_PRICE_PRO_PHP_MINOR',business:'PILOT_PRICE_BUSINESS_PHP_MINOR',enterprise:'PILOT_PRICE_ENTERPRISE_PHP_MINOR'};
export async function POST(request:Request){
 const denied=requireSameOrigin(request);if(denied)return denied;
 const user=await currentUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
 const body=await request.json().catch(()=>({}));
 const plan=typeof body.plan==='string'?body.plan:'';
 const method=typeof body.method==='string'?body.method:'';
 if(!(plan in catalog)||!['gcash','maya'].includes(method))return NextResponse.json({error:'Unsupported plan or payment method'},{status:400});
 const configured=process.env[catalog[plan]];
 if(!configured||!/^[1-9][0-9]{0,11}$/.test(configured))return NextResponse.json({error:'This plan is not yet available for purchase'},{status:503});
 const amount=BigInt(configured);
 if(amount>1000000000000n)return NextResponse.json({error:'Price configuration invalid'},{status:503});
 let org:string|null=null;
 if(user.organizationId){
  const m=await query<{role:string}>(`SELECT role FROM organization_memberships WHERE organization_id=$1 AND user_id=$2 AND status='active'`,[user.organizationId,user.id]);
  if(!m.rows.length)return NextResponse.json({error:'Organization access unavailable'},{status:403});
  if(m.rows[0].role!=='owner')return NextResponse.json({error:'Only the organization owner can create payment orders'},{status:403});
  org=user.organizationId;
 }
 const result=await transaction(async client=>{
 const result=await client.query<{id:string;plan_tier:string;amount_minor:string;currency:string;method:string;status:string}>(`INSERT INTO payment_orders(organization_id,user_id,plan_tier,amount_minor,method) VALUES($1,$2,$3,$4,$5) RETURNING id,plan_tier,amount_minor,currency,method,status`,[org,org?null:user.id,plan,amount.toString(),method]);
 await client.query(`INSERT INTO audit_logs(organization_id,actor_user_id,action,target_type,target_id,metadata) VALUES($1,$2,'payment.order_created','payment_order',$3,$4::jsonb)`,[org,user.id,result.rows[0].id,JSON.stringify({plan,method})]);
 return result;
 });
 return NextResponse.json({order:result.rows[0],instructions:'Await seller-issued payment instructions. Do not transfer to unverified account details.'},{status:201,headers:{'Cache-Control':'private, no-store'}});
}
