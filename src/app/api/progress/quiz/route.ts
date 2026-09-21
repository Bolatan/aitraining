import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Progress, ModuleModel, User } from '@/models';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId, answers } = await req.json();

    if (!moduleId || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'moduleId and answers array are required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const moduleDoc = await ModuleModel.findById(moduleId);
    if (!moduleDoc) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    if (!moduleDoc.quiz || moduleDoc.quiz.length === 0) {
      return NextResponse.json({ error: 'Module has no quiz' }, { status: 400 });
    }

    let correctCount = 0;
    const totalQuestions = moduleDoc.quiz.length;

    moduleDoc.quiz.forEach((q, index) => {
      if (answers[index] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score === 100;

    let progress = await Progress.findOne({ userId: user._id, moduleId });

    if (!progress) {
      progress = new Progress({
        userId: user._id,
        moduleId,
        quizPassed: passed,
        quizScore: score,
        adminApproved: false,
        completed: false,
      });
    } else {
      progress.quizScore = Math.max(progress.quizScore || 0, score);
      if (passed) {
        progress.quizPassed = true;
      }
    }

    if (progress.quizPassed && progress.adminApproved) {
      progress.completed = true;
      progress.completedAt = new Date();
    }

    await progress.save();

    return NextResponse.json({
      passed,
      score,
      correctCount,
      totalQuestions,
      progress,
    });
  } catch (error: unknown) {
    console.error('Quiz submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
