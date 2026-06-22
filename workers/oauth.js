/**
 * Decap CMS GitHub OAuth Proxy — Cloudflare Worker
 * URL: https://ngopidulur-oauth.rifkyawalulhuda.workers.dev
 */

const ORIGIN = 'https://ngopidulur.my.id';

async function getSecret(env, key, fallback) {
  return env[key] || fallback;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
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

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('No code', {status:400});

      const cid = await getSecret(env, 'GITHUB_CLIENT_ID', '');
      const csec = await getSecret(env, 'GITHUB_CLIENT_SECRET', '');
      const origin = await getSecret(env, 'ORIGIN', ORIGIN);
      
      let token, errorMsg;
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
        errorMsg = e.message;
      }

      if (errorMsg) {
        return new Response(`Error: ${errorMsg}`, {status:400});
      }

      return new Response(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Auth Debug — Ngopidulur CMS</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0d1117;color:#c9d1d9;padding:20px}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:24px;max-width:500px;margin:0 auto}
h2{margin-bottom:12px;font-size:1.2rem}.green{color:#2ea44f}.red{color:#f85149}.yellow{color:#d29922}
pre{background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:12px;font-family:monospace;font-size:0.8rem;word-break:break-all;white-space:pre-wrap;margin:8px 0;max-height:200px;overflow:auto}
.info{margin:8px 0;font-size:0.9rem} .info span{color:#8b949e} .info b{color:#c9d1d9}
.btn{display:inline-block;margin:4px;padding:8px 16px;border-radius:6px;border:none;cursor:pointer;font-size:0.85rem;font-weight:500}
.btn-green{background:#238636;color:#fff}.btn-blue{background:#1f6feb;color:#fff}.btn-red{background:#da3633;color:#fff}
</style></head><body><div class="card">
<h2 class="green">✅ Token Didapatkan</h2>
<div class="info"><span>Origin worker: </span><b>${url.origin}</b></div>
<div class="info"><span>Target admin: </span><b>${origin}</b></div>
<div class="info"><span>Opener: </span><b id="opener-status">⏳ cek...</b></div>
<div class="info"><span>postMessage: </span><b id="pm-status">⏳ cek...</b></div>
<div class="info"><span>Error: </span><b id="err-status" class="red">-</b></div>
<pre id="token-display" style="display:none"></pre>
<button class="btn btn-green" onclick="send()">🔄 Kirim Ulang Token</button>
<button class="btn btn-blue" onclick="copyToken()">📋 Copy Token</button>
<button class="btn btn-red" onclick="window.close()">✕ Tutup</button>
</div>
<script>
var token='${token}', origin='${origin}';
document.getElementById('opener-status').textContent = window.opener ? '✅ ADA' : '❌ NULL';
document.getElementById('opener-status').className = window.opener ? 'green' : 'red';

function send(){
  var pm=document.getElementById('pm-status');
  var er=document.getElementById('err-status');
  try {
    if(!window.opener){er.textContent='window.opener NULL!';return;}
    window.opener.postMessage({token:token,provider:'github'}, origin);
    pm.textContent='✅ Terkirim ('+new Date().toLocaleTimeString()+')';
    pm.className='green';
  } catch(e) {
    pm.textContent='❌ GAGAL';
    pm.className='red';
    er.textContent=e.message;
  }
}

function copyToken(){
  navigator.clipboard.writeText(token).then(function(){
    document.getElementById('token-display').textContent=token;
    document.getElementById('token-display').style.display='block';
    alert('Token dicopy!');
  });
}

// Auto-send on load
setTimeout(send, 500);
setTimeout(send, 1500);
setTimeout(send, 3000);
</script></body></html>`, {
        headers: {'Content-Type': 'text/html; charset=utf-8'},
      });
    }

    return new Response(JSON.stringify({status:'ok'}), {
      headers: {'Content-Type': 'application/json'},
    });
  },
};
