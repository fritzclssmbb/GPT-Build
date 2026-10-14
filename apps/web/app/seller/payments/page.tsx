import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import SellerReviewQueue from './SellerReviewQueue';
export default async function SellerPaymentsPage(){
 const user=await currentUser();if(!user)redirect('/login');
 const access=await query<{user_id:string}>(`SELECT user_id FROM seller_operators WHERE user_id=$1 AND active=true AND can_verify_payments=true`,[user.id]);
 if(!access.rows.length)redirect('/dashboard');
 return <main><div className="eyebrow">TOPHCOMM SYSTEMS · SELLER OPERATIONS</div><h1>Payment Review Queue</h1><p>Restricted seller-only payment reference review. This interface cannot approve payments or activate subscriptions.</p><SellerReviewQueue/></main>;
}
