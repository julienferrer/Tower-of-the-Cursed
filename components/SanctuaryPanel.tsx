
import React from 'react';
import { Hero } from '../types';

interface SanctuaryPanelProps {
  hero: Hero;
  onReward: (type: 'force' | 'life') => void;
  onLeave: () => void;
}

const SanctuaryPanel: React.FC<SanctuaryPanelProps> = ({ hero, onReward, onLeave }) => {
  return (
    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.1)] animate-in fade-in zoom-in duration-500 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
        <span className="text-4xl">✨</span>
      </div>
      <h2 className="text-3xl font-black text-emerald-400 mb-2 uppercase tracking-tighter">Ether Sanctuary</h2>
      <p className="text-zinc-400 mb-8 max-w-sm">A mystical altar pulses with ancient energy. It offers you a choice to aid your ascent.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mb-8">
        <button 
          onClick={() => onReward('force')}
          className="p-6 bg-zinc-800/50 border border-zinc-700 hover:border-emerald-500 rounded-2xl text-left transition-all group"
        >
          <div className="text-emerald-500 text-xl mb-1">💪 Trial of Might</div>
          <p className="text-xs text-zinc-500 mb-4 font-mono">Accept a surge of raw energy to bolster your combat prowess.</p>
          <div className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-1 rounded inline-block font-bold">REWARD: +5 Force</div>
        </button>

        <button 
          onClick={() => onReward('life')}
          disabled={hero.gold < 20}
          className={`p-6 bg-zinc-800/50 border border-zinc-700 hover:border-red-500 rounded-2xl text-left transition-all group ${hero.gold < 20 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
        >
          <div className="text-red-500 text-xl mb-1">❤️ Ritual of Rebirth</div>
          <p className="text-xs text-zinc-500 mb-4 font-mono">Sacrifice wealth to mending your soul and restoring a life.</p>
          <div className="flex justify-between items-center">
             <div className="bg-red-500/10 text-red-400 text-[10px] px-2 py-1 rounded inline-block font-bold">REWARD: +1 Life</div>
             <span className="text-yellow-500 text-xs font-bold">Cost: 20🪙</span>
          </div>
        </button>
      </div>

      <button 
        onClick={onLeave}
        className="text-zinc-500 hover:text-white font-bold uppercase tracking-widest text-[10px]"
      >
        Ignore the Altar
      </button>
    </div>
  );
};

export default SanctuaryPanel;
