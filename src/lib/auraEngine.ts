import confetti from 'canvas-confetti';
import { AuraTier, AuraTierConfig } from '../types';

export const AURA_TIERS: Record<AuraTier, AuraTierConfig> = {
  npc: {
    id: 'npc',
    name: 'Cinzento / NPC',
    minAura: 0,
    maxAura: 999,
    color: '#71717a',
    glowClass: 'glow-npc',
    borderClass: 'border-zinc-500/40 ring-zinc-500/20',
    badgeBg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    badgeText: 'text-zinc-400',
    description: 'Sem presença social ou disciplina notável. Farmar é urgente.',
    title: 'Iniciante / NPC'
  },
  rising: {
    id: 'rising',
    name: 'Azul / Sigma Blue',
    minAura: 1000,
    maxAura: 4999,
    color: '#06b6d4',
    glowClass: 'glow-rising',
    borderClass: 'border-cyan-400 ring-cyan-400/40',
    badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50',
    badgeText: 'text-cyan-400',
    description: 'Consistência provada. A tua aura começa a irradiar respeito.',
    title: 'Sigma Rising'
  },
  god: {
    id: 'god',
    name: 'Dourado / Gold Sovereign',
    minAura: 5000,
    maxAura: 9999,
    color: '#f59e0b',
    glowClass: 'glow-god',
    borderClass: 'border-amber-400 ring-amber-400/50',
    badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
    badgeText: 'text-amber-400',
    description: 'Nível lendário. Disciplina inabalável e alto status social.',
    title: 'Aura Sovereign'
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cósmico / Celestial White',
    minAura: 10000,
    maxAura: 999999,
    color: '#ffffff',
    glowClass: 'glow-cosmic',
    borderClass: 'border-white ring-purple-400/60',
    badgeBg: 'bg-gradient-to-r from-purple-950/90 via-pink-950/90 to-cyan-950/90 text-white border-pink-400/60',
    badgeText: 'text-white',
    description: 'Status transcendente. Presença magnética inquestionável.',
    title: 'Cosmic Overlord'
  }
};

export function getAuraTier(aura: number): AuraTierConfig {
  if (aura >= 10000) return AURA_TIERS.cosmic;
  if (aura >= 5000) return AURA_TIERS.god;
  if (aura >= 1000) return AURA_TIERS.rising;
  return AURA_TIERS.npc;
}

export function getNextTierProgress(aura: number): {
  currentTier: AuraTierConfig;
  nextTier: AuraTierConfig | null;
  progressPercent: number;
  remaining: number;
} {
  const currentTier = getAuraTier(aura);

  if (currentTier.id === 'cosmic') {
    return {
      currentTier,
      nextTier: null,
      progressPercent: 100,
      remaining: 0
    };
  }

  let nextTierKey: AuraTier = 'rising';
  if (currentTier.id === 'npc') nextTierKey = 'rising';
  else if (currentTier.id === 'rising') nextTierKey = 'god';
  else if (currentTier.id === 'god') nextTierKey = 'cosmic';

  const nextTier = AURA_TIERS[nextTierKey];
  const range = nextTier.minAura - currentTier.minAura;
  const currentInRange = Math.max(0, aura - currentTier.minAura);
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));
  const remaining = Math.max(0, nextTier.minAura - aura);

  return {
    currentTier,
    nextTier,
    progressPercent,
    remaining
  };
}

export function formatAura(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 10000) {
    return (value / 1000).toFixed(1) + 'k';
  }
  return value.toLocaleString('pt-PT');
}

// Web Audio API Synthesizer for instant tactile sound effects
class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playAuraGain() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.3); // E6

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio fallback gracefully ignored if blocked by browser policy
    }
  }

  playAuraLoss() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  }

  playHabitComplete() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        
        gain.gain.setValueAtTime(0.1, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.25);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundEffects = new SoundEngine();

export function triggerConfettiBurst(tier?: AuraTier) {
  let colors = ['#06b6d4', '#3b82f6', '#10b981'];
  if (tier === 'god') colors = ['#f59e0b', '#fbbf24', '#d97706', '#ffffff'];
  if (tier === 'cosmic') colors = ['#ec4899', '#8b5cf6', '#06b6d4', '#ffffff', '#fbbf24'];

  confetti({
    particleCount: 45,
    spread: 60,
    origin: { y: 0.75 },
    colors
  });
}
