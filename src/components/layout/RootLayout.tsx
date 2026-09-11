import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export interface RootLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const RootLayout: React.FC<RootLayoutProps> = ({
  children,
  currentPath = '/',
  onNavigate,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-stone-900 font-sans selection:bg-stone-200 selection:text-stone-900">
      <Navbar currentPath={currentPath} onNavigate={onNavigate} />
      <main className="flex-1 flex flex-col" id="main-content">
        {children}
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
