import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { RegistrationReason } from '@/generated/prisma/client'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Sync user to Prisma database
      try {
        const metadata = data.user.user_metadata;
        await prisma.user.upsert({
          where: { id: data.user.id },
          update: {
            email: data.user.email!,
            username: metadata.username || null,
            registrationReason: (metadata.registration_reason as RegistrationReason) || 'VISITOR',
          },
          create: {
            id: data.user.id,
            email: data.user.email!,
            username: metadata.username || null,
            registrationReason: (metadata.registration_reason as RegistrationReason) || 'VISITOR',
          },
        });
      } catch (dbError) {
        console.error('Error syncing user to database:', dbError);
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // Hello, Vercel
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no proxy in between
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
