/**
 * Decap CMS GitHub OAuth Proxy — Cloudflare Worker
 * URL: https://ngopidulur-oauth.rifkyawalulhuda.workers.dev
 * 
 * Flow: /auth → GitHub → /callback → redirect ke admin site (same origin postMessage)
 */

const ORIGIN = 'https://ngopidulur.my.id';

async function getSecret(env, key, fallback) {
  return env[key] || fallback;
}

function renderBody(status, content) {
  return new Response(`<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${status}</title>
<style>*{margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#0d1117;color:#c9d1d9}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:32px 40px;text-align:center;max-width:440px}
h1{color:#58a6ff;margin-bottom:8px;font-size:1.3rem}p{color:#8b949e;font-size:.95rem;line-height:1.5}.code{background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:8px 12px;font-family:monospace;font-size:.8rem;word-break:break-all;margin-top:12px}</style>
</head><body><div class="card"><h1>Ngopidulur CMS Auth</h1>${content}</div></body></html>`, {
    status: status.includes('Error') ? 400 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export default {
  async fetch(request, env) {
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

    // Step 2: Callback from GitHub — exchange code, redirect to admin site
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
        return renderBody('Error', `<p>⚠️ GitHub error: ${tokenData.error_description || tokenData.error}</p>`);
      }

      // Redirect ke halaman callback di domain yang SAMA (ngopidulur.my.id)
      // auth-callback.html akan kirim postMessage dari same origin → diterima Decap CMS
      const origin = await getSecret(env, 'ORIGIN', ORIGIN);
      const redirectUrl = `${origin}/admin/auth-callback.html#token=${tokenData.access_token}&provider=github`;
      
      return Response.redirect(redirectUrl, 302);
    }

    // Health check
    return renderBody('OK', '<p>✅ Ngopidulur CMS OAuth Server siap.</p><p class="code">' + url.origin + '/auth</p>');
  },
};
