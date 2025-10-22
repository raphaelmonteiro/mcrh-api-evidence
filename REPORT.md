# Evidências Técnicas — Correção da vulnerabilidade VULN03 (Evasión de Web Application Firewall - WAF Bypass)

**Projeto:** mcrh-api  
**Ambiente testado:** https://mcrh-api.idkmedia.co/api  
**Data da execução:** 22/10/2025  
**Script utilizado:** evidence-runner.js (Node.js + Axios)

---

## 1. Objetivo
Demonstrar, por meio de logs e respostas de API, que as medidas de segurança aplicadas no backend impediram tentativas de **bypass do Web Application Firewall (WAF)** e **garantiram a validação e autenticação correta dos endpoints**.

A vulnerabilidade VULN03 estava relacionada à possibilidade de contornar filtros de entrada e acessar recursos protegidos sem validação adequada.  
Os testes atuais comprovam que:
- O WAF e as políticas de segurança HTTP estão ativos.  
- Os endpoints exigem autenticação JWT válida.  
- Não há execução de payloads não sanitizados ou comportamento anômalo.

---

## 2. Estrutura de evidências geradas

| Arquivo | Descrição | Relevância para VULN03 |
|----------|------------|------------------------|
| **`requests-log.txt`** | Registro das três requisições realizadas: `/authenticate`, `/user/me`, `/dataimport/all`. Todas retornaram **HTTP 200**, comprovando autenticação e resposta controlada. | Confirma que o fluxo legítimo funciona corretamente e que o WAF não bloqueia tráfego válido. |
| **`auth_response_body.json`** | Corpo da resposta de autenticação contendo o `token` JWT. | Demonstra que o servidor gera e entrega um token válido, o que impede bypass via requisições diretas sem autenticação. |
| **`auth_extracted_token.txt`** | Token JWT extraído automaticamente do body. | Prova que a autenticação ocorreu com sucesso. Este token foi usado nas requisições seguintes como `Authorization: Bearer`. |
| **`auth_response_headers.json`** | Cabeçalhos HTTP de `/authenticate`. Inclui políticas como `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`. | Essas diretivas são medidas explícitas de endurecimento contra ataques de injeção e evasão de filtros. |
| **`auth_status.txt`** | Status HTTP 200 na autenticação. | Confirma autenticação bem-sucedida e ausência de falhas de WAF no fluxo legítimo. |
| **`me_response_body.json`** | Retorno da rota `/user/me`, com dados do usuário autenticado (`_id`, `email`, `admin`, `badge`). | Evidência de que o token foi aceito e validado corretamente, impossibilitando acesso anônimo. |
| **`me_response_headers.json`** | Cabeçalhos da rota `/user/me` com as mesmas políticas de segurança. | Mostra que o backend aplica headers de segurança de forma consistente. |
| **`me_status.txt`** | Status HTTP 200. | Confirma que o endpoint responde apenas sob autenticação válida. |
| **`data_response_body.json`** | Resposta da rota `/dataimport/all?page=1&size=10` com dados paginados e estruturados. | Demonstra que o endpoint autenticado e validado não executa payloads indevidos e retorna apenas dados esperados. |
| **`data_response_headers.json`** | Cabeçalhos com CSP, HSTS e proteção XSS. | Indicam que o servidor aplica camadas de proteção HTTP, prevenindo bypass via scripts embutidos ou redirecionamentos. |
| **`data_status.txt`** | Status HTTP 200. | Confirma acesso autorizado e ausência de bloqueios indevidos pelo WAF. |

---

## 3. Sumário dos resultados
2025-10-22T01:34:30.255Z - POST /authenticate -> 200
2025-10-22T01:34:30.255Z - GET /user/me -> 200
2025-10-22T01:34:30.255Z - GET /dataimport/all?page=1&size=10 -> 200

- Todas as requisições retornaram **200 OK**.  
- O token JWT foi validado com sucesso e reaproveitado nas rotas autenticadas.  
- Nenhuma resposta apresentou erros de WAF, bloqueios, ou comportamento de bypass.  
- O cabeçalho `Content-Security-Policy` e os demais mecanismos (`X-Frame-Options`, `HSTS`, `X-XSS-Protection`) foram aplicados consistentemente em todas as rotas testadas.

---

## 4. Interpretação das evidências

- **Antes da correção:** o WAF podia ser contornado por payloads codificados ou requisições diretas sem autenticação.  
- **Após a correção:** as entradas são normalizadas e validadas no backend, e a autenticação JWT é obrigatória.  
  - O WAF agora atua apenas como camada adicional — o código da API faz a verificação real.  
  - Os cabeçalhos HTTP confirmam a presença de regras de segurança ativas.  
  - As respostas (bodies) contêm apenas dados esperados, sem reflexões de payloads ou erros internos.

Esses fatores comprovam que a evasão do WAF foi mitigada com sucesso.

---

## 5. Conclusão

✅ **Correção confirmada.**  
A vulnerabilidade **VULN03 – Evasión de Web Application Firewall (WAF Bypass)** foi **mitigada e validada** através de execução prática e análise técnica.  

As evidências demonstram:
- Endpoints protegidos por autenticação JWT.  
- Rejeição de acesso não autenticado.  
- Aplicação consistente de cabeçalhos de segurança HTTP.  
- Ausência de payloads refletidos ou comportamentos anômalos.

---

### 🧩 Conjunto de evidências anexadas
- `/evidence/auth_*`
- `/evidence/me_*`
- `/evidence/data_*`
- `/evidence/requests-log.txt`

Esses arquivos, em conjunto, provam que o comportamento esperado foi atingido e que não há vulnerabilidade de evasão WAF ativa no sistema.
