"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Check, Loader2, ShieldCheck, Crown } from "lucide-react";

export default function PartnershipModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ firm: "", docketSize: "", email: "" });

  const handleNext = () => {
    setLoading(true);
    // Fake "Verification" delay to make them feel evaluated
    setTimeout(() => {
      setLoading(false);
      setStep(step + 1);
    }, 1200);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setStep(4); // Success Step
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop with Blur */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />

        {/* The "Black Card" Modal */}
        <motion.div
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#050505] border border-amber-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)]"
        >
          {/* Golden Top Line */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          {/* Close Button */}
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>

          <div className="p-10 md:p-14">
            
            {/* --- STEP 1: ELIGIBILITY CHECK --- */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-center">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                  <ShieldCheck className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Partner Verification</h2>
                  <p className="text-slate-400 text-sm">To maintain service quality, we limit the Inner Circle to firms with active IPO dockets.</p>
                </div>
                <div className="text-left space-y-4">
                  <label className="text-xs font-bold text-amber-600 uppercase tracking-widest">Firm Name</label>
                  <input 
                    autoFocus
                    value={formData.firm}
                    onChange={(e) => setFormData({...formData, firm: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-lg focus:border-amber-500 outline-none transition-colors"
                    placeholder="e.g. LegalCore LLP"
                  />
                </div>
                <button onClick={handleNext} disabled={!formData.firm || loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-800 text-white font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : "Verify Eligibility"}
                </button>
              </motion.div>
            )}

            {/* --- STEP 2: VOLUME CHECK (The "Privilege" Question) --- */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Docket Volume</h2>
                  <p className="text-slate-400 text-sm">We prioritize high-volume partners for server allocation.</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {["< 50 Active Cases", "50 - 200 Active Cases", "200+ Active Cases (Priority)"].map((opt) => (
                    <button 
                      key={opt}
                      onClick={() => { setFormData({...formData, docketSize: opt}); handleNext(); }}
                      className="w-full py-4 px-6 rounded-xl border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 text-left text-slate-300 hover:text-white transition-all flex justify-between items-center group"
                    >
                      {opt}
                      <span className="w-4 h-4 rounded-full border border-white/20 group-hover:border-amber-500" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* --- STEP 3: FINAL DETAILS --- */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Final Step</h2>
                  <p className="text-slate-400 text-sm">Where should we send your onboarding credentials?</p>
                </div>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-lg focus:border-amber-500 outline-none transition-colors"
                  placeholder="partner@firmname.com"
                />
                <button onClick={handleSubmit} disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-800 text-white font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                  {loading ? "Securing Slot..." : "Complete Application"}
                </button>
              </motion.div>
            )}

            {/* --- STEP 4: SUCCESS (The "Velvet Rope" Opening) --- */}
            {step === 4 && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                  <Crown className="w-12 h-12 text-black" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Application Received.</h2>
                <p className="text-slate-400 leading-relaxed">
                  Your firm <span className="text-amber-500 font-bold">{formData.firm}</span> has been placed in the <strong>Priority Review Queue</strong>.
                </p>
                <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Reference ID</p>
                  <p className="font-mono text-amber-500 text-xl">DNA-PRIORITY-007</p>
                </div>
                <button onClick={onClose} className="mt-8 text-slate-500 hover:text-white text-sm">Close Window</button>
              </motion.div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}