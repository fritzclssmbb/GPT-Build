import { NextResponse } from 'next/server';
import { currentUser } from '../../../../lib/auth';

export async function GET() {
  const user = currentUser();
  if (!user) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, user });
}
