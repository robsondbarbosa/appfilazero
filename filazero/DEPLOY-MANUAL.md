# Deploy Manual - Via Interface Web

## Passo 1: Compactar o projeto

Execute no PowerShell:
```powershell
cd C:\Users\RTI\.verdent\verdent-projects
Compress-Archive -Path appfilazero-deploy\* -DestinationPath appfilazero-deploy.zip
```

## Passo 2: Deploy via Vercel Web

1. Acesse: https://vercel.com/new
2. Clique em **"Upload"** (ou arraste o arquivo)
3. Selecione o arquivo `appfilazero-deploy.zip`
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./ (deixe em branco)
5. Clique em **"Deploy"**

## Passo 3: Configurar variáveis de ambiente

Após o deploy, no dashboard da Vercel:
1. Vá em **Settings** → **Environment Variables**
2. Adicione as 6 variáveis do Firebase
3. Faça **redeploy**

## Passo 4: Tornar público

1. Settings → General
2. Deployment Protection → **Public**
3. Salve

---

## URL do projeto

Se o deploy funcionar, o site estará em:
`https://appfilazero-XXXX.vercel.app`

---

Quer tentar este método?
