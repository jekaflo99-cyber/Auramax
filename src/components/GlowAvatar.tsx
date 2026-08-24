import React from 'react';
import { AuraTier } from '../types';
import { getAuraTier } from '../lib/auraEngine';
import { SHOP_ITEMS } from '../lib/shopData';

interface GlowAvatarProps {
  src: string;
  alt: string;
  aura: number;
  tier?: AuraTier;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showBadge?: boolean;
  showRankRing?: boolean;
  skinId?: string; // Custom equipped Thematic Frame / Skin
  className?: string;
  onClick?: () => void;
}

const sizeConfig = {
  xs: {
    container: 'w-8 h-8',
    framePad: 'p-[1.5px]',
    innerRing: 'p-[1.5px]',
    badge: 'text-[8px] px-1 -bottom-1',
    decor: 'text-[8px] -top-1 -right-1',
  },
  sm: {
    container: 'w-10 h-10',
    framePad: 'p-[2px]',
    innerRing: 'p-[2px]',
    badge: 'text-[9px] px-1.5 -bottom-1.5',
    decor: 'text-[10px] -top-1 -right-1',
  },
  md: {
    container: 'w-14 h-14',
    framePad: 'p-[2.5px]',
    innerRing: 'p-[2px]',
    badge: 'text-[10px] px-2 -bottom-2',
    decor: 'text-xs -top-1 -right-1',
  },
  lg: {
    container: 'w-20 h-20',
    framePad: 'p-[3px]',
    innerRing: 'p-[2.5px]',
    badge: 'text-xs px-2.5 py-0.5 -bottom-2.5',
    decor: 'text-sm -top-1.5 -right-1.5',
  },
  xl: {
    container: 'w-28 h-28',
    framePad: 'p-[4px]',
    innerRing: 'p-[3px]',
    badge: 'text-xs font-bold px-3 py-1 -bottom-3',
    decor: 'text-base -top-2 -right-2',
  },
  '2xl': {
    container: 'w-36 h-36',
    framePad: 'p-[5px]',
    innerRing: 'p-[3.5px]',
    badge: 'text-sm font-bold px-4 py-1.5 -bottom-4',
    decor: 'text-lg -top-2.5 -right-2.5',
  }
};

export const GlowAvatar: React.FC<GlowAvatarProps> = ({
  src,
  alt,
  aura,
  tier: propTier,
  size = 'md',
  showBadge = false,
  showRankRing = true,
  skinId,
  className = '',
  onClick
}) => {
  // 1. EARNED RANK TIER (Pure Merit — cannot be bought or faked)
  const tierConfig = propTier ? getAuraTier(propTier === 'cosmic' ? 12000 : propTier === 'god' ? 7000 : propTier === 'rising' ? 2500 : 500) : getAuraTier(aura);
  const cfg = sizeConfig[size];

  // 2. THEMATIC COSMETIC FRAME (Style / Personality bought from Shop)
  const customFrame = skinId ? SHOP_ITEMS.find(item => item.id === skinId) : null;

  const isCosmic = tierConfig.id === 'cosmic';

  // Base rank ring colors (Merit Aura)
  const rankRingGradient = isCosmic
    ? 'cosmic-ring'
    : tierConfig.id === 'god'
    ? 'bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-400'
    : tierConfig.id === 'rising'
    ? 'bg-gradient-to-tr from-cyan-600 via-sky-400 to-blue-500'
    : 'bg-zinc-700';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${cfg.container} ${onClick ? 'cursor-pointer transition-transform hover:scale-105 active:scale-95' : ''} ${className}`}
    >
      {/* Layer 1: Core Rank Aura Glow (Merit) */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-700 ${tierConfig.glowClass} ${
          isCosmic ? 'cosmic-ring opacity-80' : ''
        }`}
      />

      {/* Layer 2: Thematic Frame Aura FX (If equipped from Shop) */}
      {customFrame?.glowClass && (
        <div
          className={`absolute -inset-1 rounded-full pointer-events-none transition-all duration-500 ${customFrame.glowClass}`}
        />
      )}

      {/* Layer 3: Outer Thematic Frame Container */}
      <div
        className={`relative w-full h-full rounded-full transition-all duration-500 flex items-center justify-center ${
          customFrame?.customRingStyle ? customFrame.customRingStyle : cfg.framePad
        }`}
      >
        {/* Layer 4: Inner Rank Halo (Guarantees the true Earned Rank color is always visible!) */}
        <div
          className={`w-full h-full rounded-full ${cfg.innerRing} flex items-center justify-center transition-all ${
            showRankRing ? rankRingGradient : 'bg-transparent'
          }`}
        >
          {/* Layer 5: Avatar Image */}
          <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 flex items-center justify-center">
            <img
              src={src}
              alt={alt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=18181b&color=ffffff`;
              }}
            />
          </div>
        </div>
      </div>

      {/* Thematic Frame Mini Decoration (e.g. 🔥, ⚡, ❄️, ⚔️) */}
      {customFrame?.frameDecoration && size !== 'xs' && (
        <span
          className={`absolute ${cfg.decor} pointer-events-none z-20 drop-shadow-md select-none animate-bounce`}
          style={{ animationDuration: '2.5s' }}
        >
          {customFrame.frameDecoration}
        </span>
      )}

      {/* Official Earned Rank Tier Badge */}
      {showBadge && (
        <span
          className={`absolute ${cfg.badge} rounded-full font-mono uppercase tracking-wider shadow-lg border whitespace-nowrap z-20 ${tierConfig.badgeBg}`}
        >
          {tierConfig.id}
        </span>
      )}
    </div>
  );
};
