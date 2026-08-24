import React, { useState, useRef } from 'react';
import { Sparkles, Skull, Flame, Clock, TrendingUp, ThumbsDown, MessageSquare, Share2, Plus, Zap, Film, Volume2, VolumeX } from 'lucide-react';
import { useAura } from '../context/AuraContext';
import { GlowAvatar } from './GlowAvatar';
import { AuraBadge } from './AuraBadge';
import { Post } from '../types';
import { formatAura, getAuraTier } from '../lib/auraEngine';

interface FeedViewProps {
  onOpenCreatePost: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({ onOpenCreatePost }) => {
  const { posts, voteOnPost, allUsers, switchUser, setCurrentTab } = useAura();
  const [activeFilter, setActiveFilter] = useState<'trending' | 'recent' | 'top' | 'fails'>('trending');
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [unmutedPosts, setUnmutedPosts] = useState<Record<string, boolean>>({});

  const toggleVideoSound = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setUnmutedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Sorting / Filtering posts
  const filteredPosts = [...posts].sort((a, b) => {
    if (activeFilter === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (activeFilter === 'top') {
      return b.auraGain - a.auraGain;
    }
    if (activeFilter === 'fails') {
      return a.auraGain - b.auraGain; // Most negative aura first
    }
    // Trending = score based on plus votes and recency
    return (b.plusVotes * 3 - b.minusVotes) - (a.plusVotes * 3 - a.minusVotes);
  });

  const handleShare = (postId: string) => {
    setCopiedPostId(postId);
    navigator.clipboard?.writeText?.(window.location.href);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const handleVote = (e: React.MouseEvent, postId: string, type: '+aura' | '-aura') => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const coords = { x: rect.left + rect.width / 2, y: rect.top };
    voteOnPost(postId, type, coords);
  };

  return (
    <div className="space-y-5 pb-24 max-w-xl mx-auto">
      {/* Aura Story Spotlight / Active Users Carousel */}
      <section className="bg-neutral-900/60 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Top Aura Glowers
          </span>
          <span className="text-[11px] text-neutral-500 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Ao Vivo
          </span>
        </div>
        <div className="flex items-center gap-3.5 overflow-x-auto pb-1.5 scrollbar-none">
          {allUsers.map((user) => {
            const uTier = getAuraTier(user.aura);
            return (
              <div
                key={user.id}
                onClick={() => {
                  switchUser(user.id);
                  setCurrentTab('profile');
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer group flex-shrink-0"
              >
                <div className="relative group-hover:scale-105 transition-transform">
                  <GlowAvatar
                    src={user.avatarUrl}
                    alt={user.displayName}
                    aura={user.aura}
                    size="sm"
                  />
                </div>
                <span className="text-[11px] font-bold text-neutral-300 max-w-[64px] truncate text-center">
                  @{user.username.split('_')[0]}
                </span>
                <span className={`text-[9px] font-mono font-semibold px-1 rounded ${uTier.badgeBg}`}>
                  {formatAura(user.aura)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Anime Aura Studio Camera Trigger Banner */}
      <div 
        onClick={onOpenCreatePost}
        className="cursor-pointer group relative rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-red-500/15 border border-amber-400/30 p-3.5 flex items-center justify-between gap-3 shadow-lg hover:border-amber-400/60 transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold shadow-md shadow-amber-400/30 flex-shrink-0 group-hover:rotate-12 transition-transform">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-white font-mono">
                Aura Studio Camera
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black text-[9px] font-extrabold font-mono">
                8s FILTRO ANIME
              </span>
            </div>
            <p className="text-[11px] text-neutral-300">
              Grava com <strong>Super Saiyan (Dragon Ball)</strong> ou <strong>Getsuga Tenshō (Bleach)</strong>!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCreatePost();
          }}
          className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono font-extrabold shadow-md shadow-amber-400/20 whitespace-nowrap flex items-center gap-1"
        >
          <Zap className="w-3.5 h-3.5" />
          Gravar 8s
        </button>
      </div>

      {/* Feed Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 scrollbar-none">
        <button
          id="filter-trending"
          onClick={() => setActiveFilter('trending')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeFilter === 'trending'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-white/10'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Em Alta
        </button>

        <button
          id="filter-recent"
          onClick={() => setActiveFilter('recent')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeFilter === 'recent'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-white/10'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Recentes
        </button>

        <button
          id="filter-top"
          onClick={() => setActiveFilter('top')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeFilter === 'top'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-white/10'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          + Aura Absoluta
        </button>

        <button
          id="filter-fails"
          onClick={() => setActiveFilter('fails')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeFilter === 'fails'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
              : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-white/10'
          }`}
        >
          <Skull className="w-3.5 h-3.5" />
          Perdas de Aura 💀
        </button>
      </div>

      {/* Posts Feed List */}
      <div className="space-y-5">
        {filteredPosts.map((post) => {
          const authorUser = allUsers.find(u => u.id === post.userId) || post.author;
          const authorTier = getAuraTier(authorUser.aura);
          const isVotedPlus = post.userVote === '+aura';
          const isVotedMinus = post.userVote === '-aura';
          const isPositiveNet = post.auraGain >= 0;

          return (
            <article
              key={post.id}
              className="bg-neutral-900/90 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:border-white/20 transition-all duration-300"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div
                  onClick={() => {
                    switchUser(post.userId);
                    setCurrentTab('profile');
                  }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <GlowAvatar
                    src={authorUser.avatarUrl}
                    alt={authorUser.displayName}
                    aura={authorUser.aura}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-100 group-hover:text-amber-400 transition-colors">
                        {authorUser.displayName}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${authorTier.badgeBg}`}>
                        {authorTier.title.split('/')[0]}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">
                      @{authorUser.username} • {formatAura(authorUser.aura)} Aura
                    </span>
                  </div>
                </div>

                {/* Net Post Aura Badge */}
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full font-mono text-xs font-bold border ${
                    isPositiveNet
                      ? 'bg-green-500/10 text-green-400 border-green-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}
                >
                  {isPositiveNet ? '+' : ''}
                  {formatAura(post.auraGain)} AURA
                </div>
              </div>

              {/* Media Container with Double Click Quick Vote */}
              <div
                onDoubleClick={(e) => handleVote(e, post.id, '+aura')}
                className="relative aspect-video w-full bg-neutral-950 overflow-hidden group cursor-pointer"
              >
                {post.mediaType === 'video' ? (
                  <>
                    <video
                      src={post.mediaUrl}
                      autoPlay
                      loop
                      muted={!unmutedPosts[post.id]}
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                    />

                    {/* Video 8s Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/30 text-amber-400 text-[10px] font-mono font-bold z-10">
                      <Film className="w-3 h-3 text-amber-400" />
                      <span>8s CLIPE</span>
                      {post.videoDuration && (
                        <span className="text-neutral-400 text-[9px]">
                          ({post.videoDuration.toFixed(1)}s)
                        </span>
                      )}
                    </div>

                    {/* Sound Mute/Unmute Toggle */}
                    <button
                      onClick={(e) => toggleVideoSound(e, post.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-neutral-200 hover:text-white transition-all z-10"
                      title={unmutedPosts[post.id] ? 'Mutar áudio' : 'Ativar som'}
                    >
                      {unmutedPosts[post.id] ? (
                        <Volume2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-neutral-400" />
                      )}
                    </button>
                  </>
                ) : (
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                )}

                {/* Quick Hint Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 pointer-events-none">
                  <span className="text-xs text-neutral-300 font-mono bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    Duplo clique para dar +Aura ⚡
                  </span>
                </div>
              </div>

              {/* Caption & Tags */}
              <div className="p-4 pt-3 space-y-2.5">
                <p className="text-sm text-neutral-200 leading-relaxed font-normal">
                  {post.caption}
                </p>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono font-semibold text-neutral-300 bg-neutral-800/80 px-2.5 py-0.5 rounded-md border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Voting & Actions Toolbar */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  {/* The Two Main Aura Voting Buttons (+ Aura / - Aura) */}
                  <div className="flex items-center gap-2">
                    {/* + AURA BUTTON */}
                    <button
                      id={`btn-plus-aura-${post.id}`}
                      onClick={(e) => handleVote(e, post.id, '+aura')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold font-mono text-xs transition-all duration-200 active:scale-95 ${
                        isVotedPlus
                          ? 'bg-green-500 text-black shadow-lg shadow-green-500/30 scale-105 ring-2 ring-green-400'
                          : 'bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400'
                      }`}
                    >
                      <Sparkles className={`w-4 h-4 ${isVotedPlus ? 'fill-black' : 'fill-green-400/30'}`} />
                      <span>+ AURA</span>
                      <span className={`px-1.5 py-0.5 rounded text-[11px] ${isVotedPlus ? 'bg-black/30 text-black font-black' : 'bg-green-950/60 text-green-300'}`}>
                        {post.plusVotes}
                      </span>
                    </button>

                    {/* - AURA BUTTON */}
                    <button
                      id={`btn-minus-aura-${post.id}`}
                      onClick={(e) => handleVote(e, post.id, '-aura')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold font-mono text-xs transition-all duration-200 active:scale-95 ${
                        isVotedMinus
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105 ring-2 ring-red-400'
                          : 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400'
                      }`}
                    >
                      <ThumbsDown className={`w-4 h-4 ${isVotedMinus ? 'fill-white' : ''}`} />
                      <span>- AURA</span>
                      <span className={`px-1.5 py-0.5 rounded text-[11px] ${isVotedMinus ? 'bg-black/30 text-white font-black' : 'bg-red-950/60 text-red-300'}`}>
                        {post.minusVotes}
                      </span>
                    </button>
                  </div>

                  {/* Secondary Social buttons */}
                  <div className="flex items-center gap-2 text-neutral-400 text-xs">
                    <button
                      onClick={() => handleShare(post.id)}
                      className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-white/5 transition-colors"
                      title="Copiar Link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    {copiedPostId === post.id && (
                      <span className="text-[10px] font-mono text-amber-400 animate-pulse">
                        Copiado!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Floating CTA to Post */}
      <div className="sticky bottom-20 z-20 flex justify-center pt-2">
        <button
          onClick={onOpenCreatePost}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm shadow-[0_8px_30px_rgba(251,191,36,0.4)] hover:scale-105 active:scale-95 transition-all border border-amber-300/40"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Postar Momento de Aura
        </button>
      </div>
    </div>
  );
};
