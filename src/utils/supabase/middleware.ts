import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Optimization: Use getSession() instead of getUser() to avoid network requests 
    // when the token is still valid. getSession() only decodes the local JWT unless 
    // it's expired, making it significantly faster for most requests.
    await supabase.auth.getSession()
  } catch (error) {
    // If Supabase fetch fails (e.g. network issue or invalid url), we don't want to crash the whole middleware
    console.warn('Supabase middleware gracefully bypassed fetch error:', error instanceof Error ? error.message : String(error));
  }

  return supabaseResponse
}
