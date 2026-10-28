import React from 'react';
import { Outlet } from 'react-router-dom';
import { Topbar } from './Topbar';
import { PageTransition } from '@/components/motion';

export function AppShell() {
  return (
    <div className="min-h-screen w-full bg-[#F5F5F7] flex flex-col text-foreground">
      {/* Existing custom Topbar untouched as required by Hard Constraint 1 */}
      <Topbar />

      {/* Main Content Area with generous top padding to ensure comfortable breathing room */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20">
        <div className="mx-auto max-w-7xl space-y-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </main>
    </div>
  );
}

export default AppShell;
