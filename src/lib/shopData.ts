import { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
  // 1. THEMATIC COSMETIC FRAMES (Completely distinct from earned Rank Auras!)
  {
    id: 'frame_hellfire',
    name: 'Hellfire Crimson (Chamas Carmesim)',
    category: 'thematic_frame',
    description: 'Moldura animada de brasas ardentes e labaredas carmesim com efeito flicker de chamas de anime.',
    priceCoins: 500,
    realPriceEur: '€2.99',
    icon: 'Flame',
    rarity: 'epic',
    themeType: 'hellfire',
    glowClass: 'theme-frame-hellfire shadow-[0_0_35px_rgba(239,68,68,0.85)] ring-red-500',
    customRingStyle: 'bg-gradient-to-tr from-red-700 via-orange-500 to-amber-400 p-[3px]',
    frameDecoration: '🔥',
    previewColor: '#ef4444',
    isPopular: true
  },
  {
    id: 'frame_cyber_glitch',
    name: 'Cyberpunk HUD 2077 (Glitch Matrix)',
    category: 'thematic_frame',
    description: 'Moldura cibernética com cantos cortados estilo display militar, código esmeralda e pulso digital.',
    priceCoins: 450,
    realPriceEur: '€2.49',
    icon: 'Zap',
    rarity: 'rare',
    themeType: 'cyberpunk',
    glowClass: 'theme-frame-cyber shadow-[0_0_30px_rgba(34,197,94,0.8)] ring-emerald-400',
    customRingStyle: 'bg-gradient-to-tr from-emerald-600 via-teal-400 to-cyan-500 p-[3px]',
    frameDecoration: '⚡',
    previewColor: '#22c55e'
  },
  {
    id: 'frame_glacial_frost',
    name: 'Glacial Absolute Zero (Gelo Polar)',
    category: 'thematic_frame',
    description: 'Moldura de estilhaços de gelo ártico com reflexos ciano de cristal de diamante e névoa gelada.',
    priceCoins: 400,
    realPriceEur: '€2.49',
    icon: 'Sparkles',
    rarity: 'rare',
    themeType: 'glacial',
    glowClass: 'theme-frame-glacial shadow-[0_0_30px_rgba(56,189,248,0.8)] ring-sky-300',
    customRingStyle: 'bg-gradient-to-tr from-sky-600 via-cyan-300 to-blue-400 p-[3px]',
    frameDecoration: '❄️',
    previewColor: '#38bdf8'
  },
  {
    id: 'frame_abyssal_void',
    name: 'Abyssal Dark Matter (Matéria Escura)',
    category: 'thematic_frame',
    description: 'Vórtice gravitacional de matéria escura com névoa violeta profunda e pulso de singularidade.',
    priceCoins: 600,
    realPriceEur: '€3.49',
    icon: 'Eye',
    rarity: 'epic',
    themeType: 'abyssal',
    glowClass: 'shadow-[0_0_35px_rgba(168,85,247,0.8)] ring-purple-600',
    customRingStyle: 'bg-gradient-to-tr from-purple-950 via-violet-600 to-black p-[3px]',
    frameDecoration: '🔮',
    previewColor: '#9333ea',
    isPopular: true
  },
  {
    id: 'frame_carbon_spec',
    name: 'Carbon Weave Spec-R (Fibra de Carbono)',
    category: 'thematic_frame',
    description: 'Textura de fibra de carbono aeroespacial cinza acetinada de alta resistência para amantes de ginásio e engenharia.',
    priceCoins: 350,
    realPriceEur: '€1.99',
    icon: 'Shield',
    rarity: 'rare',
    themeType: 'carbon',
    glowClass: 'shadow-[0_0_20px_rgba(255,255,255,0.25)] ring-zinc-400',
    customRingStyle: 'bg-gradient-to-tr from-zinc-900 via-neutral-600 to-zinc-800 p-[3px]',
    frameDecoration: '⚙️',
    previewColor: '#71717a'
  },
  {
    id: 'frame_vaporwave_80s',
    name: 'Synthwave 1984 (Neon Retrowave)',
    category: 'thematic_frame',
    description: 'Borda dupla de neon magenta choque e turquesa com brilho de fita cassete dos anos 80.',
    priceCoins: 550,
    realPriceEur: '€2.99',
    icon: 'Film',
    rarity: 'epic',
    themeType: 'vaporwave',
    glowClass: 'shadow-[0_0_35px_rgba(236,72,153,0.8)] ring-pink-500',
    customRingStyle: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 p-[3px]',
    frameDecoration: '🌴',
    previewColor: '#ec4899'
  },
  {
    id: 'frame_spartan_iron',
    name: 'Spartan Iron Wreath (Ferro Forjado)',
    category: 'thematic_frame',
    description: 'Armadura de ferro de batalha com acabamento forjado a fogo para guerreiros estóicos inabaláveis.',
    priceCoins: 700,
    realPriceEur: '€3.99',
    icon: 'Crown',
    rarity: 'legendary',
    themeType: 'spartan',
    glowClass: 'shadow-[0_0_35px_rgba(245,158,11,0.7)] ring-amber-600',
    customRingStyle: 'bg-gradient-to-tr from-amber-800 via-amber-600 to-zinc-400 p-[3px]',
    frameDecoration: '⚔️',
    previewColor: '#d97706'
  },

  // 2. VIDEO EFFECTS & OVERLAYS (For 8s clips)
  {
    id: 'fx_lightning_burst',
    name: 'Efeito: Lightning Strike de Entrada',
    category: 'video_effect',
    description: 'Dispara relâmpagos dourados no ecrã nos primeiros 1.5s de reprodução do teu clipe de 8s.',
    priceCoins: 350,
    realPriceEur: '€1.99',
    icon: 'Zap',
    rarity: 'rare',
    previewColor: '#eab308',
    isPopular: true
  },
  {
    id: 'fx_vintage_sigma_grain',
    name: 'Filtro: 35mm Grinder Cinema Grain',
    category: 'video_effect',
    description: 'Aparência de filme analógico 35mm com alto contraste e vinheta para vídeos de disciplina.',
    priceCoins: 250,
    realPriceEur: '€1.49',
    icon: 'Film',
    rarity: 'common',
    previewColor: '#71717a'
  },
  {
    id: 'fx_speed_lines',
    name: 'Efeito: Anime Kinetic Speed Lines',
    category: 'video_effect',
    description: 'Linhas cinéticas de foco de alta velocidade ao redor da moldura do teu vídeo.',
    priceCoins: 400,
    realPriceEur: '€2.49',
    icon: 'Sparkles',
    rarity: 'rare',
    previewColor: '#f43f5e'
  },
  {
    id: 'fx_diamond_certified',
    name: 'Selo: 100% Aura Certified Hologram',
    category: 'video_effect',
    description: 'Selo holográfico com emblema de autenticidade no canto superior do teu clipe.',
    priceCoins: 450,
    realPriceEur: '€2.49',
    icon: 'ShieldCheck',
    rarity: 'epic',
    previewColor: '#38bdf8',
    isPopular: true
  },

  // 3. BADGE TITLES & LIFE PHILOSOPHY
  {
    id: 'title_5am_grinder',
    name: 'Título: 5AM CLUB GRINDER',
    category: 'badge_title',
    description: 'Para os guerreiros da rotina matinal e consistência de ferro comprovada.',
    priceCoins: 300,
    realPriceEur: '€1.99',
    icon: 'Award',
    rarity: 'rare',
    badgeTitle: '5AM CLUB GRINDER',
    previewColor: '#38bdf8',
    isPopular: true
  },
  {
    id: 'title_monk_mode',
    name: 'Título: MONK MODE DISCIPLINE',
    category: 'badge_title',
    description: 'Para quem entrou em período de isolamento e hiper-foco extremo.',
    priceCoins: 400,
    realPriceEur: '€2.49',
    icon: 'Shield',
    rarity: 'epic',
    badgeTitle: 'MONK MODE DISCIPLINE',
    previewColor: '#a855f7'
  },
  {
    id: 'title_gym_demon',
    name: 'Título: CALISTHENICS DEMON',
    category: 'badge_title',
    description: 'Dedicado aos atletas de calistenia, força corporal e hipertrofia diária.',
    priceCoins: 350,
    realPriceEur: '€1.99',
    icon: 'Flame',
    rarity: 'rare',
    badgeTitle: 'CALISTHENICS DEMON',
    previewColor: '#ef4444'
  },
  {
    id: 'title_unbreakable',
    name: 'Título: ZERO EXCUSES BEAST',
    category: 'badge_title',
    description: 'Distintivo de resiliência psicológica e física inabalável.',
    priceCoins: 450,
    realPriceEur: '€2.49',
    icon: 'ShieldCheck',
    rarity: 'epic',
    badgeTitle: 'ZERO EXCUSES BEAST',
    previewColor: '#f97316'
  },
  {
    id: 'title_iron_will',
    name: 'Título: UNBOTHERED & ELEVATED',
    category: 'badge_title',
    description: 'Mentalidade inalcançável por opiniões externas ou ruído das redes.',
    priceCoins: 500,
    realPriceEur: '€2.99',
    icon: 'Crown',
    rarity: 'legendary',
    badgeTitle: 'UNBOTHERED & ELEVATED',
    previewColor: '#eab308'
  },

  // 4. STREAK & UTILITY (Proteção de Hábitos)
  {
    id: 'util_streak_freeze_pack',
    name: 'Escudo de Disciplina (x3 Freezes)',
    category: 'streak_utility',
    description: 'Evita perder o teu streak nos hábitos diários caso falhes um dia de treino ou leitura.',
    priceCoins: 200,
    realPriceEur: '€1.29',
    icon: 'ShieldCheck',
    rarity: 'rare',
    previewColor: '#06b6d4',
    isPopular: true
  },
  {
    id: 'util_feed_spotlight_1h',
    name: 'Aura Spotlight (1h Feed Boost)',
    category: 'streak_utility',
    description: 'Coloca o teu clipe de 8s ou foto no topo do feed "Em Alta" durante 60 minutos.',
    priceCoins: 300,
    realPriceEur: '€1.99',
    icon: 'Flame',
    rarity: 'epic',
    previewColor: '#f97316'
  },

  // 5. COIN PACKS (Microtransações Diretas)
  {
    id: 'pack_coins_starter',
    name: 'Saco de 500 Aura Coins',
    category: 'coins_pack',
    description: 'Perfeito para desbloquear a tua primeira moldura temática ou título de prestígio.',
    priceCoins: 500,
    realPriceEur: '€2.99',
    icon: 'Coins',
    rarity: 'common',
    previewColor: '#fbbf24'
  },
  {
    id: 'pack_coins_pro',
    name: 'Baú de 1.500 Aura Coins (+20% Bónus)',
    category: 'coins_pack',
    description: 'O pacote mais popular entre membros ativos para molduras e escudos de streak.',
    priceCoins: 1500,
    realPriceEur: '€7.99',
    icon: 'Coins',
    rarity: 'epic',
    previewColor: '#a855f7',
    isPopular: true
  },
  {
    id: 'pack_coins_overlord',
    name: 'Cofre de 4.000 Aura Coins (+50% Bónus)',
    category: 'coins_pack',
    description: 'Para dominar a presença visual com molduras lendárias e títulos exclusivos.',
    priceCoins: 4000,
    realPriceEur: '€16.99',
    icon: 'Coins',
    rarity: 'legendary',
    previewColor: '#ffffff'
  }
];
