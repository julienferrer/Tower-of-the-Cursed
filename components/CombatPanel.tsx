
import React, { useState, useEffect } from 'react';
import { Hero, Enemy, Boss, Equipment } from '../types';
import { calculateTotalForce, getWinProbability, getRarityFromProb } from '../gameLogic';

interface CombatPanelProps {
  hero: Hero;
  enemy: Enemy | Boss;
  result: { success: boolean; loot?: Equipment | null; gold?: number; exp?: number; message: string } | null;
  onFight: () => void;
  onClose: () => void;
}

const CombatPanel: React.FC<CombatPanelProps> = ({ hero, enemy, result, onFight, onClose }) => {
  const heroForce = calculateTotalForce(hero);
  const winProb = Math.round(getWinProbability(heroForce, enemy.force) * 100);
  const isBoss = 'keyName' in enemy;
  const enemyRarity = !isBoss ? getRarityFromProb((enemy as Enemy).spawnRate) : null;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="flex flex-row items-start justify-between mb-8 md:mb-12 gap-2">
        {/* Hero Side */}
        <div className="flex flex-col items-center md:items-start w-[45%]">
          <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">YOU</div>
          <div className="text-lg md:text-3xl font-black mb-2 text-center md:text-left truncate w-full">Hero</div>
          <div className="bg-emerald-500/10 text-emerald-400 font-mono text-base md:text-xl px-3 md:px-4 py-1 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            {heroForce}
          </div>
        </div>

        {/* VS Indicator */}
        <div className="flex flex-col items-center justify-center pt-6">
          <div className="text-zinc-800 text-xl md:text-5xl font-black italic select-none">VS</div>
        </div>

        {/* Enemy Side */}
        <div className="flex flex-col items-center md:items-end w-[45%]">
          <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">
            {isBoss ? 'GUARDIAN' : `LEVEL ${enemy.id}`}
          </div>
          <div className={`text-lg md:text-3xl font-black mb-2 text-center md:text-right leading-tight break-words w-full ${isBoss ? 'text-red-500' : enemyRarity?.color}`}>
            {enemy.name}
          </div>
          <div className={`font-mono text-base md:text-xl px-3 md:px-4 py-1 rounded-xl border ${isBoss ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
            {enemy.force}
          </div>
        </div>
      </div>

      {!result ? (
        <div className="flex flex-col items-center">
          <div className="mb-8 w-full max-w-sm">
             <div className="flex justify-between text-[10px] font-bold text-zinc-600 uppercase mb-2 tracking-widest px-1">
               <span>Win Rate</span>
               <span className={winProb > 70 ? 'text-emerald-500' : winProb > 40 ? 'text-yellow-500' : 'text-red-500'}>{winProb}%</span>
             </div>
             <div className="h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 shadow-inner p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${winProb > 70 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : winProb > 40 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}
                  style={{ width: `${winProb}%` }}
                />
             </div>
          </div>

          <div className="flex gap-3 w-full max-w-sm">
             <button 
               onClick={onClose}
               className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-600 rounded-2xl font-bold transition-all border border-zinc-800 active:scale-95 text-xs uppercase tracking-widest"
             >
               Retreat
             </button>
             <button 
               onClick={onFight}
               className={`flex-[2] py-4 text-black rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl ${isBoss ? 'bg-red-600 hover:bg-red-500' : 'bg-white hover:bg-zinc-200'}`}
             >
               FIGHT
             </button>
          </div>
          
          {isBoss && (
            <div className="mt-8 px-6 py-3 bg-red-950/10 border border-red-900/20 rounded-xl text-red-600 text-[9px] font-bold uppercase tracking-widest text-center animate-pulse">
              ⚠️ Warning: Defeat means permanent loss
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`text-4xl md:text-5xl font-black mb-6 tracking-tighter ${result.success ? 'text-emerald-500' : 'text-red-600'}`}>
            {result.success ? 'VICTORY' : 'DEFEAT'}
          </div>
          
          <div className="bg-black/40 rounded-3xl p-5 md:p-6 w-full max-w-md border border-zinc-800 mb-8 space-y-4">
            {result.success ? (
              <>
                <div className="flex justify-between items-center px-1">
                  <span className="text-zinc-600 font-bold uppercase tracking-widest text-[9px]">Spoils of War</span>
                  <div className="flex gap-3">
                    {result.exp && <span className="text-emerald-500 font-mono text-xs font-bold">+{result.exp} EXP</span>}
                    {result.gold && <span className="text-yellow-500 font-mono text-xs font-bold">+{result.gold}🪙</span>}
                  </div>
                </div>
                {result.loot ? (
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <span className="text-2xl">🎁</span>
                       <div className="min-w-0">
                         <div className="text-[9px] text-zinc-600 uppercase font-bold">Auto Equipped</div>
                         <div className="text-sm font-bold text-white truncate">{result.loot.name}</div>
                       </div>
                     </div>
                     <span className="text-emerald-500 text-xs font-mono font-bold shrink-0 ml-2">+{result.loot.forceBonus} ATK</span>
                  </div>
                ) : (
                  <p className="text-zinc-500 text-xs italic text-center py-2">The enemy held nothing of value.</p>
                )}
              </>
            ) : (
              <p className="text-zinc-500 text-center py-4 text-sm leading-relaxed">{result.message}</p>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full max-w-xs py-4 bg-white hover:bg-zinc-200 text-black rounded-2xl font-black transition-all active:scale-95"
          >
            CONTINUE
          </button>
        </div>
      )}
    </div>
  );
};

export default CombatPanel;
