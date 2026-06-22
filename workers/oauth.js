/**
 * Decap CMS GitHub OAuth Proxy — Cloudflare Worker
 * URL: https://ngopidulur-oauth.rifkyawalulhuda.workers.dev
 * 
 * PROTOKOL (ditemukan dari reverse-engineering decap-cms.js):
 *   1. Popup ke /auth → kirim HANDSHAKE dulu: "authorizing:github"
 *   2. Redirect ke GitHub → user authorize
 *   3. Callback /callback → tukar code → kirim: "authorization:github:success:<token>"
 */

const ORIGIN = 'https://ngopidulur.my.id';

async function getSecret(env, key, fallback) {
  return env[key] || fallback;
}

function html(title, body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${title}</title>
<style>*{margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#0d1117;color:#c9d1d9}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:32px 40px;text-align:center;max-width:440px;margin:20px}
h2{color:#2ea44f;margin-bottom:8px}.green{color:#2ea44f}.red{color:#f85149}
p{color:#8b949e;font-size:.9rem;line-height:1.5;margin:4px 0}
pre{background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:8px;font-family:monospace;font-size:.75rem;word-break:break-all;white-space:pre-wrap;margin:8px 0;text-align:left}
</style></head><body><div class="card">${body}</div></body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cid = await getSecret(env, 'GITHUB_CLIENT_ID', '');
    const csec = await getSecret(env, 'GITHUB_CLIENT_SECRET', '');
    const origin = await getSecret(env, 'ORIGIN', ORIGIN);
    
    // === STEP 1: /auth — Kirim handshake dulu, BARU redirect ke GitHub ===
    if (url.pathname === '/auth') {
      if (!cid) return html('Error', '<h2 class="red">Config error</h2>', 400);

      const params = new URLSearchParams({
        client_id: cid,
        scope: 'repo,user',
        redirect_uri: `${url.origin}/callback`,
      });
      const githubUrl = `https://github.com/login/oauth/authorize?${params}`;

      return new Response(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
<script>
(function(){
  var origin = '${origin}';

  // Step 1: Kirim HANDSHAKE ke Decap CMS (format: "authorizing:github")
  if (window.opener) {
    window.opener.postMessage('authorizing:github', origin);
  }

  // Step 2: Redirect ke GitHub setelah handshake terkirim
  setTimeout(function(){
    window.location.href = '${githubUrl}';
  }, 200);
})();
</script>
<p style="text-align:center;padding:40px;font-family:sans-serif">Mengalihkan ke GitHub...</p>
</body></html>`, {
        headers: {'Content-Type': 'text/html; charset=utf-8'},
      });
    }

    // === STEP 2: /callback — Tukar code, kirim SUCCESS message ===
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return html('Error', '<h2 class="red">No authorization code</h2>', 400);

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

      if (errMsg) return html('Error', `<h2 class="red">⚠️ ${errMsg}</h2>`, 400);

      // Kirim SUCCESS message: "authorization:github:success:TOKEN"
      return new Response(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
<script>
(function(){
  var token = '${token}';
  var origin = '${origin}';

  // Format SUCCESS: "authorization:github:success:TOKEN"
  if (window.opener) {
    window.opener.postMessage('authorization:github:success:' + token, origin);
  }
})();
</script>
<div style="text-align:center;padding:40px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0d1117;color:#c9d1d9;min-height:100vh;display:flex;align-items:center;justify-content:center">
<div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:32px;max-width:440px">
<h2 style="color:#2ea44f">✅ Login Berhasil!</h2>
<p style="color:#8b949e">Token terkirim ke halaman admin.</p>
<p style="color:#484f58;font-size:0.8rem;margin-top:8px">Jendela ini akan tertutup otomatis.</p>
</div></div>
<script>setTimeout(function(){window.close()},3000);</script>
</body></html>`, {
        headers: {'Content-Type': 'text/html; charset=utf-8'},
      });
    }

    // Health check
    return new Response(JSON.stringify({status:'ok',auth_url:url.origin+'/auth'}), {
      headers: {'Content-Type': 'application/json'},
    });
  },
};
