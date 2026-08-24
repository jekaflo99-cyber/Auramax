import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Database, Users, ChevronDown, Check, Coins, ShoppingBag } from 'lucide-react';
import { useAura } from '../context/AuraContext';
import { GlowAvatar } from './GlowAvatar';
import { AuraBadge } from './AuraBadge';
import { getAuraTier, formatAura } from '../lib/auraEngine';

interface NavbarProps {
  onOpenArchitecture: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenArchitecture }) => {
  const {
    currentUser,
    allUsers,
    inventory,
    switchUser,
    soundEnabled,
    setSoundEnabled,
    setCurrentTab
  } = useAura();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const tierConfig = getAuraTier(currentUser.aura);

  // Compute rank
  const sortedUsers = [...allUsers].sort((a, b) => b.aura - a.aura);
  const userRank = sortedUsers.findIndex(u => u.id === currentUser.id) + 1;

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/70 backdrop-blur-xl border-b border-white/10 px-3 sm:px-8 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentTab('feed')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl italic text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            A
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic text-white leading-none">
              Aura<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400">Max</span>
            </h1>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-400 font-bold mt-0.5">
              Level Up Your Presence ⚡
            </span>
          </div>
        </div>

        {/* Right Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Aura Coins Quick Link to Shop */}
          <button
            onClick={() => setCurrentTab('shop')}
            title="Abrir Loja de Aura Coins & Cosméticos"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 transition-all font-mono text-xs font-bold active:scale-95"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{inventory.coins.toLocaleString('pt-PT')}</span>
            <span className="hidden sm:inline text-[10px] text-amber-400/80 font-normal">Coins</span>
          </button>

          {/* Global Rank & Total Aura (Vibrant Palette style) */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                Global Rank
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                #{userRank > 0 ? userRank : 42}
              </span>
            </div>

            <div className="h-8 w-[1px] bg-white/10"></div>

            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                Total Aura
              </span>
              <span className="text-base sm:text-lg font-black tracking-tight text-amber-400 font-mono">
                {formatAura(currentUser.aura)}{' '}
                <span className="text-[10px] italic opacity-70 font-sans">pts</span>
              </span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

          {/* Database Architecture Blueprint Button */}
          <button
            id="nav-btn-architecture"
            onClick={onOpenArchitecture}
            title="Ver Arquitetura da Base de Dados & Backend"
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 border border-white/10 transition-all text-xs font-mono"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline font-bold">DB Schema</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="nav-btn-sound"
            onClick={() => setSoundEnabled(prev => !prev)}
            title={soundEnabled ? 'Desativar Sons' : 'Ativar Sons'}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-neutral-900 text-amber-400 border-white/15 hover:bg-neutral-800'
                : 'bg-neutral-900/50 text-neutral-600 border-white/5 hover:text-neutral-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* User Switcher Dropdown */}
          <div className="relative">
            <button
              id="nav-btn-user-switcher"
              onClick={() => setShowUserMenu(prev => !prev)}
              className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 pl-1.5 sm:pl-2 pr-2 sm:pr-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-white/10 transition-all text-left"
            >
              <GlowAvatar
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                aura={currentUser.aura}
                size="xs"
                skinId={inventory.equippedHaloSkinId}
              />
              <div className="hidden lg:flex flex-col text-xs leading-tight">
                <span className="font-bold text-neutral-200 truncate max-w-[100px]">
                  {currentUser.displayName}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {tierConfig.title}
                </span>
              </div>
              <AuraBadge aura={currentUser.aura} size="sm" />
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-white/10 mb-1.5">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      Alternar Utilizador Demo
                    </p>
                  </div>
                  <div className="space-y-1">
                    {allUsers.map((user) => {
                      const isSelected = user.id === currentUser.id;
                      const uTier = getAuraTier(user.aura);
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            switchUser(user.id);
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                            isSelected
                              ? 'bg-amber-400/10 border border-amber-400/30 text-white'
                              : 'hover:bg-neutral-800/60 text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <GlowAvatar
                              src={user.avatarUrl}
                              alt={user.displayName}
                              aura={user.aura}
                              size="xs"
                            />
                            <div className="text-left">
                              <p className="text-xs font-bold leading-tight">
                                {user.displayName}
                              </p>
                              <p className="text-[10px] text-neutral-400 font-mono">
                                @{user.username} • {formatAura(user.aura)} Aura
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-amber-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
