import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import LeadCapture from "./LeadCapture";

type Props={params:{slug:string}};
type PublicCard={id:string;slug:string;display_name:string;title:string|null;company:string|null;phones:unknown;emails:unknown;address:unknown;bio:string|null;primary_cta:unknown};
type LinkRow={id:string;label:string;url:string};

function firstText(value:unknown){
  if(Array.isArray(value)&&value.length){const item=value[0];if(typeof item==="string")return item;if(item&&typeof item==="object"&&"value" in item)return String((item as {value:unknown}).value??"");}
  return "";
}
function locationText(value:unknown){
  if(typeof value==="string")return value;
  if(value&&typeof value==="object"){const v=value as Record<string,unknown>;return [v.city,v.region,v.country].filter(Boolean).join(", ");}
  return "";
}
function cta(value:unknown){
  if(value&&typeof value==="object"){const v=value as Record<string,unknown>;const label=typeof v.label==="string"?v.label:"Connect";const url=typeof v.url==="string"?v.url:"";return {label,url};}
  return {label:"Connect",url:""};
}

export default async function PublicCardPage({params}:Props){
  const result=await query<PublicCard>(`SELECT id,slug,display_name,title,company,phones,emails,address,bio,primary_cta FROM cards WHERE slug=$1 AND status='published' LIMIT 1`,[params.slug]);
  const card=result.rows[0];if(!card)notFound();
  const links=await query<LinkRow>(`SELECT id,label,url FROM link_blocks WHERE card_id=$1 ORDER BY sort_order,id`,[card.id]);
  const phone=firstText(card.phones),email=firstText(card.emails),location=locationText(card.address),primary=cta(card.primary_cta);
  return <main><article className="publicCard previewShell"><div className="phone"><div className="avatar">FS</div><div className="eyebrow" style={{marginTop:22}}>FS SOFTWARES · VERIFIED PROFILE</div><h1>{card.display_name}</h1><p>{card.title}<br/><strong>{card.company}</strong></p><p>{card.bio}</p><div className="actions">{primary.url&&<a className="btn btnPrimary" href={primary.url}>{primary.label}</a>}<a className="btn" href={`/api/cards/${card.id}/vcard`}>Save contact</a><a className="btn" href={`/api/cards/${card.id}/qr`}>Show QR</a></div><div className="linkList">{links.rows.map(l=><a className="linkButton" href={`/api/public/links/${l.id}`} key={l.id} rel="noopener noreferrer">{l.label}<span>↗</span></a>)}</div><div className="identityMeta">{phone&&<span>{phone}</span>}{email&&<span>{email}</span>}{location&&<span>{location}</span>}</div><LeadCapture slug={params.slug}/></div></article></main>
}
