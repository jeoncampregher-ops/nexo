import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Lightweight keep-alive: hits the DB so Supabase free tier doesn't sleep.
// Point a daily cron (cron-job.org) at https://nexo.vercel.app/api/ping
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { error } = await supabase.from('organizations').select('id').limit(1).maybeSingle()

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, ts: new Date().toISOString() })
}
