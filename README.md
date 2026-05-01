# Verdent Projects

Este repositório contém múltiplos projetos independentes, cada um com seu próprio repositório Git e deploy.

## 📁 Estrutura

```
verdent-projects/
├── .gitignore              # Ignora pastas de projetos individuais
├── README.md               # Este arquivo
│
├── techboard/              # Sistema de atendimentos técnicos (Trello-like)
│   ├── .git/              # Repositório independente
│   └── https://techboard-rho.vercel.app
│
├── gympro/                 # Sistema de gestão para academias
│   ├── .git/              # Repositório independente
│   └── https://gympro-eight.vercel.app
│
└── [outros projetos]/      # Cada projeto é independente
```

## 🚀 Projetos

### TechBoard
Sistema de gestão de atendimentos técnicos estilo Kanban/Trello.
- **URL**: https://techboard-rho.vercel.app
- **Repositório**: GitHub (techboard)

### GymPro
Sistema completo de gestão para academias.
- **URL**: https://gympro-eight.vercel.app
- **Repositório**: GitHub (gym-manager-pro)

## 📝 Notas

- Cada projeto na pasta raiz tem seu próprio `.git/` e é um repositório independente
- O `.gitignore` do repositório pai ignora essas pastas para evitar conflitos
- Cada projeto tem seu próprio deploy na Vercel

## 🆕 Adicionar Novo Projeto

1. Crie uma nova pasta: `mkdir meu-projeto`
2. Inicialize o Git: `cd meu-projeto && git init`
3. Adicione o projeto ao `.gitignore` do repositório pai
4. Crie um repositório no GitHub
5. Configure o remote e faça push
6. Deploy na Vercel

---

**Data de organização**: 01/05/2026
