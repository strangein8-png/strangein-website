import { NextResponse } from 'next/server';

const SECTION_ROUTES = new Set(['/features', '/blogs', '/stories', '/download', '/events']);

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (SECTION_ROUTES.has(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/features', '/blogs', '/stories', '/download', '/events'],
};