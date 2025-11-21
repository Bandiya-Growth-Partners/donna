import Navbar from "@/components/Navbar";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020205] text-slate-900 dark:text-white font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto pt-40 pb-20 px-6">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-12">Last Updated: November 2025</p>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h3 className="text-xl font-bold mb-4">1. Introduction</h3>
            <p className="text-slate-500 leading-relaxed">
              Donna AI Technologies Pvt Ltd ("Donna", "we", "us") is committed to protecting the confidentiality of your firm's data. 
              This policy outlines how we handle data in compliance with the Digital Personal Data Protection Act, 2023 (DPDP).
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">2. Data Collection & Usage</h3>
            <p className="text-slate-500 leading-relaxed">
              We collect information strictly necessary to provide our patent docketing and drafting services:
            </p>
            <ul className="list-disc pl-5 text-slate-500 space-y-2 mt-4">
                <li><strong>Firm Identity:</strong> Name, Email, Phone, and Bar Council Registration numbers.</li>
                <li><strong>Client Data:</strong> Patent Application Numbers uploaded for docketing.</li>
                <li><strong>Usage Data:</strong> System logs to improve latency and security.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">3. Data Sovereignty & Security</h3>
            <p className="text-slate-500 leading-relaxed">
              All data is encrypted at rest (AES-256) and in transit (TLS 1.3). 
              Your data resides on servers located within India (Mumbai Region) to comply with data localization norms. 
              We do not use your confidential client data to train our public models.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">4. Contact Officer</h3>
            <p className="text-slate-500 leading-relaxed">
              For grievances or data deletion requests, please contact our Grievance Officer:<br/><br/>
              <strong>Email:</strong> team@donna-ai.in<br/>
              <strong>Address:</strong> DLF Cyber City, Phase 2, Gurgaon, Haryana, 122002.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}