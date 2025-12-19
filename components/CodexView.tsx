
import React, { useState } from 'react';
import { ENEMY_DATA, CLASS_DATA } from '../constants';

interface CodexViewProps {
  onClose: () => void;
}

const CodexView: React.FC<CodexViewProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'enemies' | 'heroes'>('enemies');

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-300">
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
      </div>

      <div className="p-6 overflow-y-auto max-h-[500px]">
        {tab === 'enemies' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-zinc-600 uppercase mb-2 px-2">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Name</div>
              <div className="col-span-3">Force</div>
              <div className="col-span-3 text-right">Spawn</div>
            </div>
            {ENEMY_DATA.map((enemy) => (
              <div key={enemy.id} className="grid grid-cols-12 gap-2 p-3 bg-black/30 rounded-xl border border-zinc-800/50 items-center text-sm font-mono">
                <div className="col-span-1 text-zinc-600">{enemy.id}</div>
                <div className="col-span-5 font-bold text-zinc-200">{enemy.name}</div>
                <div className="col-span-3 text-emerald-500">{enemy.force}</div>
                <div className="col-span-3 text-right text-zinc-500">{(enemy.spawnRate * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-zinc-600 uppercase mb-2 px-2">
              <div className="col-span-6">Class</div>
              <div className="col-span-3">Potential</div>
              <div className="col-span-3 text-right">Summon</div>
            </div>
            {CLASS_DATA.map((c) => (
              <div key={c.id} className="grid grid-cols-12 gap-2 p-3 bg-black/30 rounded-xl border border-zinc-800/50 items-center text-sm font-mono">
                <div className="col-span-6 font-bold text-zinc-200">{c.name}</div>
                <div className="col-span-3 text-emerald-500">{Math.floor(c.minForce/10)}-{Math.floor(c.maxForce/10)}</div>
                <div className="col-span-3 text-right text-zinc-500">{(c.probability * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodexView;
