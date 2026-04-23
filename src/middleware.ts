import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Dentara Security Middleware
 *
 * Injects strict HTTP security headers on every response and provides
 * additional CSRF hardening for Server Action POST requests.
 *
 * Headers applied:
 * - Content-Security-Policy  (strict, report-only-friendly)
 * - Strict-Transport-Security  (HSTS with 1-year max-age)
 * - X-Frame-Options  (DENY — no iframing)
 * - X-Content-Type-Options  (nosniff)
 * - Referrer-Policy  (strict-origin-when-cross-origin)
 * - Permissions-Policy  (deny camera, microphone, geolocation)
 * - X-DNS-Prefetch-Control  (on — performance boost)
 */

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // ── Content-Security-Policy ──
  // Allow self, Next.js scripts, Google Fonts, Supabase, and inline styles
  // needed for Framer Motion and Tailwind CSS.
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://generativelanguage.googleapis.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // ── Strict Transport Security ──
  // Force HTTPS for 1 year, include subdomains, allow preload list
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // ── Prevent clickjacking ──
  response.headers.set('X-Frame-Options', 'DENY');

  // ── Prevent MIME-type sniffing ──
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // ── Referrer Policy ──
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // ── Permissions Policy ──
  // Deny access to sensitive browser APIs unless explicitly needed
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // ── DNS Prefetch Control ──
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  // ── CSRF Hardening for Server Actions ──
  // Block POST requests to Server Actions with suspicious origins.
  // Next.js checks Origin automatically, but we add defense-in-depth
  // against the null-origin CVE (GHSA-mq59) on older versions.
  if (request.method === 'POST') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // Block null-origin requests (CVE mitigation)
    if (origin === 'null' || origin === '') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // If origin is present, ensure it matches our host
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return new NextResponse('Forbidden', { status: 403 });
        }
      } catch {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets folder
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets/).*)',
  ],
};
