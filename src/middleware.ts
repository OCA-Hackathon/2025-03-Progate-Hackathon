import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');

  // 現在のパスを取得
  const { pathname } = request.nextUrl;

  // /loginページの場合はリダイレクト不要
  if (pathname === '/login') {
    return NextResponse.next();
  }


  if ((pathname === '/home' || pathname.startsWith('/home/')) && !accessToken) {
    const loginUrl = new URL('/login', request.url);

    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

// 特定のパスに対してのみミドルウェアを実行するように設定
export const config = {
  matcher: ['/home', '/home/:path*', '/login'],
};