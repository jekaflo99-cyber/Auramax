import React, { useState } from 'react';
import { Sparkles, Flame, Zap, Shield, Edit3, Sliders, History, Grid, Award, CheckCircle2, TrendingUp, RefreshCw, Film, ShoppingBag, Coins, Crown, Check } from 'lucide-react';
import { useAura } from '../context/AuraContext';
import { GlowAvatar } from './GlowAvatar';
import { AuraBadge } from './AuraBadge';
import { getAuraTier, getNextTierProgress, formatAura, AURA_TIERS } from '../lib/auraEngine';
import { AuraTier } from '../types';
import { SHOP_ITEMS } from '../lib/shopData';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    posts,
    habits,
    auraLogs,
    inventory,
    updateCurrentUserProfile,
    equipItem,
    unequipItem,
    setCurrentTab,
    allUsers,
    switchUser,
    resetAllData
  } = useAura();

  const [activeTab, setActiveTab] = useState<'posts' | 'inventory' | 'history' | 'simulator'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);

  // Simulator Test State (To allow the user to test the 4 glow visual tiers live)
  const [simulatorAura, setSimulatorAura] = useState<number>(currentUser.aura);

  const tierConfig = getAuraTier(currentUser.aura);
  const nextProgress = getNextTierProgress(currentUser.aura);

  // Filter posts & logs of current user
  const userPosts = posts.filter(p => p.userId === currentUser.id);
  const userLogs = auraLogs.filter(l => l.userId === currentUser.id);

  // Owned inventory items
  const ownedItems = SHOP_ITEMS.filter(i => inventory.ownedItemIds.includes(i.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      displayName: displayName.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim()
    });
    setShowEditModal(false);
  };

  const simulatedTier = getAuraTier(simulatorAura);

  return (
    <div className="space-y-6 pb-24 max-w-xl mx-auto">
      {/* Profile Header & Grand Glow Ring */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900/60 via-neutral-900/30 to-transparent rounded-[40px] p-6 border border-white/10 shadow-2xl text-center space-y-4">
        {/* Ambient background glow according to tier */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[80px] opacity-35 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: tierConfig.color }}
        />

        {/* Top actions */}
        <div className="flex items-center justify-between relative z-10">
          <button
            onClick={() => setCurrentTab('shop')}
            className="px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{inventory.coins.toLocaleString('pt-PT')} Coins</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setDisplayName(currentUser.displayName);
                setBio(currentUser.bio);
                setAvatarUrl(currentUser.avatarUrl);
                setShowEditModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1.5 border border-white/5 transition-colors"
              title="Editar Perfil"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>
          </div>
        </div>

        {/* Center: Grand Glow Avatar */}
        <div className="flex flex-col items-center justify-center pt-2 relative z-10">
          <GlowAvatar
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            aura={currentUser.aura}
            size="xl"
            showBadge={false}
            skinId={inventory.equippedHaloSkinId}
          />

          <div className="mt-4 space-y-1">
            <h2 className="text-2xl font-black italic tracking-tight uppercase text-white">
              {currentUser.displayName}
            </h2>
            <p className="text-xs font-mono text-neutral-400">
              @{currentUser.username}
            </p>
          </div>

          {/* Equipped Prestige Title */}
          {inventory.equippedBadgeTitle && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-extrabold uppercase">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              {inventory.equippedBadgeTitle}
            </div>
          )}

          <p className="text-xs text-neutral-300 max-w-sm mt-2 px-4 leading-relaxed font-normal">
            {currentUser.bio}
          </p>

          {/* Tier Badge Pill */}
          <div className="mt-3 flex items-center gap-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold border shadow-lg ${tierConfig.badgeBg}`}>
              {tierConfig.title}
            </span>
            <AuraBadge aura={currentUser.aura} size="md" />
          </div>
        </div>

        {/* Next Tier Progression Bar */}
        <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-left relative z-10">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400">
              {nextProgress.nextTier ? `Próximo Nível: ${nextProgress.nextTier.name}` : 'Nível Máximo Atingido 🌌'}
            </span>
            <span className="text-amber-300 font-bold">
              {nextProgress.nextTier ? `Faltam ${formatAura(nextProgress.remaining)} Aura` : '100%'}
            </span>
          </div>

          <div className="h-2.5 w-full bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-indigo-500 rounded-full transition-all duration-500 shadow-md shadow-amber-500/20"
              style={{ width: `${nextProgress.progressPercent}%` }}
            />
          </div>

          {/* 4 Tiers mini step marks */}
          <div className="grid grid-cols-4 gap-1 pt-1 text-[10px] font-mono text-center">
            <span className={currentUser.aura >= 0 ? 'text-neutral-300 font-bold' : 'text-neutral-600'}>
              0 NPC
            </span>
            <span className={currentUser.aura >= 1000 ? 'text-blue-400 font-bold' : 'text-neutral-600'}>
              1k Sigma
            </span>
            <span className={currentUser.aura >= 5000 ? 'text-amber-400 font-bold' : 'text-neutral-600'}>
              5k Sovereign
            </span>
            <span className={currentUser.aura >= 10000 ? 'text-purple-300 font-bold' : 'text-neutral-600'}>
              10k+ Cosmic
            </span>
          </div>
        </div>
      </section>

      {/* Aura Stats Grid Breakdown */}
      <section className="grid grid-cols-3 gap-2.5">
        <div className="bg-neutral-900/80 rounded-2xl p-3.5 border border-white/10 flex flex-col items-center text-center">
          <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 mb-1 border border-amber-400/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold text-white">
            {formatAura(currentUser.socialAuraEarned)}
          </span>
          <span className="text-[10px] text-neutral-500 uppercase font-semibold">
            Social Aura
          </span>
        </div>

        <div className="bg-neutral-900/80 rounded-2xl p-3.5 border border-white/10 flex flex-col items-center text-center">
          <div className="p-2 rounded-xl bg-green-500/10 text-green-400 mb-1 border border-green-500/20">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold text-white">
            {formatAura(currentUser.disciplineAuraEarned)}
          </span>
          <span className="text-[10px] text-neutral-500 uppercase font-semibold">
            Disciplina Aura
          </span>
        </div>

        <div className="bg-neutral-900/80 rounded-2xl p-3.5 border border-white/10 flex flex-col items-center text-center">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 mb-1 border border-purple-500/20">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold text-white">
            {currentUser.streak} dias
          </span>
          <span className="text-[10px] text-neutral-500 uppercase font-semibold">
            Streak Ativo
          </span>
        </div>
      </section>

      {/* Tabs: Publicações / Inventário / Histórico / Simulador de Glow */}
      <div className="grid grid-cols-4 bg-neutral-900/90 p-1.5 rounded-2xl border border-white/10 gap-1 text-[11px] font-bold">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center justify-center gap-1 py-2 rounded-xl transition-all ${
            activeTab === 'posts'
              ? 'bg-neutral-800 text-white shadow-md border border-white/10'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Grid className="w-3 h-3" />
          Posts ({userPosts.length})
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center justify-center gap-1 py-2 rounded-xl transition-all ${
            activeTab === 'inventory'
              ? 'bg-neutral-800 text-amber-400 shadow-md border border-white/10'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3 h-3" />
          Inventário ({ownedItems.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center justify-center gap-1 py-2 rounded-xl transition-all ${
            activeTab === 'history'
              ? 'bg-neutral-800 text-white shadow-md border border-white/10'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <History className="w-3 h-3" />
          Auditoria
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center justify-center gap-1 py-2 rounded-xl transition-all ${
            activeTab === 'simulator'
              ? 'bg-neutral-800 text-amber-400 shadow-md border border-white/10'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3 h-3 text-amber-400" />
          Glow Sim
        </button>
      </div>

      {/* Content 1: User Posts */}
      {activeTab === 'posts' && (
        <div className="space-y-3">
          {userPosts.length === 0 ? (
            <div className="text-center py-10 bg-neutral-900/40 rounded-3xl border border-dashed border-white/10 p-6 space-y-2">
              <Sparkles className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400">Você ainda não publicou momentos de aura.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 group relative"
                >
                  <div className="aspect-square bg-neutral-950 overflow-hidden relative">
                    {post.mediaType === 'video' ? (
                      <>
                        <video
                          src={post.mediaUrl}
                          muted
                          autoPlay
                          loop
                          playsInline
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-amber-400/30 text-amber-400 text-[9px] font-mono font-bold flex items-center gap-1 z-10">
                          <Film className="w-2.5 h-2.5" />
                          8s
                        </div>
                      </>
                    ) : (
                      <img
                        src={post.mediaUrl}
                        alt={post.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="p-2.5 space-y-1">
                    <p className="text-xs text-neutral-200 line-clamp-1 font-medium">
                      {post.caption}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                      <span className="text-amber-400 font-bold">
                        +{post.auraGain} Aura
                      </span>
                      <span>{post.plusVotes} votos</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content 2: User Inventory of Owned Skins & Titles */}
      {activeTab === 'inventory' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase">
              Cosméticos Adquiridos
            </span>
            <button
              onClick={() => setCurrentTab('shop')}
              className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Ir para a Loja →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ownedItems.map(item => {
              const isEquippedHalo = inventory.equippedHaloSkinId === item.id;
              const isEquippedTitle = inventory.equippedBadgeTitle === item.badgeTitle;
              const isEquipped = isEquippedHalo || isEquippedTitle;

              return (
                <div
                  key={item.id}
                  className={`bg-neutral-900/90 rounded-2xl p-4 border transition-all flex flex-col justify-between gap-3 ${
                    isEquipped ? 'border-amber-400/60 bg-neutral-900 ring-1 ring-amber-400/20' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-amber-400 font-bold block">
                        {item.category.replace('_', ' ')}
                      </span>
                      <h4 className="text-sm font-bold text-white font-mono mt-0.5">
                        {item.name}
                      </h4>
                    </div>
                    {isEquipped && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black font-mono text-[9px] font-extrabold uppercase flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Equipado
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[10px] text-neutral-400">
                      Raridade: <strong className="text-neutral-200 capitalize">{item.rarity}</strong>
                    </span>

                    {item.category === 'thematic_frame' || item.category === 'halo_skin' ? (
                      isEquippedHalo ? (
                        <button
                          onClick={() => unequipItem('thematic_frame')}
                          className="px-3 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono font-bold"
                        >
                          Desequipar
                        </button>
                      ) : (
                        <button
                          onClick={() => equipItem(item.id, 'thematic_frame')}
                          className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono font-extrabold"
                        >
                          Equipar
                        </button>
                      )
                    ) : item.category === 'badge_title' ? (
                      isEquippedTitle ? (
                        <button
                          onClick={() => unequipItem('badge_title')}
                          className="px-3 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono font-bold"
                        >
                          Desequipar
                        </button>
                      ) : (
                        <button
                          onClick={() => equipItem(item.id, 'badge_title')}
                          className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono font-extrabold"
                        >
                          Equipar
                        </button>
                      )
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content 3: Audit / Transaction Logs */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {userLogs.length === 0 ? (
            <div className="text-center py-8 bg-neutral-900/40 rounded-3xl border border-dashed border-white/10 p-4">
              <p className="text-xs text-neutral-400">Nenhum registo de transação encontrado.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {userLogs.map((log) => {
                const isPositive = log.amount >= 0;
                return (
                  <div
                    key={log.id}
                    className="p-3 bg-neutral-900 rounded-2xl border border-white/5 flex items-center justify-between"
                  >
                    <div className="space-y-0.5 max-w-[75%]">
                      <p className="text-xs text-white font-medium line-clamp-1">
                        {log.description}
                      </p>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className={`px-2.5 py-1 rounded-xl font-mono text-xs font-bold border ${
                      isPositive
                        ? 'bg-green-950/60 text-green-400 border-green-800/40'
                        : 'bg-red-950/60 text-red-400 border-red-800/40'
                    }`}>
                      {isPositive ? `+${log.amount}` : log.amount} Aura
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Content 4: Glow Simulator Lab */}
      {activeTab === 'simulator' && (
        <section className="bg-neutral-900 rounded-3xl p-5 border border-white/10 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-black italic uppercase tracking-wider text-white flex items-center gap-2 font-mono">
              <Sliders className="w-4 h-4 text-amber-400" />
              Laboratório de Glow Visual
            </h3>
            <p className="text-xs text-neutral-400">
              Deslize o controle para testar como o brilho do perfil transmuta entre os 4 níveis de Aura em tempo real.
            </p>
          </div>

          {/* Simulated Avatar Preview */}
          <div className="flex flex-col items-center justify-center py-4">
            <GlowAvatar
              src={currentUser.avatarUrl}
              alt="Simulação de Glow"
              aura={simulatorAura}
              size="2xl"
              showBadge={true}
            />

            <div className="mt-6 text-center space-y-1">
              <span className={`text-sm font-bold font-mono px-3 py-1 rounded-full border ${simulatedTier.badgeBg}`}>
                {simulatedTier.name}
              </span>
              <p className="text-xs text-neutral-400 mt-2 max-w-xs">
                {simulatedTier.description}
              </p>
            </div>
          </div>

          {/* Aura Slider Control */}
          <div className="space-y-2 bg-neutral-950 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Aura Simulada:</span>
              <span className="text-amber-400 font-bold text-sm">
                {formatAura(simulatorAura)} AURA
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={15000}
              step={100}
              value={simulatorAura}
              onChange={(e) => setSimulatorAura(Number(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />

            <div className="flex justify-between text-[10px] font-mono text-neutral-500 pt-1">
              <button onClick={() => setSimulatorAura(350)} className="hover:text-neutral-300">
                0-1k (NPC)
              </button>
              <button onClick={() => setSimulatorAura(2500)} className="hover:text-blue-400">
                1k-5k (Azul)
              </button>
              <button onClick={() => setSimulatorAura(7500)} className="hover:text-amber-400">
                5k-10k (Dourado)
              </button>
              <button onClick={() => setSimulatorAura(13500)} className="hover:text-white">
                10k+ (Cósmico)
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                Editar Perfil
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-neutral-500 hover:text-neutral-300 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Nome de Exibição
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Bio / Filosofia de Aura
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  URL da Foto de Perfil
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs shadow-lg shadow-amber-400/20"
                >
                  Guardar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
