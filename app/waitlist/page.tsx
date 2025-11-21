"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Loader2, Search, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkRank = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Call the API (We will build this next)
    const res = await fetch('/api/waitlist/check', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    
    setStatus(data); // Expects { rank: 145, total: 500, exists: true }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white">
      <Navbar />
      <div className="pt-40 px-6 max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Check Your Position</h1>
        <p className="text-slate-400 mb-10">Enter your email to see where you stand in the queue.</p>

        <form onSubmit={checkRank} className="relative mb-12">
          <input 
            type="email" 
            placeholder="Enter registered email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-brand-purple outline-none transition-colors"
          />
          <button disabled={loading} className="absolute right-2 top-2 bottom-2 px-4 bg-white/10 hover:bg-brand-purple rounded-lg transition-colors">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
        </form>

        {status && status.exists && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/5 border border-white/10 rounded-2xl p-8">
             <Trophy className="w-12 h-12 text-brand-gold mx-auto mb-4" />
             <div className="text-sm text-slate-400 uppercase tracking-widest mb-2">Current Rank</div>
             <div className="text-6xl font-bold text-white mb-2">#{status.rank}</div>
             <div className="text-sm text-slate-500">out of {status.total} attorneys</div>
          </motion.div>
        )}
        
        {status && !status.exists && (
           <div className="text-red-400">Email not found in our database.</div>
        )}
      </div>
    </div>
  );
}