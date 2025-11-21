import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // 1. Find the user
    const { data: user, error } = await supabase
      .from('leads')
      .select('id, created_at, status')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json({ exists: false });
    }

    // 2. Count how many people registered BEFORE this user
    // (This logic assumes 'waitlisted' people are queued by time)
    const { count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'waitlisted')
      .lt('created_at', user.created_at);

    // 3. Get Total Count for context
    const { count: total } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({ 
      exists: true, 
      rank: (count || 0) + 1, // Rank is count of people ahead + 1
      total: total,
      status: user.status
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}