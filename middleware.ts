import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

// 1. Initialize next-intl middleware (handles your en, es, fr, de routing)
const intlMiddleware = createIntlMiddleware(routing);

// 2. Initialize next-auth middleware for protected routes
const authMiddleware = withAuth(
  function onSuccess(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Extract locale from path to redirect properly (e.g., /en/dashboard)
    const locale = path.split('/')[1] || 'en';

    // Check if user is trying to access admin without ADMIN role
    const isAdminRoute = /^\/(en|es|fr|de)\/admin/.test(path);
    if (isAdminRoute && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
    }

    // If authorized, pass the request to next-intl
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: "/en/login", // Send unauthorized users here
    },
  }
);

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Protect /dashboard and /admin for all 4 languages
  const isProtectedRoute = /^\/(en|es|fr|de)\/(dashboard|admin)/.test(path);

  if (isProtectedRoute) {
    // Apply Auth logic first for protected routes
    return (authMiddleware as any)(req);
  } else {
    // For public pages apply only Localization
    return intlMiddleware(req);
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};