import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="hero-gradient border-t border-white/5 py-12">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            TaxMind
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/70 transition-colors">Security</a>
            <a href="#" className="hover:text-white/70 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-white/30">© 2026 TaxMind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
