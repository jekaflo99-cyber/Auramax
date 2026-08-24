import React, { useState } from 'react';
import { Trophy, Crown, Medal, Flame, Search, Sparkles, Zap } from 'lucide-react';
import { useAura } from '../context/AuraContext';
import { GlowAvatar } from './GlowAvatar';
import { AuraBadge } from './AuraBadge';
import { formatAura, getAuraTier } from '../lib/auraEngine';

export const LeaderboardView: React.FC = () => {
  const { allUsers, currentUser, switchUser, setCurrentTab } = useAura();
  const [timeframe, setTimeframe] = useState<'all' | 'weekly' | 'daily'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sort users by aura
  const sortedUsers = [...allUsers].sort((a, b) => {
    if (timeframe === 'daily') return b.dailyAuraEarned - a.dailyAuraEarned;
    if (timeframe === 'weekly') return (b.socialAuraEarned + b.disciplineAuraEarned) - (a.socialAuraEarned + a.disciplineAuraEarned);
    return b.aura - a.aura;
  });

  const filteredUsers = sortedUsers.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top1 = sortedUsers[0];
  const top2 = sortedUsers[1];
  const top3 = sortedUsers[2];

  return (
    <div className="space-y-6 pb-24 max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono font-bold mb-1">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          Ranking Global de Aura
        </div>
        <h2 className="text-2xl font-black italic tracking-tight uppercase text-white">
          Hall da Fama AuraMax
        </h2>
        <p className="text-xs text-neutral-400">
          Os utilizadores com a maior presença de aura e disciplina comprovada no servidor.
        </p>
      </div>

      {/* Timeframe Filter Buttons */}
      <div className="flex bg-neutral-900 p-1 rounded-2xl border border-white/10 max-w-xs mx-auto">
        <button
          id="timeframe-all"
          onClick={() => setTimeframe('all')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            timeframe === 'all'
              ? 'bg-amber-400 text-black shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Geral
        </button>
        <button
          id="timeframe-weekly"
          onClick={() => setTimeframe('weekly')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            timeframe === 'weekly'
              ? 'bg-amber-400 text-black shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Semanal
        </button>
        <button
          id="timeframe-daily"
          onClick={() => setTimeframe('daily')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            timeframe === 'daily'
              ? 'bg-amber-400 text-black shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Hoje 🔥
        </button>
      </div>

      {/* Top 3 Podium */}
      {sortedUsers.length >= 3 && !searchQuery && (
        <div className="pt-6 pb-2 grid grid-cols-3 gap-2 items-end">
          {/* #2 Rank */}
          {top2 && (
            <div
              onClick={() => {
                switchUser(top2.id);
                setCurrentTab('profile');
              }}
              className="flex flex-col items-center cursor-pointer group order-1"
            >
              <div className="relative mb-2">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-neutral-800 text-neutral-200 flex items-center justify-center text-xs font-black border border-white/20 z-10">
                  2
                </span>
                <GlowAvatar
                  src={top2.avatarUrl}
                  alt={top2.displayName}
                  aura={top2.aura}
                  size="md"
                />
              </div>
              <span className="text-xs font-bold text-neutral-200 truncate max-w-[90px] text-center">
                {top2.displayName}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {formatAura(top2.aura)}
              </span>
              {/* Podium Block 2 */}
              <div className="w-full h-16 mt-2 bg-gradient-to-t from-neutral-950 to-neutral-800 rounded-t-2xl border-t border-x border-white/10 flex items-center justify-center">
                <Medal className="w-5 h-5 text-neutral-300" />
              </div>
            </div>
          )}

          {/* #1 Rank (Center, Highest Podium) */}
          {top1 && (
            <div
              onClick={() => {
                switchUser(top1.id);
                setCurrentTab('profile');
              }}
              className="flex flex-col items-center cursor-pointer group order-2 relative -top-3"
            >
              <div className="relative mb-2">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                  <Crown className="w-6 h-6 text-amber-400 fill-amber-400 animate-bounce" />
                </div>
                <GlowAvatar
                  src={top1.avatarUrl}
                  alt={top1.displayName}
                  aura={top1.aura}
                  size="lg"
                />
              </div>
              <span className="text-sm font-black italic tracking-tight uppercase text-white truncate max-w-[110px] text-center">
                {top1.displayName}
              </span>
              <span className="text-xs text-amber-300 font-mono font-bold">
                {formatAura(top1.aura)} AURA
              </span>
              {/* Podium Block 1 */}
              <div className="w-full h-24 mt-2 bg-gradient-to-t from-amber-950/40 via-neutral-900 to-amber-900/30 rounded-t-2xl border-t-2 border-x border-amber-400/50 flex flex-col items-center justify-center shadow-lg shadow-amber-500/10">
                <Crown className="w-6 h-6 text-amber-400" />
                <span className="text-[10px] font-mono font-bold text-amber-300">
                  #1 OVERLORD
                </span>
              </div>
            </div>
          )}

          {/* #3 Rank */}
          {top3 && (
            <div
              onClick={() => {
                switchUser(top3.id);
                setCurrentTab('profile');
              }}
              className="flex flex-col items-center cursor-pointer group order-3"
            >
              <div className="relative mb-2">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center text-xs font-black border border-amber-500/30 z-10">
                  3
                </span>
                <GlowAvatar
                  src={top3.avatarUrl}
                  alt={top3.displayName}
                  aura={top3.aura}
                  size="md"
                />
              </div>
              <span className="text-xs font-bold text-neutral-200 truncate max-w-[90px] text-center">
                {top3.displayName}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {formatAura(top3.aura)}
              </span>
              {/* Podium Block 3 */}
              <div className="w-full h-12 mt-2 bg-gradient-to-t from-neutral-950 to-neutral-800 rounded-t-2xl border-t border-x border-white/10 flex items-center justify-center">
                <Medal className="w-4 h-4 text-amber-500" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Pesquisar utilizador ou @handle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-neutral-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Ranked Users List */}
      <div className="space-y-2">
        {filteredUsers.map((user, index) => {
          const isCurrent = user.id === currentUser.id;
          const uTier = getAuraTier(user.aura);
          const rankNumber = sortedUsers.findIndex(u => u.id === user.id) + 1;

          return (
            <div
              key={user.id}
              onClick={() => {
                switchUser(user.id);
                setCurrentTab('profile');
              }}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-neutral-900 border-amber-400/40 ring-1 ring-amber-400/20 shadow-lg'
                  : 'bg-neutral-900 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank Number */}
                <span
                  className={`w-6 text-center font-mono font-black text-sm ${
                    rankNumber === 1
                      ? 'text-amber-400'
                      : rankNumber === 2
                      ? 'text-neutral-300'
                      : rankNumber === 3
                      ? 'text-amber-500'
                      : 'text-neutral-500'
                  }`}
                >
                  #{rankNumber}
                </span>

                <GlowAvatar
                  src={user.avatarUrl}
                  alt={user.displayName}
                  aura={user.aura}
                  size="sm"
                />

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-neutral-100">
                      {user.displayName}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30">
                        VOCÊ
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    @{user.username} • {uTier.title.split('/')[0]}
                  </span>
                </div>
              </div>

              {/* Aura Score & Streak */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{user.streak}d</span>
                </div>
                <AuraBadge aura={user.aura} size="sm" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
