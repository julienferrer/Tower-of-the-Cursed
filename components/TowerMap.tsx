
import React from 'react';
import { BOSS_DATA } from '../constants';
import { Boss } from '../types';

interface TowerMapProps {
  unlockedKeys: string[];
  maxBossDefeated: number;
  onChallenge: (boss: Boss) => void;
}

const TowerMap: React.FC<TowerMapProps> = ({ unlockedKeys, maxBossDefeated, onChallenge }) => {
  return (
    <div className="bg-zinc-900/40 rounded-3xl p-5 md:p-6 border border-zinc-800 h-full overflow-y-auto max-h-[600px] flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter">Tower Ascension</h2>
        <span className="bg-zinc-800 text-zinc-400 text-[8px] md:text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-widest">
          {maxBossDefeated}/{BOSS_DATA.length}
        </span>
      </div>

      <div className="flex flex-col-reverse gap-3">
        {BOSS_DATA.map((boss, index) => {
          const isUnlocked = boss.id === 1 || maxBossDefeated >= boss.id - 1;
          const isDefeated = maxBossDefeated >= boss.id;

          return (
            <div 
              key={boss.id}
              className={`relative flex items-center p-3.5 md:p-4 rounded-2xl border transition-all ${
                isDefeated 
                ? 'bg-zinc-800/20 border-emerald-900/10 opacity-60' 
                : isUnlocked 
                  ? 'bg-zinc-900 border-zinc-700 hover:border-zinc-500 cursor-pointer group active:scale-[0.98]' 
                  : 'bg-zinc-950 border-zinc-900 opacity-40 grayscale'
              }`}
              onClick={() => isUnlocked && !isDefeated && onChallenge(boss)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs shrink-0 ${isDefeated ? 'bg-emerald-500/10 text-emerald-500' : isUnlocked ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-zinc-800'}`}>
                     {boss.id}
                   </div>
                   <div className="min-w-0 pr-2">
                     <h3 className={`font-bold text-sm md:text-base leading-tight break-words ${isDefeated ? 'text-zinc-600 line-through' : isUnlocked ? 'text-white' : 'text-zinc-800'}`}>
                       {boss.name}
                     </h3>
                     <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-mono uppercase tracking-widest mt-0.5">
                       <span className={isUnlocked ? 'text-zinc-500' : 'text-zinc-800'}>STR: {boss.force}</span>
                       {isUnlocked && <span className="text-zinc-800 shrink-0">•</span>}
                       {isUnlocked && <span className="text-yellow-700 truncate">{boss.keyName}</span>}
                     </div>
                   </div>
                </div>
              </div>

              <div className="shrink-0 ml-auto">
                {isDefeated ? (
                  <div className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : isUnlocked ? (
                  <div className="bg-zinc-100 text-black text-[9px] font-black px-3 py-1.5 rounded-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity uppercase">
                    Fight
                  </div>
                ) : (
                  <svg className="w-5 h-5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>

              {index < BOSS_DATA.length - 1 && (
                <div className="absolute -bottom-3.5 left-7 md:left-8 w-px h-3.5 bg-zinc-800" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TowerMap;
