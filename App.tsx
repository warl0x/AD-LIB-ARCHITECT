
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AdLibForm } from './components/AdLibForm';
import { AdLibDisplay } from './components/AdLibDisplay';
import { AppState, ArtistStyle } from './types';
import { generateAdLibs } from './services/gemini';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    lyrics: '',
    styles: [ArtistStyle.TRAP],
    loading: false,
    result: null,
    error: null,
  });

  const [loadingStep, setLoadingStep] = useState(0);
  const steps = [
    "Analyzing vocal cadence...",
    "Syncing with chosen vibes...",
    "Mastering the ad-lib chain...",
    "Generating signature tags...",
    "Finalizing recording script..."
  ];

  useEffect(() => {
    let interval: any;
    if (state.loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % steps.length);
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [state.loading]);

  const handleGenerate = async () => {
    if (!state.lyrics.trim() || state.styles.length === 0) return;

    setState(prev => ({ ...prev, loading: true, error: null, result: null }));
    try {
      const result = await generateAdLibs(state.lyrics, state.styles);
      setState(prev => ({ ...prev, loading: false, result }));
      
      if (window.innerWidth < 768) {
        setTimeout(() => {
           window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  const toggleStyle = (style: ArtistStyle) => {
    setState(prev => {
      const exists = prev.styles.includes(style);
      if (exists) {
        return { ...prev, styles: prev.styles.filter(s => s !== style) };
      } else {
        return { ...prev, styles: [...prev.styles, style] };
      }
    });
  };

  const handleReset = () => {
    setState({
      lyrics: '',
      styles: [ArtistStyle.TRAP],
      loading: false,
      result: null,
      error: null,
    });
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight">
              Craft the Perfect <span className="text-purple-500">Energy.</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
              Level up your tracks with context-aware ad-libs. 
              Select multiple vibes to create a unique performance guide that blends genres.
            </p>
          </div>

          <AdLibForm
            lyrics={state.lyrics}
            selectedStyles={state.styles}
            onLyricsChange={(lyrics) => setState(prev => ({ ...prev, lyrics }))}
            onStylesToggle={toggleStyle}
            onSubmit={handleGenerate}
            isLoading={state.loading}
          />

          {state.error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center animate-in fade-in slide-in-from-top-2">
              <i className="fas fa-triangle-exclamation mr-3 text-lg"></i>
              {state.error}
            </div>
          )}

          {state.result && (
            <button
              onClick={handleReset}
              className="w-full py-3 text-zinc-500 hover:text-white transition-colors text-sm font-semibold flex items-center justify-center space-x-2"
            >
              <i className="fas fa-rotate-left"></i>
              <span>New Session</span>
            </button>
          )}
        </div>

        {/* Right Column: Display / Result */}
        <div className="lg:col-span-7">
          {state.loading ? (
            <div className="h-full min-h-[500px] bg-zinc-900/40 border border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-12 relative overflow-hidden shadow-2xl animate-in fade-in duration-500">
              {/* Waveform Animation */}
              <div className="flex items-center justify-center space-x-1.5 h-16 mb-8">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-purple-500 rounded-full animate-bounce"
                    style={{
                      height: `${Math.random() * 100 + 20}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.8s'
                    }}
                  ></div>
                ))}
              </div>
              
              <div className="text-center space-y-4 relative z-10">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Recording In Progress</span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight animate-pulse">
                  {steps[loadingStep]}
                </h3>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto italic">
                  Our A&R engine is constructing your hybrid vocal booth script...
                </p>
              </div>

              {/* Decorative background grid */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#581c87 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
            </div>
          ) : state.result ? (
            <AdLibDisplay result={state.result} />
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-center p-12 space-y-6 bg-zinc-900/20 transition-all">
              <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 text-4xl shadow-inner relative">
                <i className="fas fa-compact-disc animate-[spin_4s_linear_infinite]"></i>
                <div className="absolute inset-0 bg-purple-500/5 blur-2xl rounded-full"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-zinc-400 tracking-tight">Studio Idle</h3>
                <p className="text-zinc-600 text-sm max-w-sm mx-auto leading-relaxed">
                  The booth is empty. Drop your lyrics and select your vibes to start the production process.
                </p>
                <div className="pt-4 flex justify-center space-x-4">
                   <div className="flex flex-col items-center space-y-1">
                      <span className="text-[10px] font-bold text-zinc-700 uppercase">Input</span>
                      <div className="w-8 h-1 bg-zinc-800 rounded"></div>
                   </div>
                   <div className="flex flex-col items-center space-y-1">
                      <span className="text-[10px] font-bold text-zinc-700 uppercase">Style</span>
                      <div className="w-8 h-1 bg-zinc-800 rounded"></div>
                   </div>
                   <div className="flex flex-col items-center space-y-1">
                      <span className="text-[10px] font-bold text-zinc-700 uppercase">Logic</span>
                      <div className="w-8 h-1 bg-zinc-800 rounded"></div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;
