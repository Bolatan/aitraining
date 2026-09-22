import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { Session, User } from '@/models';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');
    const sessionId = searchParams.get('id');

    if (sessionId) {
      const session = await Session.findById(sessionId)
        .populate('studentId', 'name email')
        .populate('adminId', 'name email');
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      return NextResponse.json({ session });
    }

    if (roomId) {
      const session = await Session.findOne({ roomId })
        .populate('studentId', 'name email')
        .populate('adminId', 'name email');
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      return NextResponse.json({ session });
    }

    let filter: Record<string, unknown> = {};
    if (!authUser.isAdmin) {
      filter.studentId = authUser.userId;
    } else {
      const studentId = searchParams.get('studentId');
      if (studentId) {
        filter.studentId = studentId;
      }
    }

    const sessions = await Session.find(filter)
      .populate('studentId', 'name email')
      .populate('adminId', 'name email')
      .sort({ startTime: 1 });

    return NextResponse.json({ sessions });
  } catch (error: unknown) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!authUser.isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required to schedule sessions' }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { studentId, title, description, startTime, endTime } = body;

    if (!studentId || !title || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const roomId = `meet-${Date.now()}-${randomSuffix}`;

    const newSession = await Session.create({
      title,
      description: description || '',
      studentId,
      adminId: authUser.userId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'scheduled',
      roomId,
    });

    const populatedSession = await Session.findById(newSession._id)
      .populate('studentId', 'name email')
      .populate('adminId', 'name email');

    return NextResponse.json({ message: 'Session scheduled successfully', session: populatedSession }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error scheduling session:', error);
    return NextResponse.json({ error: 'Failed to schedule session' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { id, title, description, startTime, endTime, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const session = await Session.findById(id);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check permissions
    if (!authUser.isAdmin && session.studentId.toString() !== authUser.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (title !== undefined) session.title = title;
    if (description !== undefined) session.description = description;
    if (startTime !== undefined) session.startTime = new Date(startTime);
    if (endTime !== undefined) session.endTime = new Date(endTime);
    if (status !== undefined) session.status = status;

    await session.save();

    const updatedSession = await Session.findById(session._id)
      .populate('studentId', 'name email')
      .populate('adminId', 'name email');

    return NextResponse.json({ message: 'Session updated successfully', session: updatedSession });
  } catch (error: unknown) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!authUser.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    await Session.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Session cancelled and deleted' });
  } catch (error: unknown) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
