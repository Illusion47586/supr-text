import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    console.info(`${request.method} ${request.url}`);
    return response;
}

export const config = {
    matcher: '/api/:path*',
};
