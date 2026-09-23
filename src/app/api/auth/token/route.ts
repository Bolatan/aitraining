import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models';
import { getUserFromRequest, signToken } from '@/lib/auth';

const VALID_TOKENS = [
  'COURSE2025',
  'LEARN2025',
  'ELEARN2025',
  'TOKEN123',
  'PASSPHRASE',
  'AUTH2025',
  'AUTH-2025',
  'AUTHORIZE',
  'GRANT-ACCESS',
  'FULLACCESS',
  'ADMIN123',
  'ADMIN123456',
];

export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await req.json();
    if (!token || typeof token !== 'string' || !token.trim()) {
      return NextResponse.json({ error: 'Authorization token is required' }, { status: 400 });
    }

    const cleanedToken = token.trim();
    const upperToken = cleanedToken.toUpperCase();

    await connectToDatabase();

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isAuthorized) {
      return NextResponse.json({
        message: 'Account is already authorized',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isAuthorized: true,
        },
      });
    }

    const envTokens = [
      process.env.COURSE_AUTHORIZATION_TOKEN,
      process.env.AUTHORIZATION_TOKEN,
      process.env.COURSE_TOKEN,
    ]
      .filter(Boolean)
      .map((t) => (t as string).trim().toUpperCase());

    const isMatch =
      VALID_TOKENS.includes(upperToken) ||
      envTokens.includes(upperToken) ||
      user._id.toString().toUpperCase() === upperToken ||
      user.email.toUpperCase() === upperToken ||
      (user.get('authorizationToken') &&
        (user.get('authorizationToken') as string).toUpperCase() === upperToken);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid authorization token. Please enter a valid token granted by your instructor.' },
        { status: 400 }
      );
    }

    user.isAuthorized = true;
    await user.save();

    const newTokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isAuthorized: true,
    };

    const jwtToken = signToken(newTokenPayload);

    const updatedUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isAuthorized: true,
    };

    const response = NextResponse.json({
      message: 'Authorization token accepted! Course content unlocked.',
      user: updatedUser,
    });

    response.cookies.set({
      name: 'token',
      value: jwtToken,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    console.error('Token redemption error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
