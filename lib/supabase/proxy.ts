import { NextResponse, type NextRequest } from "next/server"

const SESSION_COOKIE_NAME = "pacs_session"

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })

  // Check if the user has a valid session cookie for our custom auth
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)

  // Protect admin routes - redirect to login if no session
  if (request.nextUrl.pathname.startsWith("/admin") && !sessionCookie) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return response
}
