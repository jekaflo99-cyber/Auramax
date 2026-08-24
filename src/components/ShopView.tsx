import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Coins, Flame, Shield, Award, Check, Film, Zap, Crown, ShieldCheck, ArrowRight, Lock, Eye, RefreshCw, ShieldAlert, Sparkle } from 'lucide-react';
import { useAura } from '../context/AuraContext';
import { SHOP_ITEMS } from '../lib/shopData';
import { ShopItem, ShopItemCategory } from '../types';
import { GlowAvatar } from './GlowAvatar';
import { formatAura, getAuraTier } from '../lib/auraEngine';

export const ShopView: React.FC = () => {
  const {
    currentUser,
    inventory,
    buyShopItem,
    buyCoinPack,
    equipItem,
    unequipItem,
    setCurrentTab
  } = useAura();

  const [activeCategory, setActiveCategory] = useState<ShopItemCategory | 'all'>('all');
  const [selectedPreviewSkin, setSelectedPreviewSkin] = useState<string>(
    inventory.equippedHaloSkinId || 'frame_hellfire'
  );
  const [purchaseStatus, setPurchaseStatus] = useState<{ id: string; message: string; success: boolean } | null>(null);

  const currentTier = getAuraTier(currentUser.aura);

  // Filter items
  const filteredItems = SHOP_ITEMS.filter(item => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'thematic_frame') {
      return item.category === 'thematic_frame' || item.category === 'halo_skin';
    }
    return item.category === activeCategory;
  });

  const handleBuy = (item: ShopItem) => {
    if (item.category === 'coins_pack') {
      buyCoinPack(item.id);
      setPurchaseStatus({
        id: item.id,
        message: `Recebeste +${item.priceCoins} Aura Coins com sucesso!`,
        success: true
      });
      setTimeout(() => setPurchaseStatus(null), 3000);
      return;
    }

    const result = buyShopItem(item.id);
    setPurchaseStatus({
      id: item.id,
      message: result.message,
      success: result.success
    });
    setTimeout(() => setPurchaseStatus(null), 3000);
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-amber-500 to-yellow-300 text-black border-yellow-300 font-extrabold';
      case 'epic':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
      case 'rare':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Top Banner: Currency Balance & Live Dressing Room Preview */}
      <div className="relative rounded-3xl bg-neutral-900 border border-white/10 p-5 sm:p-7 overflow-hidden shadow-2xl">
        {/* Background glow overlay */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-purple-600/20 via-amber-400/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Avatar Dressing Room Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              <GlowAvatar
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                aura={currentUser.aura}
                size="xl"
                showBadge={true}
                skinId={selectedPreviewSkin}
              />
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/90 border border-white/20 text-[10px] font-mono font-bold text-amber-400 whitespace-nowrap shadow-lg flex items-center gap-1">
                <Eye className="w-3 h-3 text-amber-400" />
                PROVADOR LIVE
              </div>
            </div>

            <div className="space-y-1.5 max-w-sm">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="text-xl font-black italic tracking-tight uppercase text-white">
                  {currentUser.displayName}
                </h2>
                {inventory.equippedBadgeTitle && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-extrabold uppercase">
                    {inventory.equippedBadgeTitle}
                  </span>
                )}
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 border border-white/10 text-xs font-mono text-neutral-300">
                <span className="text-neutral-500 font-medium">Rank de Mérito:</span>
                <span className={`font-bold ${currentTier.badgeText}`}>{currentTier.name} ({formatAura(currentUser.aura)})</span>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                As molduras e efeitos temáticos vestem o teu avatar sem sobrepor nem apagar o teu halo de nível conquistado.
              </p>
              
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs font-mono text-neutral-300">
                <span className="flex items-center gap-1 text-cyan-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {inventory.streakFreezes} Escudos de Streak
                </span>
              </div>
            </div>
          </div>

          {/* Right: Currency Balance Card */}
          <div className="w-full sm:w-auto bg-neutral-950/80 border border-amber-400/20 rounded-2xl p-4 flex flex-col items-center sm:items-end gap-2 backdrop-blur-md">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold font-mono">
              O Teu Saldo de Aura Coins
            </span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tracking-tight">
                {inventory.coins.toLocaleString('pt-PT')}
              </span>
            </div>
            <button
              onClick={() => setActiveCategory('coins_pack')}
              className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold font-mono transition-transform active:scale-95 flex items-center justify-center gap-1.5 shadow-lg shadow-amber-400/20"
            >
              <Coins className="w-3.5 h-3.5" />
              Recarregar Moedas
            </button>
          </div>
        </div>
      </div>

      {/* Distinction Explanation: Merit vs Style */}
      <div className="p-4 rounded-2xl bg-neutral-950/90 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-mono font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
              <span>Código de Honra: Mérito vs. Estilo Comprado</span>
            </div>
            <p className="text-neutral-400 text-[11px] mt-0.5 leading-relaxed">
              As cores de Rank (<span className="text-zinc-300">NPC</span>, <span className="text-cyan-400">Sigma</span>, <span className="text-amber-400">Sovereign</span> e <span className="text-pink-400">Cósmico</span>) só se ganham com disciplina e votos. Os cosméticos da Loja adicionam <strong className="text-white">molduras e temas artísticos</strong> sem falsificar o teu nível real!
            </p>
          </div>
        </div>
      </div>

      {/* Global Purchase Feedback Toast */}
      {purchaseStatus && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-bold font-mono flex items-center justify-between animate-in slide-in-from-top duration-300 ${
            purchaseStatus.success
              ? 'bg-green-950/80 border-green-700/80 text-green-300'
              : 'bg-red-950/80 border-red-700/80 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {purchaseStatus.success ? (
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
            ) : (
              <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />
            )}
            <span>{purchaseStatus.message}</span>
          </div>
        </div>
      )}

      {/* Filter Categories Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'all'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Todos os Itens
        </button>

        <button
          onClick={() => setActiveCategory('thematic_frame')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'thematic_frame'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Molduras Temáticas
        </button>

        <button
          onClick={() => setActiveCategory('video_effect')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'video_effect'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          Efeitos de Vídeo (8s)
        </button>

        <button
          onClick={() => setActiveCategory('badge_title')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'badge_title'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Títulos de Personalidade
        </button>

        <button
          onClick={() => setActiveCategory('streak_utility')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'streak_utility'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Escudos & Boosts
        </button>

        <button
          onClick={() => setActiveCategory('coins_pack')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'coins_pack'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          Pacotes de Moedas
        </button>
      </div>

      {/* Grid of Microtransaction Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const isOwned = inventory.ownedItemIds.includes(item.id);
          const isEquippedFrame = inventory.equippedHaloSkinId === item.id;
          const isEquippedTitle = inventory.equippedBadgeTitle === item.badgeTitle;
          const isEquipped = isEquippedFrame || isEquippedTitle;
          const isSelectedInDressingRoom = selectedPreviewSkin === item.id;
          const isThematicFrame = item.category === 'thematic_frame' || item.category === 'halo_skin';

          return (
            <div
              key={item.id}
              className={`bg-neutral-900 rounded-3xl p-5 border transition-all flex flex-col justify-between relative overflow-hidden group ${
                isEquipped
                  ? 'border-amber-400/60 ring-1 ring-amber-400/30'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Popular / Best Seller Ribbon */}
              {item.isPopular && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-400 font-mono text-[9px] font-extrabold uppercase tracking-wider">
                  ★ Mais Vendido
                </div>
              )}

              <div className="space-y-3.5">
                {/* Top Meta: Category & Rarity */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-mono font-bold border ${getRarityBadge(
                      item.rarity
                    )}`}
                  >
                    {item.rarity}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono uppercase">
                    {item.category === 'thematic_frame' || item.category === 'halo_skin'
                      ? 'MOLDURA TEMÁTICA'
                      : item.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Visual Icon / Skin Showcase Card */}
                <div className="aspect-video w-full rounded-2xl bg-neutral-950 border border-white/5 p-4 flex flex-col items-center justify-center relative overflow-hidden">
                  {isThematicFrame ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <GlowAvatar
                          src={currentUser.avatarUrl}
                          alt="preview"
                          aura={currentUser.aura}
                          size="md"
                          skinId={item.id}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedPreviewSkin(item.id)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                          isSelectedInDressingRoom
                            ? 'bg-amber-400 text-black border-amber-400 font-bold'
                            : 'bg-neutral-800 text-neutral-300 border-white/10 hover:text-white'
                        }`}
                      >
                        {isSelectedInDressingRoom ? '✓ No Provador' : 'Provar Moldura'}
                      </button>
                    </div>
                  ) : item.category === 'badge_title' ? (
                    <div className="text-center space-y-2">
                      <Crown className="w-7 h-7 text-amber-400 mx-auto" />
                      <div className="px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/40 text-amber-300 font-mono text-xs font-black uppercase">
                        {item.badgeTitle}
                      </div>
                    </div>
                  ) : item.category === 'video_effect' ? (
                    <div className="text-center space-y-2">
                      <Film className="w-7 h-7 text-cyan-400 mx-auto" />
                      <span className="text-xs font-bold text-white font-mono block">
                        Overlay 8s Clip
                      </span>
                    </div>
                  ) : item.category === 'streak_utility' ? (
                    <div className="text-center space-y-2">
                      <ShieldCheck className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
                      <span className="text-xs font-bold text-white font-mono block">
                        Proteção de Hábitos
                      </span>
                    </div>
                  ) : (
                    /* Coin Pack */
                    <div className="text-center space-y-2">
                      <Coins className="w-9 h-9 text-amber-400 mx-auto" />
                      <span className="text-sm font-black text-amber-300 font-mono block">
                        +{item.priceCoins.toLocaleString('pt-PT')} COINS
                      </span>
                    </div>
                  )}
                </div>

                {/* Title and Description */}
                <div>
                  <h3 className="text-sm font-black text-white font-mono tracking-tight group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Actions: Price, Equip or Buy */}
              <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between gap-3">
                {/* Price Display */}
                <div>
                  {item.category === 'coins_pack' ? (
                    <div className="flex flex-col">
                      <span className="text-[10px] text-neutral-500 font-mono uppercase">Preço IAP</span>
                      <span className="text-base font-black text-green-400 font-mono">
                        {item.realPriceEur}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-[10px] text-neutral-500 font-mono uppercase">Custo</span>
                      <div className="flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-sm font-black text-amber-400 font-mono">
                          {item.priceCoins}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action CTA Buttons */}
                <div>
                  {item.category === 'coins_pack' ? (
                    <button
                      onClick={() => handleBuy(item)}
                      className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black font-extrabold text-xs font-mono transition-transform active:scale-95 shadow-lg shadow-green-500/20"
                    >
                      Comprar Pacote
                    </button>
                  ) : isOwned ? (
                    isThematicFrame ? (
                      isEquippedFrame ? (
                        <button
                          onClick={() => unequipItem('thematic_frame')}
                          className="px-3.5 py-2 rounded-xl bg-amber-400/10 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-green-400" /> Equipado
                        </button>
                      ) : (
                        <button
                          onClick={() => equipItem(item.id, 'thematic_frame')}
                          className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs font-bold"
                        >
                          Equipar Moldura
                        </button>
                      )
                    ) : item.category === 'badge_title' ? (
                      isEquippedTitle ? (
                        <button
                          onClick={() => unequipItem('badge_title')}
                          className="px-3.5 py-2 rounded-xl bg-amber-400/10 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-green-400" /> Equipado
                        </button>
                      ) : (
                        <button
                          onClick={() => equipItem(item.id, 'badge_title')}
                          className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs font-bold"
                        >
                          Equipar Título
                        </button>
                      )
                    ) : (
                      /* Consumable utility */
                      <button
                        onClick={() => handleBuy(item)}
                        className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs font-bold"
                      >
                        Comprar Mais
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={inventory.coins < item.priceCoins}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-extrabold text-xs font-mono transition-transform active:scale-95 shadow-lg shadow-amber-400/20"
                    >
                      Desbloquear
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
