import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { Signal } from '@/models';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');
    const since = searchParams.get('since');

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }

    const filter: Record<string, unknown> = {
      roomId,
      senderId: { $ne: authUser.userId }, // Get signals from other peer(s)
    };

    if (since) {
      filter.createdAt = { $gt: new Date(since) };
    }

    const signals = await Signal.find(filter).sort({ createdAt: 1 });

    return NextResponse.json({ signals });
  } catch (error: unknown) {
    console.error('Error fetching WebRTC signals:', error);
    return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { roomId, type, data } = body;

    if (!roomId || !type || !data) {
      return NextResponse.json({ error: 'roomId, type, and data are required' }, { status: 400 });
    }

    const signalData = typeof data === 'string' ? data : JSON.stringify(data);

    const signal = await Signal.create({
      roomId,
      senderId: authUser.userId,
      type,
      data: signalData,
    });

    return NextResponse.json({ signal }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error posting WebRTC signal:', error);
    return NextResponse.json({ error: 'Failed to post signal' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }

    await Signal.deleteMany({ roomId });

    return NextResponse.json({ message: 'Signals cleared for room' });
  } catch (error: unknown) {
    console.error('Error clearing WebRTC signals:', error);
    return NextResponse.json({ error: 'Failed to clear signals' }, { status: 500 });
  }
}
