import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { EmailLayout, text, button } from '@/emails/Layout'; // Re-using your layout
import { Html, Text, Link, Section } from '@react-email/components';

// Initialize Clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Must use Service Role to read all emails
);
const resend = new Resend(process.env.RESEND_API_KEY);

// --- EMAIL TEMPLATE FOR BULK UPDATE ---
// You can make this dynamic later, for now, it's a standard "Waitlist Update"
const NewsletterEmail = ({ name }: { name: string }) => (
  <Html>
    <EmailLayout previewText="Weekly Digest: IP Tech Trends">
      <Text style={h1}>Weekly Intelligence.</Text>
      <Text style={text}>Hello {name},</Text>
      <Text style={text}>
        We are currently processing a high volume of IDFs through the Donna Neural Engine. 
        Here is what changed in the Indian Patent landscape this week:
      </Text>
      <Section style={{ background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <Text style={{ ...text, color: "#fff", margin: 0 }}>
          • <strong>IPO API Update:</strong> New status codes added for hearings.<br/>
          • <strong>Feature Drop:</strong> You can now export claims to .docx.<br/>
          • <strong>Waitlist Status:</strong> We are opening 5 new spots on Friday.
        </Text>
      </Section>
      <Link href="https://donna-ai.com/login" style={button}>Access Dashboard</Link>
    </EmailLayout>
  </Html>
);

export async function POST(request: Request) {
  try {
    const { ids, type } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No recipients selected" }, { status: 400 });
    }

    // 1. Fetch Emails for selected IDs
    const { data: recipients, error } = await supabase
      .from('leads')
      .select('email, name')
      .in('id', ids);

    if (error || !recipients) {
      return NextResponse.json({ error: "Database error fetching recipients" }, { status: 500 });
    }

    // 2. Send Emails (Batching)
    // Note: Resend Free Tier has limits (100/day). For production, use batching or a queue.
    const emailPromises = recipients.map((user) => 
      resend.emails.send({
        from: 'Donna AI <admin@donna-ai.com>',
        to: [user.email],
        subject: 'Weekly Intelligence Briefing',
        react: NewsletterEmail({ name: user.name }),
      })
    );

    await Promise.all(emailPromises);

    return NextResponse.json({ 
      success: true, 
      count: recipients.length, 
      message: `Sent to ${recipients.length} users` 
    });

  } catch (error) {
    console.error("Bulk Email Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}