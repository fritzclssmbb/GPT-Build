import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { query } from '@/lib/db';

// Read-only seller queue. No approval, rejection or subscription activation is exposed.
// Requires an independently provisioned seller operator with active review entitlement.
// MFA-backed approval remains a separate, unimplemented security gate.
export async function GET(){
 const user=await currentUser();
 if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
 const operator=await query<{user_id:string}>(`SELECT user_id FROM seller_operators WHERE user_id=$1 AND active=true AND can_verify_payments=true`,[user.id]);
 if(!operator.rows.length)return NextResponse.json({error:'Seller operator access required'},{status:403});
 const orders=await query<{id:string;organization_id:string|null;user_id:string|null;plan_tier:string;amount_minor:string;currency:string;method:string;status:string;customer_reference:string|null;submitted_at:string|null}>(`SELECT id,organization_id,user_id,plan_tier,amount_minor,currency,method,status,customer_reference,submitted_at FROM payment_orders WHERE status IN ('submitted','under_review') ORDER BY submitted_at ASC NULLS LAST LIMIT 100`);
 return NextResponse.json({orders:orders.rows},{headers:{'Cache-Control':'no-store, private','X-Content-Type-Options':'nosniff'}});
}
