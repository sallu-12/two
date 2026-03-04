import { Link } from "react-router-dom";
import { Instagram, Mail, ExternalLink } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-gradient-surface">
    <div className="container py-8 pb-20 md:py-14 md:pb-14">

      {/* BRAND ROW — compact on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="flex-1 max-w-xs">
          <Link to="/" className="group inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero shadow-glow transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
              <span className="absolute inset-0.5 rounded-[10px] bg-background/40 backdrop-blur-sm" />
              <span className="relative text-base font-black text-primary-foreground">B</span>
              <span className="pointer-events-none absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent shadow-glow" />
            </span>
            <span className="text-gradient">Bolzaa</span>
          </Link>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            AI-powered research. Human-refined scripts. Delivered to your Google Drive — built for your niche, your audience &amp; your growth.
          </p>
        </div>

        {/* Social + contact inline on mobile */}
        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com/bolzaa277"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @bolzaa277"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all duration-200"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href="mailto:bolzaa277@gmail.com"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* LINKS GRID — 3 cols on mobile, 3 cols on desktop */}
      <div className="grid grid-cols-3 gap-4 md:gap-8 border-t border-border pt-6">

        {/* PAGES */}
        <div>
          <h4 className="mb-3 text-xs font-bold text-foreground tracking-widest uppercase">Pages</h4>
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
            <Link to="/pricing" className="hover:text-foreground transition-colors">Plans</Link>
            <Link to="/samples" className="hover:text-foreground transition-colors">Samples</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          </div>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="mb-3 text-xs font-bold text-foreground tracking-widest uppercase">Support</h4>
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link to="/submit" className="hover:text-foreground transition-colors">Submit Form</Link>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="mb-3 text-xs font-bold text-foreground tracking-widest uppercase">Contact</h4>
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <a href="mailto:bolzaa277@gmail.com" className="hover:text-foreground transition-colors break-all">bolzaa277@gmail.com</a>
            <a href="https://instagram.com/bolzaa277" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground transition-colors">
              @bolzaa277 <ExternalLink className="h-2.5 w-2.5 opacity-50" />
            </a>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="mt-6 border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} <span className="font-semibold text-foreground/80">Bolzaa</span> · All rights reserved.</span>
        <span className="flex items-center gap-1">
          Made for YouTubers <span className="text-primary">♥</span> by <span className="font-semibold text-foreground/80">Rehan Sheikh</span>
        </span>
      </div>

    </div>
  </footer>
);

export default Footer;


