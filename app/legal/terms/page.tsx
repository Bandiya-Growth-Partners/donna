import Navbar from "@/components/Navbar";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020205] text-slate-900 dark:text-white font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto pt-40 pb-20 px-6">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-12">Effective Date: November 2025</p>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h3 className="text-xl font-bold mb-4">1. Acceptance of Terms</h3>
            <p className="text-slate-500 leading-relaxed">
              By accessing or using the Donna AI platform ("Service"), you agree to be bound by these Terms. 
              If you are entering into this agreement on behalf of a law firm, you represent that you have the authority to bind such entity.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">2. Use of AI Services</h3>
            <p className="text-slate-500 leading-relaxed">
              Donna AI provides automated drafting and docketing suggestions. You acknowledge that:
            </p>
            <ul className="list-disc pl-5 text-slate-500 space-y-2 mt-4">
                <li>Donna AI is a tool, not a replacement for professional legal judgment.</li>
                <li>You are responsible for reviewing all outputs (drafts, deadlines) before filing with the IPO.</li>
                <li>We are not liable for missed deadlines resulting from incorrect manual inputs.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">3. Intellectual Property</h3>
            <p className="text-slate-500 leading-relaxed">
              <strong>Your Data:</strong> You retain all rights to the IDFs and Patent Applications you upload. We claim no ownership.<br/>
              <strong>Our Tech:</strong> The underlying neural models, algorithms, and UI remain the exclusive property of Donna AI Technologies Pvt Ltd.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">4. Governing Law</h3>
            <p className="text-slate-500 leading-relaxed">
              These terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Gurgaon, Haryana.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}