"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Check, X, Loader2, LogOut, Search, Filter, 
  TrendingUp, Users, AlertCircle, Mail, Clock, 
  Activity, MessageCircle, ShieldAlert, Server, Zap, Crown, Send
} from "lucide-react";
import Link from "next/link";

// --- 1. SUPABASE CONFIGURATION ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- 2. TYPES ---
type Lead = {
  id: string;
  created_at: string;
  name: string;
  firm: string;
  email: string;
  phone?: string; // Added phone for WhatsApp integration
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  priority_score: number;
  metadata?: { 
    docket_size?: string;
    application_type?: string;
  };
};

// === 3. MAIN ENTRY COMPONENT ===
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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin w-8 h-8 text-purple-500" />
          <span className="text-xs font-mono text-slate-500 tracking-widest">ESTABLISHING SECURE CONNECTION...</span>
        </div>
      </div>
    );
  }

  return session ? <CommandCenter /> : <LoginScreen />;
}

// === 4. LOGIN SCREEN ===
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
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl z-10 shadow-2xl">
        <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-lg">D</div>
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
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : "Access Terminal"}
          </button>
        </form>
      </div>
    </div>
  );
}

// === 5. COMMAND CENTER (DASHBOARD) ===
function CommandCenter() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [systemHealth, setSystemHealth] = useState({ db: 'CHECKING...', api: 'ONLINE', status: 'OK', errorRate: 'N/A' });

  // --- STATS CALCULATION ---
  const activeCount = leads.filter(l => l.status === 'approved').length;
  const waitlistCount = leads.filter(l => l.status === 'waitlisted').length;
  const pendingCount = leads.filter(l => l.status === 'pending').length;
  const highPriorityCount = leads.filter(l => l.priority_score > 80).length;
  const slotsRemaining = 20 - activeCount;

  // --- DATA FETCHING ---
  const checkHealth = async () => {
    const start = Date.now();
    // Ping database for a real health check
    const { error } = await supabase.from('leads').select('count', { count: 'exact', head: true });
    const latency = Date.now() - start;
    
    if (error) {
        setSystemHealth({ db: 'ERROR', api: 'OFFLINE', status: 'CRITICAL', errorRate: 'N/A' });
    } else {
        setSystemHealth({ db: 'CONNECTED', api: `${latency}ms`, status: 'OPERATIONAL', errorRate: 'N/A' });
    }
  };

  const fetchLeads = async () => {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('priority_score', { ascending: false }) // VIPs first
      .order('created_at', { ascending: false });
    
    if (data) setLeads(data as Lead[]);
  };

  useEffect(() => { 
    fetchLeads(); 
    checkHealth();
    
    // Polling for real-time feel (every 15s)
    const interval = setInterval(() => {
        fetchLeads();
        checkHealth();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS ---

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected' | 'waitlisted', email: string, name: string) => {
    // Constraint Check for Cohort
    if (status === 'approved' && slotsRemaining <= 0) {
      alert("⚠️ Cohort is Full (20/20). Please move user to Waitlist.");
      return;
    }

    // Optimistic UI Update
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));

    try {
      // API Call triggers DB update + Resend Email Logic
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
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedLeads, type: 'newsletter_update' })
      });
      
      if(res.ok) {
          alert("Broadcast Sent Successfully via Resend.");
          setSelectedLeads([]);
      } else {
          alert("Broadcast Failed. Check Server Logs.");
      }
    } catch (error) {
      alert("Broadcast Network Error");
    }
    setIsBroadcasting(false);
  };

  const handleWhatsApp = (phone: string | undefined, name: string) => {
      if (!phone) {
          alert("No phone number provided for this lead.");
          return;
      }
      // Clean number string
      const cleanPhone = phone.replace(/\D/g, ''); 
      // Pre-filled message
      const text = `Hello ${name}, this is regarding your application to the Donna AI Partner Program. We have reviewed your firm's profile...`;
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
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
      
      {/* --- SYSTEM STATUS BAR (LIVE HEALTH) --- */}
      <div className="bg-[#020205] text-slate-400 text-[10px] font-mono py-1 px-4 flex justify-between items-center border-b border-white/5">
          <div className="flex gap-4">
              <span className={`flex items-center gap-1 font-bold ${systemHealth.status === 'OPERATIONAL' ? 'text-green-500' : 'text-red-500'}`}>
                  <span className={`w-2 h-2 rounded-full ${systemHealth.status === 'OPERATIONAL' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span> 
                  {systemHealth.status}
              </span>
              <span className="flex items-center gap-1"><Server size={10} /> DB_LATENCY: {systemHealth.api}</span>
              <span className="flex items-center gap-1"><ShieldAlert size={10} /> ERR_RATE: {systemHealth.errorRate}</span>
          </div>
          <div className="tracking-widest">ENCRYPTED CONNECTION // ADMIN_MODE</div>
      </div>

      {/* --- TOP HEADER --- */}
      <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg hover:scale-105 transition-transform">D</Link>
            <div>
                <h1 className="font-bold tracking-tight text-sm leading-none">DONNA MISSION CONTROL</h1>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">v3.0.1 • LIVE</span>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-purple-500 transition-colors">VIEW SITE</Link>
            <button onClick={() => supabase.auth.signOut()} className="text-xs font-bold bg-red-500/10 text-red-500 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2">
                <LogOut size={14} /> EXIT
            </button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        
        {/* --- HUD METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* 1. Cohort Progress */}
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Active Cohort</div>
                        <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{activeCount} <span className="text-slate-400 text-lg">/ 20</span></div>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><TrendingUp size={20} /></div>
                </div>
                {/* Real Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden relative z-10">
                    <div className={`h-full transition-all duration-1000 ${activeCount >= 20 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(activeCount/20)*100}%` }}></div>
                </div>
            </div>

            {/* 2. High Priority */}
            <StatCard label="VIP Applicants" value={highPriorityCount} icon={Zap} color="text-amber-500" />
            
            {/* 3. Pending */}
            <StatCard label="Pending Review" value={pendingCount} icon={AlertCircle} color="text-purple-500" />
            
            {/* 4. Waitlist */}
            <StatCard label="Waitlist Queue" value={waitlistCount} icon={Clock} color="text-yellow-500" />
        </div>

        {/* --- TOOLBAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-purple-500 transition-colors" />
                <input 
                    placeholder="Search leads..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-purple-500 transition-all shadow-sm"
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-white dark:bg-[#1E293B] p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm overflow-x-auto max-w-full">
                {['all', 'pending', 'approved', 'waitlisted', 'rejected'].map((f) => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap ${
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
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" 
                                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                                    onChange={() => {
                                        if (selectedLeads.length === filteredLeads.length) setSelectedLeads([]);
                                        else setSelectedLeads(filteredLeads.map(l => l.id));
                                    }}
                                />
                            </th>
                            <th className="p-4 border-b dark:border-white/5">Score</th>
                            <th className="p-4 border-b dark:border-white/5">Identity</th>
                            <th className="p-4 border-b dark:border-white/5">Docket Info</th>
                            <th className="p-4 border-b dark:border-white/5">Status</th>
                            <th className="p-4 border-b dark:border-white/5 text-right">Quick Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id} className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group ${selectedLeads.includes(lead.id) ? 'bg-purple-50 dark:bg-purple-900/10' : ''}`}>
                                {/* Checkbox */}
                                <td className="p-4 text-center">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedLeads.includes(lead.id)} 
                                        onChange={() => toggleSelect(lead.id)} 
                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" 
                                    />
                                </td>
                                
                                {/* Priority Score (Visual) */}
                                <td className="p-4">
                                    {lead.priority_score >= 80 ? (
                                        <span className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 w-fit">
                                            <Crown size={12} /> {lead.priority_score}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-xs font-mono px-2">{lead.priority_score}</span>
                                    )}
                                </td>

                                {/* Identity */}
                                <td className="p-4">
                                    <div className="font-bold text-slate-900 dark:text-white">{lead.name}</div>
                                    <div className="text-xs text-slate-500">{lead.firm}</div>
                                    <div className="text-[10px] text-purple-600 dark:text-purple-400 mt-0.5 font-mono flex items-center gap-1">
                                        <Mail size={8}/> {lead.email}
                                    </div>
                                    {lead.phone && (
                                        <div className="text-[10px] text-green-600 dark:text-green-400 mt-0.5 font-mono flex items-center gap-1">
                                            <MessageCircle size={8}/> {lead.phone}
                                        </div>
                                    )}
                                </td>

                                {/* Metadata */}
                                <td className="p-4">
                                    {lead.metadata?.docket_size ? (
                                        <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded border border-blue-500/20 whitespace-nowrap">
                                            {lead.metadata.docket_size}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-[10px]">-</span>
                                    )}
                                </td>

                                {/* Status Badge */}
                                <td className="p-4">
                                    <StatusBadge status={lead.status} />
                                </td>

                                {/* Actions Toolbar */}
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                        
                                        {/* WhatsApp Trigger */}
                                        <button onClick={() => handleWhatsApp(lead.phone, lead.name)} className="p-2 bg-green-500/10 text-green-700 dark:text-green-400 rounded hover:bg-green-500 hover:text-white transition-all" title="Chat on WhatsApp">
                                            <MessageCircle size={16} />
                                        </button>
                                        
                                        {/* Decisions (Only if pending) */}
                                        {lead.status === 'pending' && (
                                            <>
                                                <div className="w-px h-8 bg-slate-200 dark:bg-white/10 mx-1"></div>
                                                
                                                <button onClick={() => handleStatusUpdate(lead.id, 'approved', lead.email, lead.name)} className="p-2 bg-green-500 text-white rounded hover:bg-green-600 shadow-sm" title="Approve (Send Welcome)">
                                                    <Check size={16} />
                                                </button>
                                                
                                                <button onClick={() => handleStatusUpdate(lead.id, 'waitlisted', lead.email, lead.name)} className="p-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded hover:bg-yellow-500 hover:text-white transition-colors" title="Move to Waitlist">
                                                    <Clock size={16} />
                                                </button>
                                                
                                                <button onClick={() => handleStatusUpdate(lead.id, 'rejected', lead.email, lead.name)} className="p-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors" title="Reject">
                                                    <X size={16} />
                                                </button>
                                            </>
                                        )}
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
                    {isBroadcasting ? "Broadcasting..." : "Send Newsletter"}
                </button>
            </div>
        )}

      </main>
    </div>
  );
}

// === 6. HELPER COMPONENTS ===

const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between relative overflow-hidden group">
        <div className="relative z-10">
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">{label}</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</div>
        </div>
        <div className={`p-3 rounded-xl bg-opacity-10 ${color.replace('text-', 'bg-')} ${color} relative z-10`}>
            <Icon size={20} />
        </div>
        {/* Hover Glow */}
        <div className={`absolute inset-0 bg-opacity-5 ${color.replace('text-', 'bg-')} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
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