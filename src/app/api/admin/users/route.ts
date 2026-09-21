import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User, ModuleModel, Progress, CapstoneSubmission } from '@/models';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    await connectToDatabase();

    const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
    const modules = await ModuleModel.find({}).sort({ order: 1 });
    const allProgress = await Progress.find({});
    const capstones = await CapstoneSubmission.find({});

    const totalModules = modules.length;

    const userStats = users.map((user) => {
      const userProgress = allProgress.filter((p) => p.userId.toString() === user._id.toString());
      const completedCount = userProgress.filter((p) => p.completed).length;
      const userCapstone = capstones.find((c) => c.userId.toString() === user._id.toString());

      const completionPercentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isAuthorized: user.isAuthorized,
        createdAt: user.createdAt,
        completedCount,
        totalModules,
        completionPercentage,
        progress: userProgress,
        capstoneSubmitted: !!userCapstone,
        capstoneDetails: userCapstone || null,
      };
    });

    return NextResponse.json({ users: userStats, modules });
  } catch (error: unknown) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
