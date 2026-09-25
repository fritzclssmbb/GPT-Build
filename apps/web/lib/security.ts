import { createHash } from "crypto";

type Bucket={count:number;resetAt:number};
const buckets=new Map<string,Bucket>();

export function requireSameOrigin(request:Request){
 const origin=request.headers.get("origin");if(!origin)return null;
 const expected=new URL(request.url).origin;
 return origin===expected?null:new Response(JSON.stringify({error:"Cross-origin request rejected"}),{status:403,headers:{"Content-Type":"application/json"}});
}
export function clientKey(request:Request,scope:string){const ip=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||request.headers.get("x-real-ip")||"unknown";return createHash("sha256").update(scope+"|"+ip).digest("hex");}
export function rateLimit(key:string,limit:number,windowMs:number){const now=Date.now();const b=buckets.get(key);if(!b||b.resetAt<=now){buckets.set(key,{count:1,resetAt:now+windowMs});return null;}if(b.count>=limit){const retry=Math.max(1,Math.ceil((b.resetAt-now)/1000));return new Response(JSON.stringify({error:"Too many requests. Please try again later."}),{status:429,headers:{"Content-Type":"application/json","Retry-After":String(retry)}});}b.count++;return null;}
export function safeHttpUrl(value:unknown){if(typeof value!=="string")return null;try{const u=new URL(value.trim());return u.protocol==="https:"||u.protocol==="http:"?u.toString():null;}catch{return null;}}
export function productionSecret(name:string,min=32){const v=process.env[name];if(process.env.NODE_ENV==="production"&&(!v||v.length<min))throw new Error(name+" must be configured securely in production");return v||"";}
