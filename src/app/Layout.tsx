import React, { ReactNode } from 'react';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
      {/* Top Bar */}
      <header className="w-full flex justify-between items-start">
        <div className="obsidian-panel p-3 rounded-lg pointer-events-auto">
            <h1 className="text-aether font-bold tracking-widest uppercase text-sm">Aetheria</h1>
            <div className="text-xs text-gray-400 font-mono mt-1">SYS.PHYSICS.READY</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center pointer-events-none">
        {children}
      </main>

      {/* Bottom Bar / HUD */}
      <footer className="w-full flex justify-center pointer-events-auto pb-4">
         <div className="obsidian-panel px-6 py-2 rounded-full">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Status: Online</span>
         </div>
      </footer>
    </div>
  );
};
