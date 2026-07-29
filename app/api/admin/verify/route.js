import { NextResponse } from 'next/server';
import { isAuthorized, unauthorizedResponse } from '@/lib/auth';

// POST /api/admin/verify — checks the x-admin-key header against
// ADMIN_API_KEY. The admin sign-in screen calls this before letting
// anyone into the dashboard, so a wrong/random key is rejected
// immediately instead of silently granting UI access.
export async function POST(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();
  return NextResponse.json({ ok: true });
}