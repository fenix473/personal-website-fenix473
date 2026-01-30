import { NextResponse } from 'next/server';
import { getSignInUrl } from '@workos-inc/authkit-nextjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const signInUrl = await getSignInUrl({
      organizationId: 'org_01KG6JQ8FMTQD452WFJJ8D3CV2',
    });
    return NextResponse.redirect(signInUrl);
  } catch (err) {
    console.error('AuthKit getSignInUrl error:', err);
    return NextResponse.json(
      { error: 'Auth not configured or error' },
      { status: 500 }
    );
  }
}
