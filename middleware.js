import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token');

    if (!token || token.value !== 'authenticated_session_djm') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Protect /patient/profile - require patient_session cookie
  if (pathname === '/patient/profile') {
    const patientSession = request.cookies.get('patient_session');
    if (!patientSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/patient/login';
      return NextResponse.redirect(url);
    }
  }

  // Protect /patient/complete-profile - require patient_session cookie
  if (pathname === '/patient/complete-profile') {
    const patientSession = request.cookies.get('patient_session');
    if (!patientSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/patient/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/patient/profile', '/patient/complete-profile'],
};
