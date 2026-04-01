import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Early redirect: unauthenticated requests to /admin/* (except /admin/login)
  // go to /admin/login. This is a session-cookie check only; staff profile
  // authorization is re-checked server-side by requireStaff() / requireAdmin().
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.getAll().find(
      (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
    )
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
