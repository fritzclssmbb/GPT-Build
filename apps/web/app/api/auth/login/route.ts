import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { setSession, verifyPassword, type Role } from '../../../../lib/auth';

type UserRow = { id: string; email: string; display_name: string; password_hash: string | null };
type MembershipRow = { organization_id: string; role: 'owner'|'admin'|'member' };

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email || password.length < 8) return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });

  const result = await query<UserRow>('SELECT id,email,display_name,password_hash FROM users WHERE email=$1 LIMIT 1', [email]);
  const user = result.rows[0];
  if (!user?.password_hash || !verifyPassword(password, user.password_hash)) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const membership = await query<MembershipRow>(`SELECT organization_id,role FROM organization_memberships WHERE user_id=$1 AND status='active' ORDER BY created_at LIMIT 1`, [user.id]);
  const m = membership.rows[0];
  const role: Role = m?.role ?? 'individual';
  setSession({ id: user.id, email: user.email, displayName: user.display_name, role, organizationId: m?.organization_id });
  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, displayName: user.display_name, role, organizationId: m?.organization_id } });
}
