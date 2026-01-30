import { NextResponse } from 'next/server';
import { withAuth } from '@workos-inc/authkit-nextjs';

export async function GET() {
    const { user } = await withAuth();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
    });
}
