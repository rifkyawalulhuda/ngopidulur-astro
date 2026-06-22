/**
 * Decap CMS GitHub OAuth + API Proxy — Cloudflare Worker
 * URL: https://ngopidulur-oauth.rifkyawalulhuda.workers.dev
 * 
 * Dua fungsi:
 *   1. OAuth: /auth → GitHub auth, /callback → tukar token
 *   2. API Proxy: /api/*, /repos/* → forward ke api.github.com
 *      (fallback kalau Decap CMS salah pakai base_url untuk API call)
 */

const ORIGIN = 'https://ngopidulur.my.id';
const GITHUB_API = 'https://api.github.com';

async function getSecret(env, key, fallback) {
  return env[key] || fallback;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cid = await getSecret(env, 'GITHUB_CLIENT_ID', '');
    const csec = await getSecret(env, 'GITHUB_CLIENT_SECRET', '');
    const origin = await getSecret(env, 'ORIGIN', ORIGIN);
    
    // === OAuth: /auth ===
    if (url.pathname === '/auth') {
      if (!cid) return new Response('Config error', {status:400});
      const params = new URLSearchParams({
        client_id: cid,
        scope: 'repo,user',
        redirect_uri: url.origin + '/callback',
      });
      return Response.redirect('https://github.com/login/oauth/authorize?' + params, 302);
    }

    // === OAuth: /callback ===
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('No code', {status:400});

      try {
        const tr = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
          body: JSON.stringify({client_id: cid, client_secret: csec, code}),
        });
        const td = await tr.json();
        if (td.error) throw new Error(td.error_description || td.error);
        const token = td.access_token;

        return new Response('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>'
          + '<script>'
          + '(function(){'
          + '  var t=' + JSON.stringify(token) + ';'
          + '  var o=' + JSON.stringify(origin) + ';'
          + '  var p=JSON.stringify(t);'
          + '  if(window.opener)window.opener.postMessage("authorization:github:success:"+p,o);'
          + '})();'
          + '</script>'
          + '<div style="text-align:center;padding:40px;font-family:sans-serif;background:#0d1117;color:#c9d1d9;min-height:100vh;display:flex;align-items:center;justify-content:center">'
          + '<div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:32px;max-width:440px">'
          + '<h2 style="color:#2ea44f">Login Berhasil!</h2><p style="color:#8b949e">Mengalihkan...</p>'
          + '</div></div>'
          + '<script>setTimeout(function(){window.close()},3000);</script>'
          + '</body></html>', {
          headers: {'Content-Type': 'text/html; charset=utf-8'},
        });
      } catch(e) {
        return new Response('Error: ' + e.message, {status:400});
      }
    }

    // === API Proxy: forward ke api.github.com ===
    // Decap CMS mungkin salah kirim API call ke sini — kita forward-kan
    if (url.pathname.startsWith('/repos/') || url.pathname.startsWith('/api/') || url.pathname.startsWith('/user')) {
      const authHeader = request.headers.get('Authorization') || '';
      const targetUrl = GITHUB_API + url.pathname + url.search;
      
      const proxyReq = new Request(targetUrl, {
        method: request.method,
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': request.headers.get('Content-Type') || 'application/json',
          'User-Agent': 'DecapCMS-Proxy',
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
      });

      const resp = await fetch(proxyReq);
      const respHeaders = new Headers(resp.headers);
      respHeaders.set('Access-Control-Allow-Origin', ORIGIN);
      
      return new Response(resp.body, {
        status: resp.status,
        headers: respHeaders,
      });
    }

    // Fallback
    return new Response(JSON.stringify({status:'ok', auth:url.origin+'/auth'}), {
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ORIGIN},
    });
  },
};
