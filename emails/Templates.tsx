import { EmailLayout, h1, text, button } from "./Layout";
import { Section, Text, Link } from "@react-email/components";

// 1. WELCOME EMAIL (Approval)
export const WelcomeEmail = ({ name }: { name: string }) => (
  <EmailLayout previewText="Access Granted: Welcome to Donna AI">
    <Text style={{...text, color: "#8B5CF6", fontWeight: "bold", textAlign: "center", letterSpacing: "2px", fontSize: "12px"}}>ACCESS GRANTED</Text>
    <Text style={h1}>Welcome to the Inner Circle.</Text>
    <Text style={text}>Hello {name},</Text>
    <Text style={text}>Your firm's application stood out. We have unlocked your dedicated instance of the Donna Patent Platform.</Text>
    <Text style={text}>You are one of only 20 firms onboarding this week. Our servers are reserved for your docketing sync.</Text>
    <Link href="https://donna-ai.com/login" style={button}>Enter Console</Link>
  </EmailLayout>
);

// 2. WAITLIST EMAIL (The "Velvet Rope")
export const WaitlistEmail = ({ name, rank }: { name: string, rank: number }) => (
  <EmailLayout previewText={`You are #${rank} on the list.`}>
    <Text style={{...text, color: "#F59E0B", fontWeight: "bold", textAlign: "center", letterSpacing: "2px", fontSize: "12px"}}>STATUS: QUEUED</Text>
    <Text style={h1}>High Demand Alert.</Text>
    <Text style={text}>Hello {name},</Text>
    <Text style={text}>Due to an overwhelming response from IP firms across India, our current onboarding cohort (20/20) is full.</Text>
    <Text style={text}>To ensure system latency remains zero for our active users, we have placed you in the priority queue.</Text>
    
    <Section style={{ background: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "20px", textAlign: "center", margin: "30px 0" }}>
      <Text style={{ color: "#94A3B8", fontSize: "12px", textTransform: "uppercase", margin: 0 }}>Current Position</Text>
      <Text style={{ color: "#fff", fontSize: "36px", fontWeight: "bold", margin: "10px 0" }}>#{rank}</Text>
    </Section>

    <Link href="https://donna-ai.com/waitlist" style={{...button, backgroundColor: "transparent", border: "1px solid #333"}}>Check Live Status</Link>
  </EmailLayout>
);

// 3. REJECTION EMAIL (Polite & Encouraging)
export const RejectionEmail = ({ name }: { name: string }) => (
  <EmailLayout previewText="Update regarding your application">
    <Text style={h1}>Application Update</Text>
    <Text style={text}>Dear {name},</Text>
    <Text style={text}>Thank you for your interest in Donna AI. We've reviewed your firm's profile against our current infrastructure requirements.</Text>
    <Text style={text}>At this moment, we are prioritizing firms with a specific docket volume to train our neural models. We aren't able to offer you a seat in the current cohort.</Text>
    <Text style={text}>This is not a permanent "no." We are expanding capacity next quarter and will reach out to you priority.</Text>
  </EmailLayout>
);