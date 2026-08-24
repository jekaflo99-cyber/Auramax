import React, { useState } from 'react';
import { Flame, CheckCircle2, Circle, Plus, Calendar, Zap, Sparkles, Trophy, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useAura } from '../context/AuraContext';
import { formatAura } from '../lib/auraEngine';

export const DisciplineView: React.FC = () => {
  const {
    habits,
    currentUser,
    inventory,
    toggleHabit,
    addHabit,
    useStreakFreeze,
    setCurrentTab
  } = useAura();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newReward, setNewReward] = useState(150);
  const [newCategory, setNewCategory] = useState<'fitness' | 'mindset' | 'nutrition' | 'learning'>('fitness');
  const [freezeFeedback, setFreezeFeedback] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Habits belonging to current user
  const userHabits = habits.filter(h => h.userId === currentUser.id);
  const completedToday = userHabits.filter(h => h.completedDates.includes(today));

  const totalDailyPossibleAura = userHabits.reduce((acc, h) => acc + h.auraReward, 0);
  const earnedTodayAura = completedToday.reduce((acc, h) => acc + h.auraReward, 0);
  const progressPercent = userHabits.length > 0 ? Math.round((completedToday.length / userHabits.length) * 100) : 0;

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addHabit({
      title: newTitle.trim(),
      category: newCategory,
      auraReward: Number(newReward),
      description: newDesc.trim() || undefined
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const handleActivateStreakFreeze = () => {
    const success = useStreakFreeze();
    if (success) {
      setFreezeFeedback('Escudo de Streak ativado com sucesso! O teu progresso está protegido.');
    } else {
      setFreezeFeedback('Sem escudos disponíveis. Compra mais na Loja com Aura Coins.');
    }
    setTimeout(() => setFreezeFeedback(null), 3500);
  };

  return (
    <div className="space-y-5 pb-24 max-w-xl mx-auto">
      {/* Header Banner: Aura Disciplina Daily Progress */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 rounded-3xl p-5 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <Flame className="w-5 h-5 fill-amber-400 animate-pulse" />
              </span>
              <h2 className="text-xl font-black italic tracking-tight uppercase text-white">
                Aura Disciplina
              </h2>
            </div>
            <p className="text-xs text-neutral-400">
              A disciplina diária constrói a aura inabalável. Completa tarefas para somar pontos fixos.
            </p>
          </div>

          {/* Daily Streak Pill */}
          <div className="flex flex-col items-center justify-center px-3.5 py-2 rounded-2xl bg-neutral-800/80 border border-white/10 shadow-lg flex-shrink-0">
            <div className="flex items-center gap-1 text-amber-400 font-extrabold font-mono text-lg">
              <Flame className="w-4 h-4 fill-amber-400" />
              {currentUser.streak}d
            </div>
            <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
              Streak Ativo
            </span>
          </div>
        </div>

        {/* Streak Shield & Freeze Protection status bar */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-300 font-mono">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Escudos de Streak: <strong>{inventory.streakFreezes}</strong> disponíveis</span>
          </div>

          <div className="flex items-center gap-2">
            {inventory.streakFreezes > 0 ? (
              <button
                onClick={handleActivateStreakFreeze}
                className="px-3 py-1 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold transition-all"
              >
                Ativar Escudo Hoje
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab('shop')}
                className="px-3 py-1 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-mono text-[11px] font-bold transition-all flex items-center gap-1"
              >
                <ShoppingBag className="w-3 h-3 text-amber-400" />
                Comprar Escudos na Loja
              </button>
            )}
          </div>
        </div>

        {/* Feedback message */}
        {freezeFeedback && (
          <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-600/60 text-cyan-300 text-xs font-mono font-bold animate-in fade-in">
            {freezeFeedback}
          </div>
        )}

        {/* Progress Metric Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400">
              Progresso de Hoje ({completedToday.length}/{userHabits.length} hábitos)
            </span>
            <span className="text-amber-300 font-bold">
              +{earnedTodayAura} / +{totalDailyPossibleAura} Aura
            </span>
          </div>

          <div className="h-3.5 w-full bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-green-400 rounded-full transition-all duration-500 shadow-lg shadow-amber-500/30"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Quick Action: Add Habit Button */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-wider font-mono">
            Hábitos Diários
          </h3>
        </div>

        <button
          id="btn-add-habit-modal"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Novo Hábito
        </button>
      </div>

      {/* Habits Checklist */}
      <div className="space-y-2.5">
        {userHabits.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900/40 rounded-3xl border border-dashed border-white/10 p-6 space-y-3">
            <Trophy className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-sm text-neutral-400 font-medium">Nenhum hábito configurado ainda.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs"
            >
              Criar o Primeiro Hábito
            </button>
          </div>
        ) : (
          userHabits.map((habit) => {
            const isCompleted = habit.completedDates.includes(today);

            return (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer select-none group ${
                  isCompleted
                    ? 'bg-neutral-900/90 border-green-500/30 shadow-lg shadow-green-500/5'
                    : 'bg-neutral-900 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Custom animated checkbox */}
                  <div className="transition-transform group-active:scale-90 flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-7 h-7 rounded-lg bg-green-500 text-black flex items-center justify-center text-xs font-black shadow-lg shadow-green-500/20">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg border-2 border-neutral-700 group-hover:border-neutral-500 flex items-center justify-center text-transparent" />
                    )}
                  </div>

                  {/* Habit Info */}
                  <div className="space-y-0.5">
                    <p
                      className={`text-sm font-semibold transition-all ${
                        isCompleted
                          ? 'text-neutral-400 line-through'
                          : 'text-neutral-100 group-hover:text-white'
                      }`}
                    >
                      {habit.title}
                    </p>
                    {habit.description && (
                      <p className="text-xs text-neutral-500 line-clamp-1">
                        {habit.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Aura Reward Badge & Streak Count */}
                <div className="flex items-center gap-2.5">
                  {habit.streak > 0 && (
                    <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-neutral-400 font-bold bg-neutral-950 px-2 py-0.5 rounded-md border border-white/5">
                      <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {habit.streak}d
                    </span>
                  )}

                  <span
                    className={`font-mono text-xs font-bold px-2.5 py-1 rounded-xl transition-all border ${
                      isCompleted
                        ? 'bg-green-950/60 text-green-400 border-green-800/40'
                        : 'bg-amber-400/10 text-amber-300 border-amber-400/20'
                    }`}
                  >
                    +{habit.auraReward} Aura
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create New Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase italic tracking-tight text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Novo Hábito de Aura
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-500 hover:text-neutral-300 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Nome do Hábito
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Treino de Força / Acordar às 06:00"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Descrição (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Detalhes ou metas diárias..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="fitness">Fitness / Corpo</option>
                    <option value="mindset">Mindset / Foco</option>
                    <option value="nutrition">Nutrição / Dieta</option>
                    <option value="learning">Estudo / Leitura</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Recompensa Aura
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="1000"
                    step="50"
                    value={newReward}
                    onChange={(e) => setNewReward(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs shadow-lg shadow-amber-400/20"
                >
                  Criar Hábito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
