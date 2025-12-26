
import React, { useState, useRef, useEffect } from 'react';
import { ArtistStyle } from '../types';

interface AdLibFormProps {
  lyrics: string;
  selectedStyles: ArtistStyle[];
  onLyricsChange: (val: string) => void;
  onStylesToggle: (style: ArtistStyle) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const PREVIEW_ADLIBS: Record<string, string[]> = {
  [ArtistStyle.TRAP]: ["Skrrt!", "Brrr!", "Facts!", "Plug!"],
  [ArtistStyle.DRILL]: ["Bow!", "Grrr!", "Ay!", "Look!"],
  [ArtistStyle.MELODIC]: ["Ooh-whoa", "Yeah yeah", "Mmm..."],
  [ArtistStyle.HORROR]: ["(Scream)", "(Whispers)", "(Chain rattling)", "Don't look back..."],
  [ArtistStyle.COMEDY]: ["Wait, what?", "Haha!", "Sike!", "(Slide whistle)"],
  [ArtistStyle.HYPERPOP]: ["*Glitch*", "Wow!", "Sparkle!", "Beep!"],
  [ArtistStyle.R_AND_B]: ["Soulful", "Baby...", "Deep down"],
  [ArtistStyle.OLD_SCHOOL]: ["Check it", "One two", "Classic"],
};

export const AdLibForm: React.FC<AdLibFormProps> = ({
  lyrics,
  selectedStyles,
  onLyricsChange,
  onStylesToggle,
  onSubmit,
  isLoading
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderStyleLabel = (style: ArtistStyle) => style.split(' (')[0];

  const getLivePreview = () => {
    if (!lyrics.trim()) return "Waiting for lyrics...";
    if (selectedStyles.length === 0) return "Select a vibe to preview ad-libs...";

    const lines = lyrics.split('\n').filter(l => l.trim());
    const lastLine = lines[lines.length - 1] || "";
    const truncatedLine = lastLine.length > 25 ? lastLine.substring(0, 25) + "..." : lastLine;

    // Pick a random style from selected and a random ad-lib from it
    const randomStyle = selectedStyles[Math.floor(Math.random() * selectedStyles.length)];
    const adLibs = PREVIEW_ADLIBS[randomStyle] || ["Yeah!", "Uh-huh", "Let's go!"];
    const randomLib = adLibs[Math.floor(Math.random() * adLibs.length)];

    return (
      <span>
        <span className="text-zinc-500">Line {lines.length}:</span> {truncatedLine}{" "}
        <span className="text-purple-400 font-bold italic animate-pulse">({randomLib})</span>
      </span>
    );
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-zinc-300 mb-2">
          <i className="fas fa-pen-nib mr-2 text-purple-500"></i>
          Paste Your Lyrics
        </label>
        <textarea
          value={lyrics}
          onChange={(e) => onLyricsChange(e.target.value)}
          placeholder="I'm counting money till my fingers bleed... (Write your lines here)"
          className="w-full h-40 bg-black border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all placeholder:text-zinc-700 font-medium leading-relaxed resize-none"
        />
      </div>

      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-zinc-300">
            <i className="fas fa-sliders mr-2 text-purple-500"></i>
            Artist Vibes
          </label>
        </div>
        
        {/* Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between text-left transition-all hover:border-zinc-700 ${isDropdownOpen ? 'ring-2 ring-purple-600 border-transparent' : ''}`}
        >
          <div className="flex flex-wrap gap-1 items-center overflow-hidden">
            {selectedStyles.length === 0 ? (
              <span className="text-zinc-600 text-sm italic">Select one or more vibes...</span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-bold bg-purple-600/20 px-2 py-0.5 rounded border border-purple-500/30">
                  {selectedStyles.length} Selected
                </span>
                <span className="text-zinc-400 text-xs truncate max-w-[200px]">
                  {selectedStyles.map(s => renderStyleLabel(s)).join(', ')}
                </span>
              </div>
            )}
          </div>
          <i className={`fas fa-chevron-down text-zinc-600 text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
        </button>

        {/* Multi-select Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute z-50 mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-2 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center px-4">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Performance Styles</span>
              <button 
                onClick={() => setIsDropdownOpen(false)}
                className="text-zinc-500 hover:text-white text-xs"
              >
                Done
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar p-1">
              {Object.values(ArtistStyle).map((s) => {
                const isSelected = selectedStyles.includes(s);
                const description = s.split('(')[1]?.replace(')', '') || "";
                return (
                  <div
                    key={s}
                    onClick={() => onStylesToggle(s)}
                    className={`flex items-center px-3 py-3 rounded-lg cursor-pointer transition-colors group ${
                      isSelected ? 'bg-purple-600/10 text-white' : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-all shrink-0 ${
                      isSelected ? 'bg-purple-600 border-purple-500' : 'border-zinc-700 group-hover:border-zinc-600'
                    }`}>
                      {isSelected && <i className="fas fa-check text-[10px] text-white"></i>}
                    </div>
                    <div className="flex items-baseline gap-2 overflow-hidden">
                      <span className="text-sm font-bold whitespace-nowrap">{renderStyleLabel(s)}</span>
                      <span className="text-[10px] text-zinc-500 truncate italic">
                        — {description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* AI Ad-Lib Preview Section */}
      <div className="bg-black/40 border border-zinc-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
            AI Ad-Lib Preview
          </label>
          <span className="text-[8px] text-zinc-600 mono uppercase tracking-widest">Real-time Feedback</span>
        </div>
        <div className="mono text-xs text-zinc-400 min-h-[1.25rem] italic overflow-hidden whitespace-nowrap">
          {getLivePreview()}
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading || !lyrics.trim() || selectedStyles.length === 0}
        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all ${
          isLoading || !lyrics.trim() || selectedStyles.length === 0
            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg hover:shadow-purple-500/20 active:scale-[0.98]'
        }`}
      >
        {isLoading ? (
          <>
            <i className="fas fa-circle-notch fa-spin"></i>
            <span>Processing Vocal Chain...</span>
          </>
        ) : (
          <>
            <i className="fas fa-wand-magic-sparkles"></i>
            <span>Generate Hybrid Guide</span>
          </>
        )}
      </button>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
};
