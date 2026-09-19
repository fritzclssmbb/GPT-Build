import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(){
  const started=Date.now();
  try{
    await query("SELECT 1");
    return NextResponse.json({status:"ok",database:"ok",latencyMs:Date.now()-started},{headers:{"Cache-Control":"no-store"}});
  }catch{
    return NextResponse.json({status:"degraded",database:"unavailable"},{status:503,headers:{"Cache-Control":"no-store"}});
  }
}
