/**
 * Decap CMS GitHub OAuth Proxy — Cloudflare Worker
 * 
 * Deploy ke Cloudflare Workers (gratis 100k req/hari).
 * Setelah deploy, ganti `base_url` di config.yml dengan URL Worker ini.
 *
 * Setup:
 *   1. Bikin GitHub OAuth App: https://github.com/settings/developers
 *      - Homepage URL: https://ngopidulur.my.id
 *      - Callback URL: https://YOUR_WORKER.workers.dev/callback
 *   2. Deploy worker ini dengan wrangler:
 *        npx wrangler deploy
 *   3. Set secrets:
 *        npx wrangler secret put GITHUB_CLIENT_ID
 *        npx wrangler secret put GITHUB_CLIENT_SECRET
 *        npx wrangler secret put OAUTH_CLIENT_ID
 *        npx wrangler secret put OAUTH_CLIENT_SECRET
 *        npx wrangler secret put ORIGIN
 */

const ORIGIN = 'https://ngopidulur.my.id';

// ===== GitHub OAuth Config =====
// Disimpan sebagai secret di Cloudflare:
//   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
//   OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET
//   ORIGIN (optional, default di atas)

async function getSecret(env, key, fallback) {
  return env[key] || fallback;
}

// ===== Helpers =====
function renderBody(status, content) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${status}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex; justify-content: center; align-items: center;
      min-height: 100vh; margin: 0; background: #0d1117; color: #c9d1d9;
    }
    .card {
      background: #161b22; border: 1px solid #30363d;
      border-radius: 8px; padding: 32px 40px; text-align: center;
      max-width: 420px; width: 90%;
    }
    h1 { color: #58a6ff; margin-bottom: 8px; font-size: 1.3rem; }
    p { color: #8b949e; font-size: 0.95rem; line-height: 1.5; }
    .code { background: #0d1117; border: 1px solid #30363d;
      border-radius: 6px; padding: 8px 12px; font-family: monospace;
      font-size: 0.85rem; word-break: break-all; margin-top: 12px; }
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

// ===== OAuth Flow =====
async function handleAuth(request, env) {
  const url = new URL(request.url);
  const clientId = await getSecret(env, 'OAUTH_CLIENT_ID', '');
  const clientSecret = await getSecret(env, 'OAUTH_CLIENT_SECRET', '');
  
  // Step 1: Redirect to GitHub OAuth
  if (url.pathname === '/auth') {
    const githubClientId = await getSecret(env, 'GITHUB_CLIENT_ID', '');
    if (!githubClientId) {
      return renderBody('Error', '<p>⚠️ GITHUB_CLIENT_ID belum diset di Cloudflare Worker secrets.</p>');
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
    
    // Exchange code for access token
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

    // Send token back to Decap CMS via postMessage
    const origin = await getSecret(env, 'ORIGIN', ORIGIN);
    const html = `
<!DOCTYPE html>
<html><head><script>
  window.opener.postMessage(
    { token: "${tokenData.access_token}", provider: "github" },
    "${origin}"
  );
  window.close();
</script></head><body><p>Login berhasil! Menutup jendela...</p></body></html>`;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  // Health check
  return renderBody('OK', '<p>✅ Ngopidulur CMS OAuth Server siap.</p><p class="code">' + url.origin + '/auth</p>');
}

export default {
  async fetch(request, env) {
    return handleAuth(request, env);
  },
};
