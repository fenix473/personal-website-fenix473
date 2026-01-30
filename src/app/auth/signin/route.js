import { NextResponse } from 'next/server';
import { WorkOS } from '@workos-inc/node';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.WORKOS_API_KEY;
  const clientId = process.env.WORKOS_CLIENT_ID;

  if (!apiKey || !clientId) {
    console.error('WorkOS: missing WORKOS_API_KEY or WORKOS_CLIENT_ID');
    return NextResponse.json(
      { error: 'Auth not configured' },
      { status: 500 }
    );
  }

  const workos = new WorkOS(apiKey);
  const organization = 'org_01KG6GPKDPZ6CTTV7760Y71MMZ';
  const redirectUri =
    process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI ||
    'https://fenix473.vercel.app/auth/callback';

  try {
    const authorizationUrl = workos.sso.getAuthorizationUrl({
      organization,
      redirectUri,
      clientId,
    });
    return NextResponse.redirect(authorizationUrl);
  } catch (err) {
    console.error('WorkOS getAuthorizationUrl error:', err);
    return NextResponse.json(
      { error: 'Auth error' },
      { status: 500 }
    );
  }
}
