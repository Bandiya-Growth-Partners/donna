import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// CHANGE 1: Use Service Role Key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // <--- Changed from ANON_KEY
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, firm, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([{ name, firm, email, status: 'pending' }])
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}