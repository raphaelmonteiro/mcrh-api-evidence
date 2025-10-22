# Guia de Execução — Coleta de Evidências (mcrh-api)

Este documento explica como configurar e executar o script `evidence-runner.js`, responsável por gerar os logs de evidência que comprovam a correção da vulnerabilidade **VULN03 – “Evasión de Web Application Firewall (WAF Bypass)”**.

---

## 🧩 1. Pré-requisitos

Antes de rodar o script, certifique-se de que você tem o seguinte ambiente instalado:

- **Node.js** (versão 16 ou superior)
- **npm** (gerenciador de pacotes do Node)
- **Acesso à internet** (para conectar com a API em produção ou homologação)
- **Credenciais válidas de usuário** (email e senha ativos no sistema `mcrh-api`)

Verifique as versões com:

```bash
node -v
npm -v 
```

## ⚙️ 2. Estrutura do projeto

A estrutura mínima para rodar o script é a seguinte:

```
mcrh-api-evidence/
│
├── evidence-runner.js        # Script principal de coleta de evidências
├── evidence/                 # Pasta onde os arquivos de evidência são salvos
│   ├── auth_*                # Respostas e headers do endpoint /authenticate
│   ├── me_*                  # Respostas e headers do endpoint /user/me
│   ├── data_*                # Respostas e headers do endpoint /dataimport/all
│   └── requests-log.txt      # Registro resumido das requisições
│  
├── README.md             # Este guia
└── REPORT.md             # Documento técnico com a análise das evidências
```

## 🔐 3. Configuração das credenciais

Edite as linhas dentro do evidence-runner.js:

```bash
const authPayload = {
  email: 'substitua_pelo_seu_email',
  password: 'substitua_pela_sua_senha'
};
```

## ▶️ 4. Instalação e execução
1.	Instale as dependências: 
```bash
npm install
```

2.	Execute o script:
```bash
node evidence-runner.js
```

3.	Após a execução, o console exibirá:
```bash
Evidências salvas em ./evidence/
```

4.	Todos os arquivos gerados ficarão dentro da pasta ./evidence.
