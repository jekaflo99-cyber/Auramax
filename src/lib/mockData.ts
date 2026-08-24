import { Habit, Post, User, AuraLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_alex',
    username: 'alex_sigma',
    displayName: 'Alex Rivers',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: '⚡ Disciplina > Motivação. Em busca dos 10k Aura Cósmico.',
    aura: 6420,
    tier: 'god',
    dailyAuraEarned: 450,
    socialAuraEarned: 3970,
    disciplineAuraEarned: 2450,
    streak: 14,
    lastActiveDate: new Date().toISOString(),
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'user_auragod',
    username: 'auragod_99',
    displayName: 'Kenji Takahashi',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: '🌌 Nível Cósmico desbloqueado. 450 dias de streak ininterruptos.',
    aura: 15420,
    tier: 'cosmic',
    dailyAuraEarned: 820,
    socialAuraEarned: 9620,
    disciplineAuraEarned: 5800,
    streak: 45,
    lastActiveDate: new Date().toISOString(),
    createdAt: '2025-11-01T08:00:00Z'
  },
  {
    id: 'user_valkyrie',
    username: 'valkyrie_fit',
    displayName: 'Helena Costa',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    bio: '👑 Powerlifter & Empreendedora. A tua aura é o teu maior ativo.',
    aura: 11850,
    tier: 'cosmic',
    dailyAuraEarned: 600,
    socialAuraEarned: 7450,
    disciplineAuraEarned: 4400,
    streak: 28,
    lastActiveDate: new Date().toISOString(),
    createdAt: '2025-12-15T12:00:00Z'
  },
  {
    id: 'user_kai',
    username: 'kai_zen',
    displayName: 'Kai Nakamura',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bio: '🎯 Deep Work + Boxe. Subindo de rank todos os dias.',
    aura: 3850,
    tier: 'rising',
    dailyAuraEarned: 320,
    socialAuraEarned: 2150,
    disciplineAuraEarned: 1700,
    streak: 7,
    lastActiveDate: new Date().toISOString(),
    createdAt: '2026-02-01T14:00:00Z'
  },
  {
    id: 'user_npc',
    username: 'pedro_npc',
    displayName: 'Pedro Santos',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    bio: '💀 A recuperar a aura perdida depois de dormir 14 horas seguidas.',
    aura: 580,
    tier: 'npc',
    dailyAuraEarned: 50,
    socialAuraEarned: 280,
    disciplineAuraEarned: 300,
    streak: 2,
    lastActiveDate: new Date().toISOString(),
    createdAt: '2026-02-18T09:00:00Z'
  }
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit_1',
    userId: 'user_alex',
    title: 'Treino de Força no Ginásio',
    category: 'fitness',
    icon: 'Dumbbell',
    auraReward: 200,
    completedDates: [new Date().toISOString().split('T')[0]],
    streak: 14,
    description: '1h de treino focado com sobrecarga progressiva'
  },
  {
    id: 'habit_2',
    userId: 'user_alex',
    title: 'Leitura de 25 páginas',
    category: 'mind',
    icon: 'BookOpen',
    auraReward: 120,
    completedDates: [new Date().toISOString().split('T')[0]],
    streak: 8,
    description: 'Livros de alta densidade (não ficção / filosofia / finanças)'
  },
  {
    id: 'habit_3',
    userId: 'user_alex',
    title: 'Acordar às 06:00 Sem Soneca',
    category: 'routine',
    icon: 'AlarmClock',
    auraReward: 150,
    completedDates: [new Date().toISOString().split('T')[0]],
    streak: 12,
    description: 'Levantar no primeiro alarme, luz natural imediata'
  },
  {
    id: 'habit_4',
    userId: 'user_alex',
    title: 'Banho Gelado de 3 minutos',
    category: 'fitness',
    icon: 'Droplets',
    auraReward: 100,
    completedDates: [],
    streak: 5,
    description: 'Choque térmico para foco e dopamina basal'
  },
  {
    id: 'habit_5',
    userId: 'user_alex',
    title: 'Sessão de Deep Work (90 min)',
    category: 'productivity',
    icon: 'Zap',
    auraReward: 180,
    completedDates: [],
    streak: 9,
    description: 'Sem notificações, foco total no projeto principal'
  },
  {
    id: 'habit_6',
    userId: 'user_alex',
    title: '3L de Água & Zero Junk Food',
    category: 'diet',
    icon: 'Apple',
    auraReward: 100,
    completedDates: [],
    streak: 11,
    description: 'Hidratação constante e refeições limpas'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_video_1',
    userId: 'user_alex',
    author: {
      id: 'user_alex',
      username: 'alex_sigma',
      displayName: 'Alex Rivers',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      aura: 6420,
      tier: 'god'
    },
    caption: '⚡ Treino de alta intensidade (HIIT & Calistenia). 8 segundos de foco absoluto sem desistir. + Aura ou - Aura? 🗿🔥',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    mediaType: 'video',
    videoDuration: 8.0,
    tags: ['#GymSigma', '#VideoMoment', '#AuraGain', '#Focus'],
    auraGain: 2150,
    plusVotes: 168,
    minusVotes: 7,
    userVote: null,
    createdAt: '2026-08-23T15:00:00Z',
    commentsCount: 34
  },
  {
    id: 'post_1',
    userId: 'user_valkyrie',
    author: {
      id: 'user_valkyrie',
      username: 'valkyrie_fit',
      displayName: 'Helena Costa',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      aura: 11850,
      tier: 'cosmic'
    },
    caption: 'Novo Recorde Pessoal: 180kg Deadlift com técnica limpa. Nenhum treino é desperdiçado quando o foco é absoluto. + Aura ou - Aura? 🗿🔥',
    mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    tags: ['#GymSigma', '#DeadliftPR', '#AuraGain', '#Disciplina'],
    auraGain: 1850,
    plusVotes: 142,
    minusVotes: 5,
    userVote: null,
    createdAt: '2026-08-23T12:30:00Z',
    commentsCount: 28
  },
  {
    id: 'post_2',
    userId: 'user_auragod',
    author: {
      id: 'user_auragod',
      username: 'auragod_99',
      displayName: 'Kenji Takahashi',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      aura: 15420,
      tier: 'cosmic'
    },
    caption: '05:30 da manhã. A cidade ainda dorme, mas o código e o treino já estão concluídos. Farmar aura enquanto outros procrastinam é a única regra. 🌌',
    mediaUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    tags: ['#5AMClub', '#CosmicAura', '#DeepWork', '#Grind'],
    auraGain: 2640,
    plusVotes: 210,
    minusVotes: 12,
    userVote: null,
    createdAt: '2026-08-23T08:15:00Z',
    commentsCount: 45
  },
  {
    id: 'post_3',
    userId: 'user_npc',
    author: {
      id: 'user_npc',
      username: 'pedro_npc',
      displayName: 'Pedro Santos',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
      aura: 580,
      tier: 'npc'
    },
    caption: 'Tropecei na passadeira do ginásio a tentar olhar para o relógio e voei 2 metros à frente de toda a gente... Quantos pontos de aura perdi hoje? 💀📉',
    mediaUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    tags: ['#AuraLoss', '#Fails', '#GymFail', '#NPCMoment'],
    auraGain: -420,
    plusVotes: 35,
    minusVotes: 88,
    userVote: null,
    createdAt: '2026-08-23T14:10:00Z',
    commentsCount: 62
  },
  {
    id: 'post_4',
    userId: 'user_kai',
    author: {
      id: 'user_kai',
      username: 'kai_zen',
      displayName: 'Kai Nakamura',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      aura: 3850,
      tier: 'rising'
    },
    caption: '12 rounds de sparring concluídos. Rosto intacto, mente afiada. Rumo aos 5,000 de Aura Dourada. 🥊⚡',
    mediaUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    tags: ['#Boxing', '#AuraFarm', '#SigmaBlue', '#Focus'],
    auraGain: 1120,
    plusVotes: 98,
    minusVotes: 4,
    userVote: null,
    createdAt: '2026-08-23T10:45:00Z',
    commentsCount: 19
  }
];

export const INITIAL_LOGS: AuraLog[] = [
  {
    id: 'log_1',
    userId: 'user_alex',
    amount: 200,
    source: 'habit',
    description: 'Completou: Treino de Força no Ginásio',
    timestamp: '2026-08-23T11:00:00Z'
  },
  {
    id: 'log_2',
    userId: 'user_alex',
    amount: 150,
    source: 'habit',
    description: 'Completou: Acordar às 06:00 Sem Soneca',
    timestamp: '2026-08-23T06:05:00Z'
  },
  {
    id: 'log_3',
    userId: 'user_alex',
    amount: 120,
    source: 'habit',
    description: 'Completou: Leitura de 25 páginas',
    timestamp: '2026-08-23T07:30:00Z'
  },
  {
    id: 'log_4',
    userId: 'user_alex',
    amount: 100,
    source: 'post_vote_received',
    description: 'Voto +Aura recebido no post #GymSigma',
    timestamp: '2026-08-23T13:20:00Z'
  }
];
