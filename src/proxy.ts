import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

/**
 * Dentara Security Middleware
 *
 * Three layers of protection:
 * 1. Rate Limiting    — Sliding window per-IP throttling on auth & API routes
 * 2. CSRF Hardening   — Origin validation for all POST requests
 * 3. Security Headers — Full suite of HTTP hardening headers
 */

// ── Rate Limit Configurations ──
const AUTH_LIMIT   = { maxRequests: 10, windowSeconds: 60 };   // 10 login/register attempts per minute
const API_LIMIT    = { maxRequests: 30, windowSeconds: 60 };   // 30 server action calls per minute
const GLOBAL_LIMIT = { maxRequests: 120, windowSeconds: 60 };  // 120 total requests per minute

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous'
  );
}

export function proxy(request: NextRequest) {
  const { pathname, method } = { pathname: request.nextUrl.pathname, method: request.method };
  const ip = getClientIp(request);

  // ── 1. Rate Limiting ──
  const isAuthRoute = pathname.startsWith('/app/login') || pathname.startsWith('/app/register');
  const isServerAction = method === 'POST' && request.headers.get('next-action') !== null;

  if (isAuthRoute && method === 'POST') {
    // Strict limit on login/register attempts
    const result = rateLimit(`auth:${ip}`, AUTH_LIMIT);
    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many attempts. Please wait a moment and try again.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)) } }
      );
    }
  } else if (isServerAction) {
    // Moderate limit on all Server Action calls
    const result = rateLimit(`api:${ip}`, API_LIMIT);
    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded. Please slow down.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)) } }
      );
    }
  } else {
    // Global limit for all other traffic (DDoS protection)
    const result = rateLimit(`global:${ip}`, GLOBAL_LIMIT);
    if (!result.allowed) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  // ── 2. CSRF Hardening for POST requests ──
  if (method === 'POST') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // Block null-origin requests (CVE GHSA-mq59 mitigation)
    if (origin === 'null' || origin === '') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Ensure origin matches our host
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

  // ── 3. Security Headers ──
  const response = NextResponse.next();

  // Content-Security-Policy
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
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  response.headers.set('X-DNS-Prefetch-Control', 'on');

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
