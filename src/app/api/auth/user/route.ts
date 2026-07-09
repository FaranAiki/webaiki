import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null, error: String(error) }, { status: 500 });
  }
}
