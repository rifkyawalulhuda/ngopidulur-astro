/**
 * Decap CMS GitHub OAuth Proxy — Cloudflare Worker
 * URL: https://ngopidulur-oauth.rifkyawalulhuda.workers.dev
 * 
 * PROTOKOL (reverse-engineered dari decap-cms.js 3.4.2):
 *   1. Popup ke /auth → HANDSHAKE: "authorizing:github"
 *   2. Redirect ke GitHub → user authorize
 *   3. Callback /callback → SUCCESS: "authorization:github:success:"TOKEN_JSON""
 *      Decap CMS parse: regex ^authorization:github:success:(.+)$ → JSON.parse(group1)
 */

const ORIGIN = 'https://ngopidulur.my.id';

async function getSecret(env, key, fallback) {
  return env[key] || fallback;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cid = await getSecret(env, 'GITHUB_CLIENT_ID', '');
    const csec = await getSecret(env, 'GITHUB_CLIENT_SECRET', '');
    const origin = await getSecret(env, 'ORIGIN', ORIGIN);
    
    // === /auth — Kirim handshake dulu, BARU redirect ke GitHub ===
    if (url.pathname === '/auth') {
      if (!cid) return new Response('Config error', {status:400});

      const params = new URLSearchParams({
        client_id: cid,
        scope: 'repo,user',
        redirect_uri: url.origin + '/callback',
      });
      const githubUrl = 'https://github.com/login/oauth/authorize?' + params;

      return new Response('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>'
        + '<script>'
        + '(function(){'
        + '  if(window.opener)window.opener.postMessage("authorizing:github","' + origin + '");'
        + '  setTimeout(function(){window.location.href="' + githubUrl + '"},200);'
        + '})();'
        + '</script>'
        + '<p style="text-align:center;padding:40px;font-family:sans-serif">Mengalihkan ke GitHub...</p>'
        + '</body></html>', {
        headers: {'Content-Type': 'text/html; charset=utf-8'},
      });
    }

    // === /callback — Tukar code, kirim SUCCESS ===
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('No code', {status:400});

      let token, errMsg;
      try {
        const tr = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
          body: JSON.stringify({client_id: cid, client_secret: csec, code}),
        });
        const td = await tr.json();
        if (td.error) throw new Error(td.error_description || td.error);
        token = td.access_token;
      } catch(e) {
        errMsg = e.message;
      }

      if (errMsg) {
        return new Response('Error: ' + errMsg, {status:400});
      }

      // Kirim SUCCESS: "authorization:github:success:TOKEN_JSON"
      // JSON.stringify token biar valid JSON (contoh: "gho_xxx" → "\"gho_xxx\"")
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
        + '<h2 style="color:#2ea44f">Login Berhasil!</h2>'
        + '<p style="color:#8b949e">Token terkirim. Tutup jendela ini.</p>'
        + '</div></div>'
        + '<script>setTimeout(function(){window.close()},3000);</script>'
        + '</body></html>', {
        headers: {'Content-Type': 'text/html; charset=utf-8'},
      });
    }

    return new Response(JSON.stringify({status:'ok'}), {
      headers: {'Content-Type': 'application/json'},
    });
  },
};
