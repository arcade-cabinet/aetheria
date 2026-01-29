import React, { ReactNode, useState } from 'react';
import { BlackRoseLogo } from '../features/ui/BlackRoseLogo';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [started, setStarted] = useState(false);

  return (
    <div className="absolute inset-0 z-10 font-gothic pointer-events-none">

      {/* Landing Page Overlay (Fades out when started) */}
      {!started && (
        <div className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center pointer-events-auto transition-opacity duration-1000">

            {/* Main Graphical Logo */}
            <div className="relative mb-8 max-w-4xl w-full p-4 animate-fade-in-slow">
                <img
                    src="/logo_title.jpg"
                    alt="Aetheria: The Fractured Realm"
                    className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(74,14,92,0.5)] mask-image-gradient"
                />
                <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, black 100%) opacity-20" />
            </div>

            {/* Organic Menu / Button */}
            <div className="mt-8">
                <button
                    onClick={() => setStarted(true)}
                    className="group relative px-16 py-5 bg-[#1a1412] border-2 border-[#8a805d] text-[#c0b283] hover:text-[#ffd700] hover:border-[#ffd700] transition-all duration-500 overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                >
                    <span className="relative z-10 tracking-[0.3em] uppercase text-lg font-bold drop-shadow-md group-hover:drop-shadow-[0_0_10px_rgba(192,178,131,0.8)] transition-all">
                        Enter the Realm
                    </span>

                    {/* Hover Effect - Eerie Purple fill */}
                    <div className="absolute inset-0 bg-[#4a0e5c] opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-md" />
                </button>
            </div>
        </div>
      )}

      {/* In-Game HUD (Visible after start) */}
      <div className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-1000 ${started ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Top Bar */}
          <header className="w-full flex justify-between items-start">
            <div className="glass-metallic px-6 py-3 rounded-sm border-filigree pointer-events-auto flex items-center gap-4">
                <div className="w-8 h-8 opacity-80">
                    <BlackRoseLogo />
                </div>
                <div>
                    <h1 className="text-[#c0b283] font-bold tracking-widest uppercase text-xs">Aetheria</h1>
                    <div className="text-[10px] text-[#8a805d] font-mono mt-0.5">SYS.PHYSICS.ACTIVE</div>
                </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-grow flex items-center justify-center pointer-events-none">
            {children}
          </main>

          {/* Bottom Bar / HUD */}
          <footer className="w-full flex justify-center pointer-events-auto pb-4">
            <div className="glass-metallic px-12 py-3 rounded-sm border-filigree flex gap-8">
                <div className="text-center">
                    <div className="text-[10px] text-[#8a805d] uppercase tracking-widest">Status</div>
                    <div className="text-[#c0b283] text-xs glow-text">Stable</div>
                </div>
                <div className="w-[1px] h-full bg-[#8a805d]/30" />
                <div className="text-center">
                    <div className="text-[10px] text-[#8a805d] uppercase tracking-widest">Ether</div>
                    <div className="text-[#4a0e5c] text-xs font-bold glow-text">100%</div>
                </div>
            </div>
          </footer>
      </div>
    </div>
  );
};
