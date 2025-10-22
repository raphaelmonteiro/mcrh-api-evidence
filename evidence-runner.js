// evidence-runner.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const BASE = 'https://mcrh-api.idkmedia.co/api';
const OUT = path.resolve(__dirname, 'evidence');

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

function save(filename, content) {
  const target = path.join(OUT, filename);
  if (typeof content === 'string') {
    fs.writeFileSync(target, content);
  } else {
    fs.writeFileSync(target, JSON.stringify(content, null, 2));
  }
}

function now() {
  return new Date().toISOString();
}

function safeExtractToken(body) {
  if (!body) return null;
  // common shapes
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body);
      body = parsed;
    } catch (e) {
      return null;
    }
  }
  if (body.accessToken) return body.accessToken;
  if (body.token) return body.token;
  if (body.data && body.data.accessToken) return body.data.accessToken;
  if (body.data && body.data.token) return body.data.token;
  for (const k of Object.keys(body)) {
    if (typeof body[k] === 'string' && body[k].split('.').length === 3) {
      return body[k];
    }
  }
  return null;
}

async function safeRequest(method, url, opts = {}) {
  try {
    const resp = await axios(Object.assign({ method, url, validateStatus: () => true }, opts));
    return resp;
  } catch (err) {
    // return a synthetic response-like object for evidence
    return {
      status: 0,
      headers: {},
      data: { error: err.message },
      _error: (err && err.stack) || String(err)
    };
  }
}

async function run() {
  try {
    save('run-info.txt', `Run at: ${now()}\nHost: ${BASE}\n`);
    // ===== AJUSTE AS CREDENCIAIS AQUI =====
    const authPayload = {
      email: 'substitua_pelo_seu_email',
      password: 'substitua_pela_sua_senha'
    };

    // 1) Authenticate
    const authResp = await safeRequest('post', `${BASE}/authenticate`, { data: authPayload, headers: { 'Content-Type': 'application/json' } });
    save('auth_response_headers.json', authResp.headers || {});
    save('auth_response_body.json', authResp.data || {});
    save('auth_status.txt', `status: ${authResp.status}`);

    const token = safeExtractToken(authResp.data);
    save('auth_extracted_token.txt', token || 'TOKEN_NAO_ENCONTRADO_PREENCHA_MANUALMENTE');

    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
          'x-access-token': token,
          token: token,
          'Content-Type': 'application/json'
        }
      : { 'Content-Type': 'application/json' };

    save('request_headers_used.json', headers);

    // 2) /user/me
    const meResp = await safeRequest('get', `${BASE}/user/me`, { headers });
    save('me_response_headers.json', meResp.headers || {});
    save('me_response_body.json', meResp.data || {});
    save('me_status.txt', `status: ${meResp.status}`);

    // 3) /dataimport/all?page=1&size=10
    const dataResp = await safeRequest('get', `${BASE}/dataimport/all?page=1&size=10`, { headers });
    save('data_response_headers.json', dataResp.headers || {});
    save('data_response_body.json', dataResp.data || {});
    save('data_status.txt', `status: ${dataResp.status}`);

    // 4) registro das requisições executadas (com timestamps)
    save('requests-log.txt', [
      `${now()} - POST /authenticate -> ${authResp.status}`,
      `${now()} - GET /user/me -> ${meResp.status}`,
      `${now()} - GET /dataimport/all?page=1&size=10 -> ${dataResp.status}`
    ].join('\n'));

    save('summary.txt', [
      `Run at: ${now()}`,
      `Host: ${BASE}`,
      `auth.status=${authResp.status}`,
      `me.status=${meResp.status}`,
      `data.status=${dataResp.status}`,
      `token.extracted=${token ? 'YES' : 'NO'}`
    ].join('\n'));

    console.log('Evidências salvas em ./evidence/');
  } catch (err) {
    console.error('Erro geral:', err);
    save('error.txt', `${now()} - ${err.stack || err.message}`);
  }
}

run();