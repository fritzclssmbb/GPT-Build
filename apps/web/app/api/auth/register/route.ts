import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { hashPassword, setSession } from '../../../../lib/auth';

type UserRow={id:string;email:string;display_name:string};
export async function POST(request:Request){
 const body=await request.json().catch(()=>({}));
 const email=typeof body.email==='string'?body.email.trim().toLowerCase():'';
 const displayName=typeof body.displayName==='string'?body.displayName.trim():'';
 const password=typeof body.password==='string'?body.password:'';
 if(!email.includes('@')||displayName.length<2||password.length<10)return NextResponse.json({error:'Valid name, email and a 10+ character password are required'},{status:400});
 try{
  const r=await query<UserRow>(`INSERT INTO users(email,display_name,password_hash) VALUES($1,$2,$3) RETURNING id,email,display_name`,[email,displayName,hashPassword(password)]);
  const u=r.rows[0]; setSession({id:u.id,email:u.email,displayName:u.display_name,role:'individual'});
  return NextResponse.json({ok:true,user:{id:u.id,email:u.email,displayName:u.display_name,role:'individual'}},{status:201});
 }catch(e:any){if(e?.code==='23505')return NextResponse.json({error:'An account already exists for this email'},{status:409});throw e;}
}
