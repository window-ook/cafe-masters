'use client';

import { Github } from 'lucide-react';
import { useUIStore } from '@/stores';

export default function FooterSection() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  return (
    <footer className="relative w-full overflow-hidden border-t-2 border-gray-200/50 bg-white/10 py-8 backdrop-blur-md">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-between">
          <p
            className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
          >
            © 2024 CAFE MASTERS. All rights reserved.
          </p>

          <a
            href="https://github.com/window-ook"
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:text-main group flex items-center gap-2 text-sm font-medium transition-colors ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
          >
            <span>Developed by</span>
            <Github className="size-4 transition-transform group-hover:scale-110" />
            <span className="font-bold">window-ook</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
