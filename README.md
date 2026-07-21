# 4K Vestibulares — Plataforma

Plataforma do cursinho pré-vestibular **4K Vestibulares** (Taguatinga/DF): landing page institucional + ambiente do aluno e do professor (em construção). MVP real que também serve de pitch do produto.

## Stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Supabase** (Postgres, sa-east-1) — banco e autenticação
- Tema claro/escuro persistido, mobile-first
- Identidade visual definida em [`4k_vest/DESIGN.md`](4k_vest/DESIGN.md) — fonte única de verdade (roxo `#600BDA`, verde `#38E358`, obsidian `#0B1215`, Anton + Inter)

## Rodando localmente

```bash
npm install
npm run dev
# abre http://localhost:3000
```

Crie um `.env.local` (não versionado) com:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

As mesmas variáveis precisam existir também nas Environment Variables do projeto na Vercel.

> **Nota (OneDrive):** se o projeto estiver numa pasta sincronizada pelo OneDrive, o watcher do dev server pode perder edições. Se a página parecer desatualizada, reinicie o `npm run dev`.

## Estrutura

| Caminho | O que é |
|---|---|
| `app/` | Rotas: landing (`/`), `/login`, `/redefinir-senha`, `/auth/confirm`, `/politica-de-privacidade`, `/aluno` + `/aluno/quiz`, `/professor` (stub) |
| `components/landing/` | Seções da landing (hero, prova social, método, resultados, depoimentos, suporte, footer) |
| `components/aluno/` | Dashboard, radar de desempenho, quiz e navegação do ambiente do aluno |
| `components/` | Navbar, toggle de tema, Reveal (animação de entrada) |
| `lib/supabase/` | Clients Supabase (browser, server, proxy) tipados com `database.types.ts` |
| `lib/auth/actions.ts` | Server actions de autenticação (entrar, cadastrar, recuperar senha, sair) |
| `lib/aluno/` | Camada de dados do aluno (queries, server actions, tipos, ícones de matéria) |
| `proxy.ts` | Proteção de rotas (convenção do Next 16, substitui `middleware.ts`) |
| `app/globals.css` | Design tokens (única área com hex permitido) |
| `4k_vest/DESIGN.md` | Design system — consultar antes de qualquer tela nova |

> **Segurança (gabarito):** as questões chegam ao cliente via RPC `quiz_do_dia_seguro` **sem** a coluna `gabarito`; a correção e o gabarito só saem do banco pela função `responder_quiz`, no servidor, **após** o aluno responder. Nenhuma tela recebe o gabarito antecipadamente.

## Fases

- [x] **Fase 0** — Seed do banco (Supabase)
- [x] **Fase 1** — Landing page
- [x] **Fase 2** — Login/Cadastro (Supabase Auth)
- [x] **Fase 3** — Ambiente do aluno: dashboard, quiz diário (correção server-side), streak e radar de desempenho
- [ ] **Fase 3b** — Simulados, monitorias e redação (adiado)
- [ ] **Fase 4** — Ambiente do professor (frequência, item analysis, correção de redação)
