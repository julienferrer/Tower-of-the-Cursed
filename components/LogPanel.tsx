
import React from 'react';

interface LogPanelProps {
  logs: string[];
}

const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  return (
    <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden flex flex-col h-[300px]">
      <div className="p-4 bg-zinc-800/30 border-b border-zinc-800 flex items-center justify-between">
         <h3 className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Adventure Logs</h3>
         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[11px] leading-relaxed">
        {logs.map((log, i) => (
          <div key={i} className={`pb-2 border-b border-zinc-800/30 last:border-0 ${i === 0 ? 'text-zinc-100' : 'text-zinc-600'}`}>
            <span className="text-zinc-800 mr-2">[{logs.length - i}]</span>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogPanel;
