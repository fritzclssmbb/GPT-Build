import { cookies } from 'next/headers';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export type Role = 'owner' | 'admin' | 'member' | 'individual';
export type SessionUser = { id: string; email: string; displayName: string; role: Role; organizationId?: string };

const SESSION_COOKIE = 'fs_card_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('SESSION_SECRET must be configured with at least 32 characters');
  return value;
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, encoded: string) {
  const [salt, stored] = encoded.split(':');
  if (!salt || !stored) return false;
  const computed = scryptSync(password, salt, 64);
  const expected = Buffer.from(stored, 'hex');
  return computed.length === expected.length && timingSafeEqual(computed, expected);
}

export function createSession(user: SessionUser) {
  const body = Buffer.from(JSON.stringify({ user, exp: Date.now() + SESSION_TTL_SECONDS * 1000 })).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function readSession(raw?: string | null): SessionUser | null {
  if (!raw) return null;
  const [body, signature] = raw.split('.');
  if (!body || !signature) return null;
  const expected = sign(body);
  const actualBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as { user: SessionUser; exp: number };
    if (parsed.exp < Date.now()) return null;
    return parsed.user;
  } catch { return null; }
}

export async function currentUser() {
  const store = await cookies();
  return readSession(store.get(SESSION_COOKIE)?.value);
}

export async function setSession(user: SessionUser) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSession(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  });
}

export async function clearSession() { const store = await cookies(); store.delete(SESSION_COOKIE); }

export function can(role: Role, action: 'billing'|'brand'|'members'|'analytics'|'own-card') {
  const grants: Record<Role, string[]> = {
    owner: ['billing','brand','members','analytics','own-card'],
    admin: ['brand','members','analytics','own-card'],
    member: ['analytics','own-card'],
    individual: ['analytics','own-card']
  };
  return grants[role].includes(action);
}
