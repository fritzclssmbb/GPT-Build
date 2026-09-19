import { NextResponse } from "next/server";
import { query } from "@/lib/db";

type Card={slug:string;display_name:string;title:string|null;company:string|null;phones:unknown;emails:unknown};
function first(value:unknown){if(Array.isArray(value)&&value.length){const x=value[0];if(typeof x==="string")return x;if(x&&typeof x==="object"&&"value" in x)return String((x as {value:unknown}).value??"");}return "";}
function esc(v:string){return v.replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;");}
export async function GET(_:Request,{params}:{params:{id:string}}){
 const r=await query<Card>(`SELECT slug,display_name,title,company,phones,emails FROM cards WHERE id=$1 AND status='published' LIMIT 1`,[params.id]);
 const c=r.rows[0];if(!c)return NextResponse.json({error:"Card not found"},{status:404});
 const phone=first(c.phones),email=first(c.emails);
 const lines=["BEGIN:VCARD","VERSION:3.0",`FN:${esc(c.display_name)}`,c.company?`ORG:${esc(c.company)}`:"",c.title?`TITLE:${esc(c.title)}`:"",phone?`TEL;TYPE=CELL:${esc(phone)}`:"",email?`EMAIL:${esc(email)}`:"","END:VCARD"].filter(Boolean);
 return new NextResponse(lines.join("\r\n"),{headers:{"Content-Type":"text/vcard; charset=utf-8","Content-Disposition":`attachment; filename="${c.slug}.vcf"`,"Cache-Control":"public, max-age=300"}});
}
