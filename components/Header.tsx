
import React from 'react';
import { Hero } from '../types';

interface HeaderProps {
  hero: Hero | null;
  unlockedKeys: string[];
  onOpenCodex: () => void;
}

const Header: React.FC<HeaderProps> = ({ hero, unlockedKeys, onOpenCodex }) => {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center rotate-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase">Tower of the Cursed</h1>
            <div className="flex gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
              <span>Floor {Math.max(1, unlockedKeys.length + 1)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button onClick={onOpenCodex} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500" title="Codex">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
             </svg>
           </button>
           <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
             <span className="text-yellow-500 font-bold text-xs">🪙</span>
             <span className="font-mono text-xs">{hero?.gold || 0}</span>
           </div>
           <div className="flex -space-x-1">
             {unlockedKeys.map((key, i) => (
               <div key={i} className="w-6 h-6 bg-zinc-800 rounded-full border border-black flex items-center justify-center text-[10px] shadow-lg" title={key}>
                 🔑
               </div>
             ))}
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
