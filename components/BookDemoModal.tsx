"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Calendar, Clock, CheckCircle, Loader2, User, Mail } from "lucide-react";

export default function BookDemoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [contact, setContact] = useState({ name: "", email: "" });

  const handleNext = () => {
    if (step === 1 && date && time) setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
        // REAL API CALL (Reusing your leads API for simplicity, or create a new /api/schedule endpoint)
        const res = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: contact.name,
                email: contact.email,
                firm: "Pending Demo", // Placeholder
                source: "demo_scheduler",
                metadata: {
                    scheduled_date: date,
                    scheduled_time: time,
                    type: "product_walkthrough"
                }
            }),
        });

        if (res.ok) {
            setStep(3); // Success
        } else {
            alert("Scheduling failed. Please try again.");
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
        
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative w-full max-w-md bg-white dark:bg-[#0A0A0F] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white z-10"><X size={20} /></button>
          
          <div className="p-8">
            {/* STEP 1: PICK TIME */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Schedule Briefing</h2>
                        <p className="text-slate-500 text-sm">Select a time for a 15-min product walkthrough.</p>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Preferred Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple" size={18} />
                                <input type="date" onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:border-brand-purple" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Preferred Time</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cyan" size={18} />
                                <select onChange={(e) => setTime(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:border-brand-purple appearance-none">
                                    <option value="">Select Slot...</option>
                                    <option value="10:00 AM">10:00 AM - 10:30 AM</option>
                                    <option value="12:00 PM">12:00 PM - 12:30 PM</option>
                                    <option value="03:00 PM">03:00 PM - 03:30 PM</option>
                                    <option value="05:00 PM">05:00 PM - 05:30 PM</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={handleNext} disabled={!date || !time} className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: IDENTITY (The Missing Piece) */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Details</h2>
                        <p className="text-slate-500 text-sm">Where should we send the calendar invite?</p>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                autoFocus
                                value={contact.name}
                                onChange={(e) => setContact({...contact, name: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:border-brand-purple" 
                                placeholder="Full Name" 
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="email"
                                value={contact.email}
                                onChange={(e) => setContact({...contact, email: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:border-brand-purple" 
                                placeholder="work@firm.com" 
                            />
                        </div>
                    </div>

                    <button onClick={handleSubmit} disabled={loading || !contact.name || !contact.email} className="w-full py-4 rounded-xl bg-brand-purple text-white font-bold text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin" /> : "Confirm Booking"}
                    </button>
                </div>
            )}

            {/* STEP 3: SUCCESS */}
            {step === 3 && (
                <div className="text-center py-8 animate-in zoom-in fade-in duration-300">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Calendar Updated.</h3>
                    <p className="text-slate-500 text-sm">We have sent a Google Calendar invite to <span className="text-brand-purple font-mono">{contact.email}</span>.</p>
                    <div className="mt-6 p-4 bg-slate-50 dark:bg-white/5 rounded-lg text-left border border-slate-200 dark:border-white/10">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Confirmed Slot</div>
                        <div className="text-slate-900 dark:text-white font-mono">{date} @ {time}</div>
                    </div>
                    <button onClick={onClose} className="mt-6 text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm underline underline-offset-4">Close Window</button>
                </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}