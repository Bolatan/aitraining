import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 404 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isAuthorized: user.isAuthorized,
        createdAt: user.createdAt,
      },
    });
  } catch (error: unknown) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
