import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';

// Publicly visible purchase configuration contains no prices or account numbers.
// Actual order creation remains gated by server-side approved price and terms.
export async function GET(){
 const user=await currentUser();
 if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
 const months=process.env.PILOT_BILLING_PERIOD_MONTHS||'';
 const version=process.env.PILOT_TERMS_VERSION||'';
 const validMonths=/^(?:[1-9]|[12][0-9]|3[0-6])$/.test(months);
 const plans=['pro','business','enterprise'] as const;
 const available=plans.filter(plan=>{const key='PILOT_PRICE_'+plan.toUpperCase()+'_PHP_MINOR';return /^[1-9][0-9]{0,11}$/.test(process.env[key]||'')});
 return NextResponse.json({billingPeriodMonths:validMonths?Number(months):null,termsVersion:version||null,availablePlans:validMonths&&version?available:[],maxSeats:1},{headers:{'Cache-Control':'private, no-store'}});
}
