import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Return an immediate 404 for paths probed by automated WordPress/PHP scanners.
// These bots hit every domain looking for WordPress installs — hagbits has none.
export function proxy(_request: NextRequest) {
  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: [
    '/(wp-.*)',        // /wp-admin/*, /wp-login.php, etc.
    '/(wordpress/.*)', // /wordpress/wp-admin/*, etc.
    '/(.*\\.php)',     // any .php file at any depth
    '/(\\.env.*)',     // /.env, /.env.local, etc.
  ],
};
