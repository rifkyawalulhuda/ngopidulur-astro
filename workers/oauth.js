/**
 * Decap CMS GitHub OAuth Proxy — Cloudflare Worker
 * URL: https://ngopidulur-oauth.rifkyawalulhuda.workers.dev
 */

const ORIGIN = 'https://ngopidulur.my.id';

async function getSecret(env, key, fallback) {
  return env[key] || fallback;
}

function renderBody(status, content) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${status}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex; justify-content: center; align-items: center;
      min-height: 100vh; background: #0d1117; color: #c9d1d9;
    }
    .card {
      background: #161b22; border: 1px solid #30363d;
      border-radius: 8px; padding: 32px 40px; text-align: center;
      max-width: 440px; width: 90%;
    }
    h1 { color: #58a6ff; margin-bottom: 8px; font-size: 1.3rem; }
    p { color: #8b949e; font-size: 0.95rem; line-height: 1.5; margin-bottom: 8px; }
    .code { background: #0d1117; border: 1px solid #30363d;
      border-radius: 6px; padding: 8px 12px; font-family: monospace;
      font-size: 0.8rem; word-break: break-all; margin-top: 12px; user-select: all; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Ngopidulur CMS Auth</h1>
    ${content}
  </div>
</body>
</html>`;
  return new Response(html, {
    status: status.includes('Error') ? 400 : 200,
    headers: { 'Content-Type': 'text/html' },
  });
}

async function handleAuth(request, env) {
  const url = new URL(request.url);
  
  // Step 1: Redirect to GitHub OAuth
  if (url.pathname === '/auth') {
    const githubClientId = await getSecret(env, 'GITHUB_CLIENT_ID', '');
    if (!githubClientId) {
      return renderBody('Error', '<p>⚠️ GITHUB_CLIENT_ID belum diset.</p>');
    }

    const params = new URLSearchParams({
      client_id: githubClientId,
      scope: 'repo,user',
      redirect_uri: `${url.origin}/callback`,
    });
    
    return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
  }

  // Step 2: Callback from GitHub, exchange code for token
  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code');
    if (!code) {
      return renderBody('Error', '<p>⚠️ Tidak ada authorization code dari GitHub.</p>');
    }

    const githubClientId = await getSecret(env, 'GITHUB_CLIENT_ID', '');
    const githubClientSecret = await getSecret(env, 'GITHUB_CLIENT_SECRET', '');
    
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: githubClientId,
        client_secret: githubClientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      return renderBody('Error', `<p>⚠️ GitHub OAuth error: ${tokenData.error_description || tokenData.error}</p>`);
    }

    const origin = await getSecret(env, 'ORIGIN', ORIGIN);
    const token = tokenData.access_token;

    // Kirim token ke Decap CMS via postMessage + fallback localStorage
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Auth</title></head><body>
<script>
(function() {
  var token = "${token}";
  var origin = "${origin}";
  var done = false;

  function sendToken() {
    if (done) return;
    done = true;

    // Method 1: postMessage ke opener (Decap CMS)
    if (window.opener && window.opener !== window) {
      try {
        window.opener.postMessage(
          { token: token, provider: "github" },
          origin
        );
        console.log("Token sent via postMessage");
      } catch(e) {
        console.error("postMessage failed:", e);
      }
    }

    // Method 2: localStorage fallback
    try {
      localStorage.setItem("decap-cms-github-token", token);
    } catch(e) {}

    // Tunggu sebentar biar Decap CMS sempat terima message
    setTimeout(function() {
      window.close();
      // Kalau window gak ketutup (blocked), tampilkan success
      setTimeout(function() {
        document.body.innerHTML = '<div style="text-align:center;padding:40px;font-family:sans-serif;">'
          + '<h2 style="color:#2ea44f;">✅ Login Berhasil!</h2>'
          + '<p>Tutup jendela ini dan kembali ke halaman admin.</p>'
          + '<button onclick="window.close()" style="margin-top:12px;padding:8px 16px;border-radius:6px;background:#238636;color:#fff;border:none;cursor:pointer;font-size:14px;">Tutup</button>'
          + '</div>';
      }, 1500);
    }, 500);
  }

  // Delay dikit — memastikan opener sudah siap nerima message
  setTimeout(sendToken, 300);
})();
</script></body></html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return renderBody('OK', '<p>✅ Ngopidulur CMS OAuth Server siap.</p><p class="code">' + url.origin + '/auth</p>');
}

export default {
  async fetch(request, env) {
    return handleAuth(request, env);
  },
};
