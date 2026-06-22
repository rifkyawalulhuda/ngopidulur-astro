/**
 * Decap CMS GitHub OAuth Proxy — Cloudflare Worker
 * URL: https://ngopidulur-oauth.rifkyawalulhuda.workers.dev
 * 
 * KRITIS: Decap CMS hanya menerima postMessage dari origin base_url (workers.dev).
 * Jadi postMessage HARUS dikirim dari sini, bukan dari ngopidulur.my.id.
 */

const ORIGIN = 'https://ngopidulur.my.id';

async function getSecret(env, key, fallback) {
  return env[key] || fallback;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Step 1: Redirect ke GitHub (callback balik ke Worker)
    if (url.pathname === '/auth') {
      const cid = await getSecret(env, 'GITHUB_CLIENT_ID', '');
      if (!cid) return new Response('Config error', {status:400});
      
      const params = new URLSearchParams({
        client_id: cid,
        scope: 'repo,user',
        redirect_uri: `${url.origin}/callback`,
      });
      return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
    }

    // Step 2: Callback dari GitHub — tukar code, kirim token via postMessage
    // POPUP TETAP TERBUKA — Decap CMS perlu window hidup untuk verifikasi
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('No code', {status:400});
      }

      const cid = await getSecret(env, 'GITHUB_CLIENT_ID', '');
      const csec = await getSecret(env, 'GITHUB_CLIENT_SECRET', '');
      const origin = await getSecret(env, 'ORIGIN', ORIGIN);
      
      // Tukar code dengan access token
      let token;
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
        return new Response(`Error: ${e.message}`, {status:400});
      }

      // Kirim token via postMessage — origin = workers.dev (COCOK dengan authOrigin Decap CMS)
      // PENTING: JANGAN close window! Decap CMS perlu window hidup sebagai event.source
      return new Response(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Auth — Ngopidulur CMS</title>
<style>
*{margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#0d1117;color:#c9d1d9}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:32px 40px;text-align:center;max-width:440px}
h2{color:#2ea44f;margin-bottom:8px;font-size:1.3rem}p{color:#8b949e;font-size:.95rem;line-height:1.5}
</style></head><body>
<div class="card">
<h2>✅ Login Berhasil!</h2>
<p id="msg">Token terkirim ke halaman admin.</p>
<p style="font-size:0.8rem;color:#484f58;margin-top:12px">Jangan tutup jendela ini sampai halaman admin masuk dashboard.</p>
</div>
<script>
(function(){
  var token='${token}', origin='${origin}';
  var sent = false;
  
  function sendToken() {
    if (sent) return;
    sent = true;
    try {
      // Kirim ke opener (halaman admin Decap CMS)
      // Origin pengirim = workers.dev → COCOK dengan authOrigin Decap CMS!
      window.opener.postMessage(
        { token: token, provider: 'github' },
        origin
      );
      document.getElementById('msg').textContent = '✅ Token terkirim! Anda bisa tutup jendela ini sekarang.';
    } catch(e) {
      document.getElementById('msg').textContent = '⚠️ Gagal mengirim: ' + e.message;
    }
  }
  
  // Kirim token — beberapa kali dengan jeda untuk memastikan Decap CMS siap
  sendToken();
  setTimeout(sendToken, 500);
  setTimeout(sendToken, 1500);
  
  // Auto-close setelah 10 detik (fallback)
  setTimeout(function(){ window.close(); }, 10000);
})();
</script></body></html>`, {
        headers: {'Content-Type': 'text/html; charset=utf-8'},
      });
    }

    // Health check
    return new Response(JSON.stringify({status:'ok'}), {
      headers: {'Content-Type': 'application/json'},
    });
  },
};
