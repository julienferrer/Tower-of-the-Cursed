
import React, { useState } from 'react';
import { ENEMY_DATA, CLASS_DATA, SLOT_NAMES, RARITY_BONUS } from '../constants';
import { getRarityFromProb } from '../gameLogic';
import { Rarity, SlotType } from '../types';

interface CodexViewProps {
  collection?: { [K in SlotType]: Rarity[] };
  onClose: () => void;
}

const CodexView: React.FC<CodexViewProps> = ({ collection, onClose }) => {
  const [tab, setTab] = useState<'enemies' | 'heroes' | 'vault'>('enemies');

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

      <div className="flex border-b border-zinc-800">
        <button 
          onClick={() => setTab('enemies')}
          className={`flex-1 py-4 font-bold text-xs uppercase tracking-widest transition-colors ${tab === 'enemies' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Bestiary
        </button>
        <button 
          onClick={() => setTab('heroes')}
          className={`flex-1 py-4 font-bold text-xs uppercase tracking-widest transition-colors ${tab === 'heroes' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Soul Registry
        </button>
        <button 
          onClick={() => setTab('vault')}
          className={`flex-1 py-4 font-bold text-xs uppercase tracking-widest transition-colors ${tab === 'vault' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
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
              <div className="col-span-5 text-right">Rarity</div>
            </div>
            {ENEMY_DATA.map((enemy) => {
              const rarity = getRarityFromProb(enemy.spawnRate);
              return (
                <div key={enemy.id} className="grid grid-cols-12 gap-2 p-3 bg-black/30 rounded-xl border border-zinc-800/50 items-center text-sm font-mono">
                  <div className="col-span-1 text-zinc-600">{enemy.id}</div>
                  <div className={`col-span-4 font-bold ${rarity.color}`}>{enemy.name}</div>
                  <div className="col-span-2 text-zinc-200">{enemy.force}</div>
                  <div className="col-span-5 flex justify-end">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${rarity.bg} ${rarity.color} ${rarity.border} font-bold uppercase`}>
                      {rarity.label}
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
              <div className="col-span-2">Potential</div>
              <div className="col-span-5 text-right">Rarity</div>
            </div>
            {CLASS_DATA.map((c) => {
              const rarity = getRarityFromProb(c.probability);
              return (
                <div key={c.id} className="grid grid-cols-12 gap-2 p-3 bg-black/30 rounded-xl border border-zinc-800/50 items-center text-sm font-mono">
                  <div className={`col-span-5 font-bold ${rarity.color}`}>{c.name}</div>
                  <div className="col-span-2 text-zinc-200">{Math.floor(c.minForce/10)}-{Math.floor(c.maxForce/10)}</div>
                  <div className="col-span-5 flex justify-end">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${rarity.bg} ${rarity.color} ${rarity.border} font-bold uppercase`}>
                      {rarity.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'vault' && (
          <div className="space-y-8">
            {/* Guide Section */}
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

            {/* Rarity Table */}
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

            {/* Collection Log */}
            <section>
               <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Collection Log</h3>
               <div className="grid grid-cols-1 gap-4">
                 {SLOT_NAMES.map(slot => (
                   <div key={slot} className="bg-black/30 p-4 rounded-2xl border border-zinc-800">
                      <div className="text-xs font-bold uppercase mb-3 text-zinc-400">{slot}s Found</div>
                      <div className="flex gap-2">
                         {rarities.map(r => {
                           const isFound = collection && collection[slot].includes(r);
                           const rColor = getRarityFromProb(r === Rarity.LEGENDARY ? 0.01 : r === Rarity.EPIC ? 0.02 : r === Rarity.RARE ? 0.04 : r === Rarity.UNCOMMON ? 0.08 : 0.15);
                           return (
                             <div 
                               key={r} 
                               className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${isFound ? `${rColor.bg} ${rColor.border} text-xl shadow-lg` : 'bg-zinc-900 border-zinc-800 text-zinc-800 opacity-20 grayscale'}`}
                               title={isFound ? `${r} ${slot}` : 'Not found'}
                             >
                                {slot === 'Weapon' && '⚔️'}
                                {slot === 'Armor' && '🛡️'}
                                {slot === 'Accessory' && '💍'}
                                {slot === 'Relic' && '🏺'}
                             </div>
                           );
                         })}
                      </div>
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
