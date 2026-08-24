import React from 'react';
import { Home, Flame, Plus, Trophy, ShoppingBag, User as UserIcon } from 'lucide-react';
import { useAura } from '../context/AuraContext';
import { ViewTab } from '../types';
import { GlowAvatar } from './GlowAvatar';

interface BottomNavProps {
  onOpenCreatePost: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenCreatePost }) => {
  const { currentTab, setCurrentTab, currentUser, inventory } = useAura();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-2xl border-t border-white/10 px-2 sm:px-4 py-2 safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-between relative">
        {/* Tab 1: Feed */}
        <button
          id="tab-btn-feed"
          onClick={() => setCurrentTab('feed')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'feed'
              ? 'text-amber-400'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <div className="relative flex flex-col items-center">
            {currentTab === 'feed' && (
              <div className="w-1 h-1 bg-amber-400 rounded-full mb-1 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            )}
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">
            Feed
          </span>
        </button>

        {/* Tab 2: Disciplina */}
        <button
          id="tab-btn-discipline"
          onClick={() => setCurrentTab('discipline')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'discipline'
              ? 'text-amber-400'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <div className="relative flex flex-col items-center">
            {currentTab === 'discipline' && (
              <div className="w-1 h-1 bg-amber-400 rounded-full mb-1 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            )}
            <Flame className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">
            Disciplina
          </span>
        </button>

        {/* Center: Vibrant Amber Create Post CTA */}
        <button
          id="btn-create-post-cta"
          onClick={onOpenCreatePost}
          className="-mt-7 bg-amber-400 hover:bg-amber-300 text-black w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-black shadow-[0_8px_30px_rgba(251,191,36,0.4)] cursor-pointer active:scale-90 hover:scale-105 transition-all z-10"
          title="Postar Momento de Aura (+/-)"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Tab 3: Shop / Loja de Cosméticos */}
        <button
          id="tab-btn-shop"
          onClick={() => setCurrentTab('shop')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'shop'
              ? 'text-amber-400'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <div className="relative flex flex-col items-center">
            {currentTab === 'shop' && (
              <div className="w-1 h-1 bg-amber-400 rounded-full mb-1 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            )}
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">
            Loja
          </span>
        </button>

        {/* Tab 4: Ranking */}
        <button
          id="tab-btn-leaderboard"
          onClick={() => setCurrentTab('leaderboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'leaderboard'
              ? 'text-amber-400'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <div className="relative flex flex-col items-center">
            {currentTab === 'leaderboard' && (
              <div className="w-1 h-1 bg-amber-400 rounded-full mb-1 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            )}
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">
            Ranking
          </span>
        </button>

        {/* Tab 5: Profile */}
        <button
          id="tab-btn-profile"
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'profile'
              ? 'text-amber-400'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <div className="relative flex flex-col items-center">
            {currentTab === 'profile' && (
              <div className="w-1 h-1 bg-amber-400 rounded-full mb-1 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            )}
            <div className={`p-0.5 rounded-full ${currentTab === 'profile' ? 'ring-2 ring-amber-400' : ''}`}>
              <GlowAvatar
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                aura={currentUser.aura}
                size="xs"
                skinId={inventory.equippedHaloSkinId}
              />
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">
            Perfil
          </span>
        </button>
      </div>
    </div>
  );
};
