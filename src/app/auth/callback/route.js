import { NextResponse } from 'next/server';
import { WorkOS } from '@workos-inc/node';
import { cookies } from 'next/headers';

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientId = process.env.WORKOS_CLIENT_ID;

export async function GET(request) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const { profile } = await workos.sso.getProfileAndToken({
    code,
    clientId,
  });

  // Validate that the profile belongs to our organization
  const organization = 'org_01KG6GPKDPZ6CTTV7760Y71MMZ';
  if (profile.organizationId !== organization) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Create a simple session cookie so the user is "logged in"
  const sessionPayload = JSON.stringify({
    userId: profile.id,
    email: profile.email,
  });
  const cookieStore = await cookies();
  cookieStore.set('wos_session', Buffer.from(sessionPayload, 'utf8').toString('base64'), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return NextResponse.redirect(new URL('/', request.url));
}