// Very small "is this request allowed to write?" check.
// The admin UI (and any other tool) must send the same key back as the
// header `x-admin-key`. Set ADMIN_API_KEY in your .env.local — see
// .env.local.example. This is intentionally simple; for a production app
// with real user accounts, swap this for proper session/JWT auth.

export function isAuthorized(request) {
  const key = request.headers.get('x-admin-key');
  const expected = process.env.ADMIN_API_KEY;

  if (!expected) {
    return false;
  }
  return key === expected;
}

export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: 'Unauthorized. Send a valid x-admin-key header.' }),
    { status: 401, headers: { 'Content-Type': 'application/json' } }
  );
}