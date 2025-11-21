import Navbar from "@/components/Navbar";
import { MapPin, Mail, Phone, ShieldCheck, Code2, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020205] text-slate-900 dark:text-white font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="pt-48 pb-20 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
          Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-cyan">Neural Layer</span> for Indian Law.
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed mb-12">
          Donna AI was born from a simple observation: Indian attorneys are brilliant strategists stuck doing manual data entry. 
          We are a team of engineers and legal experts based in Gurgaon, dedicated to automating the mundane so you can focus on the magnificent.
        </p>
      </div>

      {/* Grid Info */}
      <div className="max-w-6xl mx-auto px-6 pb-32 grid md:grid-cols-3 gap-8">
        
        <div className="p-8 bg-white dark:bg-[#0A0A0F] border border-slate-200 dark:border-white/10 rounded-3xl shadow-sm">
            <div className="w-12 h-12 bg-brand-purple/10 rounded-full flex items-center justify-center mb-6 text-brand-purple"><ShieldCheck /></div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-slate-500 leading-relaxed">To save 1 million billable hours for Indian IP firms by 2030 through autonomous docketing and generative drafting.</p>
        </div>

        <div className="p-8 bg-white dark:bg-[#0A0A0F] border border-slate-200 dark:border-white/10 rounded-3xl shadow-sm">
            <div className="w-12 h-12 bg-brand-cyan/10 rounded-full flex items-center justify-center mb-6 text-brand-cyan"><Code2 /></div>
            <h3 className="text-2xl font-bold mb-4">Our Technology</h3>
            <p className="text-slate-500 leading-relaxed">Proprietary Neural Engines trained specifically on the Indian Patent Act (1970), hosted on secure, ISO-27001 compliant servers in Mumbai.</p>
        </div>

        <div className="p-8 bg-white dark:bg-[#0A0A0F] border border-slate-200 dark:border-white/10 rounded-3xl shadow-sm">
            <div className="w-12 h-12 bg-brand-amber/10 rounded-full flex items-center justify-center mb-6 text-brand-amber"><Globe /></div>
            <h3 className="text-2xl font-bold mb-4">Contact HQ</h3>
            <ul className="space-y-4 text-slate-500">
                <li className="flex items-center gap-3"><MapPin size={18} /> <span>DLF Cyber City, Gurgaon, India</span></li>
                <li className="flex items-center gap-3"><Mail size={18} /> <span>team@donna-ai.in</span></li>
                <li className="flex items-center gap-3"><Phone size={18} /> <span>+91-9625818967</span></li>
            </ul>
        </div>

      </div>
    </div>
  );
}