import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { AuthToken } from '@/models';
import { getUserFromRequest } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    await connectToDatabase();

    const tokens = await AuthToken.find({})
      .populate('createdBy', 'name email')
      .populate('usedBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ tokens });
  } catch (error: unknown) {
    console.error('Admin tokens fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    await connectToDatabase();

    const body = await req.json().catch(() => ({}));
    const customCode = body.customCode?.trim().toUpperCase();

    let code = customCode;
    if (!code) {
      const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
      code = `COURSE-${randomPart}`;
    }

    const existing = await AuthToken.findOne({ code });
    if (existing) {
      return NextResponse.json({ error: 'Token code already exists' }, { status: 400 });
    }

    const newToken = await AuthToken.create({
      code,
      createdBy: payload.userId,
    });

    return NextResponse.json({
      message: `Authorization token generated: ${code}`,
      token: newToken,
    });
  } catch (error: unknown) {
    console.error('Admin token creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { tokenId } = await req.json();

    if (!tokenId) {
      return NextResponse.json({ error: 'tokenId is required' }, { status: 400 });
    }

    await connectToDatabase();

    await AuthToken.findByIdAndDelete(tokenId);

    return NextResponse.json({ message: 'Token deleted successfully' });
  } catch (error: unknown) {
    console.error('Admin token delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
