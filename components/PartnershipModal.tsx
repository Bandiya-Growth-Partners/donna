"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Loader2, ShieldCheck, Crown, User, Phone, Mail, Briefcase } from "lucide-react";

export default function PartnershipModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Full Data State
  const [formData, setFormData] = useState({ 
    name: "", 
    phone: "", 
    firm: "", 
    docketSize: "", 
    email: "" 
  });

  const handleNext = () => {
    setLoading(true);
    // Small UX delay to make it feel like the system is "processing"
    setTimeout(() => { 
        setLoading(false); 
        setStep(step + 1); 
    }, 600); 
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          firm: formData.firm,
          email: formData.email,
          phone: formData.phone,
          source: "inner_circle_modal", // Critical for Priority Scoring
          metadata: {
            docket_size: formData.docketSize,
            application_type: "priority_partner"
          }
        }),
      });

      if (res.ok) {
        setStep(4); // Success View
      } else {
        alert("Transmission Error. Please try again.");
      }
    } catch (e) {
      console.error("Submission failed", e);
      alert("Network Error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
        
        <motion.div
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#050505] border border-amber-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)]"
        >
          {/* Gold Progress Line */}
          <div className="h-1 w-full bg-gray-800">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-600 to-yellow-400" 
                initial={{ width: "0%" }} 
                animate={{ width: `${(step / 4) * 100}%` }} 
              />
          </div>

          <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-10">
            <X size={24} />
          </button>

          <div className="p-10 md:p-14 min-h-[500px] flex flex-col justify-center">
            
            {/* --- STEP 1: IDENTITY --- */}
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="text-center">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20 mb-6"><User className="w-8 h-8 text-amber-500" /></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Partner Identity</h2>
                    <p className="text-slate-400 text-sm">Who is the primary point of contact?</p>
                </div>
                <div className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={18} />
                        <input autoFocus value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-amber-500 transition-colors" placeholder="Full Name" />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={18} />
                        <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-amber-500 transition-colors" placeholder="WhatsApp Number (+91)" />
                    </div>
                </div>
                <button onClick={handleNext} disabled={!formData.name || !formData.phone || loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-800 text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="animate-spin"/> : "Next Step"}
                </button>
              </div>
            )}

            {/* --- STEP 2: FIRM & VOLUME --- */}
            {step === 2 && (
              <div className="space-y-8 text-center animate-in slide-in-from-right-4 fade-in duration-300">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Firm Profile</h2>
                    <p className="text-slate-400 text-sm">We limit the Inner Circle to firms with high-volume dockets.</p>
                </div>
                
                <div className="relative text-left">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={18} />
                    <input value={formData.firm} onChange={(e) => setFormData({...formData, firm: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-lg focus:border-amber-500 outline-none transition-colors" placeholder="Firm Name (e.g. LegalCore)" />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {["< 50 Active Cases", "50 - 200 Active Cases", "200+ Active Cases (Priority)"].map((opt) => (
                    <button 
                      key={opt} 
                      onClick={() => { setFormData({...formData, docketSize: opt}); handleNext(); }} 
                      disabled={!formData.firm}
                      className="w-full py-3 px-6 rounded-xl border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 text-left text-slate-300 hover:text-white transition-all flex justify-between items-center group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {opt}
                      <span className="w-4 h-4 rounded-full border border-white/20 group-hover:border-amber-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- STEP 3: EMAIL & SUBMIT --- */}
            {step === 3 && (
              <div className="space-y-8 text-center animate-in slide-in-from-right-4 fade-in duration-300">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Secure Credentials</h2>
                    <p className="text-slate-400 text-sm">Where should we send your onboarding pack?</p>
                </div>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={18} />
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-lg focus:border-amber-500 outline-none transition-colors" placeholder="partner@firmname.com" />
                </div>
                <button onClick={handleSubmit} disabled={!formData.email || loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-800 text-white font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <><Loader2 className="animate-spin"/> Securing Slot...</> : "Complete Application"}
                </button>
              </div>
            )}

            {/* --- STEP 4: SUCCESS --- */}
            {step === 4 && (
              <div className="text-center py-8 animate-in zoom-in fade-in duration-500">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(245,158,11,0.4)] relative">
                    <div className="absolute inset-0 rounded-full animate-ping bg-amber-500 opacity-20"></div>
                    <Crown className="w-12 h-12 text-black" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Application Received.</h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Your firm <span className="text-amber-500 font-bold">{formData.firm}</span> has been placed in the <strong>Priority Review Queue</strong>. 
                  We will contact you via WhatsApp shortly.
                </p>
                <button onClick={onClose} className="text-slate-500 hover:text-white text-sm underline underline-offset-4">Return to Homepage</button>
              </div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}