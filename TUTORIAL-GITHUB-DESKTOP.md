# Tutorial GitHub Desktop - FilaZero

## 📥 Passo 1: Instalar GitHub Desktop

1. Acesse: https://desktop.github.com
2. Clique em **"Download for Windows"**
3. Execute o instalador
4. Abra o GitHub Desktop

---

## 🔐 Passo 2: Fazer Login

1. No GitHub Desktop, clique em **"Sign in to GitHub.com"**
2. Clique em **"Sign in using your browser"**
3. Faça login com sua conta GitHub (robsondbarbosa)
4. Autorize o GitHub Desktop

---

## 📁 Passo 3: Adicionar Repositório FilaZero

### Opção A: Clonar do GitHub (Recomendado)

1. No GitHub Desktop, clique em **"File"** → **"Clone repository"**
2. Selecione a aba **"GitHub.com"**
3. Procure por **"filazero"**
4. Selecione **"robsondbarbosa/filazero"**
5. Em **"Local path"**, escolha onde salvar:
   ```
   C:\Users\RTI\.verdent\verdent-projects\filazero-desktop
   ```
6. Clique em **"Clone"**

### Opção B: Usar pasta existente

1. No GitHub Desktop, clique em **"File"** → **"Add local repository"**
2. Clique em **"Choose..."**
3. Navegue até: `C:\Users\RTI\.verdent\verdent-projects\filazero`
4. Clique em **"Add repository"**

---

## ✏️ Passo 4: Fazer Alterações

1. Abra o projeto no VS Code:
   - No GitHub Desktop, clique em **"Repository"** → **"Open in Visual Studio Code"**

2. Faça qualquer alteração (ex: edite o README.md)

3. Salve o arquivo

---

## 📤 Passo 5: Enviar Alterações (Commit + Push)

1. No GitHub Desktop, você verá:
   - À esquerda: lista de arquivos alterados
   - À direita: visualização das alterações

2. Na parte inferior:
   - **Summary (required):** Digite um resumo das alterações
     ```
     Atualiza dashboard com API real
     ```
   - **Description:** (opcional) Detalhes adicionais

3. Clique em **"Commit to main"**

4. Clique em **"Push origin"** (botão azul no topo)

✅ Pronto! O código foi enviado para o GitHub!

---

## 🔄 Passo 6: Sincronizar (Pull)

Se outra pessoa (ou você em outro lugar) fez alterações:

1. No GitHub Desktop, clique em **"Fetch origin"**
2. Se houver alterações, clique em **"Pull origin"**

---

## 🚀 Passo 7: Deploy na Vercel

### Opção A: Via GitHub Desktop + Browser

1. No GitHub Desktop, clique em **"Repository"** → **"View on GitHub"**
2. No navegador, acesse: https://vercel.com/new
3. Importe o repositório **robsondbarbosa/filazero**

### Opção B: Deploy Automático

1. Acesse: https://vercel.com/dashboard
2. Clique em **"Add New Project"**
3. Importe do GitHub: **robsondbarbosa/filazero**
4. Configure:
   - Framework: **Next.js**
   - Root Directory: **apps/web**
5. Clique em **"Deploy"**

---

## 📋 Resumo dos Botões

| Botão | Função |
|-------|--------|
| **Fetch origin** | Verifica se há alterações no GitHub |
| **Pull origin** | Baixa alterações do GitHub |
| **Push origin** | Envia suas alterações para o GitHub |
| **Commit to main** | Salva alterações localmente |
| **Changes** | Arquivos que você modificou |
| **History** | Histórico de alterações |

---

## ❌ Erros Comuns

### "Authentication failed"
- Solução: Faça logout e login novamente no GitHub Desktop

### "Merge conflict"
- Solução: Clique em **"Repository"** → **"Open in Command Prompt"** e execute:
  ```bash
  git pull origin main
  # Resolva os conflitos manualmente
  git push origin main
  ```

### "Repository not found"
- Solução: Verifique se você tem acesso ao repositório no GitHub

---

## ✅ Checklist

- [ ] GitHub Desktop instalado
- [ ] Login realizado
- [ ] Repositório FilaZero adicionado
- [ ] Alterações commitadas
- [ ] Código enviado (push)
- [ ] Deploy na Vercel configurado

---

## 🆘 Precisa de Ajuda?

Se travar em algum passo, me diga qual e ajudo!
