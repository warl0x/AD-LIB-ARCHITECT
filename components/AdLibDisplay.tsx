
import React, { useState } from 'react';
import { AdLibResponse } from '../types';

interface AdLibDisplayProps {
  result: AdLibResponse;
}

const SAMPLE_LIBRARY = [
  "Skrrt!", "Brrr!", "Yeah!", "Let's go!", "Facts!", "On god!", "Phew!", 
  "Splash!", "Woah!", "Hey!", "Ayy!", "Straight up!", "No cap!", "It's lit!"
];

export const AdLibDisplay: React.FC<AdLibDisplayProps> = ({ result }) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [sessionCopied, setSessionCopied] = useState(false);

  const getFullFormattedScript = () => {
    const notesHeader = "=== EXECUTIVE PRODUCER NOTES ===\n";
    const notesBody = `${result.vibeAnalysis}\n\n`;

    const reportHeader = "=== LYRIC ENHANCEMENT REPORT ===\n";
    const reportBody = result.lyricSuggestions && result.lyricSuggestions.length > 0
      ? result.lyricSuggestions.map(s => 
          `• ORIGINAL: "${s.originalLine}"\n  SUGGESTED: "${s.suggestedChange}"\n  LOGIC: ${s.reason}`
        ).join('\n\n') + "\n\n"
      : "";

    const signatureHeader = result.signatureCall ? `=== SIGNATURE TAG ===\n"${result.signatureCall}"\n\n` : "";

    const scriptHeader = "=== LIVE RECORDING SCRIPT ===\n";
    
    // Process annotated lyrics to ensure ad-libs are on their own lines
    const scriptBody = result.annotatedLyrics
      .split('\n')
      .map(line => {
        // Split by ad-libs in parentheses, trim everything, and join with newlines
        return line
          .split(/(\(.*?\))/)
          .map(part => part.trim())
          .filter(part => part !== "")
          .join('\n');
      })
      .join('\n\n'); // Keep space between original stanzas/verses

    return `${notesHeader}${notesBody}${reportHeader}${reportBody}${signatureHeader}${scriptHeader}${scriptBody}`;
  };

  const copyToClipboard = (text: string, isSession: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isSession) {
      setSessionCopied(true);
      setTimeout(() => setSessionCopied(false), 2000);
    } else {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 1500);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      
      {/* SECTION: Producer's Dashboard */}
      <div className="grid grid-cols-1 gap-6">
        {/* Vibe Analysis Card */}
        <div className="bg-purple-950/20 border border-purple-500/30 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <i className="fas fa-quote-right text-6xl text-purple-400"></i>
          </div>
          <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-3 flex items-center">
            <span className="w-2 h-2 rounded-full bg-purple-500 mr-2 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
            Executive Producer's Notes
          </h3>
          <p className="text-zinc-300 text-lg leading-relaxed italic font-medium relative z-10">
            "{result.vibeAnalysis}"
          </p>
        </div>

        {/* Lyric Enhancement Report */}
        {result.lyricSuggestions && result.lyricSuggestions.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em] flex items-center">
                <i className="fas fa-microscope mr-2"></i>
                Lyric Enhancement Report
              </h3>
              <span className="text-[10px] text-zinc-600 font-mono">A&R VERIFIED // v2.4</span>
            </div>
            
            <div className="space-y-6">
              {result.lyricSuggestions.map((suggestion, idx) => (
                <div key={idx} className="relative pl-6 border-l border-zinc-800 space-y-3 group hover:border-cyan-500/50 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-zinc-600 uppercase">Input Draft</span>
                      <p className="text-zinc-500 italic text-sm line-through decoration-zinc-700/50">
                        {suggestion.originalLine}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-cyan-500 uppercase">Studio Master</span>
                      <p className="text-white font-bold text-base leading-tight">
                        {suggestion.suggestedChange}
                      </p>
                    </div>
                  </div>
                  <div className="bg-zinc-950/50 border border-zinc-800/50 p-3 rounded-xl flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <i className="fas fa-info text-[8px] text-cyan-400"></i>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      <span className="text-cyan-600 font-bold uppercase text-[9px] mr-1">Logic:</span>
                      {suggestion.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION: Live Recording Guide (Booth Monitor) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="p-5 border-b border-zinc-800 bg-black/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <span className="w-3 h-3 rounded-full bg-red-600 block shadow-[0_0_15px_rgba(220,38,38,0.6)]"></span>
              <span className="absolute inset-0 w-3 h-3 rounded-full bg-red-600 animate-ping opacity-75"></span>
            </div>
            <span className="text-[11px] font-black tracking-[0.25em] text-zinc-100 uppercase">Booth Monitor // REC</span>
          </div>
          <button
            onClick={() => copyToClipboard(getFullFormattedScript(), true)}
            className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-all flex items-center space-x-2"
          >
            <i className={sessionCopied ? "fas fa-check" : "fas fa-copy"}></i>
            <span>{sessionCopied ? 'Copied Full Script' : 'Copy Full Script'}</span>
          </button>
        </div>
        
        <div className="p-8 md:p-14 mono text-xl md:text-2xl leading-[1.8] text-zinc-200 bg-[linear-gradient(rgba(168,85,247,0.02)_2px,transparent_2px)] bg-[length:100%_3.5rem] selection:bg-purple-500/30">
          {result.annotatedLyrics.split('\n').map((line, i) => (
            <div key={i} className="mb-10 last:mb-0 relative group">
              <span className="absolute -left-12 top-2 text-zinc-800 text-[10px] font-mono font-bold select-none opacity-50 group-hover:opacity-100 transition-opacity">
                {String(i + 1).padStart(3, '0')}
              </span>
              
              <div className="space-y-3">
                {line.split(/(\(.*?\))/).map((part, j) => {
                  const trimmedPart = part.trim();
                  if (!trimmedPart) return null;

                  if (trimmedPart.startsWith('(') && trimmedPart.endsWith(')')) {
                    return (
                      <div 
                        key={j} 
                        className="text-purple-400 font-black italic pl-6 md:pl-12 py-3 text-lg md:text-xl drop-shadow-[0_0_12px_rgba(168,85,247,0.3)] border-l-4 border-purple-600/30 ml-2 animate-in slide-in-from-left-4 duration-500 bg-purple-500/5 rounded-r-xl"
                      >
                        {trimmedPart}
                      </div>
                    );
                  }

                  return (
                    <div key={j} className="font-bold text-white tracking-wide border-l-4 border-transparent pl-2">
                      {trimmedPart}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="px-8 py-4 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center text-[10px] font-black tracking-widest text-zinc-600">
          <span>END OF TRANSMISSION</span>
          <div className="flex space-x-6">
             <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]"></div>
                <span className="text-zinc-400">MAIN VOCALS</span>
             </div>
             <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></div>
                <span className="text-zinc-400">AD-LIB OVERLAY</span>
             </div>
          </div>
        </div>
      </div>

      {/* SECTION: Studio Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Signature Tag */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <i className="fas fa-tag text-zinc-800/50 text-3xl"></i>
          </div>
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Signature Catchphrase</h3>
          <p className="text-3xl font-black text-white italic tracking-tight">
            "{result.signatureCall}"
          </p>
        </div>

        {/* Stock Ad-Libs */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Stock Energy Shots</h3>
          <div className="flex flex-wrap gap-2">
            {result.generalAdLibs.map((lib, i) => (
              <span key={i} className="px-4 py-2 bg-black/50 border border-zinc-800 rounded-xl text-purple-400 font-black text-xs hover:border-purple-500/50 hover:text-white transition-all cursor-default">
                {lib}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION: Global Ad-Lib Library */}
      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center">
            <i className="fas fa-layer-group mr-2"></i>
            Quick Copy Global Library
          </h3>
          {copiedText && (
            <span className="text-[10px] font-black text-green-500 animate-pulse bg-green-500/10 px-2 py-1 rounded">
              COPIED: {copiedText}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {SAMPLE_LIBRARY.map((lib) => (
            <button
              key={lib}
              onClick={() => copyToClipboard(lib)}
              className="py-2.5 px-3 bg-zinc-950/50 hover:bg-purple-600 border border-zinc-800 hover:border-purple-500 rounded-xl text-zinc-400 hover:text-white text-[10px] font-black transition-all active:scale-95 uppercase tracking-tighter"
            >
              {lib}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
