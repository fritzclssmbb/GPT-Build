import { NextResponse } from 'next/server';import { clearSession } from '../../../../lib/auth';import { requireSameOrigin } from '../../../../lib/security';
export async function POST(request:Request){const rejected=requireSameOrigin(request);if(rejected)return rejected;clearSession();return NextResponse.json({ok:true});}
