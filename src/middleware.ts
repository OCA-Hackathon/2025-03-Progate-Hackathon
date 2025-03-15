import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // アクセストークンを取得
  const accessToken = request.cookies.get('accessToken');

  // 現在のパスを取得
  const { pathname } = request.nextUrl;

  // /loginページの場合はリダイレクト不要
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // /homeページとその他の保護されたルートでaccessTokenがない場合、/loginにリダイレクト
  if ((pathname === '/home' || pathname.startsWith('/home/')) && !accessToken) {
    // ログインURLを作成
    const loginUrl = new URL('/login', request.url);

    // リダイレクト元のURLを保存したい場合（ログイン後に元のページに戻すため）
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

// 特定のパスに対してのみミドルウェアを実行するように設定
export const config = {
  matcher: ['/home', '/home/:path*', '/login'],
};