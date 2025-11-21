"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "backdrop-blur-xl bg-white/80 dark:bg-[#020205]/80 border-slate-200 dark:border-white/5"
          : "border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          {/* THE NEURAL SEAL LOGO */}
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

        <div className="hidden md:flex items-center gap-8">
          {["Features", "Integration", "Pricing"].map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-purple transition-colors">
              {item}
            </Link>
          ))}
          <Link href="/admin" className="text-sm font-medium text-brand-gold/80 hover:text-brand-gold transition-colors">
             Admin Login
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-slate-900" />}
            </button>
          )}
          <Link href="#contact" className="hidden md:inline-flex px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-brand-purple dark:hover:bg-brand-purple dark:hover:text-white transition-colors shadow-lg">
            Book Demo
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}