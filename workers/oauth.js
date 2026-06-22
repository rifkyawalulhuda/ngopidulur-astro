/**
 * Decap CMS GitHub OAuth Proxy — Cloudflare Worker
 * URL: https://ngopidulur-oauth.rifkyawalulhuda.workers.dev
 * 
 * Endpoints:
 *   /auth        → redirect ke GitHub (dengan callback ke domain sendiri)
 *   /api/token   → POST {code} → {access_token} (dipanggil dari auth-callback.html)
 */

const ORIGIN = 'https://ngopidulur.my.id';

async function getSecret(env, key, fallback) {
  return env[key] || fallback;
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ORIGIN },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': ORIGIN,
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Step 1: Redirect ke GitHub — callback ke domain SENDIRI
    if (url.pathname === '/auth') {
      const cid = await getSecret(env, 'GITHUB_CLIENT_ID', '');
      if (!cid) return json({error: 'Config error'}, 400);
      
      // Callback URL: balik ke domain sendiri, bukan workers.dev!
      const params = new URLSearchParams({
        client_id: cid,
        scope: 'repo,user',
        redirect_uri: `${ORIGIN}/admin/auth-callback.html`,
      });
      return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
    }

    // Step 2: API endpoint — tukar code dengan token
    if (url.pathname === '/api/token' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({error: 'Invalid JSON'}, 400); }
      
      const code = body.code;
      if (!code) return json({error: 'No code'}, 400);

      const cid = await getSecret(env, 'GITHUB_CLIENT_ID', '');
      const csec = await getSecret(env, 'GITHUB_CLIENT_SECRET', '');
      
      const tr = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({client_id: cid, client_secret: csec, code}),
      });
      const td = await tr.json();
      if (td.error) return json({error: td.error_description || td.error}, 400);

      return json({access_token: td.access_token}, 200);
    }

    // Health check
    return json({status: 'ok', auth_url: `${url.origin}/auth`}, 200);
  },
};
