import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { hashPassword, setSession } from '../../../../lib/auth';

type UserRow = { id: string; email: string; display_name: string };

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email.includes('@') || displayName.length < 2 || password.length < 12) {
    return NextResponse.json({ error: 'Valid name, email and a password of at least 12 characters are required' }, { status: 400 });
  }

  try {
    const result = await query<UserRow>(
      `INSERT INTO users(email,display_name,password_hash,auth_provider)
       VALUES($1,$2,$3,'local')
       RETURNING id,email,display_name`,
      [email, displayName, hashPassword(password)]
    );
    const user = result.rows[0];
    setSession({ id: user.id, email: user.email, displayName: user.display_name, role: 'individual' });
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, displayName: user.display_name, role: 'individual' } }, { status: 201 });
  } catch (error: unknown) {
    const code = typeof error === 'object' && error && 'code' in error ? String((error as { code?: unknown }).code) : '';
    if (code === '23505') return NextResponse.json({ error: 'An account already exists for this email' }, { status: 409 });
    throw error;
  }
}
