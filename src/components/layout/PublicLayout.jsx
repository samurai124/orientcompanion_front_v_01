import React from 'react';
import { Outlet } from 'react-router-dom';
import { Topbar } from '@/components/layout/Topbar';
import { Logo } from '@/components/brand/Logo';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-foreground">
      {/* Existing custom Topbar untouched as required */}
      <Topbar />

      {/* Main Content with comfortable padding below the navbar */}
      <main className="flex-1 flex flex-col pt-4 sm:pt-6 pb-16">
        <Outlet />
      </main>

      {/* Minimal clean footer */}
      <footer className="border-t border-border/80 py-8 bg-white/60 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <div className="flex items-center gap-3">
            <Logo size="sm" showSubtitle={false} />
            <span className="hidden sm:inline text-neutral-300">|</span>
            <p>© {new Date().getFullYear()} OrientCompanion. Écosystème d'orientation académique au Maroc.</p>
          </div>
          <div className="flex items-center gap-6">
            <span>Données conformes aux seuils ministériels</span>
            <span>Accompagnement post-bac</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
