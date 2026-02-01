
import React from 'react';
import { TerminalLog } from '../types';

interface TerminalOutputProps {
  logs: TerminalLog[];
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ logs }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 terminal-scrollbar space-y-1 text-sm md:text-base">
      {logs.map((log) => (
        <div key={log.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-left duration-300">
          <span className="text-gray-600 shrink-0 select-none">[{log.timestamp}]</span>
          <span className={`
            ${log.type === 'error' ? 'text-red-500' : ''}
            ${log.type === 'success' ? 'text-green-400 font-bold' : ''}
            ${log.type === 'warning' ? 'text-yellow-500' : ''}
            ${log.type === 'info' ? 'text-cyan-400' : ''}
            ${log.type === 'system' ? 'text-purple-400' : ''}
            break-all
          `}>
            {log.type === 'system' && <span className="mr-2">⚡</span>}
            {log.type === 'info' && <span className="mr-2">ℹ</span>}
            {log.type === 'error' && <span className="mr-2">✖</span>}
            {log.type === 'success' && <span className="mr-2">✔</span>}
            {log.message}
          </span>
        </div>
      ))}
    </div>
  );
};
