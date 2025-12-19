
import React from 'react';
import { Hero } from '../types';
import { calculateTotalForce, getRequiredExp, getRarityFromProb } from '../gameLogic';
import { SLOT_NAMES } from '../constants';

interface HeroCardProps {
  hero: Hero | null;
  isDead: boolean;
  onSummon: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, isDead, onSummon }) => {
  if (!hero) return null;

  const totalForce = calculateTotalForce(hero);
  const expNeeded = getRequiredExp(hero.level);
  const rarity = getRarityFromProb(hero.class.probability);

  return (
    <div className={`bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl transition-all ${isDead ? 'opacity-50 grayscale scale-[0.98]' : ''}`}>
      <div className={`bg-zinc-800/50 p-6 flex items-start justify-between border-b border-zinc-700/30 ${hero.isMiserable ? 'border-l-4 border-l-zinc-600' : ''}`}>
        <div>
          <h2 className={`font-bold text-xs uppercase tracking-widest mb-1 ${hero.isMiserable ? 'text-zinc-500' : rarity.color}`}>
            {hero.isMiserable ? 'WRETCHED ' : ''}{hero.class.name}
          </h2>
          {!hero.isMiserable && (
            <div className={`text-[9px] font-bold uppercase tracking-wider mb-2 inline-block px-2 py-0.5 rounded ${rarity.bg} ${rarity.color}`}>
              {rarity.label}
            </div>
          )}
          <div className="flex items-center gap-3">
             <span className="text-3xl font-black tracking-tight">Level {hero.level}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-emerald-400 font-mono text-xs mb-1">FORCE</div>
          <div className="text-4xl font-black text-white tracking-tighter">{totalForce}</div>
        </div>
      </div>

      <div className="p-6">
        {/* Vital Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/40 rounded-2xl p-3 border border-zinc-800">
            <span className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">Lives</span>
            <div className="flex gap-1">
              {[...Array(2)].map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i < hero.lives ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-zinc-800'}`} />
              ))}
            </div>
          </div>
          <div className="bg-black/40 rounded-2xl p-3 border border-zinc-800">
            <span className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">Experience</span>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
               <div 
                 className="bg-emerald-500 h-full transition-all duration-500" 
                 style={{ width: `${Math.min(100, (hero.exp / expNeeded) * 100)}%` }} 
               />
            </div>
            <div className="text-[8px] text-zinc-600 font-mono mt-1 text-right">{hero.exp} / {expNeeded}</div>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Equipment</h3>
          <div className="grid grid-cols-1 gap-2">
            {SLOT_NAMES.map(slot => {
              const item = hero.equipment[slot];
              return (
                <div key={slot} className="flex items-center justify-between bg-black/30 p-2.5 rounded-xl border border-zinc-800/50 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-lg shadow-inner group-hover:bg-zinc-700 transition-colors">
                      {slot === 'Weapon' && '⚔️'}
                      {slot === 'Armor' && '🛡️'}
                      {slot === 'Accessory' && '💍'}
                      {slot === 'Relic' && '🏺'}
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase font-bold">{slot}</div>
                      <div className={`text-sm font-bold truncate ${item ? 'text-zinc-100' : 'text-zinc-600 italic'}`}>
                        {item ? item.name : 'Empty Slot'}
                      </div>
                    </div>
                  </div>
                  {item && (
                    <div className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-mono font-bold">
                      +{item.forceBonus}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {!isDead && (
          <button 
            onClick={onSummon}
            className="w-full mt-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-2xl font-bold transition-all border border-zinc-700 text-sm flex items-center justify-center gap-2 group"
          >
            <span>Replace Hero</span>
            <span className="text-yellow-500 group-hover:scale-110 transition-transform">10🪙</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default HeroCard;
