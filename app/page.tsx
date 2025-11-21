"use client";

import { motion, useScroll, useTransform, useInView, Variants } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { 
  Shield, Bot, Briefcase, CheckCircle, ArrowRight, Zap, Activity, 
  UploadCloud, Check, Star 
} from "lucide-react";

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.15 } }
};

export default function Home() {
  // --- SCROLL PARALLAX EFFECTS ---
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // --- SMART LOADER LOGIC ---
  const integrationRef = useRef(null);
  // TRIGGER FIX: 'amount: 0.5' ensures animation starts only when 50% of section is visible
  const isIntegrationInView = useInView(integrationRef, { once: true, amount: 0.5 }); 
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("WAITING FOR INPUT...");

  useEffect(() => {
    if (isIntegrationInView) {
      let currentProgress = 0;
      setUploadStatus("INITIALIZING SECURE CONNECTION...");
      
      const timer = setInterval(() => {
        // Non-linear progress for realism (Fast start -> Slow middle -> Fast finish)
        const increment = currentProgress < 30 ? 2 : currentProgress < 80 ? 0.5 : 5;
        currentProgress += increment;

        if (currentProgress >= 100) {
          setUploadProgress(100);
          setUploadStatus("MIGRATION COMPLETE");
          clearInterval(timer);
        } else {
          setUploadProgress(currentProgress);
          // Dynamic status updates targeting "Tech Enthusiast" persona
          if (currentProgress > 10 && currentProgress < 30) setUploadStatus("ENCRYPTING DATA PACKETS...");
          else if (currentProgress > 30 && currentProgress < 60) setUploadStatus("PARSING PATENT CLAIMS (AI)...");
          else if (currentProgress > 60 && currentProgress < 90) setUploadStatus("SYNCING WITH IPO DATABASE...");
          else if (currentProgress > 90) setUploadStatus("FINALIZING DOCKET...");
        }
      }, 50); // Update every 50ms

      return () => clearInterval(timer);
    }
  }, [isIntegrationInView]);

  // --- ROI STATE ---
  const [attorneys, setAttorneys] = useState(5);
  const [rate, setRate] = useState(4000);
  const [hours, setHours] = useState(20);
  
  // --- FORM STATE ---
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");

  // ... inside Home() component

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      // REAL API CALL
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setFormStatus("success");
        // Optional: Reset form or show success message
      } else {
        console.error("Submission failed");
        setFormStatus("idle");
        alert("Failed to submit. Please check your connection.");
      }
    } catch (error) {
      console.error(error);
      setFormStatus("idle");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020205] selection:bg-brand-purple selection:text-white overflow-hidden font-sans text-slate-900 dark:text-white">
      <Navbar />
      
      {/* NOISE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

      {/* DYNAMIC BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-brand-purple/20 blur-[100px] animate-blob"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-brand-cyan/20 blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      {/* --- 1. HERO SECTION --- */}
      <section ref={targetRef} className="relative pt-36 pb-16 lg:pt-52 lg:pb-32 text-center z-10 px-6">
        <motion.div style={{ y, opacity }} className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm mb-8 hover:scale-105 transition-transform cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase">IPO Auto-Sync Active</span>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-7xl md:text-9xl font-extrabold tracking-tighter leading-[1.1] mb-8"
          >
            Command Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-purple bg-[length:200%_auto] animate-flow">
              Patent Empire.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            The intelligent platform for high-growth IPR firms. 
            Automate <strong className="text-slate-900 dark:text-white">docketing</strong>, accelerate <strong className="text-slate-900 dark:text-white">drafting</strong>, and own your data.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          >
            <a href="#contact" className="group relative px-8 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-lg shadow-xl hover:scale-105 transition-all overflow-hidden flex items-center justify-center gap-2">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-cyan opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <span>Request Access</span> <ArrowRight size={18} />
            </a>
            <a href="#integration" className="px-8 py-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 font-medium text-lg transition-all flex items-center justify-center">
              View Architecture
            </a>
          </motion.div>
        </motion.div>

        {/* 3D DASHBOARD */}
        <motion.div 
          initial={{ opacity: 0, rotateX: 20, y: 100 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, type: "spring" }}
          className="mt-24 max-w-6xl mx-auto perspective-1000 hidden md:block"
        >
          <div className="relative rounded-2xl p-2 bg-gradient-to-b from-white/40 to-transparent dark:from-white/10 dark:to-transparent backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl">
             <div className="rounded-xl bg-slate-50 dark:bg-[#0A0A0F] border border-slate-200 dark:border-white/5 aspect-[16/9] flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-8 left-8 right-8 flex justify-between items-center opacity-50">
                    <div className="h-2 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="flex gap-2">
                        <div className="h-2 w-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        <div className="h-2 w-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    </div>
                </div>
                <div className="text-center space-y-6 z-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-brand-cyan blur-[40px] opacity-20 animate-pulse"></div>
                        <Bot size={64} className="relative text-slate-900 dark:text-white mx-auto" />
                    </div>
                    <div className="space-y-2">
                        <div className="text-slate-500 font-mono text-sm tracking-widest">NEURAL ENGINE ACTIVE</div>
                        <div className="text-brand-purple font-bold text-2xl">Generating Claim Set 4...</div>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-brand-purple/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-[3s] ease-in-out"></div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* --- 2. FEATURES SECTION --- */}
      <section id="features" className="py-24 lg:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="mb-16 md:mb-24 text-center"
            >
                <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-6">The <span className="text-slate-400">Unfair Advantage</span></motion.h2>
                <motion.p variants={fadeInUp} className="text-slate-500 max-w-2xl mx-auto">Don't let manual docketing slow down your firm's growth. Automate the boring stuff.</motion.p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SpotlightCard className="p-8 md:p-10 h-full">
                    <div className="w-12 h-12 bg-brand-purple/10 rounded-xl flex items-center justify-center mb-8 text-brand-purple"><Shield size={24} /></div>
                    <h3 className="text-xl md:text-2xl font-bold mb-4">Ironclad Docketing</h3>
                    <p className="text-slate-500 leading-relaxed text-sm md:text-base">We scrape the IPO database directly. If a status changes at 3 AM, you know by 3:01 AM. Never miss a hearing.</p>
                </SpotlightCard>
                <SpotlightCard className="p-8 md:p-10 h-full">
                    <div className="w-12 h-12 bg-brand-cyan/10 rounded-xl flex items-center justify-center mb-8 text-brand-cyan"><Zap size={24} /></div>
                    <h3 className="text-xl md:text-2xl font-bold mb-4">AI Draft Factory</h3>
                    <p className="text-slate-500 leading-relaxed text-sm md:text-base">Upload an IDF and generate a First Draft (FoF) in minutes, not days. Impress clients with speed.</p>
                </SpotlightCard>
                <SpotlightCard className="p-8 md:p-10 h-full">
                    <div className="w-12 h-12 bg-brand-amber/10 rounded-xl flex items-center justify-center mb-8 text-brand-amber"><Activity size={24} /></div>
                    <h3 className="text-xl md:text-2xl font-bold mb-4">Client Pulse</h3>
                    <p className="text-slate-500 leading-relaxed text-sm md:text-base">Stop sending Excel sheets. Give clients a premium login to view their portfolio status 24/7.</p>
                </SpotlightCard>
            </div>
        </div>
      </section>

      {/* --- 3. SEAMLESS INTEGRATION --- */}
      <section id="integration" className="py-24 lg:py-32 border-y border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/[0.01]">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="sticky top-32">
                 <motion.div variants={fadeInUp} className="inline-block mb-4">
                    <span className="bg-brand-purple/10 text-brand-purple text-xs font-bold px-3 py-1 rounded-md">ZERO DOWNTIME</span>
                 </motion.div>
                 <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-6">Seamless <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-purple bg-[length:200%_auto] animate-flow">Integration</span></motion.h2>
                 <motion.p variants={fadeInUp} className="text-slate-500 mb-10 text-lg leading-relaxed">
                    Your current Excel sheets are costing you money. Import your legacy data into Donna and let our bots verify every single deadline against the IPO database instantly.
                 </motion.p>
                 
                 <div className="space-y-8 relative pl-6 border-l-2 border-slate-200 dark:border-white/10 ml-3">
                    {[
                      { title: "Import Legacy Data", desc: "Drag & drop your existing Excel/CSV docket." },
                      { title: "Neural Verification", desc: "Our AI cross-references every application number with the IPO." },
                      { title: "Live Dashboard", desc: "Deadlines are auto-calculated. You are live in minutes." }
                    ].map((s, i) => (
                      <motion.div key={i} variants={fadeInUp} className="relative pl-8 group cursor-pointer">
                        <div className="absolute -left-[33px] top-0 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/20 flex items-center justify-center font-bold text-xs z-10 group-hover:border-brand-purple group-hover:text-brand-purple transition-colors shadow-lg">{i + 1}</div>
                        <h4 className="font-bold text-lg group-hover:text-brand-purple transition-colors">{s.title}</h4>
                        <p className="text-slate-500 text-sm mt-1">{s.desc}</p>
                      </motion.div>
                    ))}
                 </div>
             </motion.div>

             {/* REFINED DYNAMIC LOADER */}
             <motion.div 
               ref={integrationRef}
               initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
               className="bg-white dark:bg-[#0A0A0F] border border-slate-200 dark:border-white/10 p-8 md:p-12 rounded-3xl text-center relative shadow-2xl backdrop-blur-md mt-8 md:mt-0"
             >
                  <div className="absolute inset-0 bg-grid-pattern opacity-20 rounded-3xl"></div>
                  <div className="relative z-10 mb-8">
                      {uploadProgress < 100 ? (
                          <div className="w-24 h-24 mx-auto bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                              <UploadCloud size={40} className="text-slate-400" />
                          </div>
                      ) : (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                              <CheckCircle size={48} className="text-green-500" />
                          </motion.div>
                      )}
                  </div>
                  <div className="font-bold text-2xl mb-2 relative z-10 text-slate-900 dark:text-white">{uploadProgress < 100 ? "Importing Docket..." : "Integration Complete"}</div>
                  <div className="mt-8 h-4 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden relative z-10">
                      <motion.div className="h-full bg-gradient-to-r from-brand-purple to-brand-cyan" initial={{ width: "0%" }} animate={{ width: `${uploadProgress}%` }} transition={{ ease: "linear", duration: 0.1 }} />
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 mt-4 font-mono relative z-10 uppercase tracking-wider">
                      <span className={uploadProgress === 100 ? "text-green-500 font-bold" : "text-brand-purple animate-pulse"}>{uploadStatus}</span>
                      <span>{Math.floor(uploadProgress)}%</span>
                  </div>
                  
                  {/* Simulated Terminal */}
                  <div className="mt-8 text-left bg-slate-900 rounded-lg p-4 font-mono text-[10px] text-slate-400 h-32 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900 z-10"></div>
                        <div className="space-y-1">
                            <div className="text-green-400">$ init_migration_sequence</div>
                            {uploadProgress > 10 && <div>{">"} connecting_to_ipo_gateway... <span className="text-green-400">OK</span></div>}
                            {uploadProgress > 30 && <div>{">"} decrypting_client_file.xlsx... <span className="text-green-400">OK</span></div>}
                            {uploadProgress > 50 && <div>{">"} parsing_500_records...</div>}
                            {uploadProgress > 70 && <div>{">"} verifying_priority_dates...</div>}
                            {uploadProgress === 100 && <div className="text-brand-cyan">{">"} MIGRATION_SUCCESSFUL. WELCOME_COMMANDER.</div>}
                        </div>
                  </div>
             </motion.div>
         </div>
      </section>

      {/* --- 4. PARTNER PROGRAM --- */}
      <section className="py-32 relative px-6">
        <div className="max-w-5xl mx-auto">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-amber-500/20 bg-[#050505]">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,transparent_0%,rgba(245,158,11,0.15)_50%,transparent_100%)] animate-gold-shimmer z-10 pointer-events-none"></div>
                <div className="relative p-12 md:p-20 text-center z-20">
                    <div className="inline-block border border-amber-500/50 bg-amber-900/20 rounded-full px-5 py-2 mb-8 backdrop-blur-md"><span className="text-amber-400 font-bold tracking-widest text-xs uppercase">Founding Partner Program</span></div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-600">Inner Circle</span></h2>
                    <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">We are selecting 20 forward-thinking IPR Firms for white-glove onboarding, custom feature requests, and zero migration costs.</p>
                    <div className="flex flex-col items-center gap-6">
                        <a href="#contact" className="px-12 py-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-xl text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(245,158,11,0.3)]">Apply for Partnership</a>
                        <div className="flex items-center gap-3 text-sm font-mono bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>
                            <span className="text-gray-300">Only <span className="text-white font-bold">3</span> of <span className="text-gray-500">20</span> spots remaining</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 5. TESTIMONIALS --- */}
      <section className="py-24 overflow-hidden border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
        <div className="text-center mb-12"><h2 className="text-3xl font-bold">Trusted by <span className="text-brand-purple">IP Leaders</span></h2></div>
        <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex gap-8 w-max animate-marquee hover:[animation-play-state:paused] px-4">
                {[1, 2, 3, 4, 1, 2].map((i, idx) => (
                    <div key={idx} className="bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-2xl w-[350px] backdrop-blur-sm hover:border-brand-purple transition-colors">
                        <div className="flex text-brand-purple mb-4 gap-1"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                        <p className="text-slate-600 dark:text-slate-300 italic mb-6 text-sm leading-relaxed">"The sync accuracy is 100%. We caught a hearing date that wasn't in our manual diary. Donna is indispensable."</p>
                        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center font-bold text-xs">RK</div><div><div className="font-bold text-sm">Rajesh Kumar</div><div className="text-xs text-slate-500">Managing Partner</div></div></div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- 6. PRICING SECTION --- */}
      <section id="pricing" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Simple Pricing</h2>
                <p className="text-slate-500">Positive ROI from day one. Choose the plan that fits your firm.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {/* Solo */}
                <SpotlightCard className="p-8 flex flex-col h-full">
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Solo</h3>
                    <div className="mb-6"><span className="text-4xl font-bold text-slate-900 dark:text-white">₹2,999</span><span className="text-slate-500">/mo</span></div>
                    <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex gap-3"><Check size={18} className="text-green-500" /> Full IPO Docketing</li>
                        <li className="flex gap-3"><Check size={18} className="text-green-500" /> 50 AI Credits</li>
                        <li className="flex gap-3"><Check size={18} className="text-green-500" /> Email Support</li>
                    </ul>
                    <a href="#contact" className="w-full block text-center py-3 rounded-lg border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-bold">Select Solo</a>
                </SpotlightCard>

                {/* Team (Popular) */}
                <div className="relative group">
                    <div className="absolute -inset-px bg-gradient-to-r from-brand-purple to-brand-cyan rounded-[24px] opacity-50 blur-sm group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative h-full bg-white dark:bg-[#0A0A0F] rounded-3xl p-8 flex flex-col border border-slate-200 dark:border-transparent">
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-brand-purple to-brand-cyan text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</div>
                        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Team</h3>
                        <div className="mb-6"><span className="text-4xl font-bold text-slate-900 dark:text-white">₹2,499</span><span className="text-slate-500">/seat</span></div>
                        <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex gap-3"><Check size={18} className="text-brand-purple" /> <strong>Full AI Drafting Suite</strong></li>
                            <li className="flex gap-3"><Check size={18} className="text-brand-purple" /> Client Portal Access</li>
                            <li className="flex gap-3"><Check size={18} className="text-brand-purple" /> Priority Support</li>
                        </ul>
                        <a href="#contact" className="w-full block text-center py-3 rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan text-white font-bold hover:shadow-lg transition-shadow">Get Started</a>
                    </div>
                </div>

                {/* Enterprise */}
                <SpotlightCard className="p-8 flex flex-col h-full">
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Enterprise</h3>
                    <div className="mb-6"><span className="text-4xl font-bold text-slate-900 dark:text-white">Custom</span></div>
                    <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex gap-3"><Check size={18} className="text-green-500" /> Dedicated Server</li>
                        <li className="flex gap-3"><Check size={18} className="text-green-500" /> Custom API Integrations</li>
                        <li className="flex gap-3"><Check size={18} className="text-green-500" /> SLA & Account Manager</li>
                    </ul>
                    <a href="#contact" className="w-full block text-center py-3 rounded-lg border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-bold">Contact Sales</a>
                </SpotlightCard>
            </div>
        </div>
      </section>

      {/* --- 7. ROI CALCULATOR --- */}
      <section className="py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-slate-100/50 dark:bg-white/[0.02] skew-y-3 scale-110 z-0 pointer-events-none"></div>
         <div className="max-w-6xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Recover <span className="text-brand-purple">Lost Revenue</span></h2>
               <p className="text-slate-500 text-lg mb-10">Admin tasks burn billable hours. Adjust the sliders to match your firm's size and see the hidden cost.</p>
               
               <div className="space-y-8">
                  {[
                    { label: "Attorneys", value: attorneys, set: setAttorneys, min: 1, max: 50 },
                    { label: "Hourly Rate (₹)", value: rate, set: setRate, min: 1000, max: 15000, step: 500 },
                    { label: "Hours Saved/Mo", value: hours, set: setHours, min: 5, max: 100 }
                  ].map((item, i) => (
                    <div key={i} className="group">
                       <div className="flex justify-between text-sm font-bold uppercase tracking-wider mb-3 text-slate-500 dark:text-slate-400">
                          <label>{item.label}</label>
                          <span className="text-brand-cyan">{item.value.toLocaleString()}</span>
                       </div>
                       <input 
                         type="range" min={item.min} max={item.max} step={item.step || 1} value={item.value} 
                         onChange={(e) => item.set(Number(e.target.value))}
                         className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-purple hover:accent-brand-cyan transition-all"
                       />
                    </div>
                  ))}
               </div>
            </div>
            <SpotlightCard className="p-12 md:p-16 text-center border-t-4 border-t-brand-purple bg-white dark:bg-[#0A0A0F]">
               <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-slate-500">Annual Value Unlocked</h3>
               <div className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter text-slate-900 dark:text-white">
                 ₹{((attorneys * rate * hours) * 12).toLocaleString('en-IN')}
               </div>
               <p className="text-brand-purple font-medium">Pure profit added to your bottom line.</p>
            </SpotlightCard>
         </div>
      </section>

      {/* --- 8. CONTACT FORM --- */}
      <section id="contact" className="py-32 relative">
         <div className="max-w-3xl mx-auto px-6 relative z-10">
             <div className="bg-white dark:bg-[#0A0A0F] border border-slate-200 dark:border-white/10 p-10 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                 {/* Subtle gradient glow */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-[80px] -z-10"></div>

                 <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Request Access</h2>
                    <p className="text-slate-500">Join the waitlist. We verify every firm manually to ensure security.</p>
                 </div>

                 {formStatus === "success" ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
                       <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                           <CheckCircle className="w-10 h-10 text-green-500" />
                       </div>
                       <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Signal Received.</h3>
                       <p className="text-slate-500 mt-2">Stand by for onboarding coordinates.</p>
                    </motion.div>
                 ) : (
                   <form onSubmit={handleFormSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                         <div className="space-y-2">
                             <label className="text-xs font-bold uppercase text-slate-500 ml-1">Name</label>
                             <input name="name" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all" />
                         </div>
                         <div className="space-y-2">
                             <label className="text-xs font-bold uppercase text-slate-500 ml-1">Firm</label>
                             <input name="firm" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all" />
                         </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-slate-500 ml-1">Email</label>
                          <input name="email" type="email" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all" />
                      </div>
                      <button 
                        disabled={formStatus === "submitting"}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-cyan text-white font-bold text-lg shadow-lg hover:shadow-brand-purple/25 hover:-translate-y-1 transition-all disabled:opacity-50 mt-4"
                      >
                        {formStatus === "submitting" ? "Transmitting..." : "Initiate Sequence"}
                      </button>
                   </form>
                 )}
             </div>
         </div>
      </section>

      {/* --- 9. FOOTER --- */}
      <footer className="bg-slate-100 dark:bg-[#020205] border-t border-slate-200 dark:border-white/5 pt-20 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1">
                    <span className="text-2xl font-bold">DONNA<span className="text-brand-purple text-sm align-top">AI</span></span>
                    <p className="text-slate-500 text-sm mt-4 leading-relaxed">The patent management platform for the next generation of Indian Intellectual Property firms.</p>
                </div>
                <div><h4 className="font-bold mb-6 text-slate-900 dark:text-white">Platform</h4><ul className="space-y-3 text-sm text-slate-500"><li><a href="#" className="hover:text-brand-purple">Auto-Docketing</a></li><li><a href="#" className="hover:text-brand-purple">AI Drafting</a></li></ul></div>
                <div><h4 className="font-bold mb-6 text-slate-900 dark:text-white">Company</h4><ul className="space-y-3 text-sm text-slate-500"><li><a href="#" className="hover:text-brand-purple">About Us</a></li><li><a href="#" className="hover:text-brand-purple">Contact</a></li></ul></div>
                <div><h4 className="font-bold mb-6 text-slate-900 dark:text-white">Newsletter</h4><div className="flex gap-2"><input type="email" placeholder="Email" className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm w-full focus:outline-none" /><button className="bg-brand-purple text-white px-4 py-2 rounded-lg text-sm font-bold">Go</button></div></div>
            </div>
            <div className="border-t border-slate-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-500 text-xs">© 2025 Donna AI Technologies Pvt Ltd.</p>
                <p className="text-slate-500 text-xs font-medium flex items-center gap-1">Made with <span className="text-red-500 animate-pulse">❤</span> in India</p>
            </div>
        </div>
      </footer>
    </main>
  );
}