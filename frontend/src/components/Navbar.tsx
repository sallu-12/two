import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/pricing", label: "Plans" },
  { to: "/samples", label: "Samples" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

type NavLink = {
  to: string;
  label: string;
  external?: boolean;
  href?: string;
};

const isExternalLink = (link: NavLink): link is NavLink & { external: true; href: string } =>
  link.external === true && typeof link.href === "string";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "border-b border-white/10 bg-slate-950/40 backdrop-blur-2xl shadow-2xl" 
          : "bg-gradient-to-b from-slate-950/60 to-transparent backdrop-blur-sm"
      }`}
    >
      {/* Animated gradient line */}
      {scrolled && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
        />
      )}

      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group relative inline-flex items-center gap-3 font-display text-xl font-bold tracking-tighter">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-purple-500 to-accent shadow-lg transition-all duration-300"
          >
            <span className="absolute inset-0.5 rounded-[10px] bg-slate-950/50 backdrop-blur-sm" />
            <span className="relative text-base font-black text-white">B</span>
            <motion.span 
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="pointer-events-none absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent shadow-lg"
            />
          </motion.div>
          <motion.span 
            className="bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            Bolzaa
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link, idx) => (
            isExternalLink(link) ? (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -2 }}
                className="group relative rounded-lg px-4 py-2 text-sm font-semibold text-white/70 transition-colors duration-300 hover:text-white overflow-hidden"
              >
                <span className="relative z-10">{link.label}</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100"
                  layoutId="navBg"
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ) : (
              <motion.div key={link.to}>
                <Link
                  to={link.to}
                  className={`group relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-300 overflow-hidden inline-block ${
                    location.pathname === link.to || location.pathname.startsWith(link.to + "/")
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {(location.pathname === link.to || location.pathname.startsWith(link.to + "/")) && (
                    <motion.div 
                      layoutId="underline"
                      className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-primary to-purple-500"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            )
          ))}
          
          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="ml-4"
          >
            <Link to="/pricing">
              <Button 
                size="sm" 
                className="relative overflow-hidden bg-gradient-to-r from-primary via-purple-500 to-accent text-white font-bold rounded-lg px-6 py-2 shadow-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300"
              >
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100"
                  whileHover={{ x: 100 }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative">Get Started</span>
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Mobile toggle */}
        <motion.button 
          onClick={() => setOpen(!open)} 
          className="lg:hidden text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10 bg-slate-950/80 backdrop-blur-2xl lg:hidden"
          >
            <div className="container px-4 py-3">
              {/* 2-column grid for links */}
              <div className="grid grid-cols-2 gap-1">
                {links.map((link, idx) => (
                  isExternalLink(link) ? (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex items-center rounded-xl px-3 py-2 text-sm font-semibold text-white/60 transition-all hover:text-white hover:bg-white/5"
                    >
                      {link.label}
                    </motion.a>
                  ) : (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <Link
                        to={link.to}
                        className={`flex items-center rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                          location.pathname === link.to || location.pathname.startsWith(link.to + "/")
                            ? "text-white bg-gradient-to-r from-primary/30 to-purple-500/20 shadow-sm"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {location.pathname === link.to && (
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        )}
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                ))}
              </div>

              {/* Divider */}
              <div className="my-2.5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
              >
                <Link to="/pricing" className="block">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-primary via-purple-500 to-accent text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                  >
                    🚀 Get Started Now
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
