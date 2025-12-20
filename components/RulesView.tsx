
import React from 'react';

interface RulesViewProps {
  onClose: () => void;
}

const RulesView: React.FC<RulesViewProps> = ({ onClose }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 h-full max-h-[80vh]">
      <div className="p-6 bg-zinc-800/30 border-b border-zinc-800 flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-black uppercase tracking-tighter">Tower Rules</h2>
           <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">Guide for the Damned</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6 overflow-y-auto space-y-8 bg-black/20">
        <section>
          <h3 className="text-emerald-500 font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-emerald-500/10 rounded flex items-center justify-center text-xs">01</span>
            The Objective
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed font-mono">
            Ascend through 10 floors of a cursed vertical dungeon. Each floor is guarded by a lethal Boss. Your journey ends only when the <span className="text-white font-bold">Void Entity</span> is shattered on Floor 10.
          </p>
        </section>

        <section>
          <h3 className="text-blue-500 font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center text-xs">02</span>
            Force & Combat
          </h3>
          <div className="space-y-4">
            <div className="bg-zinc-800/40 p-4 rounded-2xl border border-zinc-800">
              <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                Combat is determined by <span className="text-emerald-400">Force</span>. Your win probability is calculated as:
                <br/>
                <span className="text-zinc-500 block mt-2 text-[10px]">Probability = Your Force / (Your Force + Enemy Force)</span>
              </p>
            </div>
            <p className="text-zinc-500 text-xs font-mono">
              Higher Force doesn't guarantee victory, it only tilts the odds in your favor. Gamble wisely.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-red-500 font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-red-500/10 rounded flex items-center justify-center text-xs">03</span>
            Lives & Permadeath
          </h3>
          <ul className="space-y-3 text-sm font-mono">
            <li className="flex gap-3">
              <span className="text-red-500">❤</span>
              <span className="text-zinc-400">You start with <span className="text-white">2 Lives</span>. Basic enemies consume 1 Life on defeat.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-600">💀</span>
              <span className="text-zinc-400"><span className="text-red-500">Floor Bosses</span> kill you instantly if you lose. No second chances.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-500">✨</span>
              <span className="text-zinc-400"><span className="text-emerald-400">Leveling Up</span> fully restores your Lives to 2.</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-yellow-500 font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-yellow-500/10 rounded flex items-center justify-center text-xs">04</span>
            Keys & Progression
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed font-mono">
            Defeating a Floor Boss grants a <span className="text-yellow-500 font-bold">Permanent Key</span>. Even if your hero dies, your keys remain. You don't have to restart from Floor 1, but you must summon a new hero and grow their strength again.
          </p>
        </section>

        <section>
          <h3 className="text-zinc-300 font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-xs">05</span>
            Loot System
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed font-mono">
            The Tower is efficient. Any equipment found on enemies is <span className="text-emerald-400">automatically equipped</span> if it is stronger than your current gear. No inventory management—just pure progression.
          </p>
        </section>
      </div>

      <div className="p-6 border-t border-zinc-800">
        <button onClick={onClose} className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">
          GOT IT
        </button>
      </div>
    </div>
  );
};

export default RulesView;
