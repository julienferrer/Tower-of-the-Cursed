
import React, { useState } from 'react';
import { ENEMY_DATA, CLASS_DATA, SLOT_NAMES, RARITY_BONUS } from '../constants';
import { getRarityFromProb } from '../gameLogic';
import { Rarity, SlotType } from '../types';

interface CodexViewProps {
  collection?: { [K in SlotType]: Rarity[] };
  onClose: () => void;
}

const CodexView: React.FC<CodexViewProps> = ({ collection, onClose }) => {
  const [tab, setTab] = useState<'enemies' | 'heroes' | 'vault' | 'progression'>('enemies');

  const rarities = [Rarity.COMMON, Rarity.UNCOMMON, Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-300 h-full">
      <div className="p-6 bg-zinc-800/30 border-b border-zinc-800 flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-black uppercase tracking-tighter">Tower Codex</h2>
           <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">Secrets of the Ascension</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex border-b border-zinc-800 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setTab('enemies')}
          className={`flex-1 min-w-[100px] py-4 font-bold text-[10px] uppercase tracking-widest transition-colors ${tab === 'enemies' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Bestiary
        </button>
        <button 
          onClick={() => setTab('heroes')}
          className={`flex-1 min-w-[100px] py-4 font-bold text-[10px] uppercase tracking-widest transition-colors ${tab === 'heroes' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Registry
        </button>
        <button 
          onClick={() => setTab('progression')}
          className={`flex-1 min-w-[100px] py-4 font-bold text-[10px] uppercase tracking-widest transition-colors ${tab === 'progression' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Force Chart
        </button>
        <button 
          onClick={() => setTab('vault')}
          className={`flex-1 min-w-[100px] py-4 font-bold text-[10px] uppercase tracking-widest transition-colors ${tab === 'vault' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Treasury
        </button>
      </div>

      <div className="p-6 overflow-y-auto max-h-[600px] bg-black/20">
        {tab === 'enemies' && (
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-zinc-600 uppercase mb-2 px-2">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Enemy</div>
              <div className="col-span-2">Force</div>
              <div className="col-span-2 text-center">Spawn</div>
              <div className="col-span-3 text-right">Rarity</div>
            </div>
            {ENEMY_DATA.map((enemy) => {
              const rarity = getRarityFromProb(enemy.spawnRate);
              return (
                <div key={enemy.id} className="grid grid-cols-12 gap-2 p-3 bg-black/30 rounded-xl border border-zinc-800/50 items-center text-sm font-mono">
                  <div className="col-span-1 text-zinc-600">{enemy.id}</div>
                  <div className={`col-span-4 font-bold ${rarity.color}`}>{enemy.name}</div>
                  <div className="col-span-2 text-zinc-200">{enemy.force}</div>
                  <div className="col-span-2 text-center text-zinc-500">{(enemy.spawnRate * 100).toFixed(1)}%</div>
                  <div className="col-span-3 flex justify-end">
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${rarity.bg} ${rarity.color} ${rarity.border} font-bold uppercase`}>
                      {rarity.label.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'heroes' && (
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-zinc-600 uppercase mb-2 px-2">
              <div className="col-span-5">Class</div>
              <div className="col-span-3 text-center">Summon Rate</div>
              <div className="col-span-4 text-right">Rarity</div>
            </div>
            {CLASS_DATA.map((c) => {
              const rarity = getRarityFromProb(c.probability);
              return (
                <div key={c.id} className="grid grid-cols-12 gap-2 p-3 bg-black/30 rounded-xl border border-zinc-800/50 items-center text-sm font-mono">
                  <div className={`col-span-5 font-bold ${rarity.color}`}>{c.name}</div>
                  <div className="col-span-3 text-center text-zinc-400 font-bold">{(c.probability * 100).toFixed(1)}%</div>
                  <div className="col-span-4 flex justify-end">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${rarity.bg} ${rarity.color} ${rarity.border} font-bold uppercase`}>
                      {rarity.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'progression' && (
          <div className="space-y-4">
             <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl mb-6">
               <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Growth Mechanic</h3>
               <p className="text-[10px] text-zinc-500 font-mono">Every soul gains exactly +15 Base Force per level.</p>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead className="text-zinc-600 uppercase border-b border-zinc-800">
                    <tr>
                      <th className="py-2 pr-4">Class</th>
                      <th className="py-2 px-2 text-center">Lvl 1</th>
                      <th className="py-2 px-2 text-center">Lvl 5</th>
                      <th className="py-2 px-2 text-center">Lvl 10</th>
                      <th className="py-2 px-2 text-center">Lvl 15</th>
                      <th className="py-2 px-2 text-center">Lvl 20</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {CLASS_DATA.map(c => (
                      <tr key={c.id} className="hover:bg-zinc-800/20">
                        <td className="py-3 pr-4 font-bold text-zinc-300">{c.name}</td>
                        <td className="py-3 px-2 text-center text-zinc-500">{c.minForce}</td>
                        <td className="py-3 px-2 text-center text-zinc-400">{c.minForce + (4 * 15)}</td>
                        <td className="py-3 px-2 text-center text-zinc-300">{c.minForce + (9 * 15)}</td>
                        <td className="py-3 px-2 text-center text-zinc-200">{c.minForce + (14 * 15)}</td>
                        <td className="py-3 px-2 text-center text-emerald-500 font-bold">{c.maxForce}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {tab === 'vault' && (
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4 border-l-2 border-emerald-500 pl-3">How to Obtain</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-zinc-800/40 p-4 rounded-2xl border border-zinc-800">
                    <div className="text-xl mb-1">⚔️ Enemies</div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">Defeat basic enemies to find equipment. Stronger enemies have higher drop rates and better rarity potential.</p>
                 </div>
                 <div className="bg-zinc-800/40 p-4 rounded-2xl border border-zinc-800">
                    <div className="text-xl mb-1">🔄 Automatic</div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">The tower automatically equips the strongest item found. No management required, focus on the fight.</p>
                 </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Rarity Multipliers</h3>
              <div className="flex flex-wrap gap-2">
                {rarities.map(r => (
                  <div key={r} className="bg-black/30 px-3 py-2 rounded-xl border border-zinc-800 flex items-center gap-2">
                    <span className={`text-[10px] font-bold ${getRarityFromProb(r === Rarity.LEGENDARY ? 0.01 : r === Rarity.EPIC ? 0.02 : r === Rarity.RARE ? 0.04 : r === Rarity.UNCOMMON ? 0.08 : 0.15).color}`}>
                      {r}
                    </span>
                    <span className="text-emerald-500 font-mono text-xs">+{RARITY_BONUS[r]} Force</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodexView;
