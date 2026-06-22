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
    const cid = await getSecret(env, 'GITHUB_CLIENT_ID', '');
    const csec = await getSecret(env, 'GITHUB_CLIENT_SECRET', '');
    const origin = await getSecret(env, 'ORIGIN', ORIGIN);
    
    if (url.pathname === '/auth') {
      if (!cid) return new Response('Config error', {status:400});
      const params = new URLSearchParams({
        client_id: cid,
        scope: 'repo,user',
        redirect_uri: url.origin + '/callback',
      });
      return Response.redirect('https://github.com/login/oauth/authorize?' + params, 302);
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('No code', {status:400});

      // DEBUG: tampilkan apa yang kita kirim ke GitHub
      const debug = [];
      debug.push('Code length: ' + code.length);
      debug.push('Client ID: ' + cid.substring(0,8) + '...');

      try {
        const tr = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
          body: JSON.stringify({client_id: cid, client_secret: csec, code}),
        });
        
        const rawText = await tr.text();
        debug.push('GitHub response: ' + rawText.substring(0, 200));
        
        let td;
        try {
          td = JSON.parse(rawText);
        } catch(e) {
          debug.push('JSON parse error: ' + e.message);
          // Try URL-encoded format
          const params = new URLSearchParams(rawText);
          td = {
            access_token: params.get('access_token'),
            error: params.get('error'),
            error_description: params.get('error_description'),
            scope: params.get('scope'),
            token_type: params.get('token_type'),
          };
        }
        
        debug.push('Token from response: ' + (td.access_token ? td.access_token.substring(0, 10) + '... (len:' + td.access_token.length + ')' : 'NONE'));
        debug.push('Error from response: ' + (td.error || 'none'));
        debug.push('Scope: ' + (td.scope || 'none'));
        
        if (td.error) {
          return new Response('<!DOCTYPE html><html><body><pre>' 
            + debug.join('\n') 
            + '</pre></body></html>', {
            headers: {'Content-Type': 'text/html'},
            status: 400
          });
        }
        
        const token = td.access_token;
        if (!token) {
          return new Response('<!DOCTYPE html><html><body><pre>NO TOKEN!\n' 
            + debug.join('\n') 
            + '</pre></body></html>', {
            headers: {'Content-Type': 'text/html'},
            status: 400
          });
        }

        // Kirim SUCCESS ke Decap CMS
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
          + '<div style="background:#161b22;border:1px solid #30363d;border-radius:8px;padding:32px;max-width:500px">'
          + '<h2 style="color:#2ea44f">Login Berhasil!</h2>'
          + '<p style="color:#8b949e;font-size:0.85rem">Token: ' + token.substring(0,12) + '... <b>(len:' + token.length + ')</b></p>'
          + '<pre style="background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:8px;font-family:monospace;font-size:0.75rem;word-break:break-all;white-space:pre-wrap;max-height:200px;overflow:auto;text-align:left">' + debug.join('\n') + '</pre>'
          + '</div></div>'
          + '<script>setTimeout(function(){window.close()},5000);</script>'
          + '</body></html>', {
          headers: {'Content-Type': 'text/html; charset=utf-8'},
        });
        
      } catch(e) {
        debug.push('Fetch error: ' + e.message);
        return new Response('<!DOCTYPE html><html><body><pre>' 
          + debug.join('\n') 
          + '</pre></body></html>', {
          headers: {'Content-Type': 'text/html'},
          status: 500
        });
      }
    }

    return new Response(JSON.stringify({status:'ok'}), {
      headers: {'Content-Type': 'application/json'},
    });
  },
};
