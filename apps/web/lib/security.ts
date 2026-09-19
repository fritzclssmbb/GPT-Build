export function requireSameOrigin(request:Request){
  const origin=request.headers.get("origin");
  if(!origin) return null;
  const expected=new URL(request.url).origin;
  return origin===expected?null:new Response(JSON.stringify({error:"Cross-origin request rejected"}),{status:403,headers:{"Content-Type":"application/json"}});
}
