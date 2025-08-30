// app/api/check-cookies/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  return NextResponse.json({
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    cookies: cookieStore.getAll().map(cookie => ({
      name: cookie.name,
      value: cookie.value.substring(0, 10) + '...', // Частинне значення для безпеки
      path: cookie.path,
      expires: cookie.expires
    }))
  });
}