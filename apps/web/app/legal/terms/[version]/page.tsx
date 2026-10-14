import { notFound } from 'next/navigation';

// Draft only: not an approved or legally reviewed contract.
// No versioned commercial terms are published until seller approval.
export default async function CommercialTermsPage({params}:{params:Promise<{version:string}>}){
 const {version}=await params;
 const approved=process.env.PILOT_TERMS_PUBLISHED==='true';
 const current=process.env.PILOT_TERMS_VERSION;
 if(!approved||!current||version!==current)notFound();
 return <main><div className="eyebrow">TOPHCOMM SYSTEMS · COMMERCIAL PILOT</div><h1>Commercial terms · {version}</h1><p>These terms apply to assisted Digi-IP Hub payment orders. The seller must publish a legally reviewed, complete version of the terms before purchase requests can be enabled.</p><p>Commercial terms content has not yet been approved for publication. No customer should be asked to accept this placeholder.</p></main>;
}
