"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Check, X, Loader2, LogOut, Search, Filter, 
  TrendingUp, Users, AlertCircle, Mail, Clock,
  BarChart3, Send
} from "lucide-react";
import Link from "next/link";

// --- SUPABASE CLIENT ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- TYPES ---
type Lead = {
  id: string;
  created_at: string;
  name: string;
  firm: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
};

// === MAIN ENTRY COMPONENT ===
export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020205] text-white">
        <Loader2 className="animate-spin w-8 h-8 text-brand-purple" />
      </div>
    );
  }

  return session ? <CommandCenter /> : <LoginScreen />;
}

// === SUB-COMPONENT: LOGIN SCREEN ===
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020205] relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
      <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>

      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl z-10 shadow-2xl">
        <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-lg">D</div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-slate-400 text-sm mt-2">Secure Environment • Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Admin ID</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full p-3 rounded-lg bg-black/50 border border-white/10 text-white focus:border-purple-500 outline-none transition-colors font-mono" 
              placeholder="admin@donna-ai.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Secure Key</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full p-3 rounded-lg bg-black/50 border border-white/10 text-white focus:border-purple-500 outline-none transition-colors font-mono" 
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-xs flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          
          <button 
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : "Access Terminal"}
          </button>
        </form>
      </div>
    </div>
  );
}

// === SUB-COMPONENT: DASHBOARD (COMMAND CENTER) ===
function CommandCenter() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, approved, waitlisted
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // --- STATS CALCULATION ---
  const activeCount = leads.filter(l => l.status === 'approved').length;
  const waitlistCount = leads.filter(l => l.status === 'waitlisted').length;
  const pendingCount = leads.filter(l => l.status === 'pending').length;
  const slotsRemaining = 20 - activeCount;

  // --- DATA FETCHING ---
  const fetchLeads = async () => {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setLeads(data as Lead[]);
  };

  useEffect(() => { fetchLeads(); }, []);

  // --- ACTIONS ---
  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected' | 'waitlisted', email: string, name: string) => {
    // Constraint Check for Cohort
    if (status === 'approved' && slotsRemaining <= 0) {
      alert("Cohort is Full (20/20). Please move user to Waitlist.");
      return;
    }

    // Optimistic Update
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));

    try {
      // Call API to update DB and trigger email
      await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, email, name })
      });
    } catch (error) {
      console.error("Failed to update status", error);
      fetchLeads(); // Revert on error
    }
  };

  const handleBulkEmail = async () => {
    if (!confirm(`Send update to ${selectedLeads.length} users?`)) return;
    
    setIsBroadcasting(true);
    try {
      await fetch('/api/admin/bulk-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedLeads, type: 'newsletter_update' })
      });
      alert("Broadcast Sent Successfully");
      setSelectedLeads([]);
    } catch (error) {
      alert("Broadcast Failed");
    }
    setIsBroadcasting(false);
  };

  const toggleSelect = (id: string) => {
    if (selectedLeads.includes(id)) setSelectedLeads(selectedLeads.filter(i => i !== id));
    else setSelectedLeads([...selectedLeads, id]);
  };

  const filteredLeads = leads.filter(l => 
    (filter === "all" || l.status === filter) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.firm.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0C15] text-slate-900 dark:text-white font-sans transition-colors duration-500">
      
      {/* --- TOP BAR --- */}
      <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg hover:scale-105 transition-transform">D</Link>
            <div>
                <h1 className="font-bold tracking-tight text-sm leading-none">DONNA MISSION CONTROL</h1>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">v2.0.1 • SECURE</span>
            </div>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="text-xs font-bold text-slate-500 hover:text-red-500 flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-md transition-colors">
            <LogOut size={14} /> Sign Out
        </button>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        
        {/* --- HUD (HEADS UP DISPLAY) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Cohort Progress */}
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Active Cohort</div>
                        <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{activeCount} <span className="text-slate-400 text-lg">/ 20</span></div>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><TrendingUp size={20} /></div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden relative z-10">
                    <div className={`h-full transition-all duration-1000 ${activeCount >= 20 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(activeCount/20)*100}%` }}></div>
                </div>
            </div>

            {/* Waitlist */}
            <StatCard label="Waitlist Queue" value={waitlistCount} icon={Clock} color="text-yellow-500" />
            
            {/* Pending Actions */}
            <StatCard label="Pending Review" value={pendingCount} icon={AlertCircle} color="text-purple-500" />
            
            {/* Total Leads */}
            <StatCard label="Total Database" value={leads.length} icon={Users} color="text-slate-500" />
        </div>

        {/* --- TOOLBAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            {/* Search */}
            <div className="relative w-full md:w-96">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    placeholder="Search leads..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-purple-500 transition-all shadow-sm"
                />
            </div>

            {/* Filters */}
            <div className="flex bg-white dark:bg-[#1E293B] p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                {['all', 'pending', 'approved', 'waitlisted', 'rejected'].map((f) => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                            filter === f 
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-md' 
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>

        {/* --- DATA GRID --- */}
        <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-white/5 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="p-4 w-10 text-center">
                                <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
                                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                                    onChange={() => {
                                        if (selectedLeads.length === filteredLeads.length) setSelectedLeads([]);
                                        else setSelectedLeads(filteredLeads.map(l => l.id));
                                    }}
                                />
                            </th>
                            <th className="p-4 border-b dark:border-white/5">Identity</th>
                            <th className="p-4 border-b dark:border-white/5">Timestamp</th>
                            <th className="p-4 border-b dark:border-white/5">Status</th>
                            <th className="p-4 border-b dark:border-white/5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id} className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group ${selectedLeads.includes(lead.id) ? 'bg-purple-50 dark:bg-purple-900/10' : ''}`}>
                                <td className="p-4 text-center">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedLeads.includes(lead.id)} 
                                        onChange={() => toggleSelect(lead.id)} 
                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" 
                                    />
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-slate-900 dark:text-white">{lead.name}</div>
                                    <div className="text-xs text-slate-500">{lead.firm}</div>
                                    <div className="text-xs text-purple-600 dark:text-purple-400 mt-0.5 font-mono cursor-pointer hover:underline">{lead.email}</div>
                                </td>
                                <td className="p-4 text-xs text-slate-500 font-mono">
                                    {new Date(lead.created_at).toLocaleDateString()} <br/>
                                    {new Date(lead.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </td>
                                <td className="p-4">
                                    <StatusBadge status={lead.status} />
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* ACTION BUTTONS */}
                                        <button onClick={() => handleStatusUpdate(lead.id, 'approved', lead.email, lead.name)} className="p-2 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors" title="Approve (Send Welcome)">
                                            <Check size={16} />
                                        </button>
                                        <button onClick={() => handleStatusUpdate(lead.id, 'waitlisted', lead.email, lead.name)} className="p-2 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded hover:bg-yellow-100 dark:hover:bg-yellow-500/20 transition-colors" title="Move to Waitlist">
                                            <Clock size={16} />
                                        </button>
                                        <button onClick={() => handleStatusUpdate(lead.id, 'rejected', lead.email, lead.name)} className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors" title="Reject">
                                            <X size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Empty State */}
                {filteredLeads.length === 0 && (
                    <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4"><Filter size={24} /></div>
                        <p className="text-sm font-medium">No leads match the current filters.</p>
                    </div>
                )}
            </div>
        </div>

        {/* --- FLOATING BULK ACTION BAR --- */}
        {selectedLeads.length > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-4 duration-300 border border-white/10">
                <span className="text-sm font-bold whitespace-nowrap">{selectedLeads.length} Selected</span>
                <div className="h-4 w-px bg-white/20 dark:bg-black/20"></div>
                <button 
                    onClick={handleBulkEmail} 
                    disabled={isBroadcasting}
                    className="flex items-center gap-2 text-xs font-bold uppercase hover:text-purple-400 dark:hover:text-purple-600 transition-colors disabled:opacity-50"
                >
                    {isBroadcasting ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                    {isBroadcasting ? "Sending..." : "Send Newsletter"}
                </button>
            </div>
        )}

      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between relative overflow-hidden group">
        <div className="relative z-10">
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">{label}</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</div>
        </div>
        <div className={`p-3 rounded-xl bg-opacity-10 ${color.replace('text-', 'bg-')} ${color} relative z-10`}>
            <Icon size={20} />
        </div>
        {/* Hover Effect */}
        <div className={`absolute inset-0 bg-opacity-5 ${color.replace('text-', 'bg-')} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        pending: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
        approved: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20",
        waitlisted: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20",
        rejected: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20"
    };
    return (
        <span className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wide ${styles[status] || styles.pending}`}>
            {status}
        </span>
    );
};