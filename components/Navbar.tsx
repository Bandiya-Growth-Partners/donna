"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";

interface NavbarProps {
  onBookDemo?: () => void;
}

export default function Navbar({ onBookDemo }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Integration", href: "#integration" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
          isScrolled || mobileMenuOpen
            ? "backdrop-blur-xl bg-white/80 dark:bg-[#020205]/80 border-slate-200 dark:border-white/5"
            : "border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group z-50">
            <div className="w-10 h-10 relative flex items-center justify-center">
              <svg className="w-full h-full transition-transform duration-500 group-hover:scale-110" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4L34 12V28L20 36L6 28V12L20 4Z" className="fill-transparent stroke-slate-900 dark:stroke-white stroke-[1.5] opacity-20"/>
                  <path d="M20 10C14.5 10 10 14.5 10 20C10 25.5 14.5 30 20 30C25.5 30 30 25.5 30 20" className="stroke-slate-900 dark:stroke-white stroke-[2.5] stroke-linecap-round" fill="none"/>
                  <path d="M20 10C25.5 10 30 14.5 30 20" className="stroke-brand-purple stroke-[2.5] stroke-linecap-round" fill="none"/>
                  <path d="M10 20C10 14.5 14.5 10 20 10" className="stroke-brand-cyan stroke-[2.5] stroke-linecap-round" fill="none"/>
                  <circle cx="20" cy="20" r="4" className="fill-slate-900 dark:fill-white"/>
              </svg>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xl font-extrabold tracking-tight dark:text-white text-slate-900 leading-none">DONNA</span>
              <span className="text-[0.65rem] font-bold tracking-[0.25em] text-brand-purple uppercase mt-1 opacity-90">PATENT PLATFORM</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-purple transition-colors">
                {item.name}
              </Link>
            ))}
            <Link href="https://patents.donna-ai.in" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-purple transition-colors">
              User Login
            </Link>
            <Link href="/admin" className="text-sm font-medium text-brand-gold hover:text-amber-500 transition-colors">
               Admin Login
            </Link>
          </div>

          {/* Actions & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-slate-900" />}
              </button>
            )}
            
            {/* Desktop Book Demo */}
            <button 
              onClick={onBookDemo}
              className="hidden md:inline-flex px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-brand-purple dark:hover:bg-brand-purple dark:hover:text-white transition-colors shadow-lg"
            >
              Book Demo
            </button>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-900 dark:text-white">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 w-full bg-white dark:bg-[#020205] border-b border-slate-200 dark:border-white/10 z-40 md:hidden shadow-2xl"
          >
            <div className="flex flex-col p-6 space-y-6">
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-slate-900 dark:text-white hover:text-brand-purple"
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                href="https://patents.donna-ai.in" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-slate-900 dark:text-white hover:text-brand-purple"
              >
                User Login
              </Link>
              <Link 
                href="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-brand-gold"
              >
                Admin Login
              </Link>
              <hr className="border-slate-200 dark:border-white/10" />
              <button 
                onClick={() => { onBookDemo?.(); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-lg"
              >
                Book Demo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}