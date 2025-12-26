
import React, { useState } from 'react';
import { AdLibResponse } from '../types';

interface AdLibDisplayProps {
  result: AdLibResponse;
}

export const AdLibDisplay: React.FC<AdLibDisplayProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.annotatedLyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-black/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Booth Monitor</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="text-xs font-semibold px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors flex items-center space-x-2"
          >
            <i className={copied ? "fas fa-check text-green-500" : "fas fa-copy"}></i>
            <span>{copied ? 'Copied!' : 'Copy Session'}</span>
          </button>
        </div>
        <div className="p-6 md:p-10 mono text-lg leading-loose text-zinc-300">
          {result.annotatedLyrics.split('\n').map((line, i) => (
            <div key={i} className="mb-2 group">
              <span className="text-zinc-500 mr-4 text-sm select-none">{(i + 1).toString().padStart(2, '0')}</span>
              {line.split(/(\(.*?\))/).map((part, j) => 
                part.startsWith('(') ? (
                  <span key={j} className="text-purple-400 font-bold italic drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                    {part}
                  </span>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center">
            <i className="fas fa-bullhorn mr-2 text-purple-500"></i>
            Signature Intro Tag
          </h3>
          <p className="text-2xl font-extrabold text-white italic">
            "{result.signatureCall}"
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center">
            <i className="fas fa-list-check mr-2 text-purple-500"></i>
            Stock Ad-Libs
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.generalAdLibs.map((lib, i) => (
              <span key={i} className="px-3 py-1.5 bg-black border border-zinc-700 rounded-lg text-purple-300 font-bold text-sm">
                {lib}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2">
          Producer's Vibe Analysis
        </h3>
        <p className="text-zinc-400 leading-relaxed text-sm italic">
          {result.vibeAnalysis}
        </p>
      </div>
    </div>
  );
};
