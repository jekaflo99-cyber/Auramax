import React from 'react';
import { Sparkles, Flame, Zap } from 'lucide-react';
import { formatAura, getAuraTier } from '../lib/auraEngine';

interface AuraBadgeProps {
  aura: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  prefix?: string;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const AuraBadge: React.FC<AuraBadgeProps> = ({
  aura,
  size = 'md',
  showIcon = true,
  prefix = '',
  className = '',
  interactive = false,
  onClick
}) => {
  const tier = getAuraTier(aura);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2 font-bold'
  };

  const getIcon = () => {
    if (tier.id === 'cosmic') return <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-spin" style={{ animationDuration: '4s' }} />;
    if (tier.id === 'god') return <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />;
    if (tier.id === 'rising') return <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />;
    return <span className="text-zinc-400 text-xs">⚡</span>;
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center rounded-full font-mono font-bold tracking-tight border transition-all ${tier.badgeBg} ${sizeClasses[size]} ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
    >
      {showIcon && getIcon()}
      <span>
        {prefix}
        {formatAura(aura)} <span className="font-sans text-[10px] uppercase font-semibold opacity-80">AURA</span>
      </span>
    </div>
  );
};
