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
        <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center pointer-events-auto transition-opacity duration-1000">
            <div className="mb-8 scale-150">
                <BlackRoseLogo />
            </div>

            <h1 className="text-6xl text-[#c0b283] glow-text mb-4 tracking-widest uppercase">
                Aetheria
            </h1>
            <p className="text-[#8a805d] mb-12 text-sm tracking-[0.3em] opacity-80">
                The Fractured Realm
            </p>

            <button
                onClick={() => setStarted(true)}
                className="group relative px-12 py-4 bg-wood border-filigree text-[#c0b283] hover:text-white transition-all overflow-hidden cursor-pointer"
            >
                <span className="relative z-10 tracking-widest uppercase text-sm font-bold">Enter the Void</span>
                <div className="absolute inset-0 bg-[#4a0e5c] opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            </button>
        </div>
      )}

      {/* In-Game HUD (Visible after start) */}
      <div className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-1000 ${started ? 'opacity-100' : 'opacity-0'}`}>
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
