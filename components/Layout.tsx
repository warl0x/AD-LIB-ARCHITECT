
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen studio-gradient flex flex-col">
      <header className="border-b border-zinc-800 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center neon-border">
              <i className="fas fa-microphone-lines text-white"></i>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              AD-LIB ARCHITECT
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm text-zinc-400 font-medium">
            <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-white cursor-pointer transition-colors">Presets</span>
            <span className="px-3 py-1 bg-zinc-800 rounded-full text-zinc-200 border border-zinc-700">Studio Mode</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-500 text-xs">
        <p>&copy; {new Date().getFullYear()} Ad-Lib Architect Studio. Powered by Gemini Pro AI.</p>
      </footer>
    </div>
  );
};
