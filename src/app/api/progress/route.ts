import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Progress, User } from '@/models';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const progressRecords = await Progress.find({ userId: user._id });

    return NextResponse.json({
      isAuthorized: user.isAuthorized,
      progress: progressRecords,
    });
  } catch (error: unknown) {
    console.error('Fetch progress error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId, markComplete } = await req.json();
    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId is required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.isAuthorized && !user.isAdmin) {
      return NextResponse.json(
        { error: 'Course token authorization required before accessing modules' },
        { status: 403 }
      );
    }

    let progress = await Progress.findOne({ userId: user._id, moduleId });

    if (!progress) {
      progress = new Progress({
        userId: user._id,
        moduleId,
        quizPassed: false,
        adminApproved: false,
        completed: false,
      });
    }

    if (markComplete) {
      if (user.isAdmin) {
        progress.quizPassed = true;
        progress.adminApproved = true;
        progress.completed = true;
        progress.completedAt = new Date();
      } else {
        if (!progress.quizPassed) {
          return NextResponse.json(
            { error: 'You must pass the module quiz before marking it complete.' },
            { status: 400 }
          );
        }
        if (!progress.adminApproved) {
          return NextResponse.json(
            { error: 'Admin authorization/approval is required to complete this module.' },
            { status: 400 }
          );
        }
        progress.completed = true;
        progress.completedAt = new Date();
      }
    }

    await progress.save();

    return NextResponse.json({ message: 'Progress updated', progress });
  } catch (error: unknown) {
    console.error('Update progress error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
