# ⚡ AuraMax — Documentação Técnica da Aplicação

> **AuraMax** é uma aplicação web progressiva de fitness, disciplina e gamificação anime de alta performance, equipada com um estúdio de câmara alimentado por **IA de Segmentação em Tempo Real (MediaPipe Tasks-Vision)** e um motor de **Shaders de GPU em WebGL (SDF + Ridged Multifractal Noise)** para projetar a verdadeira aura Super Saiyan / Bleach atrás da silhueta do utilizador.

---

## 📑 Índice
1. [Visão Geral e Arquitetura](#-visão-geral-e-arquitetura)
2. [Estrutura de Ficheiros do Projeto](#-estrutura-de-ficheiros-do-projeto)
3. [Explicação Detalhada de Cada Ficheiro](#-explicação-detalhada-de-cada-ficheiro)
   - [Raiz e Configurações](#1-raiz-e-configurações)
   - [Contexto e Estado Global (`/src/context`)](#2-contexto-e-estado-global-srccontext)
   - [Motor de Shaders e Efeitos (`/src/utils`)](#3-motor-de-shaders-e-efeitos-srcutils)
   - [Lógica de Negócio e Dados (`/src/lib`)](#4-lógica-de-negócio-e-dados-srclib)
   - [Componentes da Interface (`/src/components`)](#5-componentes-da-interface-srccomponents)
   - [Tipagem TypeScript (`/src/types.ts`)](#6-tipagem-typescript-srctypests)
4. [Como Funciona o Motor de Aura Anime por GPU](#-como-funciona-o-motor-de-aura-anime-por-gpu)
5. [Scripts e Comandos de Execução](#-scripts-e-comandos-de-execução)

---

## 🌟 Visão Geral e Arquitetura

O AuraMax combina a motivação do treino diário com a estética imersiva do universo anime (*Dragon Ball Z*, *Dragon Ball Super*, *Bleach*, *Berserk*). A aplicação é dividida em 5 pilares funcionais:

1. **Aura Studio Camera (WebGL + MediaPipe):** Segmentação corporal por IA (WASM) associada a um pipeline de fragment shaders com SDF de 16 taps e ruído ridged para recriar as chamas de Ki, raios SSJ2 e rim light colados à silhueta, gravando clipes sincronizados de 8 segundos com áudio a 30 FPS.
2. **Feed Social & Provas de Treino:** Publicação de vídeos de treino com cálculo dinâmico de Aura Points (AP), níveis de poder (Power Level) e streaks.
3. **Módulo de Disciplina:** Gestor de hábitos diários de treino, nutrição e sono, concedendo bónus de consistência e subida de nível.
4. **Loja de Auras & Cosméticos:** Desbloqueio e compra de auras (Super Saiyan 2, Ultra Instinct, SSJ Blue, Getsuga Tenshō, Bankai Reiatsu, Berserk Rage) usando pontos obtidos na disciplina.
5. **Tabela de Classificação (Leaderboard):** Ranking global em tempo real dividido por Ligas e Escalões de Ki.

---

## 📂 Estrutura de Ficheiros do Projeto

```text
├── index.html                           # Ponto de entrada HTML + CDN scripts (MediaPipe, Fontes)
├── metadata.json                        # Metadados e permissões da aplicação no AI Studio
├── package.json                         # Dependências npm e scripts de build/dev
├── tsconfig.json                        # Configuração do compilador TypeScript
├── tsconfig.node.json                   # Configuração TypeScript para o ambiente Vite/Node
├── vite.config.ts                       # Configuração do Vite + Plugin Tailwind CSS
│
└── src/
    ├── main.tsx                         # Bootstrap da aplicação React
    ├── App.tsx                          # Orquestrador principal das vistas e navegação
    ├── index.css                        # Estilos globais e importação do Tailwind CSS
    ├── types.ts                         # Interfaces, tipos globais e enums TypeScript
    │
    ├── context/
    │   └── AuraContext.tsx              # Estado global (Utilizador, Posts, Disciplina, Moedas, Auras)
    │
    ├── utils/
    │   └── animeShaders.ts              # Shaders WebGL (Vertex & Fragment) para o efeito de Ki
    │
    ├── lib/
    │   ├── auraEngine.ts                # Motor de cálculo de Níveis de Poder, AP e Auras
    │   ├── mockData.ts                  # Posts iniciais, utilizadores e dados de demonstração
    │   └── shopData.ts                  # Catálogo de auras desbloqueáveis e itens da loja
    │
    └── components/
        ├── AnimeAuraCameraStudio.tsx    # Estúdio de câmara em direto com GPU shaders e gravação 8s
        ├── Navbar.tsx                   # Barra superior com estatísticas (Streak, AP, Nível, Moedas)
        ├── BottomNav.tsx                # Barra de navegação móvel rápida (Feed, Disciplina, Loja, etc.)
        ├── FeedView.tsx                 # Feed social interativo com reprodução de vídeos e comentários
        ├── DisciplineView.tsx           # Gestor de disciplina, rotinas diárias e hábitos de treino
        ├── ShopView.tsx                 # Loja de personalização e desbloqueio de auras
        ├── LeaderboardView.tsx          # Ranking competitivo de guerreiros por Power Level
        ├── ProfileView.tsx              # Perfil do utilizador com histórico, medalhas e estatísticas
        ├── CreatePostModal.tsx          # Modal de criação de publicações (vídeo, texto, aura selecionada)
        ├── DatabaseArchitectureModal.tsx# Visualizador da arquitetura de dados e persistência
        ├── AuraBadge.tsx                # Badge estilizado indicativo do nível de aura do utilizador
        ├── GlowAvatar.tsx               # Avatar com efeito de brilho e pulso de Ki animado
        └── FloatingAuraLayer.tsx        # Camada de partículas flutuantes decorativas na interface
```

---

## 🔍 Explicação Detalhada de Cada Ficheiro

### 1. Raiz e Configurações

* **`index.html`**
  * Define a estrutura base do documento, metatags de viewport para dispositivos móveis e carrega as bibliotecas externas necessárias (como o script de IA do `@mediapipe/selfie_segmentation`).
* **`metadata.json`**
  * Configura o nome da aplicação, descrição e permissões de hardware solicitadas ao navegador (`camera`, `microphone`).
* **`package.json`**
  * Regista as dependências do ecossistema React 19, Tailwind CSS v4, Lucide React (ícones), Canvas Confetti e bibliotecas de animação (`motion`), além dos scripts de compilação (`dev`, `build`, `lint`).
* **`vite.config.ts`**
  * Configura o servidor de desenvolvimento na porta `3000` (host `0.0.0.0`) e integra o plugin `@tailwindcss/vite`.
* **`src/main.tsx`**
  * Ponto de entrada do React que monta a árvore de componentes no elemento `#root` envolta pelo `AuraProvider`.
* **`src/index.css`**
  * Folha de estilo global que importa o Tailwind CSS através da diretiva `@import "tailwindcss";` e define estilos base para scrollbars e temas escuros.

---

### 2. Contexto e Estado Global (`/src/context`)

* **`src/context/AuraContext.tsx`**
  * Cria e gere o `AuraContext`, permitindo o acesso e manipulação do estado em toda a aplicação sem *prop drilling*.
  * **Responsabilidades:**
    * Gestão do utilizador autenticado (Aura Points, Moedas de Treino, Streak, Nível de Poder, Aura Equipada).
    * Gestão da lista de publicações no feed (adicionar posts, dar likes com efeito Ki, comentar).
    * Gestão dos hábitos de disciplina (marcar tarefas de treino como concluídas, adicionar novas metas diárias).
    * Compra e equipagem de auras no inventário.
    * Persistência automática no `localStorage` do browser.

---

### 3. Motor de Shaders e Efeitos (`/src/utils`)

* **`src/utils/animeShaders.ts`**
  * Contém o código GLSL do **Vertex Shader** e do **Fragment Shader** de alta performance executados na GPU via WebGL.
  * **Componentes Chave do Shader:**
    * **Amostragem Radial SDF (16 Taps):** Cria um campo de distância assinado aproximado em torno da máscara humana gerada pela IA, determinando a distância exata $d$ de cada píxel em relação à borda do corpo.
    * **Pintura Exclusiva de Fundo ($d > 0$):** Garante que as chamas se propagam **atrás** do utilizador, preservando a pessoa 100% nítida em primeiro plano.
    * **Ruído Ridged Multifractal (`ridgedFbm`):** Inverte o ruído de Simplex ($1.0 - |\text{noise}|$) e eleva-o ao quadrado para esculpir os picos pontiagudos e dentes de fogo espetados fiéis ao estilo de animação de *Dragon Ball Z*.
    * **Gradiente Incandescente:** Transição suave entre o núcleo branco-quente na borda do corpo $\to$ cor pura saturada (dourado/ciano/púrpura) $\to$ âmbar alaranjado na ponta das cristas.
    * **Relâmpagos SSJ2:** Ruído de alta frequência com threshold estreito que gera estalos elétricos com núcleo branco e halo lilás (`#a78bfa`).
    * **Rim Light:** Luz de contorno subtil no contorno interno do corpo.
    * **Modulação Determinística de Tempo (`u_time`):** Deslocamento ascendente contínuo que elimina tremores aleatórios (*anti-flicker*).

---

### 4. Lógica de Negócio e Dados (`/src/lib`)

* **`src/lib/auraEngine.ts`**
  * Contém a lógica matemática de progressão:
    * Cálculo de Nível e Título do Guerreiro a partir do total de Aura Points (ex: *Recruta de Ki*, *Guerreiro Z*, *Super Saiyan*, *Deus da Destruição*).
    * Fórmulas de cálculo de bónus de consistência diária e multiplicadores de streak.
* **`src/lib/mockData.ts`**
  * Conjunto inicial de dados para demonstração: publicações no feed com contagens de likes, comentários e exemplos de guerreiros para o Leaderboard.
* **`src/lib/shopData.ts`**
  * Catálogo de itens da loja, definindo os requisitos de compra, preços em moedas de treino e raridades de cada aura cosmética.

---

### 5. Componentes da Interface (`/src/components`)

* **`src/components/AnimeAuraCameraStudio.tsx`**
  * **O coração do estúdio de vídeo:**
    * Inicializa a câmara e o modelo de IA do MediaPipe (`SelfieSegmentation`).
    * Configura o contexto WebGL e desenha o fluxo de vídeo da câmara e a máscara da IA em texturas de GPU em tempo real a 60 FPS.
    * Permite alternar entre os filtros de aura (*Super Saiyan 2*, *Ultra Instinct*, *SSJ Blue*, *Getsuga Tenshō*, *Bankai*, *Berserk*).
    * Fornece controlos de ajuste em tempo real de **Intensidade do Ki** (30% a 100%) e **Extensão das Chamas** (15px a 60px).
    * Inclui o gravador com contagem decrescente sincronizada de **8 segundos** via `canvas.captureStream()` e `MediaRecorder` (com áudio do microfone incluído e reinício do `uTime` em `0.0s`).
* **`src/components/Navbar.tsx`**
  * Barra de topo que apresenta a identificação do utilizador, streak de dias seguidos de treino, moedas acumuladas e nível atual.
* **`src/components/BottomNav.tsx`**
  * Navegação inferior responsiva com ícones para alternar instantaneamente entre o Feed, Disciplina, Câmara de Ki, Loja e Perfil.
* **`src/components/FeedView.tsx`**
  * Ecrã principal de comunidade: lista de publicações dos atletas, suporte a reprodução de vídeo com controlos, reações de Ki e secção de comentários.
* **`src/components/DisciplineView.tsx`**
  * Ecrã de produtividade e treino: lista de tarefas diárias com caixas de seleção, barra de progresso diário e botão para adicionar novos hábitos com atribuição de pontos.
* **`src/components/ShopView.tsx`**
  * Montra de auras: pré-visualização dos efeitos, verificação de saldo e botão para desbloquear e equipar novas auras.
* **`src/components/LeaderboardView.tsx`**
  * Tabela de classificação com pódio para os 3 melhores guerreiros e listagem detalhada de pontuações e ligas.
* **`src/components/ProfileView.tsx`**
  * Painel de perfil pessoal com resumo de conquistas, estatísticas de treino, galeria de vídeos gravados e distintivos de honra.
* **`src/components/CreatePostModal.tsx`**
  * Modal para redigir uma nova publicação no feed, anexando o vídeo gravado no estúdio de câmara e selecionando a aura utilizada.
* **`src/components/DatabaseArchitectureModal.tsx`**
  * Modal informativo com o diagrama da arquitetura de dados e entidades do sistema.
* **`src/components/AuraBadge.tsx`**
  * Componente atómico para renderizar a etiqueta temática da aura do utilizador com as cores correspondentes.
* **`src/components/GlowAvatar.tsx`**
  * Componente de avatar com auréola de brilho reativa ao nível de poder do guerreiro.
* **`src/components/FloatingAuraLayer.tsx`**
  * Camada visual de partículas subtis em segundo plano para reforçar o ambiente anime da aplicação.

---

### 6. Tipagem TypeScript (`/src/types.ts`)

* **`src/types.ts`**
  * Centraliza todas as interfaces e definições de tipos da aplicação:
    * `UserProfile`: Dados do utilizador (AP, moedas, aura equipada, streak, bio).
    * `Post`: Estrutura das publicações do feed (autor, mídia, aura, likes, comentários, timestamp).
    * `DisciplineTask`: Estrutura dos hábitos diários de treino.
    * `ShopItem`: Estrutura dos itens cosméticos da loja.
    * `Comment`: Estrutura das interações nos posts.

---

## ⚡ Como Funciona o Motor de Aura Anime por GPU

```text
[Câmara Web / Telemóvel] ──> [Textura WebGL 0 (u_image)]
                                      │
[MediaPipe IA Segmentation] ──> [Textura WebGL 1 (u_mask)]
                                      │
                                      ▼
                        [Fragment Shader (GLSL)]
    ┌─────────────────────────────────────────────────────────────┐
    │ 1. Amostragem Radial SDF 16-Taps ──> Distância à borda (d)  │
    │ 2. Máscara Exclusiva Externa (d > 0)                        │
    │ 3. Ruído Ridged Multifractal ──> Picos de Chama Pontiagudos │
    │ 4. Gradiente Incandescente: Branco -> Dourado -> Âmbar      │
    │ 5. Streaks de Raios Elétricos SSJ2 (Núcleo Branco + Lilás)  │
    │ 6. Rim Light na Borda Interior da Pessoa                    │
    │ 7. Mistura Aditiva: Fundo Aura + Vídeo Nítido em Frente     │
    └─────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                       [Ecrã / Gravação de 8s (30 FPS)]
```

---

## 🚀 Scripts e Comandos de Execução

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento na porta `3000` |
| `npm run build` | Compila o projeto TypeScript e gera o bundle de produção otimizado na pasta `dist/` |
| `npm run lint` | Executa a validação estática de tipos com o compilador TypeScript (`tsc --noEmit`) |
| `npm run preview` | Executa a pré-visualização local dos ficheiros compilados de produção |
