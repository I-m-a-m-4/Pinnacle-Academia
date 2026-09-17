import { ReactNode } from 'react';

export default function MockExamLayout({ children }: { children: ReactNode }) {
  // This layout is strict: no navbar, no footer.
  // It's meant to simulate a pure CBT environment.
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans selection:bg-primary/30">
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex items-center justify-between">
        <div className="font-bold text-xl tracking-tight">Pinnacle CBT Engine</div>
        <div className="text-sm opacity-90">Strict Mode Enabled</div>
      </header>
      <main className="flex-1 flex flex-col relative">
        {children}
      </main>
    </div>
  );
}
