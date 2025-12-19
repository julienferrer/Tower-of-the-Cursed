
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-12">
        <div className="text-left w-1/3">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">YOU</div>
          <div className="text-3xl font-black mb-1">Hero</div>
          <div className="inline-block bg-emerald-500/10 text-emerald-400 font-mono text-xl px-4 py-1 rounded-lg border border-emerald-500/20">
            {heroForce}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-zinc-700 text-5xl font-black italic">VS</div>
        </div>

        <div className="text-right w-1/3">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">
            {isBoss ? 'GUARDIAN' : `NUMBER ${enemy.id} ${enemyRarity?.label.toUpperCase()}`}
          </div>
          <div className={`text-3xl font-black mb-1 ${isBoss ? 'text-red-500' : enemyRarity?.color}`}>
            {enemy.name}
          </div>
          <div className={`inline-block font-mono text-xl px-4 py-1 rounded-lg border ${isBoss ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
            {enemy.force}
          </div>
        </div>
      </div>

      {!result ? (
        <div className="flex flex-col items-center">
          <div className="mb-8 w-full max-w-sm">
             <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase mb-2">
               <span>Chance of Victory</span>
               <span className={winProb > 70 ? 'text-emerald-500' : winProb > 40 ? 'text-yellow-500' : 'text-red-500'}>{winProb}%</span>
             </div>
             <div className="h-4 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700 shadow-inner p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${winProb > 70 ? 'bg-emerald-500' : winProb > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${winProb}%` }}
                />
             </div>
          </div>

          <div className="flex gap-4">
             <button 
               onClick={onClose}
               className="px-10 py-4 bg-transparent hover:bg-zinc-800 text-zinc-500 rounded-2xl font-bold transition-all"
             >
               Retreat
             </button>
             <button 
               onClick={onFight}
               className={`px-12 py-4 text-black rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl ${isBoss ? 'bg-red-500 hover:bg-red-400 shake' : 'bg-white hover:bg-zinc-200'}`}
             >
               FIGHT
             </button>
          </div>
          
          {isBoss && (
            <div className="mt-8 px-6 py-3 bg-red-950/20 border border-red-900/40 rounded-xl text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">
              ⚠️ Warning: Defeat means permanent character loss
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`text-5xl font-black mb-6 tracking-tighter ${result.success ? 'text-emerald-500' : 'text-red-500'}`}>
            {result.success ? 'VICTORY' : 'DEFEAT'}
          </div>
          
          <div className="bg-black/40 rounded-3xl p-6 w-full max-w-md border border-zinc-800 mb-8 space-y-4">
            {result.success ? (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Rewards</span>
                  <div className="flex gap-3">
                    {result.exp && <span className="text-emerald-400 font-mono">+{result.exp} EXP</span>}
                    {result.gold && <span className="text-yellow-500 font-mono">+{result.gold}🪙</span>}
                  </div>
                </div>
                {result.loot && (
                  <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <span className="text-2xl">🎁</span>
                       <div>
                         <div className="text-[10px] text-zinc-500 uppercase font-bold">New Item Found</div>
                         <div className="text-sm font-bold">{result.loot.name}</div>
                       </div>
                     </div>
                     <span className="text-emerald-500 text-xs font-mono font-bold">+{result.loot.forceBonus} Force</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-zinc-400 text-center py-4">{result.message}</p>
            )}
          </div>

          <button 
            onClick={onClose}
            className="px-12 py-4 bg-zinc-100 hover:bg-white text-black rounded-2xl font-black transition-all"
          >
            CONTINUE
          </button>
        </div>
      )}
    </div>
  );
};

export default CombatPanel;
