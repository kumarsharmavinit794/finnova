import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#comparison" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-foreground/95 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 max-w-7xl mx-auto px-6">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          TaxMind
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-white/60 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="hero" size="sm">
              Start Free Trial
            </Button>
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-foreground/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-sm text-white/60 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link to="/dashboard" className="block">
            <Button variant="hero" size="sm" className="w-full mt-2">
              Start Free Trial
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
