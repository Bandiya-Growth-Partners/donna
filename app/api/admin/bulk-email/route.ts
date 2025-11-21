// FILE: app/api/admin/bulk-email/route.ts
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// ✅ CRITICAL: Import the component. DO NOT define it here.
import { NewsletterEmail } from '@/emails/NewletterTemplate';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { ids, type } = await request.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: "No recipients" }, { status: 400 });
    }

    const { data: recipients, error } = await supabase
      .from('leads')
      .select('email, name')
      .in('id', ids);

    if (error || !recipients) return NextResponse.json({ error: "DB Error" }, { status: 500 });

    const emailPromises = recipients.map((user) => 
      resend.emails.send({
        from: 'Donna AI <team@donna-ai.in>',
        to: [user.email],
        subject: 'Weekly Intelligence Briefing',
        react: NewsletterEmail({ name: user.name }), // ✅ Using the import
      })
    );

    await Promise.all(emailPromises);

    return NextResponse.json({ success: true, count: recipients.length });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}