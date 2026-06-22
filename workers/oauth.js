/**
 * Decap CMS GitHub OAuth Proxy — Cloudflare Worker
 * URL: https://ngopidulur-oauth.rifkyawalulhuda.workers.dev
 */

const ORIGIN = 'https://ngopidulur.my.id';

async function getSecret(env, key, fallback) {
  return env[key] || fallback;
}

function html(title, body) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${title}</title>
<style>*{margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#0d1117;color:#c9d1d9}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:32px 40px;text-align:center;max-width:440px}h1{color:#58a6ff;margin-bottom:8px;font-size:1.3rem}
p{color:#8b949e;font-size:.95rem;line-height:1.5;margin-bottom:6px}
.green{color:#2ea44f}.red{color:#f85149}
.code{background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:8px 12px;font-family:monospace;font-size:.8rem;word-break:break-all;margin-top:12px}
</style></head><body><div class="card"><h1>Ngopidulur CMS Auth</h1>${body}</div></body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/auth') {
      const githubClientId = await getSecret(env, 'GITHUB_CLIENT_ID', '');
      if (!githubClientId) return new Response(html('Error', '<p class="red">⚠️ Config error</p>'), {status:400,headers:{'Content-Type':'text/html'}});

      const params = new URLSearchParams({
        client_id: githubClientId,
        scope: 'repo,user',
        redirect_uri: `${url.origin}/callback`,
      });
      return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response(html('Error', '<p class="red">⚠️ No authorization code</p>'), {status:400,headers:{'Content-Type':'text/html'}});

      const githubClientId = await getSecret(env, 'GITHUB_CLIENT_ID', '');
      const githubClientSecret = await getSecret(env, 'GITHUB_CLIENT_SECRET', '');
      
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({client_id: githubClientId, client_secret: githubClientSecret, code}),
      });

      const tokenData = await tokenRes.json();
      if (tokenData.error) {
        return new Response(html('Error', `<p class="red">⚠️ ${tokenData.error_description || tokenData.error}</p>`), {status:400,headers:{'Content-Type':'text/html'}});
      }

      const origin = await getSecret(env, 'ORIGIN', ORIGIN);
      const token = tokenData.access_token;

      // Kirim token via postMessage + TETAP BUKA window (jangan close!)
      return new Response(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
<div style="text-align:center;padding:40px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0d1117;color:#c9d1d9;min-height:100vh;display:flex;align-items:center;justify-content:center">
<div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:32px 40px;max-width:440px">
<h2 style="color:#2ea44f;margin-bottom:8px">✅ Login Berhasil!</h2>
<p id="msg" style="color:#8b949e;font-size:.95rem">Mengirim token...</p>
</div></div>
<script>
(function(){
  var token='${token}', origin='${origin}';
  // Kirim token ke Decap CMS (via postMessage dari origin workers.dev)
  // Decap CMS cek origin berdasarkan base_url, jadi ini harusnya diterima
  try {
    window.opener.postMessage({token:token,provider:'github'}, origin);
    document.getElementById('msg').textContent='Token terkirim! Jendela ini bisa ditutup.';
  } catch(e) {
    document.getElementById('msg').textContent='Error: '+e.message+'. Silakan refresh halaman admin.';
  }
  // JANGAN close window — Decap CMS perlu window tetap hidup untuk verifikasi
})();
</script></body></html>`, {
        headers: {'Content-Type': 'text/html; charset=utf-8'},
      });
    }

    return new Response(html('OK', '<p class="green">✅ OAuth Server siap.</p><p class="code">'+url.origin+'/auth</p>'), {headers:{'Content-Type':'text/html'}});
  },
};
