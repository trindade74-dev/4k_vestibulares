---
title: DESIGN — Plataforma 4K
projeto: 4K Vestibulares
tipo: sistema-de-design
status: ativo
data: 2026-07-11
aliases:
  - Design System 4K
  - Identidade Visual 4K
tags:
  - 4k
  - design
  - frontend
  - design-system
---

# DESIGN — Plataforma 4K

> [!abstract] Para que serve este documento
> Fonte de verdade da identidade visual da plataforma do cursinho **4K Vestibulares**. Toda tela, componente e cor sai daqui. Antes de escrever CSS ou JSX, o Claude Code **consulta este arquivo**. Objetivo: impedir drift visual num projeto tocado por uma pessoa só.

> [!danger] Regras invioláveis (leia antes de codar qualquer coisa)
> 1. **Verde é sagrado e escasso.** `#38E358` só aparece em ação e acerto (botão principal, streak, resposta certa). Nunca em decoração, fundo grande ou texto corrido. Se o verde está em tudo, ele deixa de significar "vai".
> 2. **Anton só em título de impacto, caixa alta.** Nunca em corpo, frase longa ou parágrafo. Corpo é sempre a sans neutra.
> 3. **Grid é tempero, não papel de parede.** Aparece nas superfícies de destaque nos **dois temas** (hero, header, tela de quiz, card de matéria, seção de resultados): no claro com linha roxo-clara quase rosa (`#E6CBEF`), no escuro com roxo a 28%. Nunca atrás de texto de estudo nem em card branco de conteúdo.
> 4. **Futurista contido, nunca caricato.** Zero cromado, zero fonte "espacial", zero holograma, zero neon piscando. Profundidade vem de camadas de roxo/obsidian + grid fino + glow sutil no verde.
> 5. **Dois modos obrigatórios.** Toda cor precisa funcionar no claro e no escuro. Plataforma de estudo não pode ser só escura.

---

## Conceito

Identidade que cruza três referências: as **cores do 4K** (roxo elétrico + verde neon, tiradas do material da marca), a **estrutura amigável do Duolingo** (cantos arredondados, gamificação, feedback generoso) e um **acabamento sci-fi contido** — preciso e técnico, nunca cômico.

O que é / o que não é:

| É | Não é |
|---|---|
| Geométrico, limpo, com profundidade | Cromado, holográfico, "espacial" |
| Cantos arredondados (12px) | Cantos vivos e agressivos |
| Glow sutil só no verde | Neon piscando em tudo |
| Tipografia de display forte | Fonte de filme B sci-fi |
| Grid fino pontual | Grid em toda superfície |

---

## Paleta

> [!info] Cores extraídas dos pixels reais do material de marca do 4K, não estimadas.

### Cores de marca (constantes nos dois modos)

| Token | Hex | Uso |
|---|---|---|
| `--verde-4k` | `#38E358` | **Só ação e acerto.** Botão principal, streak, resposta certa. |
| `--obsidian` | `#0B1215` | Preto do sistema. Texto principal (claro) / fundo (escuro). Nunca `#000`. |

### Roxo (muda entre modos para manter contraste)

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--roxo-4k` | `#600BDA` | `#7F47E0` | Cor de marca. Clareia no escuro pra não sumir sobre obsidian. |
| `--roxo-profundo` | — | `#0E0A16` | Fundos escuros secundários. |

### Superfícies

| Token | Claro | Escuro |
|---|---|---|
| `--bg` | `#F4F1FB` (névoa) | `#0B1215` (obsidian) |
| `--surface` | `#FFFFFF` | `#15101F` |
| `--surface-alt` | `#EDE7F8` | `#241a3d` |
| `--border` | `#E0D8F0` | `#2E2145` |

### Texto

| Token | Claro | Escuro |
|---|---|---|
| `--text-primary` | `#0B1215` | `#FFFFFF` |
| `--text-secondary` | `#8478A8` | `#8B7FB5` |

### Feedback

| Estado | Fundo (claro) | Borda | Texto |
|---|---|---|---|
| Acerto | `#EAFBEF` | `#38E358` | `#0B3D18` |
| Revisar | `#F4F1FB` | `--roxo-4k` | `#3A1785` |

> [!tip] Texto sobre verde
> Em cima do `#38E358`, o texto é sempre o verde escuro `#0B3D18` — nunca preto puro nem branco.

---

## Tipografia

> [!example] Import (Google Fonts)
> ```html
> <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
> ```

| Papel | Fonte | Peso | Regra |
|---|---|---|---|
| Título de impacto | **Anton** | 400 (é black por natureza) | Só caixa alta, frases curtas. Nunca corpo. |
| Título de seção | Inter | 500/600 | Sentence case. |
| Corpo | Inter | 400 | Legível, `line-height: 1.6`. |
| Código / mono | mono do sistema | 400 | Tokens, hex, valores. |

```css
--font-display: 'Anton', sans-serif;
--font-sans: 'Inter', system-ui, sans-serif;
```

> [!warning] Anton cansa em texto longo
> Ela é linda no "SOZINHO NÃO" gigante e ilegível num parágrafo. Se a linha tem mais de ~4 palavras ou não é título, use Inter.

---

## O grid quadriculado

Detalhe de marca herdado do Instagram do 4K. Aplicado nas **superfícies de destaque nos dois temas**, com linha diferente por modo.

```css
/* aplicar no container de destaque (hero, header, card de matéria, tela de quiz) */
background-image:
  linear-gradient(var(--grid-line) 1px, transparent 1px),
  linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
background-size: 24px 24px;

/* --grid-line no modo claro:  #E6CBEF                  (roxo bem claro, quase rosa) */
/* --grid-line no modo escuro: rgba(96, 11, 218, 0.28)  (respira, vira profundidade) */
```

> [!failure] Onde o grid NÃO vai
> Card branco de conteúdo, fundo de texto de estudo, telas de leitura longa, formulários. Em dúvida: não põe.

### Card "Mais de 120 aprovados na UnB" (prova social)

**Caixa de feedback "acerto"** — fundo `--acerto-bg`, borda `--acerto-border`, texto `--acerto-text`, check verde — estática, no fluxo normal da seção, **sem grid** (decisão final do cliente em 2026-07-18, após testes com obsidian + grid verde e com selo flutuante).

> [!note] Cores do grid verde (arquivadas)
> As cores de grid verde `#337418` (escuro) / `#5DD62C` (claro) que o cliente mandou guardar estão **sem uso** — preservadas aqui e na memória do projeto caso o selo com grid volte. A regra "verde só em ação e acerto" vale sem exceções.

O card "Maior índice de aprovação na UnB" do método **não é exceção**: é o 6º card da mesma família dos pilares, theme-aware (claro no claro, escuro no escuro), com ícone de troféu no quadrado roxo.

---

## Componentes

### Botões

| Tipo | Fundo | Texto | Borda | Uso |
|---|---|---|---|---|
| Principal | `--verde-4k` | `#0B3D18` | — | Ação central: responder, confirmar. **Um por tela.** |
| Marca | `--roxo-4k` | `#FFF` | — | Ação secundária forte: iniciar simulado. |
| Contorno | transparente | `--roxo-4k` | `1.5px --roxo-4k` | Ação terciária: ver depois. |

Todos: `border-radius: 12px`, `padding: 11–12px`, `font-weight: 500`.

### Card de matéria

Superfície escura + grid + ícone em quadrado roxo + barra de progresso verde.

```
[ícone 40px roxo]  Matemática
                   72% de acerto
[▓▓▓▓▓▓▓░░░ barra verde sobre trilho escuro]
```

### Streak diário

Círculo verde com ícone de chama + número grande (Inter 800 ou Anton) + fileira de dias. Dia cumprido = verde, dia atual = roxo, futuro = vazio com borda.

### Feedback de resposta

Acerto → caixa verde clara, borda verde, ícone `ti-circle-check`. Revisar → caixa roxa clara, borda roxa, ícone `ti-arrow-right`.

---

## Alternância de tema

> [!note] Implementação
> Tema controlado por `[data-theme="light|dark"]` no `<html>`. Preferência salva e respeitando `prefers-color-scheme` no primeiro load. Todas as cores via CSS custom properties (nunca hex hardcoded em componente).

O que muda entre os modos:

- **Roxo** clareia de `#600BDA` → `#7F47E0` no escuro (contraste sobre obsidian).
- **Grid** troca de linha: roxo-claro quase rosa (`#E6CBEF`) no claro → roxo a 28% no escuro.
- **Fundo/texto** invertem (obsidian vira fundo no escuro, texto no claro).

O que **não** muda (a assinatura da marca):

- **Verde** `#38E358` idêntico nos dois.
- **Anton** nos títulos nos dois.
- **Cantos** de 12px nos dois.

---

## Checklist antes de commitar tela nova

> [!todo] Verificar
> - [ ] Verde só em ação/acerto? (não vazou pra decoração)
> - [ ] Anton só em título curto caixa alta?
> - [ ] Grid só em superfície de destaque, com a linha certa de cada tema? (roxo-claro-rosado no claro, roxo 28% no escuro)
> - [ ] Sem superfície escura constante nem verde decorativo na landing? (card "120 aprovados" = caixa de acerto, sem grid)
> - [ ] Funciona nos dois modos? (testar claro E escuro)
> - [ ] Zero hex hardcoded? (tudo via CSS var)
> - [ ] Cantos 12px, sem cromado/neon/holograma?
> - [ ] Preto é `#0B1215`, nunca `#000`?

---

## Relacionados

- [[4K Vestibulares]] — visão geral do projeto
- [[schema_fase1]] — banco de dados (o radar de desempenho consome as cores por matéria daqui)

%% Manter este arquivo como fonte única de verdade visual. Mudou uma cor ou regra? Muda AQUI primeiro, depois no código. %%
