import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAura } from '../context/AuraContext';
import { Sparkles, Skull } from 'lucide-react';

export const FloatingAuraLayer: React.FC = () => {
  const { floatingFeedbacks } = useAura();

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {floatingFeedbacks.map((item) => {
          const isPlus = item.type === '+aura';
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1.2, y: -70 }}
              exit={{ opacity: 0, scale: 0.8, y: -120 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                left: `${Math.min(window.innerWidth - 140, Math.max(20, item.x - 60))}px`,
                top: `${Math.min(window.innerHeight - 80, Math.max(80, item.y - 30))}px`
              }}
              className={`absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-black text-sm tracking-wider shadow-2xl backdrop-blur-md border ${
                isPlus
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-400/80 shadow-emerald-500/40'
                  : 'bg-rose-950/90 text-rose-300 border-rose-500/80 shadow-rose-600/40'
              }`}
            >
              {isPlus ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400 fill-emerald-400 animate-pulse" />
                  <span>+{item.amount} AURA FARMED!</span>
                </>
              ) : (
                <>
                  <Skull className="w-4 h-4 text-rose-400" />
                  <span>-{item.amount} AURA LOSS</span>
                </>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
