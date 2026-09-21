import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { Message, Session } from '@/models';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');
    const sessionId = searchParams.get('sessionId');
    const partnerId = searchParams.get('partnerId');

    let filter: Record<string, unknown> = {};

    if (roomId) {
      filter.roomId = roomId;
    } else if (sessionId) {
      filter.sessionId = sessionId;
    } else if (partnerId) {
      filter = {
        $or: [
          { senderId: authUser.userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: authUser.userId },
        ],
      };
    } else {
      // General direct messages for current user
      filter = {
        $or: [
          { senderId: authUser.userId },
          { receiverId: authUser.userId },
        ],
      };
    }

    const messages = await Message.find(filter)
      .populate('senderId', 'name email isAdmin')
      .populate('receiverId', 'name email isAdmin')
      .sort({ createdAt: 1 });

    return NextResponse.json({ messages });
  } catch (error: unknown) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
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
    const { sessionId, roomId, receiverId, content } = body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Message content cannot be empty' }, { status: 400 });
    }

    let targetRoomId = roomId;
    if (sessionId && !targetRoomId) {
      const sessionObj = await Session.findById(sessionId);
      if (sessionObj) {
        targetRoomId = sessionObj.roomId;
      }
    }

    const newMessage = await Message.create({
      sessionId: sessionId || undefined,
      roomId: targetRoomId || undefined,
      senderId: authUser.userId,
      receiverId: receiverId || undefined,
      content: content.trim(),
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'name email isAdmin')
      .populate('receiverId', 'name email isAdmin');

    return NextResponse.json({ message: populatedMessage }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
