import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User, AuthToken } from '@/models';
import { getUserFromRequest, signToken } from '@/lib/auth';

const STANDARD_TOKENS = ['COURSE2025', 'ELEARN2025', 'AUTH123', 'TOKEN2025', 'INSTRUCTOR-TOKEN', 'PASSPHRASE'];

export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized: Please log in first' }, { status: 401 });
    }

    const { token } = await req.json();

    if (!token || typeof token !== 'string' || token.trim() === '') {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 });
    }

    const cleanedToken = token.trim().toUpperCase();

    // Check env var or standard static valid tokens
    const envToken = process.env.COURSE_AUTHORIZATION_TOKEN?.trim().toUpperCase();
    const isStandardValid = STANDARD_TOKENS.includes(cleanedToken) || (envToken && cleanedToken === envToken);

    // Check if token exists in AuthToken collection
    const dbToken = await AuthToken.findOne({ code: cleanedToken });

    if (!dbToken && !isStandardValid) {
      return NextResponse.json(
        { error: 'Invalid course authorization token. Please enter a valid token granted by your instructor.' },
        { status: 400 }
      );
    }

    if (dbToken && dbToken.isUsed) {
      return NextResponse.json(
        { error: 'This authorization token has already been redeemed.' },
        { status: 400 }
      );
    }

    if (dbToken) {
      dbToken.isUsed = true;
      dbToken.usedBy = user._id;
      dbToken.usedAt = new Date();
      await dbToken.save();
    }

    // Authorize user in database
    user.isAuthorized = true;
    await user.save();

    // Re-issue JWT token with updated authorization state
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isAuthorized: user.isAuthorized,
    };

    const newToken = signToken(tokenPayload);

    const response = NextResponse.json({
      message: 'Authorization token accepted! Course access granted.',
      isAuthorized: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isAuthorized: user.isAuthorized,
      },
    });

    response.cookies.set({
      name: 'token',
      value: newToken,
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
