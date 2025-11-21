import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { WelcomeEmail, RejectionEmail, WaitlistEmail } from '@/emails/Templates';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { id, status, email, name } = await request.json();

  // 1. Update DB
  await supabase.from('leads').update({ status }).eq('id', id);

  // 2. Calculate Rank (if waitlisted)
  let rank = 0;
  if (status === 'waitlisted') {
     const { count } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'waitlisted');
     rank = (count || 0) + 1;
  }

  // 3. Send Specific Email
  let emailTemplate;
  let subject = "";

  if (status === 'approved') {
      subject = "Access Granted: Welcome to Donna AI";
      emailTemplate = WelcomeEmail({ name });
  } else if (status === 'rejected') {
      subject = "Update regarding your application";
      emailTemplate = RejectionEmail({ name });
  } else if (status === 'waitlisted') {
      subject = `You are #${rank} on the waitlist`;
      emailTemplate = WaitlistEmail({ name, rank });
  }

  if (emailTemplate) {
      await resend.emails.send({
          from: 'Donna AI <admin@donna-ai.com>',
          to: [email],
          subject: subject,
          react: emailTemplate,
      });
  }

  return NextResponse.json({ success: true });
}