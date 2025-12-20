
import React from 'react';
import { Hero } from '../types';
import { calculateTotalForce, getRequiredExp, getRarityFromProb } from '../gameLogic';
import { SLOT_NAMES } from '../constants';

interface HeroCardProps {
  hero: Hero | null;
  isDead: boolean;
  onSummon: (type: 'standard' | 'legendary') => void;
  onSummonArsenal: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, isDead, onSummon, onSummonArsenal }) => {
  if (!hero) return null;

  const totalForce = calculateTotalForce(hero);
  const expNeeded = getRequiredExp(hero.level);
  const rarity = getRarityFromProb(hero.class.probability);

  return (
    <div className={`bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl transition-all ${isDead ? 'opacity-50 grayscale scale-[0.98]' : ''}`}>
      <div className={`bg-zinc-800/50 p-4 md:p-6 flex items-start justify-between border-b border-zinc-700/30`}>
        <div className="flex-1 min-w-0">
          <h2 className={`font-bold text-[10px] uppercase tracking-widest mb-1 truncate ${rarity.color}`}>
            {hero.class.name}
          </h2>
          <div className={`text-[8px] font-bold uppercase tracking-wider mb-2 inline-block px-1.5 py-0.5 rounded ${rarity.bg} ${rarity.color}`}>
            {rarity.label}
          </div>
          <div className="flex items-center gap-3">
             <span className="text-2xl md:text-3xl font-black tracking-tight">Lvl {hero.level}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-emerald-400 font-mono text-[9px] mb-0.5 font-bold uppercase tracking-widest">FORCE</div>
          <div className="text-3xl md:text-4xl font-black text-white tracking-tighter">{totalForce}</div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {/* Vital Stats */}
        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="bg-black/40 rounded-2xl p-2.5 md:p-3 border border-zinc-800/50">
            <span className="block text-[8px] text-zinc-600 uppercase font-bold mb-1.5 tracking-wider">Lives</span>
            <div className="flex gap-1.5">
              {[...Array(2)].map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i < hero.lives ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-zinc-800/80'}`} />
              ))}
            </div>
          </div>
          <div className="bg-black/40 rounded-2xl p-2.5 md:p-3 border border-zinc-800/50">
            <span className="block text-[8px] text-zinc-600 uppercase font-bold mb-1.5 tracking-wider">Experience</span>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
               <div 
                 className="bg-emerald-500 h-full transition-all duration-700" 
                 style={{ width: `${Math.min(100, (hero.exp / expNeeded) * 100)}%` }} 
               />
            </div>
            <div className="text-[8px] text-zinc-500 font-mono mt-1 text-right">{hero.exp}/{expNeeded}</div>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Equipment</h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
            {SLOT_NAMES.map(slot => {
              const item = hero.equipment[slot];
              return (
                <div key={slot} className="flex items-center justify-between bg-black/30 p-2 rounded-xl border border-zinc-800/50">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 md:w-9 md:h-9 bg-zinc-800 rounded-lg flex items-center justify-center text-sm md:text-lg shrink-0">
                      {slot === 'Weapon' && '⚔️'}
                      {slot === 'Armor' && '🛡️'}
                      {slot === 'Accessory' && '💍'}
                      {slot === 'Relic' && '🏺'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[7px] text-zinc-700 uppercase font-bold">{slot}</div>
                      <div className={`text-[10px] md:text-xs font-bold truncate ${item ? 'text-zinc-200' : 'text-zinc-800 italic'}`}>
                        {item ? item.name : 'Empty'}
                      </div>
                    </div>
                  </div>
                  {item && (
                    <div className="text-emerald-500 text-[9px] font-mono font-bold shrink-0 ml-1">
                      +{item.forceBonus}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {!isDead && (
          <div className="flex flex-col gap-2 mt-4 md:mt-6">
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => onSummon('standard')}
                className="py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-xl font-bold transition-all border border-zinc-700/50 text-[9px] uppercase tracking-widest active:scale-95"
              >
                New Hero <span className="text-yellow-600 ml-1">10🪙</span>
              </button>
              <button 
                onClick={onSummonArsenal}
                disabled={hero.gold < 50}
                className={`py-3 bg-zinc-900 hover:bg-emerald-900/10 text-emerald-500 rounded-xl font-bold transition-all border border-emerald-900/30 text-[9px] uppercase tracking-widest active:scale-95 ${hero.gold < 50 ? 'opacity-30 grayscale' : ''}`}
              >
                Arsenal <span className="text-yellow-600 ml-1">50🪙</span>
              </button>
            </div>
            <button 
              onClick={() => onSummon('legendary')}
              disabled={hero.gold < 100}
              className={`py-3.5 bg-zinc-900 hover:bg-yellow-600/10 text-yellow-500 rounded-xl font-bold transition-all border border-yellow-600/30 text-[10px] uppercase tracking-widest active:scale-95 shadow-lg shadow-yellow-900/5 ${hero.gold < 100 ? 'opacity-30 grayscale' : ''}`}
            >
              Legendary Hero (100🪙)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroCard;
