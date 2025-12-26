
import React from 'react';
import { ArtistStyle } from '../types';

interface AdLibFormProps {
  lyrics: string;
  style: ArtistStyle;
  onLyricsChange: (val: string) => void;
  onStyleChange: (style: ArtistStyle) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const AdLibForm: React.FC<AdLibFormProps> = ({
  lyrics,
  style,
  onLyricsChange,
  onStyleChange,
  onSubmit,
  isLoading
}) => {
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
          className="w-full h-64 bg-black border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all placeholder:text-zinc-700 font-medium leading-relaxed"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-zinc-300 mb-4">
          <i className="fas fa-sliders mr-2 text-purple-500"></i>
          Select Artist Vibe
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(ArtistStyle).map((s) => (
            <button
              key={s}
              onClick={() => onStyleChange(s)}
              className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                style === s
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'
              }`}
            >
              {s.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading || !lyrics.trim()}
        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all ${
          isLoading || !lyrics.trim()
            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg hover:shadow-purple-500/20'
        }`}
      >
        {isLoading ? (
          <>
            <i className="fas fa-circle-notch fa-spin"></i>
            <span>Engineering Ad-Libs...</span>
          </>
        ) : (
          <>
            <i className="fas fa-wand-magic-sparkles"></i>
            <span>Generate Performance Guide</span>
          </>
        )}
      </button>
    </div>
  );
};
