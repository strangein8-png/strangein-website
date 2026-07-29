// Very small "is this request allowed to write?" check.
// The admin UI (and any other tool) must send back one of the keys listed
// in ADMIN_API_KEY. Set ADMIN_API_KEY in your .env.local — see
// .env.local.example. This is intentionally simple; for a production app
// with real user accounts, swap this for proper session/JWT auth.
//
// Supports multiple admins: separate keys with a comma, e.g.
//   ADMIN_API_KEY=key-for-priya,key-for-arjun
// Anyone holding any one of these keys can create/edit/delete content.
// There's no per-admin identity tracking — it's a shared-secret model,
// same security level as before, just allowing more than one secret.

export function isAuthorized(request) {
  const key = request.headers.get('x-admin-key');
  const rawExpected = process.env.ADMIN_API_KEY;

  if (!key || !rawExpected) {
    // No key sent, or none configured on the server -> writes disabled.
    return false;
  }

  const validKeys = rawExpected
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  return validKeys.includes(key);
}

export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: 'Unauthorized. Send a valid x-admin-key header.' }),
    { status: 401, headers: { 'Content-Type': 'application/json' } }
  );
}