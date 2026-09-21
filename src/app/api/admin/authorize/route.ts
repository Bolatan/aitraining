import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User, Progress } from '@/models';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { action, userId, moduleId, isAuthorized } = await req.json();

    await connectToDatabase();

    if (action === 'toggleToken') {
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      user.isAuthorized = typeof isAuthorized === 'boolean' ? isAuthorized : !user.isAuthorized;
      await user.save();

      return NextResponse.json({
        message: `Token access ${user.isAuthorized ? 'granted' : 'revoked'} for ${user.email}`,
        isAuthorized: user.isAuthorized,
      });
    }

    if (action === 'approveModule') {
      if (!userId || !moduleId) {
        return NextResponse.json({ error: 'userId and moduleId required' }, { status: 400 });
      }

      let progress = await Progress.findOne({ userId, moduleId });
      if (!progress) {
        progress = new Progress({
          userId,
          moduleId,
          quizPassed: false,
          quizScore: 0,
          adminApproved: true,
          completed: false,
        });
      } else {
        progress.adminApproved = true;
      }

      if (progress.quizPassed && progress.adminApproved) {
        progress.completed = true;
        progress.completedAt = new Date();
      }

      await progress.save();

      return NextResponse.json({
        message: 'Module progress approved by admin',
        progress,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    console.error('Admin authorization error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
