import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';

// Display approved prices before acceptance; never expose merchant credentials.
export async function GET(){
 const user=await currentUser();
 if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
 const months=process.env.PILOT_BILLING_PERIOD_MONTHS||'';
 const version=process.env.PILOT_TERMS_VERSION||'';
 const termsUrl=process.env.PILOT_TERMS_URL||'';
 const validMonths=/^(?:[1-9]|[12][0-9]|3[0-6])$/.test(months);
 // Only an internal, versioned legal page is acceptable. No arbitrary redirect URLs.
 const validTermsUrl=/^\/legal\/terms\/[a-zA-Z0-9._-]{1,80}$/.test(termsUrl);
 const plans=['pro','business','enterprise'] as const;
 const prices:Record<string,string>={};
 for(const plan of plans){const raw=process.env['PILOT_PRICE_'+plan.toUpperCase()+'_PHP_MINOR']||'';if(/^[1-9][0-9]{0,11}$/.test(raw)&&BigInt(raw)<=1000000000000n)prices[plan]=raw;}
 const enabled=validMonths&&Boolean(version)&&validTermsUrl&&termsUrl===`/legal/terms/${version}`;
 return NextResponse.json({billingPeriodMonths:validMonths?Number(months):null,termsVersion:version||null,termsUrl:enabled?termsUrl:null,pricesMinor:enabled?prices:{},availablePlans:enabled?Object.keys(prices):[],maxSeats:1},{headers:{'Cache-Control':'private, no-store'}});
}
