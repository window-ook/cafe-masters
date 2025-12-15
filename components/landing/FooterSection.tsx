import { Github } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/10 bg-transparent py-8">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-400">
            © 2024 Cafe Masters. All rights reserved.
          </p>

          <a
            href="https://github.com/window-ook"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <span>Developed by</span>
            <Github className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="font-medium">window-ook</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
