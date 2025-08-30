// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPrivateRoute = pathname.startsWith('/profile') || pathname.startsWith('/notes');

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // Якщо приватний маршрут і немає accessToken — але Є refreshToken:
  // переходимо через наш refresh-ендпоінт, який поставить нові куки і поверне назад
  if (isPrivateRoute && !accessToken && refreshToken) {
    const url = new URL(`/api/auth/refresh?next=${encodeURIComponent(pathname)}`, request.url);
    return NextResponse.redirect(url);
  }

  // Якщо приватний маршрут і немає жодного токена — на логін
  if (isPrivateRoute && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Якщо користувач уже автентифікований і лізе на /sign-in|/sign-up — відправляємо на ГОЛОВНУ (вимога ментора)
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in/:path*', '/sign-up/:path*'],
};
