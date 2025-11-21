import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { WelcomeEmail } from '@/emails/WelcomeTemplate';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, firm, email, phone, source, metadata } = body;

    // 1. Validation
    if (!name || !email) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Priority Scoring Algorithm
    let priority_score = 10; // Default (Contact Form)
    
    if (source === 'inner_circle_modal') {
        // Boost score for partners
        priority_score = 40; 
        // Super boost for high volume
        if (metadata?.docket_size?.includes('200+')) priority_score = 95; 
        else if (metadata?.docket_size?.includes('50 - 200')) priority_score = 60;
    }

    // 3. Insert into Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([{ 
          name, 
          firm, 
          email, 
          phone: phone || null, // Store the phone!
          status: 'pending',
          metadata: metadata || {},
          priority_score 
      }])
      .select();

    if (error) throw error;

    // 4. Trigger "Receipt" Email
    try {
        await resend.emails.send({
            from: 'Donna AI <team@donna-ai.in>',
            to: [email],
            subject: 'We received your request',
            react: WelcomeEmail({ name }),
        });
    } catch (e) {
        console.error("Email failed (non-fatal):", e);
    }

    return NextResponse.json({ success: true, leadId: data[0].id });

  } catch (error: any) {
    console.error("Lead Gen Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}